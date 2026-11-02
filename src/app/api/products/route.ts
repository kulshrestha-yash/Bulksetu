import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import type { ProductDTO, Slab } from "@/lib/types";

export const dynamic = "force-dynamic";

export function toProductDTO(p: {
  id: string; slug: string; name: string; grade: string | null; category: string; department: string;
  packSize: string; unit: string; moq: number; basePrice: number; priceSlabs: string;
  supplierName: string; supplierCity: string; supplierState: string; supplierType: string;
  supplierYears: number; supplierRating: number; rating: number; reviews: number; stockKg: number;
  hsn: string; description: string | null; imageHint: string | null; imageUrl: string | null; featured: boolean;
}): ProductDTO {
  return { ...p, priceSlabs: JSON.parse(p.priceSlabs) as Slab[] };
}

// GET /api/products?category=&q=&sort=&featured=&page=&pageSize=
export async function GET(req: Request) {
  await ensureSeeded();
  const { searchParams } = new URL(req.url);
  const category = searchParams.get("category") || undefined;
  const q = searchParams.get("q")?.trim() || undefined;
  const sort = searchParams.get("sort") || "featured";
  const featured = searchParams.get("featured");
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const pageSize = Math.min(48, Math.max(1, parseInt(searchParams.get("pageSize") || "9", 10)));

  const where: Record<string, unknown> = {};
  if (category) where.category = category;
  if (featured === "1") where.featured = true;
  if (q) {
    where.OR = [
      { name: { contains: q } },
      { category: { contains: q } },
      { supplierName: { contains: q } },
      { grade: { contains: q } },
      { packSize: { contains: q } },
    ];
  }

  const orderBy: Record<string, "asc" | "desc"> =
    sort === "price-asc" ? { basePrice: "asc" }
    : sort === "price-desc" ? { basePrice: "desc" }
    : sort === "moq" ? { moq: "asc" }
    : sort === "rating" ? { rating: "desc" }
    : { basePrice: "desc" };

  const [rows, total] = await Promise.all([
    db.product.findMany({
      where,
      orderBy: featured === "1" ? [{ featured: "desc" }, orderBy] : orderBy,
      skip: featured === "1" ? 0 : (page - 1) * pageSize,
      take: featured === "1" ? 10 : pageSize,
    }),
    db.product.count({ where }),
  ]);

  return NextResponse.json({ products: rows.map(toProductDTO), total, page, pageSize });
}
