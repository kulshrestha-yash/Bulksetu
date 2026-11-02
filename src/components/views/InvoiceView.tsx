"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import { LogoMark } from "@/components/site/Logo";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { useRoute } from "@/lib/hash-router";
import { fmtDate, inr } from "@/lib/format";
import type { OrderDTO } from "@/lib/types";
import { toast } from "sonner";

// Screen 13 — tax invoice after full settlement, with PAID IN FULL stamp.
export default function InvoiceView() {
  const route = useRoute();
  const orderNo = route.segments[1] || "";
  const [order, setOrder] = useState<OrderDTO | null>(null);

  useEffect(() => {
    (async () => {
      const res = await fetch(`/api/orders/one?orderNo=${encodeURIComponent(orderNo)}`);
      if (res.ok) setOrder((await res.json()).order);
    })();
  }, [orderNo]);

  const invoiceNo = orderNo.replace(/^BS-(\d+)-(\d+)$/, "BS/$1/$2");

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder={`Invoice ${invoiceNo}`} hideNavRow />
      <div className="flex-1 px-4 md:px-7 py-6">
        {!order ? (
          <div className="max-w-[860px] mx-auto space-y-3">
            <Skeleton className="h-24" />
            <Skeleton className="h-40" />
            <Skeleton className="h-24" />
          </div>
        ) : !order.balancePaid ? (
          <div className="max-w-[660px] mx-auto text-center py-16">
            <p className="text-[15px] font-extrabold text-ink">Invoice not available yet</p>
            <p className="text-[12px] text-muted-foreground mt-1.5 max-w-[420px] mx-auto leading-relaxed">
              The GST tax invoice unlocks as soon as the 90% balance is settled for {orderNo}. Current progress:{" "}
              {order.advancePaid ? "10% collected" : "advance pending"}.
            </p>
            <Button className="mt-4 font-bold" onClick={() => (window.location.hash = `#/order/${orderNo}`)}>Open order</Button>
          </div>
        ) : (
          <>
            <div className="max-w-[860px] mx-auto mb-4 flex flex-wrap gap-2.5 print:hidden">
              <Button variant="outline" className="border-input bg-white font-bold" onClick={() => window.print()}>
                Download Invoice PDF
              </Button>
              <Button className="font-bold" onClick={() => (window.location.hash = "#/orders")}>Back to My Orders</Button>
              <Button
                variant="outline"
                className="border-input bg-white font-bold"
                onClick={() => toast.success("Thanks! Your rating helps other buyers choose verified suppliers.")}
              >
                Rate Supplier ★★★★★
              </Button>
            </div>

            {/* invoice paper */}
            <article className="invoice-sheet max-w-[860px] mx-auto bg-white border border-input rounded-lg px-6 md:px-8 py-7 shadow-[0_10px_30px_rgba(30,30,20,0.10)]">
              <header className="flex items-center gap-3.5 pb-4 border-b-2 border-ink">
                <LogoMark size={40} />
                <span>
                  <b className="text-[17px]">
                    <span className="text-navy">Bulk</span>
                    <span className="text-orange">Setu</span>
                  </b>{" "}
                  <span className="text-[11px] font-semibold text-muted-foreground tracking-wide">B2B MARKETPLACE</span>
                  <span className="block text-[10.5px] text-muted-foreground mt-0.5">
                    BulkSetu Technologies Pvt. Ltd. · Delhi, India · support@bulksetu.in · GSTIN 07AAACB1234M1Z5
                  </span>
                </span>
                <span className="ml-auto text-right">
                  <b className="text-[15px] text-ink">TAX INVOICE</b>
                  <span className="block text-[10.5px] text-muted-foreground">Original for Recipient</span>
                </span>
              </header>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-4 border-b border-dashed border-border text-[11px]">
                <div>
                  <b className="block text-[9.5px] tracking-[0.9px] uppercase text-muted-foreground mb-1">Seller</b>
                  {order.items[0]?.supplierName ?? "—"}
                  <span className="block text-muted-foreground">GSTIN 06AAACS1122P1Z8</span>
                </div>
                <div>
                  <b className="block text-[9.5px] tracking-[0.9px] uppercase text-muted-foreground mb-1">Buyer</b>
                  {order.address.businessName}
                  <span className="block text-muted-foreground">{order.address.gstin ? `GSTIN ${order.address.gstin}` : "GSTIN: —"}<br />{order.address.city}, {order.address.state}</span>
                </div>
                <div>
                  <b className="block text-[9.5px] tracking-[0.9px] uppercase text-muted-foreground mb-1">Invoice / Order</b>
                  Invoice {invoiceNo}
                  <span className="block text-muted-foreground">Order {order.orderNo}<br />Dated {fmtDate(order.deliveredAt ?? order.createdAt)}</span>
                </div>
                <div>
                  <b className="block text-[9.5px] tracking-[0.9px] uppercase text-muted-foreground mb-1">Delivery</b>
                  Delivered {fmtDate(order.deliveredAt)}
                  <span className="block text-muted-foreground">POD captured · e-way bill ✓</span>
                </div>
              </div>

              <table className="w-full border-collapse text-[11.5px] my-4">
                <thead>
                  <tr>
                    {["#", "Item", "HSN", "Qty", "Rate", "Amount"].map((h, i) => (
                      <th
                        key={h}
                        className={`bg-muted border border-border px-2.5 py-2 text-[9.5px] uppercase tracking-[0.6px] text-muted-foreground ${i >= 4 ? "text-right" : "text-left"} ${i === 0 ? "w-8" : ""}`}
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {order.items.map((i, idx) => (
                    <tr key={i.slug}>
                      <td className="border border-border px-2.5 py-2">{idx + 1}</td>
                      <td className="border border-border px-2.5 py-2">{i.name} ({i.packSize})</td>
                      <td className="border border-border px-2.5 py-2">{i.hsn}</td>
                      <td className="border border-border px-2.5 py-2">{i.qty.toLocaleString("en-IN")} {i.unit}</td>
                      <td className="border border-border px-2.5 py-2">{inr(i.slabPrice)} / {i.unit}</td>
                      <td className="border border-border px-2.5 py-2 text-right">{inr(i.amount)}</td>
                    </tr>
                  ))}
                  <tr>
                    <td colSpan={4} className="border border-border px-2.5 py-2 text-muted-foreground">Delivery — bulk freight</td>
                    <td className="border border-border" />
                    <td className="border border-border px-2.5 py-2 text-right">{order.deliveryFee === 0 ? "FREE" : inr(order.deliveryFee)}</td>
                  </tr>
                  <tr>
                    <td colSpan={5} className="border border-border px-2.5 py-2.5 text-right font-extrabold text-ink">Invoice total</td>
                    <td className="border border-border px-2.5 py-2.5 text-right font-extrabold text-ink">{inr(order.total)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="flex flex-col md:flex-row gap-4 items-stretch">
                <div className="flex-1 border border-border rounded-lg overflow-hidden">
                  <div className="flex items-center justify-between px-3.5 py-2.5 text-[11.5px] border-b border-dashed border-border">
                    <span>10% advance — paid {fmtDate(order.createdAt)} · {order.advanceMethod}</span>
                    <span><b>{inr(order.advanceAmount)}</b> <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded px-1.5 py-[2px] ml-1">PAID ✓</span></span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5 text-[11.5px] border-b border-dashed border-border">
                    <span>90% balance — paid {fmtDate(order.deliveredAt)} · {order.balanceMethod}</span>
                    <span><b>{inr(order.balanceAmount)}</b> <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded px-1.5 py-[2px] ml-1">PAID ✓</span></span>
                  </div>
                  <div className="flex items-center justify-between px-3.5 py-2.5 text-[11.5px] bg-muted font-extrabold text-ink">
                    <span>Total settled (100%)</span>
                    <span>{inr(order.total)}</span>
                  </div>
                </div>
                <div className="flex items-center justify-center md:w-52">
                  <span className="border-[3px] border-orange text-orange-dark font-extrabold text-[15px] tracking-[2.5px] px-4 py-2.5 rounded-lg -rotate-[8deg] opacity-90">
                    PAID IN FULL
                  </span>
                </div>
              </div>

              <p className="text-[9.5px] text-muted-foreground mt-5 leading-relaxed">
                Subject to Delhi jurisdiction · Prices inclusive of applicable GST where applicable · This is a
                computer-generated invoice. Advance receipt {order.advanceRef ?? "—"} · Balance receipt {order.balanceRef ?? "—"}.
              </p>
            </article>
          </>
        )}
      </div>
      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}
