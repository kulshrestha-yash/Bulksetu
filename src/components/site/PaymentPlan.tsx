"use client";

import { inr } from "@/lib/format";

// 10/90 payment plan boxes — the signature BulkSetu payment explainer.
// variant "cart" = rounded solid boxes (cart page) · "split" = bordered rows (checkout)
export function PaymentPlan({
  total,
  advance,
  balance,
  variant = "cart",
  compact = false,
}: {
  total: number;
  advance: number;
  balance: number;
  variant?: "cart" | "split";
  compact?: boolean;
}) {
  if (variant === "cart") {
    return (
      <div className={compact ? "" : "mt-3 pt-3 border-t border-dashed border-border"}>
        <div className="text-[9.5px] font-extrabold tracking-[1.3px] text-muted-foreground mb-2">HOW YOU PAY — 10 / 90 SPLIT</div>
        <div className="rounded-md border-2 border-orange bg-white px-3 py-2.5 mb-2">
          <div className="text-[9.5px] font-extrabold tracking-[0.8px] text-orange-dark">NOW · 10% ADVANCE</div>
          <div className="text-[16.5px] font-extrabold text-ink my-0.5">{inr(advance)}</div>
          <div className="text-[10px] text-muted-foreground leading-snug">Paid today at checkout — confirms the order with the supplier</div>
        </div>
        <div className="rounded-md border-[1.5px] border-dashed border-input bg-transparent px-3 py-2.5">
          <div className="text-[9.5px] font-extrabold tracking-[0.8px] text-muted-foreground">ON DELIVERY · 90% BALANCE</div>
          <div className="text-[16.5px] font-extrabold text-ink my-0.5">{inr(balance)}</div>
          <div className="text-[10px] text-muted-foreground leading-snug">Pay after you inspect &amp; accept delivery · within 48 hrs · no auto-debit</div>
        </div>
        <div className="sr-only">Order total {inr(total)}: {inr(advance)} now, {inr(balance)} after delivery.</div>
      </div>
    );
  }

  return (
    <div>
      <div className="text-[9.5px] font-extrabold tracking-[1.3px] text-muted-foreground mb-2">PAYMENT SPLIT — 10% / 90%</div>
      <div className="rounded-md border-2 border-orange bg-white px-3 py-2.5 mb-2">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-extrabold tracking-[0.9px] text-orange-dark">PAY NOW · 10% ADVANCE</span>
          <span className="text-[17px] font-extrabold text-ink">{inr(advance)}</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Charged today to confirm the order — gateway opens next</div>
      </div>
      <div className="rounded-md border-[1.5px] border-dashed border-input bg-transparent px-3 py-2.5">
        <div className="flex items-center justify-between">
          <span className="text-[9.5px] font-extrabold tracking-[0.9px] text-muted-foreground">ON DELIVERY · 90% BALANCE</span>
          <span className="text-[17px] font-extrabold text-ink">{inr(balance)}</span>
        </div>
        <div className="text-[10px] text-muted-foreground mt-0.5 leading-snug">Due only after you inspect &amp; accept delivery · UPI / Card / Netbanking</div>
      </div>
      <div className="sr-only">Order total {inr(total)}: {inr(advance)} now, {inr(balance)} after delivery.</div>
    </div>
  );
}

// Orange payment-plan explainer band used on PDP / Home (payhint in wireframe)
export function PaymentPlanHint({ advance, balance, className = "" }: { advance: string; balance: string; className?: string }) {
  return (
    <div className={`rounded-lg border-2 border-orange bg-white px-3.5 py-3 text-[11.5px] leading-relaxed ${className}`}>
      <div className="text-[9.5px] font-extrabold tracking-[1.2px] text-orange-dark mb-0.5">BULKSETU PAYMENT PLAN — 10 / 90</div>
      Pay <b>{advance}</b> now to place this order → pay the remaining <b>{balance}</b> only after you inspect &amp; accept
      the delivery. No auto-debit.
    </div>
  );
}
