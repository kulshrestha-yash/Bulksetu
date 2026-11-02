"use client";

import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import ImagePlaceholder from "@/components/site/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { useCart, cartTotals } from "@/store/cart";
import { useSession } from "@/store/session";
import { navigate } from "@/lib/hash-router";
import { inr, inrUnit, qtyFmt } from "@/lib/format";
import { useEffect } from "react";
import { PaymentPlan } from "@/components/site/PaymentPlan";
import { toast } from "sonner";
import { Trash2, Lock } from "lucide-react";

export default function CartView() {
  const lines = useCart((s) => s.lines);
  const setQty = useCart((s) => s.setQty);
  const remove = useCart((s) => s.remove);
  const user = useSession((s) => s.user);
  const { subtotal, deliveryFee, total, advance, balance } = cartTotals(lines);

  // guard stale slab prices if the catalog changed — clamp qty to MOQ
  useEffect(() => {
    lines.forEach((l) => {
      if (l.qty < l.moq) setQty(l.slug, l.moq);
    });
  }, [lines, setQty]);

  const proceed = () => {
    if (!lines.length) return;
    if (!user) {
      toast.info("Login as a buyer to checkout — takes under a minute. Demo buyer available with one click.");
      navigate("/account?next=/cart");
      return;
    }
    navigate("/checkout");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder="Search 5 lakh+ products…" />
      <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground">
        <a href="#/" className="hover:text-navy">Home</a> / <b className="text-ink">My Cart ({lines.length} item{lines.length === 1 ? "" : "s"})</b>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-7 py-5">
        {lines.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[15px] font-extrabold text-ink">Your cart is empty</p>
            <p className="text-[12px] text-muted-foreground mt-1">Bulk staples are one tap away — MOQ-friendly slabs included.</p>
            <Button className="mt-4 font-bold" onClick={() => navigate("/products")}>Browse Staples</Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="flex-1 w-full">
              <h1 className="text-[17px] font-extrabold text-ink mb-3">My Cart ({lines.length} item{lines.length === 1 ? "" : "s"})</h1>
              <div className="w-full border border-border rounded-lg overflow-hidden bg-white">
                <table className="w-full text-[11.5px]">
                  <thead>
                    <tr className="bg-muted text-left">
                      <th className="px-3 py-2.5 text-[9.5px] font-extrabold tracking-[0.7px] uppercase text-muted-foreground w-[44%]">Product</th>
                      <th className="px-3 py-2.5 text-[9.5px] font-extrabold tracking-[0.7px] uppercase text-muted-foreground">Quantity</th>
                      <th className="px-3 py-2.5 text-[9.5px] font-extrabold tracking-[0.7px] uppercase text-muted-foreground">Unit price</th>
                      <th className="px-3 py-2.5 text-[9.5px] font-extrabold tracking-[0.7px] uppercase text-muted-foreground text-right">Amount</th>
                      <th className="px-2 py-2.5"><span className="sr-only">Remove</span></th>
                    </tr>
                  </thead>
                  <tbody>
                    {lines.map((l) => (
                      <tr key={l.slug} className="border-t border-dashed border-border">
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2.5">
                            <ImagePlaceholder label={l.imageHint ?? l.name} className="w-[52px] h-[46px] shrink-0" />
                            <span>
                              <b className="text-ink">{l.name}</b>
                              <span className="block text-[10px] text-muted-foreground mt-0.5">
                                {l.packSize} · {l.supplierName} ·{" "}
                                <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded px-1 py-[1px]">
                                  slab {inrUnit(l.slabPrice)}/{l.unit} applied
                                </span>
                              </span>
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <div className="inline-flex items-stretch border border-input rounded-md overflow-hidden bg-white h-8">
                            <button
                              aria-label="Decrease"
                              className="w-8 border-r border-border font-extrabold hover:bg-muted disabled:opacity-40"
                              disabled={l.qty <= l.moq}
                              onClick={() => setQty(l.slug, Math.max(l.moq, l.qty - 50))}
                            >
                              −
                            </button>
                            <span className="w-20 flex items-center justify-center font-bold text-ink">{qtyFmt(l.qty)} {l.unit}</span>
                            <button aria-label="Increase" className="w-8 border-l border-border font-extrabold hover:bg-muted" onClick={() => setQty(l.slug, l.qty + 50)}>
                              +
                            </button>
                          </div>
                        </td>
                        <td className="px-3 py-3">{inrUnit(l.slabPrice)} / {l.unit}</td>
                        <td className="px-3 py-3 text-right font-extrabold text-ink">{inr(l.amount)}</td>
                        <td className="px-2 py-3">
                          <button aria-label={`Remove ${l.name}`} className="text-muted-foreground hover:text-destructive" onClick={() => remove(l.slug)}>
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="flex flex-wrap items-center gap-2 mt-3">
                <span className="text-[9.5px] font-bold border border-input rounded-full px-2 py-1 bg-white text-muted-foreground">✓ All items meet MOQ</span>
                <a href="#/products" className="text-[11.5px] font-semibold text-navy hover:underline ml-auto">+ Add more staples</a>
              </div>
            </div>

            <aside className="w-full lg:w-[330px] shrink-0 bg-white border border-border rounded-lg p-4">
              <div className="text-[13px] font-extrabold text-ink mb-2.5">Order Summary</div>
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Subtotal ({lines.length} item{lines.length === 1 ? "" : "s"})</span>
                <b>{inr(subtotal)}</b>
              </div>
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Bulk slab savings</span>
                <span className="text-muted-foreground">already applied</span>
              </div>
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Delivery — bulk freight</span>
                <b>{deliveryFee === 0 ? "FREE" : inr(deliveryFee)}</b>
              </div>
              <div className="flex justify-between text-[14.5px] font-extrabold text-ink border-t border-border pt-2.5 mt-2.5">
                <span>Order total</span>
                <span>{inr(total)}</span>
              </div>

              <PaymentPlan total={total} advance={advance} balance={balance} />

              <Button className="w-full mt-3 bg-orange hover:bg-orange-dark text-white font-extrabold" onClick={proceed}>
                Proceed to Checkout — pay {inr(advance)} (10%) now
              </Button>
              <p className="text-[10px] text-muted-foreground text-center mt-2 flex items-center justify-center gap-1">
                <Lock className="w-3 h-3" /> UPI / Card / Netbanking at checkout · gateway placeholder ready for Stripe / JusPay
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
