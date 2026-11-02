"use client";

import { useState } from "react";
import { qtyFmt } from "@/lib/format";

// MOQ-aware quantity stepper — steps in sensible bulk increments.
export default function QuantityStepper({
  value,
  moq,
  unit,
  step,
  onChange,
  size = "md",
}: {
  value: number;
  moq: number;
  unit: string;
  step?: number;
  onChange: (v: number) => void;
  size?: "md" | "sm";
}) {
  const inc = step ?? Math.max(moq, moq >= 1000 ? 500 : moq >= 200 ? 100 : moq >= 50 ? 25 : 1);
  const [draft, setDraft] = useState<string | null>(null);
  const h = size === "sm" ? "h-7" : "h-8";
  const clamp = (v: number) => Math.max(moq, Math.round(v));

  return (
    <span className={`inline-flex items-stretch border border-input rounded-md overflow-hidden bg-white ${h}`}>
      <button
        type="button"
        aria-label="Decrease quantity"
        className="w-8 flex items-center justify-center border-r border-border font-extrabold text-foreground hover:bg-muted disabled:opacity-40"
        disabled={value <= moq}
        onClick={() => onChange(clamp(value - inc))}
      >
        −
      </button>
      <input
        aria-label={`Quantity in ${unit}`}
        className="w-20 text-center font-bold text-ink text-[12px] focus:outline-none"
        value={draft ?? `${qtyFmt(value)} ${unit}`}
        onFocus={() => setDraft(String(value))}
        onBlur={() => {
          if (draft !== null) {
            const n = parseFloat(draft.replace(/,/g, ""));
            onChange(clamp(Number.isFinite(n) ? n : value));
          }
          setDraft(null);
        }}
        onChange={(e) => setDraft(e.target.value)}
        inputMode="decimal"
      />
      <button
        type="button"
        aria-label="Increase quantity"
        className="w-8 flex items-center justify-center border-l border-border font-extrabold text-foreground hover:bg-muted"
        onClick={() => onChange(clamp(value + inc))}
      >
        +
      </button>
    </span>
  );
}
