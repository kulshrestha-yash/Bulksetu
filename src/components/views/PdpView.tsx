"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import ImagePlaceholder from "@/components/site/ImagePlaceholder";
import SlabTable from "@/components/site/SlabTable";
import QuantityStepper from "@/components/site/QuantityStepper";
import ProductCard from "@/components/site/ProductCard";
import { PaymentPlanHint } from "@/components/site/PaymentPlan";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { useRoute } from "@/lib/hash-router";
import { inr, inrUnit, qtyFmt } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";
import { useCart } from "@/store/cart";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";

export default function PdpView() {
  const route = useRoute();
  const slug = route.segments[1] || "";
  const [product, setProduct] = useState<ProductDTO | null>(null);
  const [related, setRelated] = useState<ProductDTO[]>([]);
  const [notFound, setNotFound] = useState(false);
  const [qty, setQty] = useState(0);
  const add = useCart((s) => s.add);

  useEffect(() => {
    (async () => {
      setProduct(null);
      setNotFound(false);
      const res = await fetch(`/api/products/one?slug=${encodeURIComponent(slug)}`);
      if (!res.ok) {
        setNotFound(true);
        return;
      }
      const data = await res.json();
      setProduct(data.product);
      setRelated(data.related ?? []);
      setQty(data.product.moq);
    })();
  }, [slug]);

  const slab = product ? product.priceSlabs.reduce((acc, s) => (qty >= s.minQty ? s.price : acc), product.priceSlabs[0].price) : 0;
  const lineTotal = Math.round(slab * qty);
  const packInfo = product ? `${Math.round(qty / (parseInt(product.packSize) || 1) || 1)} × ${product.packSize}` : "";

  const addToCart = () => {
    if (!product) return;
    add(product, qty);
    toast.success(`${product.name} · ${qtyFmt(qty)} ${product.unit} added — ${inr(lineTotal)}`);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder="Search 5 lakh+ products…" />

      {notFound && (
        <div className="flex-1 flex flex-col items-center justify-center py-24 px-5 text-center">
          <p className="text-[15px] font-extrabold text-ink">Product not found</p>
          <p className="text-[12px] text-muted-foreground mt-1">It may have been delisted — browse the live staples instead.</p>
          <Button className="mt-4" onClick={() => (window.location.hash = "#/products")}>Browse products</Button>
        </div>
      )}

      {product && (
        <>
          <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground overflow-x-auto whitespace-nowrap">
            <a href="#/" className="hover:text-navy">Home</a> / <a href="#/categories" className="hover:text-navy">{product.category}</a> /{" "}
            <b className="text-ink">{product.name}</b>
          </div>

          <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-7 py-5">
            <div className="flex flex-col lg:flex-row gap-6 items-start">
              {/* gallery */}
              <div className="w-full lg:w-[300px] shrink-0">
                <ImagePlaceholder label={product.imageHint ?? "Main product photo"} className="w-full h-[230px] lg:h-[265px]" rounded="rounded-lg" />
                <div className="flex gap-2 mt-2">
                  {[1, 2, 3, 4].map((n) => (
                    <ImagePlaceholder key={n} label={`Photo ${n}`} className="w-14 h-12" />
                  ))}
                </div>
              </div>

              {/* info */}
              <div className="flex-1 flex flex-col gap-3 min-w-0">
                <div className="flex flex-wrap gap-1.5">
                  {product.grade && <span className="text-[9.5px] font-bold border border-input rounded-full px-2 py-1 bg-white text-muted-foreground">{product.grade}</span>}
                  <span className="text-[9.5px] font-bold border border-input rounded-full px-2 py-1 bg-white text-muted-foreground">Category: {product.category}</span>
                </div>
                <h1 className="text-[20px] md:text-[22px] font-extrabold text-ink leading-tight">{product.name}</h1>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[9.5px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded-full px-2 py-1">{product.rating.toFixed(1)} ★ · {product.reviews} reviews</span>
                  <span className="text-[9.5px] font-bold border border-input rounded-full px-2 py-1 bg-white text-muted-foreground">{product.supplierName}</span>
                  <span className="text-[9.5px] font-bold border border-input rounded-full px-2 py-1 bg-white text-muted-foreground">GST invoice available</span>
                </div>

                <div className="flex items-baseline gap-2">
                  <b className="text-[26px] text-ink">{inrUnit(slab)}</b>
                  <span className="text-[11.5px] text-muted-foreground">per {product.unit} · {qtyFmt(qty)} {product.unit} slab applied</span>
                </div>

                <SlabTable slabs={product.priceSlabs} unit={product.unit} qty={qty} />

                <div className="flex flex-wrap items-center gap-2.5">
                  <span className="text-[10.5px] font-bold text-foreground">Pack</span>
                  <span className="text-[11.5px] border border-input rounded bg-white px-2.5 py-1.5 text-muted-foreground">{product.packSize}</span>
                  <span className="text-[10.5px] font-bold text-foreground ml-1">Quantity</span>
                  <QuantityStepper value={qty} moq={product.moq} unit={product.unit} onChange={setQty} />
                  <span className="text-[9.5px] font-bold border border-dashed border-input rounded-full px-2 py-1 text-muted-foreground">
                    MOQ {qtyFmt(product.moq)} {product.unit}
                  </span>
                  <span className="text-[10.5px] text-muted-foreground">In stock · {qtyFmt(Math.round(product.stockKg))} {product.unit} available</span>
                </div>

                <div className="flex flex-wrap items-center gap-2.5">
                  <Button className="font-bold" onClick={addToCart}>
                    Add to Cart — {inr(lineTotal)}
                  </Button>
                  <Button
                    variant="outline"
                    className="border-input bg-white font-bold"
                    onClick={() => toast.success(`Enquiry sent to ${product.supplierName} — they usually respond in ~2 hrs.`)}
                  >
                    Talk to Supplier
                  </Button>
                  <span className="text-[10.5px] text-muted-foreground">
                    Dispatch in 3–5 days · {product.supplierCity}, {product.supplierState}
                    {packInfo && parseInt(product.packSize) > 0 ? ` · ${packInfo}` : ""}
                  </span>
                </div>

                <PaymentPlanHint
                  advance={inr(Math.round(lineTotal * 0.1))}
                  balance={inr(lineTotal - Math.round(lineTotal * 0.1))}
                />

                <p className="text-[11.5px] text-foreground leading-relaxed">{product.description}</p>
              </div>

              {/* supplier card */}
              <aside className="w-full lg:w-64 shrink-0 bg-card border border-border rounded-lg p-4 flex flex-col gap-2.5">
                <div className="flex items-center gap-2.5">
                  <ImagePlaceholder label="logo" className="w-12 h-12" />
                  <div>
                    <b className="text-[12.5px] text-ink block leading-tight">{product.supplierName}</b>
                    <span className="text-[10px] text-muted-foreground">{product.supplierCity}, {product.supplierState}</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1.5">
                  <span className="text-[9px] font-bold text-navy bg-[#EEF3FB] border border-navy/40 rounded-full px-1.5 py-1 inline-flex items-center gap-1">
                    <BadgeCheck className="w-3 h-3" /> Verified supplier
                  </span>
                  <span className="text-[9px] font-bold border border-input rounded-full px-1.5 py-1 bg-white text-muted-foreground">{product.supplierYears} yrs</span>
                  <span className="text-[9px] font-bold border border-input rounded-full px-1.5 py-1 bg-white text-muted-foreground">{product.supplierRating.toFixed(1)} ★</span>
                </div>
                <div className="text-[10.5px] text-muted-foreground leading-relaxed">
                  {product.supplierType} · Member since {2026 - product.supplierYears}
                  <br />
                  Responds in ~2 hrs · Fulfils 98% orders
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-input bg-white text-[11px]"
                  onClick={() => navigate(`/products?q=${encodeURIComponent(product.supplierName.split(" ")[0])}`)}
                >
                  View Catalogue
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-input bg-white text-[11px]"
                  onClick={() => toast.success("Best price request sent — expect a revised quote within 2 working hours.")}
                >
                  Get Best Price
                </Button>
              </aside>
            </div>

            {/* tabs strip */}
            <div className="mt-7 flex flex-wrap items-center gap-2 bg-muted border-y border-dashed border-border px-4 py-3 rounded">
              {["Specs", "Certifications", "Reviews", "Shipping & Returns"].map((t) => (
                <span key={t} className="text-[10px] font-bold text-muted-foreground border border-input bg-white rounded px-2.5 py-1.5">{t}</span>
              ))}
              <span className="flex-1" />
              <span className="text-[10.5px] text-muted-foreground">HSN {product.hsn} · FSSAI &amp; GST docs shared with invoice</span>
            </div>

            {/* related */}
            {related.length > 0 && (
              <section className="mt-7">
                <h2 className="text-[15px] font-extrabold text-ink mb-3">More in {product.category}</h2>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
                  {related.map((p) => <ProductCard key={p.slug} product={p} />)}
                </div>
              </section>
            )}
          </div>

          {/* mobile sticky add bar */}
          <div className="lg:hidden sticky bottom-[52px] bg-white border-t border-border px-3.5 py-2.5 flex items-center gap-3 z-30">
            <div className="text-[14px] font-extrabold text-ink leading-tight">
              {inr(lineTotal)}
              <span className="block text-[9.5px] font-semibold text-muted-foreground">
                {qtyFmt(qty)} {product.unit} · slab {inrUnit(slab)}/{product.unit}
              </span>
            </div>
            <span className="flex-1" />
            <Button size="sm" className="font-bold" onClick={addToCart}>Add to Cart</Button>
          </div>
        </>
      )}

      {!product && !notFound && (
        <div className="flex-1 w-full max-w-7xl mx-auto px-5 py-8 grid lg:grid-cols-[300px_1fr_260px] gap-6">
          <Skeleton className="h-[265px]" />
          <div className="space-y-3"><Skeleton className="h-6 w-2/3" /><Skeleton className="h-40" /><Skeleton className="h-14" /></div>
          <Skeleton className="h-64" />
        </div>
      )}

      <Footer />
      <div className="h-[52px] lg:hidden"><MobileTabBar /></div>
    </div>
  );
}
