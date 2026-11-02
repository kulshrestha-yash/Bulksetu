"use client";

// Order status + payment split chips (wireframe screen 10)
import type { OrderDTO } from "@/lib/types";
import { inr } from "@/lib/format";

export function StatusPill({ order }: { order: OrderDTO }) {
  if (order.status === "COMPLETED")
    return <span className="ml-auto text-[10.5px] font-extrabold rounded px-2.5 py-1 bg-navy text-white whitespace-nowrap">COMPLETED — PAID IN FULL</span>;
  if (order.status === "DELIVERED" && !order.balancePaid)
    return <span className="ml-auto text-[10.5px] font-extrabold rounded px-2.5 py-1 text-orange-dark border-[1.5px] border-dashed border-orange whitespace-nowrap">DELIVERED — PAYMENT PENDING</span>;
  if (order.status === "CANCELLED")
    return <span className="ml-auto text-[10.5px] font-extrabold rounded px-2.5 py-1 text-muted-foreground border border-input bg-muted whitespace-nowrap">CANCELLED</span>;
  const label: Record<string, string> = {
    PLACED: order.advancePaid ? "SUPPLIER CONFIRMATION PENDING" : "AWAITING 10% ADVANCE",
    CONFIRMED: "CONFIRMED — PACKING",
    DISPATCHED: "DISPATCHED",
    IN_TRANSIT: "IN TRANSIT",
    DELIVERED: "DELIVERED",
  };
  return <span className="ml-auto text-[10.5px] font-extrabold rounded px-2.5 py-1 text-muted-foreground border border-input bg-white whitespace-nowrap">{label[order.status] || order.status}</span>;
}

export function PaySplitChips({ order }: { order: OrderDTO }) {
  return (
    <div className="flex items-center gap-2 flex-wrap">
      <span className={`text-[10px] font-extrabold rounded px-2 py-1 border ${order.advancePaid ? "bg-[#EDF3FC] text-navy border-navy/50" : "bg-[#FDB874] text-[#5C2E00] border-orange-dark"}`}>
        10% · {inr(order.advanceAmount)} — {order.advancePaid ? "PAID ✓" : "DUE NOW"}
      </span>
      <span className="text-muted-foreground text-[10px]">+</span>
      <span
        className={`text-[10px] font-extrabold rounded px-2 py-1 border ${
          order.balancePaid
            ? "bg-[#EDF3FC] text-navy border-navy/50"
            : ["DELIVERED", "COMPLETED"].includes(order.status)
              ? "bg-[#FDB874] text-[#5C2E00] border-orange-dark"
              : "bg-white text-muted-foreground border-dashed border-input"
        }`}
      >
        90% · {inr(order.balanceAmount)} — {order.balancePaid ? "PAID ✓" : ["DELIVERED", "COMPLETED"].includes(order.status) ? "DUE (within 48 hrs)" : "LOCKED until delivery"}
      </span>
    </div>
  );
}
