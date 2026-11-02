"use client";

import { useEffect, useState } from "react";
import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import { Button } from "@/components/ui/button";
import { useSession } from "@/store/session";
import { useRoute, navigate } from "@/lib/hash-router";
import { toast } from "sonner";
import { BadgeCheck } from "lucide-react";

// Screen 14 — buyer login / register, split brand + two cards.
export default function AuthView() {
  const route = useRoute();
  const next = route.query.get("next") || "/";
  const user = useSession((s) => s.user);
  const login = useSession((s) => s.login);
  const register = useSession((s) => s.register);
  const loginDemo = useSession((s) => s.loginDemo);

  const [loginEmail, setLoginEmail] = useState("orders@guptatraders.in");
  const [loginPassword, setLoginPassword] = useState("bulksetu");
  const [busy, setBusy] = useState<"login" | "register" | "demo" | null>(null);
  const [reg, setReg] = useState({ businessName: "", ownerName: "", mobile: "", gstin: "", buyerType: "Retailer / Kirana", email: "", password: "" });

  useEffect(() => {
    if (user) {
      navigate(next, { replace: true });
    }
  }, [user, next]);

  const afterAuth = (name: string) => {
    toast.success(`Welcome, ${name}! You're signed in.`);
    navigate(next, { replace: true });
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header hideNavRow />
      <div className="flex-1 bg-muted dotgrid px-5 py-8 md:px-[60px]">
        <div className="max-w-6xl mx-auto flex flex-col lg:flex-row gap-5 items-stretch">
          {/* brand panel */}
          <div className="flex-1 bg-navy rounded-xl text-white p-6 flex flex-col gap-3">
            <div className="flex items-center gap-2.5">
              <span className="relative flex items-center justify-center rounded-[7px] bg-white text-navy font-extrabold w-9 h-9">B<span className="absolute bg-orange" style={{ width: 22, height: 3, transform: "rotate(-35deg)", right: -4, bottom: 6 }} /></span>
              <span className="text-[18px] font-extrabold">Bulk<span className="text-orange">Setu</span></span>
            </div>
            <div className="text-[19px] font-extrabold leading-snug mt-2">Trusted connection.<br />Better business.</div>
            {[
              "Buy from 10,000+ verified manufacturers & wholesalers",
              "Pay 10% to place bulk orders — 90% only after delivery",
              "GST invoices, slab pricing & doorstep bulk logistics",
            ].map((l) => (
              <div key={l} className="text-[12px] opacity-90 leading-relaxed before:content-['✓_'] before:text-orange before:font-bold">{l}</div>
            ))}
            <div className="flex-1" />
            <div className="flex flex-wrap gap-2 pt-3">
              <span className="text-[10px] font-bold border border-white/20 bg-white/10 rounded-full px-2.5 py-1">50,000+ buyers</span>
              <span className="text-[10px] font-bold border border-white/20 bg-white/10 rounded-full px-2.5 py-1">₹1,000 Cr+ processed</span>
            </div>
          </div>

          {/* login */}
          <div className="flex-1 bg-white border border-border rounded-xl p-5 flex flex-col gap-2.5">
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-ink">Buyer Login</h2>
              <span className="text-[9px] font-bold text-muted-foreground border border-dashed border-input rounded-full px-2 py-1">existing business</span>
            </div>
            <label className="block">
              <span className="block text-[10.5px] font-bold text-foreground mb-1">Business email / mobile</span>
              <input value={loginEmail} onChange={(e) => setLoginEmail(e.target.value)} className="w-full h-9 px-3 rounded-md border border-input bg-[#FCFCFA] text-[12px] text-ink" />
            </label>
            <label className="block">
              <span className="block text-[10.5px] font-bold text-foreground mb-1">Password</span>
              <input type="password" value={loginPassword} onChange={(e) => setLoginPassword(e.target.value)} className="w-full h-9 px-3 rounded-md border border-input bg-[#FCFCFA] text-[12px] text-ink" />
            </label>
            <div className="flex items-center justify-between text-[10.5px]">
              <label className="flex items-center gap-1.5 text-muted-foreground">
                <input type="checkbox" defaultChecked className="accent-[#1E4C9A]" /> Keep me signed in
              </label>
              <button className="text-navy font-semibold hover:underline" onClick={() => toast.info("Password reset link sent (demo).")}>Forgot password?</button>
            </div>
            <Button
              className="font-bold"
              disabled={busy !== null}
              onClick={async () => {
                setBusy("login");
                try {
                  const u = await login(loginEmail, loginPassword);
                  afterAuth(u.businessName);
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Login failed");
                } finally {
                  setBusy(null);
                }
              }}
            >
              {busy === "login" ? "Signing in…" : "Login"}
            </Button>
            <div className="flex items-center gap-2.5 my-1">
              <span className="flex-1 h-px bg-border" />
              <span className="text-[10px] text-muted-foreground">OR</span>
              <span className="flex-1 h-px bg-border" />
            </div>
            <div className="flex gap-2.5">
              <Button variant="outline" className="flex-1 border-input bg-white text-[11.5px]" onClick={() => toast.info("Google sign-in activates with the production OAuth keys.")}>
                G — Google
              </Button>
              <Button
                variant="outline"
                className="flex-1 border-input bg-white text-[11.5px]"
                onClick={async () => {
                  setBusy("demo");
                  try {
                    const u = await loginDemo();
                    afterAuth(u.businessName);
                  } finally {
                    setBusy(null);
                  }
                }}
              >
                {busy === "demo" ? "Signing in…" : "⚡ One-click demo buyer"}
              </Button>
            </div>
            <p className="text-[9.5px] text-muted-foreground leading-relaxed mt-1">
              Demo credentials prefilled — <b>orders@guptatraders.in</b> / <b>bulksetu</b> — with 3 sample orders on the
              10/90 journey.
            </p>
          </div>

          {/* register */}
          <div className="flex-1.25 bg-white border border-border rounded-xl p-5 flex flex-col gap-2.5" style={{ flexGrow: 1.25 }}>
            <div className="flex items-center justify-between">
              <h2 className="text-[15px] font-extrabold text-ink">New to BulkSetu? Register as Buyer</h2>
              <span className="text-[9px] font-bold text-muted-foreground border border-dashed border-input rounded-full px-2 py-1 whitespace-nowrap">free · 2 min</span>
            </div>
            <div className="grid grid-cols-2 gap-2.5">
              <RegField label="Business name" value={reg.businessName} onChange={(v) => setReg({ ...reg, businessName: v })} placeholder="Sharma Enterprises" />
              <RegField label="Owner name" value={reg.ownerName} onChange={(v) => setReg({ ...reg, ownerName: v })} placeholder="Anil Sharma" />
              <RegField label="Mobile (WhatsApp)" value={reg.mobile} onChange={(v) => setReg({ ...reg, mobile: v })} placeholder="+91 98••• •••••" />
              <RegField label="GSTIN (optional)" value={reg.gstin} onChange={(v) => setReg({ ...reg, gstin: v })} placeholder="07AAACS••••" />
            </div>
            <div>
              <span className="block text-[10.5px] font-bold text-foreground mb-1.5">I buy as</span>
              <div className="flex flex-wrap gap-1.5">
                {["Retailer / Kirana", "Wholesaler", "Distributor", "HoReCa", "Institution"].map((t) => (
                  <button
                    key={t}
                    onClick={() => setReg({ ...reg, buyerType: t })}
                    className={`rounded-full border px-3 py-1.5 text-[11px] transition-colors ${reg.buyerType === t ? "border-navy bg-[#EEF3FB] text-navy font-bold" : "border-input bg-white text-foreground"}`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
            <RegField label="Business email" value={reg.email} onChange={(v) => setReg({ ...reg, email: v })} placeholder="purchases@business.in" />
            <RegField label="Password · min 8 chars" value={reg.password} onChange={(v) => setReg({ ...reg, password: v })} placeholder="create password" type="password" />
            <Button
              className="font-bold"
              disabled={busy !== null}
              onClick={async () => {
                setBusy("register");
                try {
                  const u = await register(reg);
                  afterAuth(u.businessName);
                } catch (e) {
                  toast.error(e instanceof Error ? e.message : "Registration failed");
                } finally {
                  setBusy(null);
                }
              }}
            >
              {busy === "register" ? "Creating account…" : "Create Buyer Account → Start Buying"}
            </Button>
            <p className="text-[9.5px] text-muted-foreground leading-relaxed flex items-start gap-1">
              <BadgeCheck className="w-3 h-3 mt-[1px] shrink-0 text-navy" />
              Registering as a supplier? Use “Sell on BulkSetu” — supplier onboarding is a separate flow.
            </p>
          </div>
        </div>
      </div>
      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}

function RegField({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
}) {
  return (
    <label className="block">
      <span className="block text-[10.5px] font-bold text-foreground mb-1">{label}</span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="w-full h-9 px-3 rounded-md border border-input bg-[#FCFCFA] text-[12px] text-ink placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
      />
    </label>
  );
}

