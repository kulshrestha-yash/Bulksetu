"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import ProductCard from "@/components/site/ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import { navigate, useRoute } from "@/lib/hash-router";
import { qtyFmt } from "@/lib/format";
import type { ProductDTO } from "@/lib/types";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CategoryInfo {
  name: string;
  count: number;
}

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "price-asc", label: "Price — low to high" },
  { id: "price-desc", label: "Price — high to low" },
  { id: "moq", label: "Lowest MOQ" },
  { id: "rating", label: "Top rated" },
];

export default function ListingView() {
  const route = useRoute();
  const category = route.query.get("category") || "";
  const q = route.query.get("q") || "";

  const [data, setData] = useState<{ key: string; products: ProductDTO[]; total: number } | null>(null);
  const [cats, setCats] = useState<CategoryInfo[]>([]);
  const [sort, setSort] = useState(route.query.get("sort") || "featured");
  const [page, setPage] = useState(1);
  const [states, setStates] = useState<string[]>([]);
  const [types, setTypes] = useState<string[]>([]);
  const [priceMax, setPriceMax] = useState<number | null>(null);
  const [moqMax, setMoqMax] = useState<number | null>(null);

  const fetchKey = `${category}|${q}|${sort}`;
  const stale = data === null || data.key !== fetchKey;

  useEffect(() => {
    (async () => {
      const cRes = await fetch("/api/categories");
      setCats((await cRes.json()).categories ?? []);
    })();
  }, []);

  useEffect(() => {
    (async () => {
      const params = new URLSearchParams({ pageSize: "48", sort });
      if (category) params.set("category", category);
      if (q) params.set("q", q);
      const res = await fetch(`/api/products?${params}`);
      const d = await res.json();
      setData({ key: fetchKey, products: d.products ?? [], total: d.total ?? 0 });
      setPage(1);
    })();
  }, [category, q, sort, fetchKey]);

  const products = stale ? null : data!.products;
  const total = data?.total ?? 0;

  const availableStates = useMemo(() => {
    const set = new Set<string>();
    data?.products.forEach((p) => set.add(p.supplierState));
    return Array.from(set).sort();
  }, [data]);

  const filtered = useMemo(() => {
    let list = stale ? [] : data!.products;
    if (states.length) list = list.filter((p) => states.includes(p.supplierState));
    if (types.length) list = list.filter((p) => types.some((t) => p.supplierType.includes(t)));
    if (priceMax !== null) list = list.filter((p) => p.basePrice <= priceMax);
    if (moqMax !== null) list = list.filter((p) => p.moq <= moqMax);
    return list;
  }, [data, stale, states, types, priceMax, moqMax]);

  const pageSize = 9;
  const pageCount = Math.max(1, Math.ceil(filtered.length / pageSize));
  const visible = filtered.slice((page - 1) * pageSize, page * pageSize);

  const toggle = useCallback((list: string[], setList: (v: string[]) => void, v: string) => {
    setList(list.includes(v) ? list.filter((x) => x !== v) : [...list, v]);
  }, []);

  const filtersActive = states.length || types.length || priceMax !== null || moqMax !== null;

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder={category ? `Search in ${category} — “atta”, “dal”, “mustard oil”…` : "Search 5 lakh+ products…"} initialQuery={q} />
      <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground">
        <a href="#/" className="hover:text-navy">Home</a> / <a href="#/categories" className="hover:text-navy">Food &amp; Beverage</a> /{" "}
        <b className="text-ink">{category || (q ? `Search: “${q}”` : "All products")}</b>
      </div>

      <div className="flex-1 w-full max-w-7xl mx-auto px-5 md:px-0 py-5">
        <div className="flex flex-col lg:flex-row items-start">
          {/* ── filters ─────────────────────────────────────────────── */}
          <aside className="w-full lg:w-60 lg:shrink-0 lg:border-r lg:border-border lg:bg-panel lg:min-h-[640px] lg:rounded-l-lg mb-5 lg:mb-0" aria-label="Filters">
            <div className="lg:p-4">
              <div className="hidden lg:flex items-center justify-between mb-3">
                <span className="text-[13.5px] font-extrabold text-ink">Filters</span>
                {filtersActive && (
                  <button
                    className="text-[10.5px] font-semibold text-navy hover:underline"
                    onClick={() => {
                      setStates([]);
                      setTypes([]);
                      setPriceMax(null);
                      setMoqMax(null);
                    }}
                  >
                    Clear all
                  </button>
                )}
              </div>

              <FilterGroup title="Category">
                {cats.map((c) => (
                  <label key={c.name} className="flex items-center gap-2 text-[11.5px] mb-1.5 cursor-pointer">
                    <Checkbox
                      checked={category === c.name}
                      onCheckedChange={() => navigate(category === c.name ? "/products" : `/products?category=${encodeURIComponent(c.name)}`)}
                    />
                    <span className="text-foreground">{c.name}</span>
                    <span className="ml-auto text-[10px] text-muted-foreground">{c.count}</span>
                  </label>
                ))}
                <a href="#/categories" className="text-[10.5px] font-semibold text-navy hover:underline">All categories →</a>
              </FilterGroup>

              <FilterGroup title="Max price per unit">
                <div className="flex items-center gap-2">
                  <input
                    type="number"
                    min={0}
                    placeholder="Max ₹"
                    value={priceMax ?? ""}
                    onChange={(e) => setPriceMax(e.target.value === "" ? null : Number(e.target.value))}
                    className="w-full h-8 px-2 rounded border border-input bg-white text-[11.5px]"
                    aria-label="Maximum price per unit"
                  />
                </div>
                <div className="text-[10px] text-muted-foreground mt-1">Filters by the best slab price shown on cards.</div>
              </FilterGroup>

              <FilterGroup title="Max MOQ">
                <div className="flex flex-wrap gap-1.5">
                  {[100, 200, 500, 1000].map((v) => (
                    <button
                      key={v}
                      onClick={() => setMoqMax(moqMax === v ? null : v)}
                      className={`text-[10px] font-bold rounded-full px-2 py-1 border ${moqMax === v ? "bg-navy border-navy text-white" : "border-input bg-white text-muted-foreground"}`}
                    >
                      ≤ {qtyFmt(v)} {v === 1000 ? "+" : ""}
                    </button>
                  ))}
                </div>
              </FilterGroup>

              <FilterGroup title="Supplier location">
                {availableStates.map((s) => (
                  <label key={s} className="flex items-center gap-2 text-[11.5px] mb-1.5 cursor-pointer">
                    <Checkbox checked={states.includes(s)} onCheckedChange={() => toggle(states, setStates, s)} />
                    <span className="text-foreground">{s}</span>
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Supplier type">
                {["Manufacturer", "Wholesaler", "Distributor", "Exporter"].map((t) => (
                  <label key={t} className="flex items-center gap-2 text-[11.5px] mb-1.5 cursor-pointer">
                    <Checkbox checked={types.includes(t)} onCheckedChange={() => toggle(types, setTypes, t)} />
                    <span className="text-foreground">{t}</span>
                  </label>
                ))}
              </FilterGroup>

              <label className="flex items-center gap-2 text-[11.5px] font-bold text-ink cursor-pointer">
                <Checkbox checked disabled />
                Verified suppliers only
              </label>
            </div>
          </aside>

          {/* ── results ─────────────────────────────────────────────── */}
          <div className="flex-1 lg:px-5 w-full">
            <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
              <b className="text-[13px] text-ink">
                {products === null ? "Loading…" : `${filtered.length} product${filtered.length === 1 ? "" : "s"}`}
                {category ? ` in ${category}` : ""}
              </b>
              <div className="flex items-center gap-2">
                <label className="text-[10.5px] text-muted-foreground" htmlFor="sortsel">Sort</label>
                <select
                  id="sortsel"
                  value={sort}
                  onChange={(e) => {
                    const params = new URLSearchParams();
                    if (category) params.set("category", category);
                    if (q) params.set("q", q);
                    if (e.target.value !== "featured") params.set("sort", e.target.value);
                    navigate(`/products${params.toString() ? `?${params}` : ""}`);
                  }}
                  className="h-8 rounded border border-input bg-white text-[11.5px] px-2"
                >
                  {SORTS.map((s) => (
                    <option key={s.id} value={s.id}>{s.label}</option>
                  ))}
                </select>
                <span className="text-[9.5px] font-bold text-navy border border-navy/40 bg-[#EEF3FB] rounded-full px-2 py-1">✓ Verified</span>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 gap-3.5 min-h-[400px]">
              {products === null
                ? Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-[210px] rounded-lg" />)
                : visible.map((p) => <ProductCard key={p.slug} product={p} />)}
            </div>

            {products !== null && filtered.length === 0 && (
              <div className="text-center py-16">
                <p className="text-[14px] font-bold text-ink">No products match these filters yet.</p>
                <p className="text-[11.5px] text-muted-foreground mt-1">Try clearing a filter or browsing all categories.</p>
                <button className="mt-4 text-[12px] font-bold text-navy hover:underline" onClick={() => navigate("/products")}>
                  Browse all products →
                </button>
              </div>
            )}

            {/* pager */}
            {pageCount > 1 && (
              <div className="flex gap-1.5 justify-center mt-6" aria-label="Pagination">
                <PagerBtn disabled={page === 1} onClick={() => setPage(page - 1)}><ChevronLeft className="w-3.5 h-3.5" /></PagerBtn>
                {Array.from({ length: pageCount }).map((_, i) => (
                  <PagerBtn key={i} active={page === i + 1} onClick={() => setPage(i + 1)}>{i + 1}</PagerBtn>
                ))}
                <PagerBtn disabled={page === pageCount} onClick={() => setPage(page + 1)}><ChevronRight className="w-3.5 h-3.5" /></PagerBtn>
              </div>
            )}
          </div>
        </div>
      </div>

      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}

function FilterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="mb-4 pb-3.5 border-b border-dashed border-border last:border-0">
      <div className="text-[9.5px] font-extrabold tracking-[1px] uppercase text-muted-foreground mb-2">{title}</div>
      {children}
    </div>
  );
}

function PagerBtn({ children, active, disabled, onClick }: { children: React.ReactNode; active?: boolean; disabled?: boolean; onClick?: () => void }) {
  return (
    <button
      disabled={disabled}
      onClick={onClick}
      aria-current={active ? "page" : undefined}
      className={`w-7 h-7 rounded-md border text-[11.5px] flex items-center justify-center ${
        active ? "bg-navy border-navy text-white font-bold" : "border-input bg-white text-foreground disabled:opacity-40"
      }`}
    >
      {children}
    </button>
  );
}
