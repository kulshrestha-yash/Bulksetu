import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded } from "@/lib/seed";
import { getSessionUser } from "@/lib/session";
import { getPaymentProvider } from "@/lib/payments";
import type { PayMethod } from "@/lib/payments/types";
import { parseOrder } from "../route";

export const dynamic = "force-dynamic";

const METHODS: PayMethod[] = ["UPI", "Card", "Netbanking", "Wallet"];

/**
 * POST /api/orders/pay — the single gateway seam.
 * Body: { orderNo, kind: "advance" | "balance", method }
 *
 * 1. Amount is resolved SERVER-SIDE from the stored order (never from the client).
 * 2. getPaymentProvider().createIntent() charges via the configured gateway
 *    (mock sandbox by default; Stripe/JusPay drop in per PAYMENT_INTEGRATION.md).
 * 3. On success the order is updated: 10% paid → order stands; 90% paid →
 *    COMPLETED and the tax invoice unlocks.
 */
export async function POST(req: Request) {
  await ensureSeeded();
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Login required" }, { status: 401 });

  const body = (await req.json().catch(() => null)) as
    | { orderNo?: string; kind?: "advance" | "balance"; method?: PayMethod }
    | null;
  if (!body?.orderNo || !body?.kind) return NextResponse.json({ error: "orderNo and kind are required" }, { status: 400 });
  const method: PayMethod = METHODS.includes(body.method as PayMethod) ? (body.method as PayMethod) : "UPI";

  const row = await db.order.findUnique({ where: { orderNo: body.orderNo } });
  if (!row) return NextResponse.json({ error: "Order not found" }, { status: 404 });
  if (row.userId && row.userId !== user.id) return NextResponse.json({ error: "Not your order" }, { status: 403 });

  const kind = body.kind;
  if (kind === "advance" && row.advancePaid) return NextResponse.json({ error: "Advance already paid" }, { status: 409 });
  if (kind === "balance") {
    if (!row.advancePaid) return NextResponse.json({ error: "Pay the 10% advance first" }, { status: 409 });
    if (row.balancePaid) return NextResponse.json({ error: "Balance already paid" }, { status: 409 });
    if (!["DELIVERED"].includes(row.status)) {
      return NextResponse.json(
        { error: "The 90% balance unlocks only after delivery is accepted — no auto-debit before that." },
        { status: 409 }
      );
    }
  }

  const amount = kind === "advance" ? row.advanceAmount : row.balanceAmount;

  // ── gateway round-trip (swap provider via PAYMENT_PROVIDER env) ──────────
  const provider = getPaymentProvider();
  let result;
  try {
    result = await provider.createIntent({
      orderNo: row.orderNo,
      kind,
      amountPaise: Math.round(amount * 100),
      currency: "INR",
      method,
      description:
        kind === "advance"
          ? `BulkSetu 10% advance — order ${row.orderNo}`
          : `BulkSetu 90% balance on delivery — order ${row.orderNo}`,
      customer: {
        name: user.businessName,
        email: user.email,
        phone: user.mobile ?? undefined,
        gstin: user.gstin ?? undefined,
      },
    });
  } catch (e) {
    return NextResponse.json(
      { error: e instanceof Error ? e.message : "Payment provider error" },
      { status: 502 }
    );
  }

  if (result.status !== "succeeded") {
    // requires_action → in a live gateway the frontend would now run the SDK
    // challenge (e.g. 3DS) using result.clientPayload, then re-confirm here.
    return NextResponse.json({ error: result.message || "Payment could not be completed" }, { status: 402 });
  }

  // ── settle the order ──────────────────────────────────────────────────────
  const events = JSON.parse(row.events) as { status: string; title: string; detail: string; at: string }[];
  const now = new Date();

  if (kind === "advance") {
    events.push({
      status: "PLACED",
      title: "Order placed — 10% advance paid",
      detail: `₹${amount.toLocaleString("en-IN")} via ${method} · receipt #${result.reference} sent on email`,
      at: now.toISOString(),
    });
    const updated = await db.order.update({
      where: { id: row.id },
      data: {
        advancePaid: true,
        advanceMethod: method,
        advanceRef: result.reference,
        events: JSON.stringify(events),
      },
    });
    return NextResponse.json({ order: parseOrder(updated), payment: { provider: provider.name, reference: result.reference } });
  }

  // balance paid → order completes, invoice unlocks
  events.push({
    status: "COMPLETED",
    title: "90% balance paid — order complete",
    detail: `₹${amount.toLocaleString("en-IN")} via ${method} · invoice ${row.orderNo.replace("BS-", "BS/").replace("-", "/")} issued`,
    at: now.toISOString(),
  });
  const updated = await db.order.update({
    where: { id: row.id },
    data: {
      balancePaid: true,
      balanceMethod: method,
      balanceRef: result.reference,
      status: "COMPLETED",
      events: JSON.stringify(events),
    },
  });
  return NextResponse.json({ order: parseOrder(updated), payment: { provider: provider.name, reference: result.reference } });
}
