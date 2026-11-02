"use client";

// ─────────────────────────────────────────────────────────────────────────────
// SecurePay modal — the BulkSetu payment gateway surface (wireframe 08 / 12).
//
// SANDBOX MODE: charges run through the mock provider (no real money).
// LIVE MODE: swap PAYMENT_PROVIDER in .env — the server calls Stripe/JusPay in
// /api/orders/pay and returns `clientPayload` (clientSecret / orderToken) here.
// Drop the gateway SDK call where marked `▶ GATEWAY SDK STEP` below.
// ─────────────────────────────────────────────────────────────────────────────

import { create } from "zustand";
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { LogoMark } from "./Logo";
import { inr } from "@/lib/format";
import { toast } from "sonner";
import type { PayMethod } from "@/lib/payments/types";

interface PayModalState {
  open: boolean;
  orderNo: string;
  kind: "advance" | "balance";
  amount: number;
  onSuccess?: () => void;
  open: (p: { orderNo: string; kind: "advance" | "balance"; amount: number; onSuccess?: () => void }) => void;
  close: () => void;
}

export const usePayModal = create<PayModalState>()((set) => ({
  open: false,
  orderNo: "",
  kind: "advance",
  amount: 0,
  onSuccess: undefined,
  open: (p) => set({ open: true, ...p }),
  close: () => set({ open: false, onSuccess: undefined }),
}));

const METHODS: { id: PayMethod; label: string; sub: string; badge?: string }[] = [
  { id: "UPI", label: "UPI", sub: "GPay · PhonePe · Paytm · scan QR", badge: "Recommended" },
  { id: "Card", label: "Credit / Debit Card", sub: "Visa · Mastercard · RuPay" },
  { id: "Netbanking", label: "Netbanking", sub: "58 banks — SBI, HDFC, ICICI…" },
  { id: "Wallet", label: "Wallet", sub: "Paytm · Amazon Pay" },
];

export function SecurePayModal() {
  const { open, orderNo, kind, amount, onSuccess, close } = usePayModal();
  const [method, setMethod] = useState<PayMethod>("UPI");
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      // ▶ GATEWAY SDK STEP (live mode): if the server response carried a
      // clientPayload (clientSecret / orderToken), run the provider SDK here
      // first, then it settles server-side. In sandbox mode the mock provider
      // settles immediately.
      const res = await fetch("/api/orders/pay", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderNo, kind, method }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Payment failed");
      toast.success(
        kind === "advance"
          ? `${inr(amount)} paid — order ${orderNo} placed!`
          : `${inr(amount)} received — order ${orderNo} complete. Invoice unlocked.`
      );
      close();
      onSuccess?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Payment failed");
    } finally {
      setBusy(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={(v) => !v && !busy && close()}>
      <DialogContent className="sm:max-w-[520px] p-0 overflow-hidden gap-0" aria-describedby={undefined}>
        <DialogHeader className="flex-row items-center gap-2.5 px-4 py-3 bg-muted border-b border-border rounded-none">
          <DialogTitle className="flex items-center gap-2.5 text-[12.5px] font-extrabold text-ink">
            <LogoMark size={24} /> BulkSetu Secure Pay
            <span className="text-[8.5px] font-bold text-navy border border-navy/40 bg-[#EEF3FB] rounded px-1.5 py-[2px] tracking-wide">DEMO</span>
            <span className="text-[9px] font-semibold text-muted-foreground border border-input rounded px-1.5 py-[2px] hidden sm:inline">
              {kind === "advance" ? "10% advance" : "Final step · 90% balance"}
            </span>
          </DialogTitle>
        </DialogHeader>

        <div className="px-4 py-4">
          <div className="flex items-center gap-2.5 pb-3 border-b border-dashed border-border mb-3 text-[11.5px]">
            <span className="imgph w-10 h-10 rounded-md border border-dashed border-input flex items-center justify-center text-[8px] text-muted-foreground">logo</span>
            <span>
              <b className="text-ink">{kind === "advance" ? "BulkSetu Marketplace" : "Final Payment — on delivery"}</b>
              <span className="block text-muted-foreground">
                Order {orderNo}
                {kind === "balance" && " · delivered &amp; accepted"}
              </span>
            </span>
          </div>

          <div className="rounded-lg border-[1.5px] border-orange bg-[#FDF6EC] px-3.5 py-2.5 mb-3.5">
            <div className="text-[9.5px] font-extrabold tracking-[1.1px] text-orange-dark">
              {kind === "advance" ? "PAYABLE NOW — 10% ADVANCE" : "BALANCE DUE — 90% OF ORDER"}
            </div>
            <div className="text-[24px] font-extrabold text-ink my-0.5">{inr(amount)}</div>
            <div className="text-[10.5px] text-muted-foreground">
              {kind === "advance" ? "Confirms the order with suppliers · adjusted against order total" : "Complete within 48 hrs of delivery · no auto-debit has occurred"}
            </div>
          </div>

          <div className="flex flex-col gap-2 mb-4" role="radiogroup" aria-label="Payment method">
            {METHODS.map((m) => (
              <button
                key={m.id}
                type="button"
                role="radio"
                aria-checked={method === m.id}
                onClick={() => setMethod(m.id)}
                className={`flex items-center gap-2.5 rounded-lg border-[1.5px] px-3 py-2.5 text-left text-[12px] bg-white transition-colors ${
                  method === m.id ? "border-orange bg-[#FFFDF9]" : "border-input hover:border-navy"
                }`}
              >
                <span className={`w-3.5 h-3.5 rounded-full border-[1.5px] shrink-0 ${method === m.id ? "border-orange bg-orange/80 shadow-[inset_0_0_0_2px_white]" : "border-input"}`} />
                <span className="font-extrabold text-ink">{m.label}</span>
                {m.badge && <span className="text-[8.5px] font-bold text-navy border border-navy/40 bg-[#EEF3FB] rounded-full px-1.5 py-[2px]">{m.badge}</span>}
                <span className="text-[10.5px] text-muted-foreground ml-1 truncate">{m.sub}</span>
                <span className="imgph ml-auto w-11 h-6 rounded border border-dashed border-input shrink-0" aria-hidden />
              </button>
            ))}
          </div>

          <button
            onClick={pay}
            disabled={busy}
            className="w-full h-10 rounded-md bg-orange hover:bg-orange-dark text-white text-[12.5px] font-extrabold disabled:opacity-60 disabled:cursor-wait transition-colors"
          >
            {busy ? "Contacting secure gateway…" : `Pay ${inr(amount)} — ${kind === "advance" ? "Place Order" : "Complete Order"}`}
          </button>
          <p className="text-[9.5px] text-muted-foreground text-center mt-2.5 leading-relaxed">
            {kind === "advance"
              ? "Advance is adjusted against the order total · cancel before dispatch → full 10% refund. No real transaction in demo mode."
              : "Invoice unlocks instantly after payment · order marked completed · supplier payout released. No real transaction in demo mode."}
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
