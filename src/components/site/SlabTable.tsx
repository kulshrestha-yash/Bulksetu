"use client";

import { inrUnit, qtyFmt } from "@/lib/format";
import type { Slab } from "@/lib/types";

// Quantity price-slab table (wireframe screen 05) — highlights the slab that
// applies to the current quantity.
export default function SlabTable({
  slabs,
  unit,
  qty,
  compact = false,
}: {
  slabs: Slab[];
  unit: string;
  qty?: number;
  compact?: boolean;
}) {
  const activeIdx = qty ? slabs.reduce((acc, s, i) => (qty >= s.minQty ? i : acc), 0) : -1;
  if (!slabs.length) return null;

  return (
    <div className={`w-full border border-border rounded-md overflow-hidden bg-white ${compact ? "text-[11px]" : "text-[11.5px]"}`}>
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-muted">
            {!compact && <th className="text-left px-3 py-2 text-[9.5px] font-extrabold tracking-[0.6px] uppercase text-muted-foreground border-b border-border">Quantity slab</th>}
            <th className={`text-left px-3 py-2 text-[9.5px] font-extrabold tracking-[0.6px] uppercase text-muted-foreground border-b border-border ${compact ? "" : ""}`}>Price / {unit}</th>
            {!compact && <th className="text-left px-3 py-2 text-[9.5px] font-extrabold tracking-[0.6px] uppercase text-muted-foreground border-b border-border">Saving</th>}
            {!compact && <th className="border-b border-border" />}
          </tr>
        </thead>
        <tbody>
          {slabs.map((s, i) => {
            const isFirst = i === 0;
            const saving = isFirst ? null : slabs[0].price - s.price;
            const active = qty ? i === activeIdx : false;
            return (
              <tr key={i} className={active ? "bg-[#F4F8FE] font-extrabold text-navy" : "text-foreground"}>
                {!compact && <td className="px-3 py-2 border-b border-dashed border-border">{qtyFmt(s.minQty)}{isFirst ? "" : "+"} {unit}{slabs.length > i + 1 ? ` — ${qtyFmt(slabs[i + 1].minQty - 1)}` : "+"}</td>}
                <td className="px-3 py-2 border-b border-dashed border-border">{inrUnit(s.price)}</td>
                {!compact && <td className="px-3 py-2 border-b border-dashed border-border">{saving ? `${inrUnit(saving)} / ${unit}` : <span className="text-muted-foreground">—</span>}</td>}
                {!compact && (
                  <td className="px-3 py-2 border-b border-dashed border-border text-right">
                    {active ? (
                      <span className="text-[9px] font-bold text-navy border border-navy/40 bg-white rounded-full px-1.5 py-[1px]">Your slab</span>
                    ) : !isFirst && i === slabs.length - 1 ? (
                      <span className="text-[9px] text-muted-foreground">best value</span>
                    ) : null}
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
