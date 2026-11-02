import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { DEPARTMENTS, CATEGORY_BLURBS, CATEGORY_ICONS } from "@/lib/catalog-data";

export const dynamic = "force-dynamic";

// GET /api/categories → functional categories (with live product counts) + department grid
export async function GET() {
  await ensureSeeded();
  const grouped = await db.product.groupBy({
    by: ["category"],
    _count: { _all: true },
  });
  const counts: Record<string, number> = {};
  for (const g of grouped) counts[g.category] = g._count._all;

  const categories = Object.keys(CATEGORY_BLURBS)
    .filter((c) => counts[c])
    .map((c) => ({
      name: c,
      count: counts[c],
      blurb: CATEGORY_BLURBS[c],
      icon: CATEGORY_ICONS[c] ?? c[0],
    }));

  return NextResponse.json({ categories, departments: DEPARTMENTS });
}
