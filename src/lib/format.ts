// INR + date formatting helpers (Indian locale).

export function inr(n: number, opts?: { decimals?: boolean }): string {
  const d = opts?.decimals ?? false;
  return "₹" + n.toLocaleString("en-IN", {
    minimumFractionDigits: d ? 2 : 0,
    maximumFractionDigits: d ? 2 : 0,
  });
}

// price may be fractional (₹9.5/kg) — show up to 2 decimals only when needed
export function inrUnit(n: number): string {
  const hasFraction = Math.abs(n % 1) > 0.001;
  return inr(n, { decimals: hasFraction });
}

export function qtyFmt(n: number): string {
  return n.toLocaleString("en-IN");
}

export function fmtDate(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" });
}

export function fmtDateTime(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return (
    d.toLocaleDateString("en-IN", { day: "2-digit", month: "short" }) +
    ", " +
    d.toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit", hour12: true })
  );
}

/** price per unit for a given quantity based on slabs (slabs sorted by minQty asc) */
export function slabPriceFor(slabs: { minQty: number; price: number }[], qty: number): number {
  if (!slabs.length) return 0;
  let price = slabs[0].price;
  for (const s of slabs) {
    if (qty >= s.minQty) price = s.price;
  }
  return price;
}

/** the slab row that applies to qty */
export function activeSlabIndex(slabs: { minQty: number; price: number }[], qty: number): number {
  let idx = 0;
  for (let i = 0; i < slabs.length; i++) {
    if (qty >= slabs[i].minQty) idx = i;
  }
  return idx;
}
