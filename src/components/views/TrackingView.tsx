"use client";

import { useCallback, useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import Timeline from "@/components/site/Timeline";
import { usePayModal } from "@/components/site/SecurePayModal";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoute } from "@/lib/hash-router";
import { fmtDate, inr } from "@/lib/format";
import type { OrderDTO } from "@/lib/types";
import { toast } from "sonner";
import { FlaskConical } from "lucide-react";

// Screen 11 — delivery progress + order & payment sidebar + demo timeline control.
export default function TrackingView() {
  const route = useRoute();
  const orderNo = route.segments[1] || "";
  const [order, setOrder] = useState<OrderDTO | null>(null);
  const openPay = usePayModal((s) => s.open);

  const load = useCallback(async () => {
    const res = await fetch(`/api/orders/one?orderNo=${encodeURIComponent(orderNo)}`);
    if (res.ok) setOrder((await res.json()).order);
  }, [orderNo]);

  useEffect(() => {
    (async () => {
      await load();
    })();
  }, [load]);

  const simulateNext = async () => {
    const res = await fetch("/api/orders/advance", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ orderNo }),
    });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || "Cannot advance");
      return;
    }
    toast.success("Fulfilment milestone updated (demo).");
    setOrder(data.order);
  };

  const collected = order ? (order.balancePaid ? 100 : order.advancePaid ? 10 : 0) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder={`Order ${orderNo}`} hideNavRow />
      <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground flex items-center gap-2 flex-wrap">
        <a href="#/orders" className="hover:text-navy">← My Orders</a> / <b className="text-ink">Order {orderNo}</b>
        {order && order.advancePaid && !order.balancePaid && order.status === "DELIVERED" && (
          <span className="text-[10px] font-extrabold text-orange-dark border border-orange bg-[#FEF4E9] rounded px-2 py-0.5">
            Delivered — action pending: pay 90%
          </span>
        )}
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-7 py-5">
        {!order ? (
          <div className="grid lg:grid-cols-[1fr_360px] gap-5">
            <Skeleton className="h-96" />
            <Skeleton className="h-80" />
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <section className="flex-1 w-full bg-white border border-border rounded-lg p-4 md:p-5">
              <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
                <h2 className="text-[13px] font-extrabold text-ink">Delivery Progress</h2>
                {/* demo-only control to walk the timeline */}
                {!["COMPLETED", "CANCELLED"].includes(order.status) && (
                  <Button
                    size="sm"
                    variant="outline"
                    className="border-dashed border-input text-[10px] text-muted-foreground"
                    onClick={simulateNext}
                  >
                    <FlaskConical className="w-3 h-3" /> Demo: advance milestone
                  </Button>
                )}
              </div>
              <Timeline order={order} />
            </section>

            <aside className="w-full lg:w-[352px] shrink-0 bg-white border border-border rounded-lg p-4">
              <div className="text-[13px] font-extrabold text-ink mb-2.5">Order &amp; Payment</div>
              {order.items.map((i) => (
                <div key={i.slug} className="flex justify-between text-[12px] mb-1.5">
                  <span className="truncate pr-3">{i.name.split("—")[0].trim()} · {i.qty.toLocaleString("en-IN")} {i.unit}</span>
                  <b>{inr(i.amount)}</b>
                </div>
              ))}
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Delivery — bulk freight</span>
                <b>{order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)}</b>
              </div>
              <div className="flex justify-between text-[14.5px] font-extrabold text-ink border-t border-border pt-2.5 mt-2">
                <span>Order total</span>
                <span>{inr(order.total)}</span>
              </div>

              <div className="mt-3.5">
                <div className="flex items-center justify-between text-[11px]">
                  <span className={`text-[9.5px] font-extrabold rounded px-2 py-1 border ${order.advancePaid ? "bg-[#EDF3FC] text-navy border-navy/50" : "bg-[#FDB874] text-[#5C2E00] border-orange-dark"}`}>
                    10% — {inr(order.advanceAmount)} {order.advancePaid ? "PAID ✓" : "DUE"}
                  </span>
                  <span className="text-muted-foreground">{order.advancePaid ? fmtDate(order.createdAt) : "at checkout"}</span>
                </div>
                <div className="h-2.5 rounded-md border border-border bg-muted overflow-hidden my-2" role="progressbar" aria-valuenow={collected} aria-valuemin={0} aria-valuemax={100}>
                  <i className="block h-full bg-orange" style={{ width: `${Math.max(3, collected)}%` }} />
                </div>
                <div className="flex justify-between text-[9.5px]">
                  <span className="text-muted-foreground">0</span>
                  <span className="text-orange-dark font-extrabold">{collected}% collected</span>
                  <span className="text-muted-foreground">100%</span>
                </div>
                <div className="flex items-center justify-between text-[11px] mt-3">
                  <span className={`text-[9.5px] font-extrabold rounded px-2 py-1 border ${order.balancePaid ? "bg-[#EDF3FC] text-navy border-navy/50" : "border-dashed border-input text-muted-foreground bg-white"}`}>
                    90% — {inr(order.balanceAmount)} {order.balancePaid ? "PAID ✓" : "DUE"}
                  </span>
                  <span className="text-muted-foreground">{order.balancePaid ? "settled" : "unlock: delivered"}</span>
                </div>
              </div>

              {/* actions */}
              {order.advancePaid && !order.balancePaid && order.status === "DELIVERED" && (
                <Button className="w-full mt-4 bg-orange hover:bg-orange-dark text-white font-extrabold" onClick={() => openPay({ orderNo: order.orderNo, kind: "balance", amount: order.balanceAmount, onSuccess: load })}>
                  Pay 90% Balance — {inr(order.balanceAmount)}
                </Button>
              )}
              {!order.advancePaid && (
                <Button className="w-full mt-4 bg-orange hover:bg-orange-dark text-white font-extrabold" onClick={() => openPay({ orderNo: order.orderNo, kind: "advance", amount: order.advanceAmount, onSuccess: load })}>
                  Pay 10% Advance — {inr(order.advanceAmount)}
                </Button>
              )}
              {order.balancePaid && (
                <Button className="w-full mt-4 font-bold" onClick={() => (window.location.hash = `#/invoice/${order.orderNo}`)}>
                  View Tax Invoice
                </Button>
              )}
              <Button
                variant="outline"
                className="w-full mt-2 border-input bg-white"
                onClick={() => toast.success("Dispute window opened — our team responds within 4 working hours.")}
              >
                Raise an Issue (refund / dispute)
              </Button>
              <p className="text-[9.5px] text-muted-foreground text-center mt-2.5 leading-relaxed">
                10% refundable in full if cancelled before dispatch · the 90% balance is never auto-debited.
              </p>
            </aside>
          </div>
        )}
      </div>

      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}
