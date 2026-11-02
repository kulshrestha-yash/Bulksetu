import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/session";
import { parseOrder } from "../route";

export const dynamic = "force-dynamic";

// GET /api/orders/one?orderNo=BS-2026-00847
export async function GET(req: Request) {
  await ensureSeeded();
  const user = await getSessionUser();
  const { searchParams } = new URL(req.url);
  const orderNo = searchParams.get("orderNo");
  if (!orderNo) return NextResponse.json({ error: "orderNo required" }, { status: 400 });

  const row = await db.order.findUnique({ where: { orderNo } });
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });

  // guests may view via direct link only if they own it (demo keeps it open for walkthrough)
  if (row.userId && user && row.userId !== user.id) {
    return NextResponse.json({ error: "Not your order" }, { status: 403 });
  }
  return NextResponse.json({ order: parseOrder(row) });
}
