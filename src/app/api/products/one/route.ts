import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { toProductDTO } from "../route";

export const dynamic = "force-dynamic";

// GET /api/products/one?slug=basmati-rice-premium-long-grain
export async function GET(req: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(req.url);
  const slug = searchParams.get("slug");
  if (!slug) return NextResponse.json({ error: "slug required" }, { status: 400 });

  const product = await db.product.findUnique({ where: { slug } });
  if (!product) return NextResponse.json({ error: "Product not found" }, { status: 404 });

  // related products from the same category (excluding self)
  const related = await db.product.findMany({
    where: { category: product.category, slug: { not: slug } },
    take: 4,
  });

  return NextResponse.json({
    product: toProductDTO(product),
    related: related.map(toProductDTO),
  });
}
