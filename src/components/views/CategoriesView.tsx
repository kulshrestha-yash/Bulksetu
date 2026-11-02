"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import ImagePlaceholder from "@/components/site/ImagePlaceholder";
import { Skeleton } from "@/components/ui/skeleton";
import { navigate } from "@/lib/hash-router";
import { qtyFmt } from "@/lib/format";
import { CATEGORY_BLURBS, CATEGORY_ICONS } from "@/lib/catalog-data";
import { Lock } from "lucide-react";
import { toast } from "sonner";

interface CategoryInfo {
  name: string;
  count: number;
  blurb: string;
  icon: string;
}

interface Dept {
  name: string;
  count: number;
  live?: boolean;
}

export default function CategoriesView() {
  const [categories, setCategories] = useState<CategoryInfo[] | null>(null);
  const [departments, setDepartments] = useState<Dept[]>([]);

  useEffect(() => {
    (async () => {
      const res = await fetch("/api/categories");
      const data = await res.json();
      setCategories(data.categories ?? []);
      setDepartments(data.departments ?? []);
    })();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder="Search by category, product or company…" />
      <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground">
        <a href="#/" className="hover:text-navy">Home</a> / <b className="text-ink">All Categories</b>
      </div>

      <div className="flex-1 px-5 md:px-7 py-6 w-full max-w-7xl mx-auto">
        <div className="flex items-baseline justify-between mb-4 flex-wrap gap-2">
          <h1 className="text-[17px] font-extrabold text-ink">Browse by Category</h1>
          <span className="text-[11px] font-semibold text-muted-foreground">
            {categories ? `${categories.length} live departments · ${qtyFmt(categories.reduce((s, c) => s + c.count, 0))} products stocked` : "loading…"}
          </span>
        </div>

        {/* live categories */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5">
          {categories === null
            ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[120px] rounded-lg" />)
            : categories.map((c) => (
                <button
                  key={c.name}
                  onClick={() => navigate(`/products?category=${encodeURIComponent(c.name)}`)}
                  className="flex flex-col bg-card border border-border rounded-lg overflow-hidden text-left hover:border-navy hover:shadow-sm transition-colors"
                >
                  <ImagePlaceholder label={`${c.name} banner`} icon={CATEGORY_ICONS[c.name] ?? "★"} className="h-20" rounded="rounded-none" />
                  <div className="p-3">
                    <div className="text-[12px] font-bold text-ink">{c.name}</div>
                    <div className="text-[10px] text-muted-foreground mt-0.5">{c.blurb}</div>
                    <div className="text-[10.5px] text-navy font-semibold mt-1.5">{qtyFmt(c.count)} products · View →</div>
                  </div>
                </button>
              ))}
        </div>

        {/* wider departments */}
        <h2 className="text-[15px] font-extrabold text-ink mt-8 mb-1">More departments — launching in phases</h2>
        <p className="text-[11px] text-muted-foreground mb-3">
          The full BulkSetu catalogue spans 18 departments. Food &amp; Beverage staples are live today; the rest open
          supplier onboarding soon.
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {departments.map((d) =>
            d.live ? null : (
              <button
                key={d.name}
                onClick={() => toast.info(`${d.name} launches soon — suppliers are being onboarded. Food & Beverage is live now.`)}
                className="flex items-center gap-3 bg-card border border-border rounded-lg px-3.5 py-3 text-left hover:border-navy transition-colors"
              >
                <ImagePlaceholder label="" icon="≡" className="w-9 h-9 shrink-0" />
                <span>
                  <span className="text-[11.5px] font-bold text-ink block">{d.name}</span>
                  <span className="text-[10px] text-muted-foreground">{qtyFmt(d.count)} planned listings</span>
                </span>
                <Lock className="w-3.5 h-3.5 text-muted-foreground ml-auto shrink-0" aria-label="Coming soon" />
              </button>
            )
          )}
        </div>
      </div>

      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}
