"use client";

import { fmtDateTime } from "@/lib/format";
import type { OrderEventDTO, OrderDTO } from "@/lib/types";
import { inr } from "@/lib/format";
import ImagePlaceholder from "./ImagePlaceholder";
import { Button } from "@/components/ui/button";

// Vertical delivery timeline (wireframe screen 11) with POD placeholders and
// the orange "action required" block when the 90% balance is due.
export default function Timeline({ order }: { order: OrderDTO }) {
  const events = order.events;
  const balanceDue = order.advancePaid && !order.balancePaid && ["DELIVERED", "IN_TRANSIT", "DISPATCHED", "CONFIRMED", "PLACED"].includes(order.status);
  const lastIdx = events.length - 1;

  return (
    <ol className="relative pl-7">
      <span aria-hidden className="absolute left-[9px] top-2.5 bottom-2.5 w-[2px] bg-border" />
      {events.map((ev, i) => {
        const isCurrent = i === lastIdx;
        return (
          <li key={i} className="relative pb-5 last:pb-0">
            <span
              aria-hidden
              className={`absolute -left-7 top-0.5 w-5 h-5 rounded-full border-2 flex items-center justify-center text-[10px] font-bold ${
                isCurrent ? "border-orange bg-white" : "bg-navy border-navy text-white"
              }`}
            >
              {isCurrent ? <span className="w-2 h-2 rounded-full bg-orange" /> : "✓"}
            </span>
            <div className="text-[12.5px] font-extrabold text-ink">{ev.title}</div>
            <div className="text-[10.5px] text-muted-foreground mt-0.5 leading-relaxed">
              {fmtDateTime(ev.at)} · {ev.detail}
            </div>

            {/* POD under the Delivered event */}
            {ev.status === "DELIVERED" && order.deliveredAt && (
              <div className="flex gap-2.5 mt-2.5 flex-wrap">
                <ImagePlaceholder label="POD — delivery photo" className="w-28 h-20" />
                <ImagePlaceholder label="Signature" className="w-28 h-20" />
                <div className="text-[10.5px] text-muted-foreground leading-relaxed self-center">
                  Signed: {order.address.businessName.replace(/& Co\.$/, "")} R. Gupta
                  <br />
                  Qty verified: {order.items.length}/{order.items.length} lines
                  <br />
                  No damage reported
                </div>
              </div>
            )}

            {/* Action block on the current node when balance is due */}
            {isCurrent && balanceDue && ev.status === "DELIVERED" && (
              <div className="mt-3 rounded-lg border-2 border-orange bg-[#FFFDF9] px-3.5 py-3">
                <div className="text-[9.5px] font-extrabold tracking-[1.1px] text-orange-dark">ACTION REQUIRED — PAY 90% BALANCE</div>
                <div className="text-[18px] font-extrabold text-ink my-0.5">{inr(order.balanceAmount)}</div>
                <div className="text-[10.5px] text-foreground mb-2.5">
                  Due within 48 hrs of delivery — pay via UPI / Card / Netbanking. No auto-debit.
                </div>
                <BalancePayButtons orderNo={order.orderNo} amount={order.balanceAmount} />
              </div>
            )}
          </li>
        );
      })}

      {/* pending completion node */}
      {!order.balancePaid && (
        <li className="relative">
          <span aria-hidden className="absolute -left-7 top-0.5 w-5 h-5 rounded-full border-2 border-input bg-white" />
          <div className="text-[12.5px] font-semibold text-muted-foreground">Completed — invoice issued</div>
          <div className="text-[10.5px] text-muted-foreground mt-0.5">Tax invoice auto-generated after full payment</div>
        </li>
      )}
    </ol>
  );
}

// thin re-export so Tracking view can trigger the same modal from the sidebar
import { usePayModal } from "./SecurePayModal";
function BalancePayButtons({ orderNo, amount }: { orderNo: string; amount: number }) {
  const open = usePayModal((s) => s.open);
  return (
    <Button size="sm" className="bg-orange hover:bg-orange-dark text-white font-bold" onClick={() => open({ orderNo, kind: "balance", amount })}>
      Pay Now — {inr(amount)}
    </Button>
  );
}
