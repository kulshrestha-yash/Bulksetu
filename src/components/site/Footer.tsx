"use client";

import { LogoMark } from "./Logo";
import { useSession } from "@/store/session";
import { useCart } from "@/store/cart";
import { navigate } from "@/lib/hash-router";
import { Home, LayoutGrid, ClipboardList, ShoppingCart, UserRound } from "lucide-react";
import { toast } from "sonner";

export function MobileTabBar() {
  const lines = useCart((s) => s.lines);
  return (
    <nav
      aria-label="Mobile"
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-card border-t border-border pb-[env(safe-area-inset-bottom)]"
    >
      <div className="grid grid-cols-5 text-[9px] text-muted-foreground">
        {[
          { label: "Home", icon: Home, to: "/" },
          { label: "Categories", icon: LayoutGrid, to: "/categories" },
          { label: "Orders", icon: ClipboardList, to: "/orders" },
          { label: `Cart${lines.length ? ` · ${lines.length}` : ""}`, icon: ShoppingCart, to: "/cart" },
          { label: "Account", icon: UserRound, to: "/account" },
        ].map(({ label, icon: Icon, to }) => (
          <a key={to} href={`#${to}`} className="flex flex-col items-center gap-0.5 py-2 active:text-navy">
            <Icon className="w-4.5 h-4.5" aria-hidden />
            <span>{label}</span>
          </a>
        ))}
      </div>
    </nav>
  );
}

const PAY_CHIPS = ["UPI", "RuPay", "VISA", "Mastercard", "NetBanking", "JusPay/Stripe ready"];

export function Footer() {
  const user = useSession((s) => s.user);
  return (
    <footer className="mt-auto bg-panel border-t border-border print:hidden">
      <div className="max-w-7xl mx-auto px-5 md:px-7 pt-8 pb-4">
        <div className="grid grid-cols-2 md:grid-cols-[1.3fr_1fr_1fr_1.2fr] gap-8 pb-6 border-b border-dashed border-border">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5">
              <LogoMark size={32} />
              <span className="font-extrabold text-[16px]">
                <span className="text-navy">Bulk</span>
                <span className="text-orange">Setu</span>
              </span>
            </div>
            <p className="text-[11px] text-muted-foreground leading-relaxed mt-3 max-w-[240px]">
              India&apos;s trusted B2B marketplace — verified manufacturers, wholesalers &amp; distributors. Pay 10% to
              place bulk orders, 90% only after delivery.
            </p>
            <div className="text-[10.5px] text-muted-foreground mt-3 leading-relaxed">
              BulkSetu Technologies Pvt. Ltd.
              <br />
              Delhi, India · support@bulksetu.in
            </div>
          </div>
          <nav aria-label="Company">
            <div className="text-[10px] font-extrabold tracking-[1.2px] text-muted-foreground uppercase mb-3">Company</div>
            <ul className="space-y-2 text-[11.5px]">
              <li><a href="#/about" className="hover:text-navy">About Us</a></li>
              <li><a href="#/companies" className="hover:text-navy">Companies</a></li>
              <li><a href="#/bulk-offers" className="hover:text-navy">Bulk Offers</a></li>
              <li><a href="#/sell" className="hover:text-navy">Sell on BulkSetu</a></li>
              <li><a href="#/careers" className="hover:text-navy">Careers</a></li>
            </ul>
          </nav>
          <nav aria-label="Buyer">
            <div className="text-[10px] font-extrabold tracking-[1.2px] text-muted-foreground uppercase mb-3">For Buyers</div>
            <ul className="space-y-2 text-[11.5px]">
              <li><a href="#/categories" className="hover:text-navy">All Categories</a></li>
              <li><a href="#/orders" className="hover:text-navy">My Orders</a></li>
              <li><a href="#/help" className="hover:text-navy">Help &amp; Support</a></li>
              <li><a href="#/account" className="hover:text-navy">{user ? "My Account" : "Login / Register"}</a></li>
              <li><button onClick={() => navigate("/help")} className="hover:text-navy">10/90 Payment Guide</button></li>
            </ul>
          </nav>
          <div className="col-span-2 md:col-span-1">
            <div className="text-[10px] font-extrabold tracking-[1.2px] text-muted-foreground uppercase mb-3">Newsletter</div>
            <p className="text-[11px] text-muted-foreground mb-2">Weekly bulk price drops &amp; new suppliers, in your inbox.</p>
            <form
              className="flex gap-2"
              onSubmit={(e) => {
                e.preventDefault();
                toast.success("Subscribed — you'll get the weekly bulk digest.");
              }}
            >
              <input
                required
                type="email"
                placeholder="you@business.in"
                aria-label="Email address"
                className="flex-1 h-9 px-3 rounded-md border border-input bg-white text-[12px] focus:outline-none focus:ring-2 focus:ring-ring/30"
              />
              <button className="h-9 px-3 rounded-md bg-navy text-white text-[11.5px] font-bold hover:bg-navy-dark" type="submit">
                Subscribe
              </button>
            </form>
            <div className="flex flex-wrap gap-1.5 mt-4">
              {PAY_CHIPS.map((p) => (
                <span key={p} className="text-[8.5px] font-bold text-muted-foreground border border-input rounded px-1.5 py-1 bg-white">
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 items-center justify-between pt-3 text-[10.5px] text-muted-foreground">
          <span>© 2026 BulkSetu Technologies Pvt. Ltd. All rights reserved.</span>
          <span className="flex gap-3">
            <a href="#/privacy" className="hover:text-navy">Privacy Policy</a>
            <a href="#/terms" className="hover:text-navy">Terms of Use</a>
            <a href="#/refunds" className="hover:text-navy">Refund Policy</a>
          </span>
        </div>
      </div>
    </footer>
  );
}
