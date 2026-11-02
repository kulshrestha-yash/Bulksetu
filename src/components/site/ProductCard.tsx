"use client";

import ImagePlaceholder from "./ImagePlaceholder";
import type { ProductDTO } from "@/lib/types";
import { inr, inrUnit, qtyFmt } from "@/lib/format";
import { navigate } from "@/lib/hash-router";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";

// Product card used on Home (5-up), Listing (3-up grid) and PDP related rail.
export default function ProductCard({ product }: { product: ProductDTO }) {
  const add = useCart((s) => s.add);
  const best = product.priceSlabs[product.priceSlabs.length - 1];

  return (
    <div
      className="flex flex-col bg-card border border-border rounded-lg overflow-hidden hover:border-navy hover:shadow-sm transition-colors cursor-pointer focus-within:border-navy"
      onClick={() => navigate(`/product/${product.slug}`)}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => e.key === "Enter" && navigate(`/product/${product.slug}`)}
      aria-label={product.name}
    >
      <ImagePlaceholder label={product.imageHint ?? product.name} className="h-24 md:h-28" rounded="rounded-none" />
      <div className="p-2.5 md:p-3 flex flex-col gap-1.5 flex-1">
        <div className="text-[11.5px] md:text-[12px] font-bold text-ink leading-snug line-clamp-2">{product.name}</div>
        <div className="text-[10px] text-muted-foreground truncate">
          {product.packSize} · {product.supplierName.split(" ").slice(0, 2).join(" ")}, {product.supplierState}
        </div>
        <div className="flex items-baseline gap-1.5 flex-wrap">
          <span className="text-[13.5px] md:text-[14.5px] font-extrabold text-ink">
            {inrUnit(product.basePrice)}
            <span className="text-[10.5px] font-semibold text-muted-foreground">/{product.unit}</span>
          </span>
          {best && best.price < product.basePrice && (
            <span className="text-[8.5px] md:text-[9.5px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded-full px-1.5 py-[1px]">
              {inrUnit(best.price)} @ {qtyFmt(best.minQty)}+ {product.unit}
            </span>
          )}
        </div>
        <div className="mt-auto flex items-center gap-1.5 pt-1">
          <span className="text-[9.5px] font-bold border border-input rounded-full px-2 py-[2px] text-muted-foreground bg-muted whitespace-nowrap">
            MOQ {qtyFmt(product.moq)} {product.unit}
          </span>
          <Button
            size="sm"
            className="ml-auto h-6 px-2.5 text-[10px] font-bold"
            onClick={(e) => {
              e.stopPropagation();
              add(product, product.moq);
              toast.success(`${product.name} — MOQ ${qtyFmt(product.moq)} ${product.unit} added to cart`);
            }}
          >
            Add to Cart
          </Button>
        </div>
      </div>
    </div>
  );
}
