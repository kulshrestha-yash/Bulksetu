"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import ProductCard from "@/components/site/ProductCard";
import ImagePlaceholder from "@/components/site/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { navigate } from "@/lib/hash-router";
import { inr, qtyFmt } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, BadgeCheck, Truck, Handshake, Headset } from "lucide-react";

interface CategoryInfo {
  name: string;
  count: number;
  blurb: string;
  icon: string;
}

export default function HomeView() {
  const [categories, setCategories] = useState<CategoryInfo[]>([]);
  const [featured, setFeatured] = useState<ProductDTO[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const [cRes, pRes] = await Promise.all([fetch("/api/categories"), fetch("/api/products?featured=1")]);
        const cData = await cRes.json();
        const pData = await pRes.json();
        setCategories(cData.categories ?? []);
        setFeatured(pData.products ?? []);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header />

      {/* hero */}
      <section className="px-5 md:px-7 py-6 md:py-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row gap-6 md:gap-6 items-stretch">
          <div className="flex-1 flex flex-col gap-3 justify-center">
            <h1 className="text-[26px] md:text-[34px] font-extrabold text-ink leading-tight text-balance">
              India&apos;s Trusted B2B Marketplace
            </h1>
            <p className="text-[13px] md:text-[14.5px] text-foreground">
              Connect directly with verified manufacturers, wholesalers &amp; distributors — kitchen staples and beyond,
              at true bulk prices.
            </p>
            <div className="flex gap-2.5 mt-2 flex-wrap">
              <Button className="font-bold" onClick={() => navigate("/products")}>
                Start Buying — Staples
              </Button>
              <Button variant="outline" className="font-bold border-input bg-white" onClick={() => navigate("/sell")}>
                Become a Supplier
              </Button>
            </div>
            <div className="text-[11px] text-muted-foreground mt-2 flex flex-wrap gap-x-4 gap-y-1">
              <span>✓ 10,000+ certified businesses</span>
              <span>✓ Secure 10/90 payments</span>
              <span>✓ Fast bulk delivery</span>
            </div>
          </div>
          <ImagePlaceholder
            label="Hero image — forklift moving pallets in a wholesale warehouse"
            className="w-full md:w-[430px] h-[190px]"
            rounded="rounded-lg"
          />
        </div>
      </section>

      {/* categories */}
      <section className="px-5 md:px-7 pb-2">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] md:text-[16px] font-extrabold text-ink">Shop by Category</h2>
            <a href="#/categories" className="text-[11.5px] font-semibold text-navy hover:underline">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {loading
              ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[104px] rounded-lg" />)
              : categories.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => navigate(`/products?category=${encodeURIComponent(c.name)}`)}
                    className="flex flex-col items-start gap-1.5 bg-card border border-border rounded-lg p-2.5 text-left hover:border-navy hover:shadow-sm transition-colors"
                  >
                    <ImagePlaceholder label={`${c.name} icon`} icon={c.icon} className="w-full h-12" />
                    <span className="text-[11.5px] font-bold text-ink leading-tight">{c.name}</span>
                    <span className="text-[10px] text-muted-foreground">{qtyFmt(c.count)} products</span>
                  </button>
                ))}
          </div>
        </div>
      </section>

      {/* featured products */}
      <section className="px-5 md:px-7 py-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-[15px] md:text-[16px] font-extrabold text-ink">Featured — Kitchen Staples in Bulk</h2>
            <a href="#/products" className="text-[11.5px] font-semibold text-navy hover:underline">
              View all →
            </a>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {loading
              ? Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-[190px] rounded-lg" />)
              : featured.map((p) => <ProductCard key={p.slug} product={p} />)}
          </div>
        </div>
      </section>

      {/* 10/90 payment band */}
      <section className="px-5 md:px-7">
        <div className="max-w-7xl mx-auto rounded-xl border-2 border-orange bg-white overflow-hidden">
          <div className="grid md:grid-cols-[1.2fr_1fr_1fr_1fr_1fr] gap-0">
            <div className="p-5 md:p-6 md:col-span-1 bg-[#FDF6EC]">
              <div className="text-[9.5px] font-extrabold tracking-[1.2px] text-orange-dark mb-1.5">THE BULKSETU WAY</div>
              <div className="text-[17px] font-extrabold text-ink leading-snug">Pay 10% now.<br />90% only after delivery.</div>
              <p className="text-[11px] text-muted-foreground mt-2 leading-relaxed">
                Place bulk orders with just 10% advance. The balance is due only after you inspect &amp; accept the
                delivery — never auto-debited.
              </p>
            </div>
            {[
              ["1", "Order with 10%", `Pay ${inr(1000)}-scale advance at checkout — order confirms with the supplier.`],
              ["2", "Get it delivered", "Track every milestone — confirmed, dispatched, in transit, POD on delivery."],
              ["3", "Accept & pay 90%", "Inspect the goods, then pay the balance by UPI / Card / Netbanking."],
              ["4", "GST invoice", "Full tax invoice unlocks instantly after the final payment."],
            ].map(([n, t, d]) => (
              <div key={n} className="p-5 border-t md:border-t-0 md:border-l border-dashed border-border">
                <span className="w-6 h-6 rounded-full bg-navy text-white text-[11px] font-extrabold flex items-center justify-center">{n}</span>
                <div className="text-[12.5px] font-extrabold text-ink mt-2">{t}</div>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">{d}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* trust band */}
      <section className="px-5 md:px-7 py-7">
        <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            ["10,000+", "certified businesses", BadgeCheck],
            ["5 Lakh+", "products listed", ShieldCheck],
            ["50,000+", "active buyers", Handshake],
            ["₹1,000 Cr+", "order value processed", Truck],
          ].map(([v, l, Icon]) => {
            const I = Icon as React.ComponentType<{ className?: string }>;
            return (
              <div key={l as string} className="bg-card border border-border rounded-lg p-4 text-center">
                <b className="block text-[17px] md:text-[19px] text-navy">{v as string}</b>
                <span className="text-[10.5px] text-muted-foreground flex items-center justify-center gap-1 mt-0.5">
                  <I className="w-3.5 h-3.5" /> {l as string}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* supplier strip */}
      <section className="px-5 md:px-7 pb-8">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center gap-4 bg-muted border-y border-dashed border-border px-5 py-4 rounded-lg">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-[1px]">Verified suppliers on BulkSetu</span>
          <div className="flex flex-wrap gap-2">
            {["Shree Grain Mills", "Laxmi Pulses", "Goldfeed Oils", "Salem Spices", "Annapurna Mills", "Sagar Salts", "Massewalas Foods", "Gau Shakti Dairy"].map((s) => (
              <span key={s} className="text-[10px] font-bold text-foreground border border-input bg-white rounded px-2 py-1.5">
                {s}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* value props */}
      <section className="px-5 md:px-7 pb-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {[
            [BadgeCheck, "Certified companies", "FSSAI, GST & trade licences verified on every supplier profile."],
            [Handshake, "Best wholesale prices", "Quantity slabs reward bigger baskets — save more as you scale."],
            [ShieldCheck, "Safe payments", "PCI-DSS gateway partners. 10% / 90% milestone structure."],
            [Truck, "Fast bulk delivery", "FTL & LTL freight, e-way bills and POD on every order."],
            [Headset, "Dedicated support", "Key-account managers on WhatsApp for every bulk buyer."],
          ].map(([Icon, t, d]) => {
            const I = Icon as React.ComponentType<{ className?: string }>;
            return (
              <div key={t as string} className="bg-card border border-border rounded-lg p-4">
                <I className="w-5 h-5 text-navy mb-2" />
                <div className="text-[12px] font-extrabold text-ink">{t as string}</div>
                <p className="text-[10.5px] text-muted-foreground mt-1 leading-relaxed">{d as string}</p>
              </div>
            );
          })}
        </div>
      </section>

      <Footer />
      <div className="h-[52px] md:hidden">
        <MobileTabBar />
      </div>
    </div>
  );
}
