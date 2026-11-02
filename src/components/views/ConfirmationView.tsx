"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoute } from "@/lib/hash-router";
import { fmtDate, inr } from "@/lib/format";
import type { OrderDTO } from "@/lib/types";

// Screen 09 — order placed successfully after the 10% advance.
export default function ConfirmationView() {
  const route = useRoute();
  const orderNo = route.segments[1] || "";
  const [order, setOrder] = useState<OrderDTO | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/orders/one?orderNo=${encodeURIComponent(orderNo)}`);
      if (res.ok) setOrder((await res.json()).order);
    })();
  }, [orderNo]);

  const packages = order ? order.items.reduce((s, i) => s + Math.max(1, Math.round(i.qty / (parseInt(i.packSize) || 1))), 0) : 0;

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder="Order confirmed" hideNavRow />
      <div className="flex-1 px-5 py-9">
        {order ? (
          <div className="max-w-[660px] mx-auto bg-white border border-border rounded-xl px-6 md:px-8 py-8 text-center">
            <span className="w-14 h-14 rounded-full border-[3px] border-navy text-navy text-[26px] font-extrabold flex items-center justify-center mx-auto mb-3.5">
              ✓
            </span>
            <h1 className="text-[19px] font-extrabold text-ink">Order placed successfully!</h1>
            <p className="text-[11.5px] text-muted-foreground mt-1.5">
              Order ID <b className="text-ink">{order.orderNo}</b> · placed {fmtDate(order.createdAt)} · supplier notified —
              confirmation expected within 24 hrs
            </p>

            {/* mini timeline */}
            <div className="flex items-center justify-center flex-wrap mt-5 mb-5">
              {["Placed · 10% paid", "Supplier confirms", "Dispatched", "Delivered", "Pay 90%", "Invoice"].map((t, i) => (
                <span key={t} className="flex items-center">
                  {i > 0 && <span className="dashed-arrow w-6 h-[2px] mx-1.5" aria-hidden />}
                  <span className={`flex items-center gap-1.5 text-[9.5px] font-bold ${i === 0 ? "text-ink" : "text-muted-foreground"}`}>
                    <span
                      className={`w-3.5 h-3.5 rounded-full border-[1.5px] flex items-center justify-center text-[8px] ${
                        i === 0 ? "bg-navy border-navy text-white" : "border-input bg-white"
                      }`}
                    >
                      {i === 0 ? "✓" : ""}
                    </span>
                    {t}
                  </span>
                </span>
              ))}
            </div>

            {/* receipt */}
            <div className="border border-border rounded-lg overflow-hidden text-left mb-5">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-dashed border-border text-[12px]">
                <span>
                  Advance paid now — 10%
                  <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded px-1.5 py-[2px] ml-2">{order.advanceMethod || "UPI"}</span>
                </span>
                <span className="font-extrabold text-ink">
                  {inr(order.advanceAmount)}
                  <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded px-1.5 py-[2px] ml-2">PAID ✓</span>
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-dashed border-border text-[12px]">
                <span>Balance on delivery — 90%</span>
                <span className="font-extrabold text-ink">
                  {inr(order.balanceAmount)}
                  <span className="text-[9px] font-bold text-muted-foreground border border-dashed border-input rounded px-1.5 py-[2px] ml-2">
                    DUE — unlocks after delivery
                  </span>
                </span>
              </div>
              <div className="flex items-center justify-between px-4 py-2.5 bg-muted text-[12px] font-extrabold text-ink">
                <span>Order total ({order.items.length} items · {packages} packages)</span>
                <span>{inr(order.total)}</span>
              </div>
            </div>

            <div className="flex flex-wrap justify-center gap-2.5">
              <Button className="font-bold" onClick={() => (window.location.hash = `#/order/${order.orderNo}`)}>Track Order</Button>
              <Button variant="outline" className="border-input bg-white font-bold" onClick={() => (window.location.hash = "#/orders")}>View My Orders</Button>
              <Button variant="outline" className="border-input bg-white font-bold" onClick={() => (window.location.hash = "#/")}>Continue Shopping</Button>
            </div>

            <p className="text-[9.5px] text-muted-foreground mt-4 leading-relaxed">
              You will pay {inr(order.balanceAmount)} only after delivery is accepted — we will remind you on WhatsApp &amp;
              SMS. The 90% is never auto-debited.
            </p>
          </div>
        ) : (
          <div className="max-w-[660px] mx-auto space-y-3">
            <Skeleton className="h-14 w-14 rounded-full mx-auto" />
            <Skeleton className="h-6 w-2/3 mx-auto" />
            <Skeleton className="h-32" />
            <Skeleton className="h-10" />
          </div>
        )}
      </div>
      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}
