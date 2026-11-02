"use client";

import Link from "next/link";

// BulkSetu logomark — navy tile, bridge "B", orange growth stripe (from the
// brand sheet). Text lockup: Bulk (navy) + Setu (orange).
export function LogoMark({ size = 36 }: { size?: number }) {
  return (
    <span
      aria-hidden
      className="relative flex items-center justify-center rounded-[7px] bg-navy text-white font-extrabold overflow-hidden shrink-0"
      style={{ width: size, height: size, fontSize: size * 0.55 }}
    >
      B
      <span
        className="absolute bg-orange"
        style={{ width: size * 0.6, height: 3, transform: "rotate(-35deg)", right: -4, bottom: size * 0.17 }}
      />
    </span>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <Link href="#/" className="flex items-center gap-2.5 shrink-0" aria-label="BulkSetu home">
      <LogoMark size={compact ? 30 : 36} />
      <span className="flex flex-col leading-none">
        <span className={`font-extrabold tracking-tight ${compact ? "text-[15px]" : "text-[17px]"}`}>
          <span className="text-navy">Bulk</span>
          <span className="text-orange">Setu</span>
        </span>
        <span className="text-[7.5px] tracking-[1.6px] text-muted-foreground mt-[3px] font-semibold">B2B MARKETPLACE</span>
      </span>
    </Link>
  );
}
