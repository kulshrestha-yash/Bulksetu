import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/session";
import { parseOrder } from "../route";

export const dynamic = "force-dynamic";

const NEXT: Record<string, { next: string; title: string; detail: (orderNo: string) => string }> = {
  PLACED: {
    next: "CONFIRMED",
    title: "Supplier confirmed",
    detail: () => "Supplier accepted the order · packing started",
  },
  CONFIRMED: {
    next: "DISPATCHED",
    title: "Packed & dispatched",
    detail: () => `Packages handed to logistics · LR-${Math.floor(1000 + Math.random() * 9000)} · e-way bill attached`,
  },
  DISPATCHED: {
    next: "IN_TRANSIT",
    title: "In transit",
    detail: () => "Line-haul to destination hub · updates on WhatsApp & SMS",
  },
  IN_TRANSIT: {
    next: "DELIVERED",
    title: "Delivered — accepted by buyer",
    detail: () => "Proof of delivery captured · 90% balance payment unlocked",
  },
  // NOTE: DELIVERED → COMPLETED is intentionally NOT reachable here — it only
  // happens through the 90% balance payment (/api/orders/pay).
};

/**
 * POST /api/orders/advance — DEMO ONLY.
 * Simulates the fulfilment timeline (supplier confirm → dispatch → transit →
 * delivered) so the whole 10/90 journey is walkable before real supplier
 * systems are connected. Blocked at DELIVERED → COMPLETED until the 90%
 * balance is actually paid (that transition happens via /api/orders/pay).
 */
export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as { orderNo?: string } | null;
  if (!body?.orderNo) return NextResponse.json({ error: "orderNo required" }, { status: 400 });

  const row = await db.order.findUnique({ where: { orderNo: body.orderNo } });
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (row.userId && row.userId !== user.id) return NextResponse.json({ error: "Not your order" }, { status: 403 });

  const step = NEXT[row.status];
  if (!step) return NextResponse.json({ error: "Order already completed" }, { status: 409 });
  if (row.status === "DELIVERED" && !row.balancePaid) {
    return NextResponse.json(
      { error: "Pay the 90% balance to complete this order — the invoice unlocks on full payment." },
      { status: 409 }
    );
  }

  const events = JSON.parse(row.events) as { status: string; title: string; detail: string; at: string }[];
  events.push({ status: step.next, title: step.title, detail: step.detail(row.orderNo), at: new Date().toISOString() });

  const updated = await db.order.update({
    where: { id: row.id },
    data: {
      status: step.next,
      events: JSON.stringify(events),
      ...(step.next === "DELIVERED" ? { deliveredAt: new Date() } : {}),
    },
  });
  return NextResponse.json({ order: parseOrder(updated) });
}
