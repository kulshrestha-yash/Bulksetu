"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import StepsBar from "@/components/site/StepsBar";
import { PaymentPlan } from "@/components/site/PaymentPlan";
import { Button } from "@/components/ui/button";
import { useCart, cartTotals } from "@/store/cart";
import { useSession } from "@/store/session";
import { navigate } from "@/lib/hash-router";
import { usePayModal } from "@/components/site/SecurePayModal";
import { inr } from "@/lib/format";
import type { AddressDTO, OrderDTO } from "@/lib/types";
import { toast } from "sonner";
import { Lock, Building2 } from "lucide-react";

export default function CheckoutView() {
  const lines = useCart((s) => s.lines);
  const clear = useCart((s) => s.clear);
  const user = useSession((s) => s.user);
  const loaded = useSession((s) => s.loaded);
  const { subtotal, deliveryFee, total, advance, balance } = cartTotals(lines);
  const [speed, setSpeed] = useState<"Standard" | "Express">("Standard");
  const [placing, setPlacing] = useState(false);
  const [addr, setAddr] = useState<AddressDTO>({
    businessName: "",
    gstin: "",
    line1: "",
    line2: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
    landmark: "",
  });
  const [po, setPo] = useState("");
  const [note, setNote] = useState("");

  useEffect(() => {
    if (user) {
      setAddr((a) => ({
        ...a,
        businessName: user.businessName,
        gstin: user.gstin ?? "",
        phone: user.mobile ?? "",
      }));
    }
  }, [user]);

  useEffect(() => {
    if (loaded && !user) {
      toast.info("Login to complete your order — your cart is saved.");
      navigate("/account?next=/checkout");
    }
  }, [loaded, user]);

  const expressFee = speed === "Express" ? 2400 : 0;
  const grand = total + expressFee;
  const grandAdvance = Math.round(grand * 0.1);
  const grandBalance = grand - grandAdvance;

  const placeOrder = async () => {
    if (!lines.length) return;
    if (!addr.line1 || !addr.city || !addr.pincode || !addr.phone) {
      toast.error("Please complete the delivery address (address, city, PIN, phone).");
      return;
    }
    setPlacing(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: lines.map(({ slug, qty }) => ({ slug, qty })),
          address: addr,
          deliverySpeed: speed,
          poNumber: po,
          deliveryNote: note,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Could not create the order");
      const order: OrderDTO = data.order;
      clear();
      // open the secure-pay modal for the 10% advance against this order
      usePayModal.getState().open({
        orderNo: order.orderNo,
        kind: "advance",
        amount: order.advanceAmount,
        onSuccess: () => navigate(`/order/${order.orderNo}/confirmed`),
      });
      // if the user closes the gateway modal, still take them to the order
      setTimeout(() => {
        if (window.location.hash === "#/checkout") navigate(`/order/${order.orderNo}`);
      }, 500);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Checkout failed");
    } finally {
      setPlacing(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder="Secure checkout" hideNavRow />
      <StepsBar current={2} />

      <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-7 py-5 w-full">
        {lines.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-[15px] font-extrabold text-ink">Nothing to checkout</p>
            <Button className="mt-4 font-bold" onClick={() => navigate("/products")}>Browse Staples</Button>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-5 items-start">
            <div className="flex-1 flex flex-col gap-4 w-full">
              {/* address */}
              <section className="bg-white border border-border rounded-lg p-4">
                <div className="flex items-center gap-2 mb-3">
                  <h2 className="text-[13px] font-extrabold text-ink">Delivery Address</h2>
                  <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded-full px-2 py-1 inline-flex items-center gap-1">
                    <Building2 className="w-3 h-3" /> Business
                  </span>
                </div>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <Field label="Business name" value={addr.businessName} onChange={(v) => setAddr({ ...addr, businessName: v })} />
                  <Field label="GSTIN" value={addr.gstin} onChange={(v) => setAddr({ ...addr, gstin: v })} placeholder="07AAACG2145K1Z6" />
                  <Field label="Address line" value={addr.line1} onChange={(v) => setAddr({ ...addr, line1: v })} placeholder="Shop 14–16, Grain Market" className="sm:col-span-2" />
                  <Field label="Landmark" value={addr.landmark ?? ""} onChange={(v) => setAddr({ ...addr, landmark: v })} />
                  <Field label="City" value={addr.city} onChange={(v) => setAddr({ ...addr, city: v })} placeholder="Old Delhi" />
                  <Field label="State" value={addr.state} onChange={(v) => setAddr({ ...addr, state: v })} placeholder="Delhi" />
                  <Field label="PIN code" value={addr.pincode} onChange={(v) => setAddr({ ...addr, pincode: v })} placeholder="110006" />
                  <Field label="Phone (WhatsApp)" value={addr.phone} onChange={(v) => setAddr({ ...addr, phone: v })} placeholder="+91 98••• •••••" />
                </div>
                <p className="text-[10.5px] text-muted-foreground mt-2.5">Order updates on WhatsApp &amp; SMS at the number above.</p>
              </section>

              {/* delivery speed */}
              <section className="bg-white border border-border rounded-lg p-4">
                <h2 className="text-[13px] font-extrabold text-ink mb-3">Delivery Speed</h2>
                {(
                  [
                    { id: "Standard", title: "Standard — arrives in 5–7 days", sub: "full-truck load · bulk freight", fee: 0 },
                    { id: "Express", title: "Express — arrives in 3–4 days", sub: "priority dispatch · dedicated vehicle", fee: 2400 },
                  ] as const
                ).map((o) => (
                  <button
                    key={o.id}
                    onClick={() => setSpeed(o.id)}
                    className={`w-full flex items-center gap-3 rounded-lg border-[1.5px] px-3.5 py-3 mb-2 text-left text-[11.5px] bg-white ${
                      speed === o.id ? "border-navy bg-[#F7FAFE]" : "border-input"
                    }`}
                    role="radio"
                    aria-checked={speed === o.id}
                  >
                    <span className={`w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 ${speed === o.id ? "border-navy bg-navy/80 shadow-[inset_0_0_0_2px_white]" : "border-input"}`} />
                    <b className="text-ink">{o.title}</b>
                    <span className="text-muted-foreground">· {o.sub}</span>
                    <span className="ml-auto font-extrabold text-ink">{o.fee === 0 ? "FREE" : inr(o.fee)}</span>
                  </button>
                ))}
              </section>

              {/* business details */}
              <section className="bg-white border border-border rounded-lg p-4">
                <h2 className="text-[13px] font-extrabold text-ink mb-3">Business Details <span className="text-[10px] font-semibold text-muted-foreground">(optional)</span></h2>
                <div className="grid sm:grid-cols-2 gap-2.5">
                  <Field label="Purchase order no." value={po} onChange={setPo} placeholder="PO-2291" />
                  <Field label="Delivery instructions" value={note} onChange={setNote} placeholder="“call before unloading”" />
                </div>
              </section>
            </div>

            {/* summary */}
            <aside className="w-full lg:w-[380px] shrink-0 bg-white border border-border rounded-lg p-4">
              <div className="text-[13px] font-extrabold text-ink mb-2.5">Order Summary</div>
              {lines.map((l) => (
                <div key={l.slug} className="flex justify-between text-[12px] mb-1.5">
                  <span className="truncate pr-3">{l.name.split("—")[0].trim()} · {l.qty.toLocaleString("en-IN")} {l.unit}</span>
                  <b>{inr(l.amount)}</b>
                </div>
              ))}
              <div className="flex justify-between text-[12px] mb-1.5">
                <span>Delivery — bulk freight</span>
                <b>{deliveryFee + expressFee === 0 ? "FREE" : inr(deliveryFee + expressFee)}</b>
              </div>
              <div className="flex justify-between text-[14.5px] font-extrabold text-ink border-t border-border pt-2.5 mt-2.5">
                <span>Order total</span>
                <span>{inr(grand)}</span>
              </div>

              <div className="mt-3.5 pt-3 border-t border-dashed border-border">
                <PaymentPlan variant="split" total={grand} advance={grandAdvance} balance={grandBalance} />
              </div>

              <Button
                className="w-full mt-4 bg-orange hover:bg-orange-dark text-white font-extrabold h-10"
                disabled={placing}
                onClick={placeOrder}
              >
                {placing ? "Creating order…" : `Pay ${inr(grandAdvance)} (10%) & Place Order`}
              </Button>
              <p className="text-[9.5px] text-muted-foreground text-center mt-2 leading-relaxed flex gap-1 items-start justify-center">
                <Lock className="w-3 h-3 mt-[1px] shrink-0" />
                Advance adjusted against final total · Cancel anytime before dispatch → full 10% refund · gateway placeholder ready for Stripe / JusPay
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

function Field({
  label,
  value,
  onChange,
  placeholder,
  className = "",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  className?: string;
}) {
  return (
    <label className={`block ${className}`}>
      <span className="block text-[10.5px] font-bold text-foreground mb-1">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 px-2.5 rounded-md border border-input bg-white text-[12px] text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}
