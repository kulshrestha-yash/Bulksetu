"use client";

// Cart store — persisted to localStorage so a refresh never loses a bulk basket.
import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { CartLine, ProductDTO } from "@/lib/types";
import { slabPriceFor } from "@/lib/format";

interface CartState {
  lines: CartLine[];
  add: (product: ProductDTO, qty: number) => void;
  setQty: (slug: string, qty: number) => void;
  remove: (slug: string) => void;
  clear: () => void;
}

export const useCart = create<CartState>()(
  persist(
    (set) => ({
      lines: [],
      add: (product, qty) =>
        set((state) => {
          const price = slabPriceFor(product.priceSlabs, qty);
          const line: CartLine = {
            productId: product.id,
            slug: product.slug,
            name: product.name,
            packSize: product.packSize,
            unit: product.unit,
            qty,
            slabs: product.priceSlabs,
            slabPrice: price,
            amount: Math.round(price * qty),
            supplierName: product.supplierName,
            imageHint: product.imageHint,
            moq: product.moq,
            hsn: product.hsn,
          };
          const existing = state.lines.find((l) => l.slug === product.slug);
          const lines = existing
            ? state.lines.map((l) => (l.slug === product.slug ? line : l))
            : [...state.lines, line];
          return { lines };
        }),
      setQty: (slug, qty) =>
        set((state) => ({
          lines: state.lines.map((l) => {
            if (l.slug !== slug) return l;
            const price = slabPriceFor(l.slabs, qty);
            return { ...l, qty, slabPrice: price, amount: Math.round(price * qty) };
          }),
        })),
      remove: (slug) => set((state) => ({ lines: state.lines.filter((l) => l.slug !== slug) })),
      clear: () => set({ lines: [] }),
    }),
    { name: "bulksetu-cart" }
  )
);

export function cartTotals(lines: CartLine[]): {
  subtotal: number;
  deliveryFee: number;
  total: number;
  advance: number;
  balance: number;
} {
  const subtotal = lines.reduce((s, l) => s + l.amount, 0);
  const deliveryFee = subtotal >= 50000 || subtotal === 0 ? 0 : 1500;
  const total = subtotal + deliveryFee;
  const advance = Math.round(total * 0.1);
  return { subtotal, deliveryFee, total, advance, balance: total - advance };
}
