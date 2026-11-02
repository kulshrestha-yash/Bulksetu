import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { ensureSeeded, hashPassword, verifyPassword } from "@/lib/seed";
import { getSessionUser, setSession, clearSession } from "@/lib/session";

export const dynamic = "force-dynamic";

// GET /api/auth → current session
export async function GET() {
  await ensureSeeded();
  const user = await getSessionUser();
  return NextResponse.json({ user });
}

// POST /api/auth  { action: "login" | "register" | "demo" | "logout", ... }
export async function POST(req: Request) {
  await ensureSeeded();
  const body = await req.json().catch(() => ({}));
  const action = body?.action as string;

  if (action === "logout") {
    await clearSession();
    return NextResponse.json({ user: null });
  }

  if (action === "demo") {
    const demo = await db.user.findFirst({ where: { isDemo: true } });
    if (!demo) return NextResponse.json({ error: "Demo user unavailable" }, { status: 500 });
    await setSession(demo.id);
    return NextResponse.json({ user: await getSessionUser() });
  }

  if (action === "login") {
    const { email, password } = body as { email?: string; password?: string };
    if (!email || !password) return NextResponse.json({ error: "Email and password are required" }, { status: 400 });
    const user = await db.user.findUnique({ where: { email: email.toLowerCase().trim() } });
    if (!user || !verifyPassword(password, user.passwordHash)) {
      return NextResponse.json({ error: "Invalid email or password. Tip: demo login is one click." }, { status: 401 });
    }
    await setSession(user.id);
    return NextResponse.json({ user: await getSessionUser() });
  }

  if (action === "register") {
    const { businessName, ownerName, mobile, gstin, buyerType, email, password } = body as Record<string, string>;
    if (!businessName || !ownerName || !email || !password) {
      return NextResponse.json({ error: "Business name, owner name, email and password are required" }, { status: 400 });
    }
    if (password.length < 8) {
      return NextResponse.json({ error: "Password must be at least 8 characters" }, { status: 400 });
    }
    const normEmail = email.toLowerCase().trim();
    const existing = await db.user.findUnique({ where: { email: normEmail } });
    if (existing) return NextResponse.json({ error: "An account with this email already exists — please login" }, { status: 409 });

    const user = await db.user.create({
      data: {
        email: normEmail,
        passwordHash: hashPassword(password),
        businessName,
        ownerName,
        mobile: mobile || null,
        gstin: gstin || null,
        buyerType: buyerType || "Retailer / Kirana",
      },
    });
    await setSession(user.id);
    return NextResponse.json({ user: await getSessionUser() });
  }

  return NextResponse.json({ error: "Unknown action" }, { status: 400 });
}
