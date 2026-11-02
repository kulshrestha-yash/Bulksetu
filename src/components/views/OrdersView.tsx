"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { StatusPill, PaySplitChips } from "@/components/site/OrderChips";
import { usePayModal } from "@/components/site/SecurePayModal";
import { useRoute } from "@/lib/hash-router";
import { fmtDate, inr } from "@/lib/format";
import type { OrderDTO } from "@/lib/types";
import { useSession } from "@/store/session";
import { navigate } from "@/lib/hash-router";
import { toast } from "sonner";

type Tab = "all" | "progress" | "due90" | "completed";

export default function OrdersView() {
  const route = useRoute();
  const user = useSession((s) => s.user);
  const loaded = useSession((s) => s.loaded);
  const [orders, setOrders] = useState<OrderDTO[] | null>(null);
  const [tab, setTab] = useState<Tab>((route.query.get("tab") as Tab) || "all");
  const openPay = usePayModal((s) => s.open);

  const load = useCallback(async () => {
    const res = await fetch("/api/orders");
    if (!res.ok) {
      setOrders([]);
      return;
    }
    setOrders((await res.json()).orders ?? []);
  }, []);

  useEffect(() => {
    if (loaded && !user) navigate("/account?next=/orders");
  }, [loaded, user]);
  useEffect(() => {
    if (!user) return;
    (async () => {
      await load();
    })();
  }, [user, load]);

  if (!loaded || !user) return <div className="min-h-screen"><Header hideNavRow /><div className="p-8"><Skeleton className="h-40" /></div><Footer /></div>;

  const filtered: OrderDTO[] = (orders ?? []).filter((o) => {
    if (tab === "progress") return ["PLACED", "CONFIRMED", "DISPATCHED", "IN_TRANSIT"].includes(o.status);
    if (tab === "due90") return o.advancePaid && !o.balancePaid && ["DELIVERED", "IN_TRANSIT", "DISPATCHED"].includes(o.status);
    if (tab === "completed") return o.status === "COMPLETED";
    return true;
  });

  const tabs: { id: Tab; label: (n: number) => string }[] = [
    { id: "all", label: (n) => `All (${n})` },
    { id: "progress", label: (n) => `In Progress (${n})` },
    { id: "due90", label: (n) => `Awaiting 90% Payment (${n})` },
    { id: "completed", label: (n) => `Completed (${n})` },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder="Search orders by ID or product…" hideNavRow />
      <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground">
        <a href="#/" className="hover:text-navy">Home</a> / <b className="text-ink">My Orders ({orders?.length ?? 0})</b>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-7 py-5">
        {/* tabs */}
        <div className="flex gap-2 mb-4 flex-wrap">
          {tabs.map((t) => {
            const n = (orders ?? []).filter((o) =>
              t.id === "progress"
                ? ["PLACED", "CONFIRMED", "DISPATCHED", "IN_TRANSIT"].includes(o.status)
                : t.id === "due90"
                  ? o.advancePaid && !o.balancePaid && ["DELIVERED", "IN_TRANSIT", "DISPATCHED"].includes(o.status)
                  : t.id === "completed"
                    ? o.status === "COMPLETED"
                    : true
            ).length;
            return (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={`rounded-full border px-3.5 py-1.5 text-[11.5px] font-semibold transition-colors ${
                  tab === t.id ? "bg-ink border-ink text-white" : "border-input bg-white text-foreground"
                }`}
              >
                {t.label(n)}
              </button>
            );
          })}
        </div>

        {orders === null ? (
          <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <Skeleton key={i} className="h-36 rounded-lg" />)}</div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-[14px] font-bold text-ink">No orders in this view.</p>
            <Button className="mt-4 font-bold" onClick={() => (window.location.hash = "#/products")}>Start Buying</Button>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map((o) => (
              <article key={o.id} className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center gap-2.5 flex-wrap mb-2">
                  <span className="text-[13.5px] font-extrabold text-ink">{o.orderNo}</span>
                  <span className="text-[11px] text-muted-foreground">
                    · placed {fmtDate(o.createdAt)}
                    {o.deliveredAt ? ` · delivered ${fmtDate(o.deliveredAt)}` : o.etaFrom ? ` · ETA ${fmtDate(o.etaFrom)}` : ""}
                  </span>
                  {o.advancePaid && !o.balancePaid && ["DELIVERED"].includes(o.status) && (
                    <span className="text-[10px] font-extrabold text-orange-dark border border-orange bg-[#FEF4E9] rounded px-2 py-0.5">Action: pay 90% balance</span>
                  )}
                  <StatusPill order={o} />
                </div>
                <div className="text-[11px] text-muted-foreground mb-2">
                  {o.items.map((i) => `${i.name.split("—")[0].trim()} ${i.qty.toLocaleString("en-IN")} ${i.unit}`).join(" · ")} — order value{" "}
                  <b className="text-ink">{inr(o.total)}</b>
                </div>
                <div className="flex items-center gap-2.5 flex-wrap bg-muted border border-dashed border-border rounded-lg px-3 py-2 mb-3">
                  <PaySplitChips order={o} />
                  <span className="ml-auto text-[10px] text-muted-foreground">
                    Progress: {o.balancePaid ? "100% collected" : o.advancePaid ? "10% collected" : "0% collected"}
                  </span>
                </div>
                <div className="flex gap-2 flex-wrap">
                  {/* primary action per state */}
                  {!o.advancePaid && o.status === "PLACED" && (
                    <Button size="sm" className="bg-orange hover:bg-orange-dark text-white font-bold" onClick={() => openPay({ orderNo: o.orderNo, kind: "advance", amount: o.advanceAmount, onSuccess: load })}>
                      Pay 10% — {inr(o.advanceAmount)}
                    </Button>
                  )}
                  {o.advancePaid && !o.balancePaid && o.status === "DELIVERED" && (
                    <Button size="sm" className="bg-orange hover:bg-orange-dark text-white font-bold" onClick={() => openPay({ orderNo: o.orderNo, kind: "balance", amount: o.balanceAmount, onSuccess: load })}>
                      Pay 90% — {inr(o.balanceAmount)}
                    </Button>
                  )}
                  {o.balancePaid && (
                    <Button size="sm" variant="outline" className="border-input bg-white font-bold" onClick={() => (window.location.hash = `#/invoice/${o.orderNo}`)}>
                      View Invoice
                    </Button>
                  )}
                  <Button size="sm" variant="outline" className="border-input bg-white font-bold" onClick={() => (window.location.hash = `#/order/${o.orderNo}`)}>
                    {o.balancePaid ? "Details" : "Track / Details"}
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-input bg-white text-muted-foreground"
                    onClick={() => toast.success(`Issue ticket raised for ${o.orderNo} — support will call you within 4 hrs.`)}
                  >
                    Raise Issue
                  </Button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}
