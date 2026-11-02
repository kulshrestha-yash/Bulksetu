import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/session";
import { slabPriceFor } from "@/lib/format";
import type { AddressDTO, CartLine, OrderDTO, OrderItemDTO } from "@/lib/types";

export const dynamic = "force-dynamic";

export function parseOrder(o: {
  id: string; orderNo: string; items: string; subtotal: number; deliveryFee: number; total: number;
  advanceAmount: number; balanceAmount: number; advancePaid: boolean; balancePaid: boolean;
  advanceMethod: string | null; balanceMethod: string | null; advanceRef: string | null; balanceRef: string | null;
  status: string; address: string; deliverySpeed: string; poNumber: string | null; deliveryNote: string | null;
  etaFrom: string | null; etaTo: string | null; deliveredAt: Date | null; events: string; createdAt: Date;
}): OrderDTO {
  return {
    id: o.id,
    orderNo: o.orderNo,
    items: JSON.parse(o.items) as OrderItemDTO[],
    subtotal: o.subtotal,
    deliveryFee: o.deliveryFee,
    total: o.total,
    advanceAmount: o.advanceAmount,
    balanceAmount: o.balanceAmount,
    advancePaid: o.advancePaid,
    balancePaid: o.balancePaid,
    advanceMethod: o.advanceMethod,
    balanceMethod: o.balanceMethod,
    advanceRef: o.advanceRef,
    balanceRef: o.balanceRef,
    status: o.status,
    address: JSON.parse(o.address) as AddressDTO,
    deliverySpeed: o.deliverySpeed,
    poNumber: o.poNumber,
    deliveryNote: o.deliveryNote,
    etaFrom: o.etaFrom,
    etaTo: o.etaTo,
    deliveredAt: o.deliveredAt ? o.deliveredAt.toISOString() : null,
    events: JSON.parse(o.events),
    createdAt: o.createdAt.toISOString(),
  };
}

export function parseAddress(a: Record<string, unknown> | undefined | null): AddressDTO {
  const s = (k: string, fallback = "") => (typeof a?.[k] === "string" ? (a[k] as string).trim() : fallback);
  return {
    businessName: s("businessName", "Buyer"),
    gstin: s("gstin"),
    line1: s("line1"),
    line2: s("line2"),
    city: s("city"),
    state: s("state"),
    pincode: s("pincode"),
    phone: s("phone"),
    landmark: s("landmark"),
  };
}

// GET /api/orders — orders of the signed-in buyer
export async function GET() {
  await ensureSeeded();
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });
  const rows = await db.order.findMany({
    where: { userId: user.id },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ orders: rows.map(parseOrder) });
}

// POST /api/orders — create an order (10% advance due). Prices are recomputed
// server-side from the DB so client tampering can't change amounts.
export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { items?: CartLine[]; address?: Record<string, unknown>; deliverySpeed?: string; poNumber?: string; deliveryNote?: string }
    | null;
  if (!body?.items?.length) return NextResponse.json({ error: "Cart is empty" }, { status: 400 });

  // recompute every line from the database
  const orderItems: OrderItemDTO[] = [];
  let subtotal = 0;
  for (const line of body.items) {
    const prod = await db.product.findUnique({ where: { slug: line.slug } });
    if (!prod) return NextResponse.json({ error: `Product unavailable: ${line.slug}` }, { status: 400 });
    if (line.qty < prod.moq) {
      return NextResponse.json({ error: `${prod.name}: minimum order quantity is ${prod.moq} ${prod.unit}` }, { status: 400 });
    }
    const slabs = JSON.parse(prod.priceSlabs) as { minQty: number; price: number }[];
    const unitPrice = slabPriceFor(slabs, line.qty);
    const amount = Math.round(unitPrice * line.qty);
    subtotal += amount;
    orderItems.push({
      productId: prod.id,
      slug: prod.slug,
      name: prod.name,
      packSize: prod.packSize,
      unit: prod.unit,
      qty: line.qty,
      slabPrice: unitPrice,
      amount,
      hsn: prod.hsn,
      supplierName: prod.supplierName,
      imageHint: prod.imageHint,
    });
  }

  const deliveryFee = subtotal >= 50000 ? 0 : 1500; // free bulk freight above ₹50,000
  const total = subtotal + deliveryFee;
  const advanceAmount = Math.round(total * 0.1);
  const balanceAmount = total - advanceAmount;

  // sequential order number BS-YYYY-#####
  const year = new Date().getFullYear();
  let seq = (await db.order.count()) + 1;
  let orderNo = `BS-${year}-${String(seq).padStart(5, "0")}`;
  while (await db.order.findUnique({ where: { orderNo } })) {
    seq += 1;
    orderNo = `BS-${year}-${String(seq).padStart(5, "0")}`;
  }

  const now = new Date();
  const created = await db.order.create({
    data: {
      orderNo,
      userId: user.id,
      items: JSON.stringify(orderItems),
      subtotal,
      deliveryFee,
      total,
      advanceAmount,
      balanceAmount,
      advancePaid: false,
      balancePaid: false,
      status: "PLACED",
      address: JSON.stringify(parseAddress(body.address)),
      deliverySpeed: body.deliverySpeed === "Express" ? "Express" : "Standard",
      poNumber: body.poNumber?.trim() || null,
      deliveryNote: body.deliveryNote?.trim() || null,
      etaFrom: new Date(now.getTime() + 5 * 86400000).toISOString().slice(0, 10),
      etaTo: new Date(now.getTime() + 7 * 86400000).toISOString().slice(0, 10),
      events: JSON.stringify([
        {
          status: "PLACED",
          title: "Order created",
          detail: "Awaiting 10% advance payment to confirm with suppliers",
          at: now.toISOString(),
        },
      ]),
    },
  });

  return NextResponse.json({ order: parseOrder(created) }, { status: 201 });
}
