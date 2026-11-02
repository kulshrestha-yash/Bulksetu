import { db } from "@/lib/db";
import type { SessionUserDTO } from "@/lib/types";
import { cookies } from "next/headers";

const COOKIE = "bs_session";

export async function setSession(userId: string): Promise<void> {
  const jar = await cookies();
  jar.set(COOKIE, userId, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 30, // 30 days — "keep me signed in"
  });
}

export async function clearSession(): Promise<void> {
  const jar = await cookies();
  jar.delete(COOKIE);
}

export async function getSessionUser(): Promise<SessionUserDTO | null> {
  const jar = await cookies();
  const id = jar.get(COOKIE)?.value;
  if (!id) return null;
  const user = await db.user.findUnique({ where: { id } });
  if (!user) return null;
  return {
    id: user.id,
    email: user.email,
    businessName: user.businessName,
    ownerName: user.ownerName,
    mobile: user.mobile,
    gstin: user.gstin,
    buyerType: user.buyerType,
    isDemo: user.isDemo,
  };
}
