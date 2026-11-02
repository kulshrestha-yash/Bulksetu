"use client";

// Buyer session store — synced with the httpOnly cookie session via /api/auth.
import { create } from "zustand";
import type { SessionUserDTO } from "@/lib/types";

interface SessionState {
  user: SessionUserDTO | null;
  loaded: boolean;
  load: () => Promise<void>;
  login: (email: string, password: string) => Promise<SessionUserDTO>;
  register: (payload: {
    businessName: string;
    ownerName: string;
    mobile?: string;
    gstin?: string;
    buyerType: string;
    email: string;
    password: string;
  }) => Promise<SessionUserDTO>;
  loginDemo: () => Promise<SessionUserDTO>;
  logout: () => Promise<void>;
}

async function postAuth(body: Record<string, unknown>): Promise<SessionUserDTO> {
  const res = await fetch("/api/auth", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Authentication failed");
  return data.user as SessionUserDTO;
}

export const useSession = create<SessionState>()((set) => ({
  user: null,
  loaded: false,
  load: async () => {
    try {
      const res = await fetch("/api/auth");
      const data = await res.json();
      set({ user: data.user ?? null, loaded: true });
    } catch {
      set({ loaded: true });
    }
  },
  login: async (email, password) => {
    const user = await postAuth({ action: "login", email, password });
    set({ user });
    return user;
  },
  register: async (payload) => {
    const user = await postAuth({ action: "register", ...payload });
    set({ user });
    return user;
  },
  loginDemo: async () => {
    const user = await postAuth({ action: "demo" });
    set({ user });
    return user;
  },
  logout: async () => {
    await postAuth({ action: "logout" });
    set({ user: null });
  },
}));
