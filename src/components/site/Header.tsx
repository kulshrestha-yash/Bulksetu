"use client";

import { useState } from "react";
import { Logo } from "./Logo";
import { useCart } from "@/store/cart";
import { useSession } from "@/store/session";
import { navigate } from "@/lib/hash-router";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Search, ChevronDown, LogOut, ClipboardList, UserRound } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function Header({
  searchPlaceholder = "Search 5 lakh+ products — “Basmati Rice 25 kg bag”",
  initialQuery = "",
  hideNavRow = false,
}: {
  searchPlaceholder?: string;
  initialQuery?: string;
  hideNavRow?: boolean;
}) {
  const lines = useCart((s) => s.lines);
  const user = useSession((s) => s.user);
  const logout = useSession((s) => s.logout);
  const [q, setQ] = useState(initialQuery);

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    navigate(q.trim() ? `/products?q=${encodeURIComponent(q.trim())}` : "/products");
  };

  return (
    <header className="sticky top-0 z-40">
      {/* utility strip */}
      <div className="hidden md:flex items-center gap-4 px-7 py-[6px] bg-panel border-b border-border text-[10.5px] text-muted-foreground">
        <span>Free delivery on bulk orders above ₹50,000</span>
        <span className="flex-1" />
        <a href="#/sell" className="hover:text-navy">Sell on BulkSetu</a>
        <a href="#/help" className="hover:text-navy">Help &amp; Support</a>
        <button
          type="button"
          onClick={() => document.dispatchEvent(new CustomEvent("bs:toast", { detail: "Language switching ships with the full i18n rollout." }))}
          className="hover:text-navy"
        >
          EN ▾
        </button>
      </div>

      {/* main header */}
      <div className="flex items-center gap-3 md:gap-4 px-3 md:px-7 py-2.5 bg-card border-b border-border">
        {/* mobile burger */}
        <MobileMenu />
        <Logo compact />
        <form onSubmit={submitSearch} className="flex-1 flex gap-2 min-w-0" role="search">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" aria-hidden />
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder={searchPlaceholder}
              aria-label="Search products"
              className="w-full h-9 pl-8 pr-3 rounded-md border border-input bg-white text-[12px] text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>
          <Button type="submit" className="h-9 px-3 md:px-4 text-xs" aria-label="Search">
            <Search className="md:hidden w-4 h-4" />
            <span className="hidden md:inline">Search</span>
          </Button>
        </form>
        <div className="flex items-center gap-2">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs border-input bg-white">
                  {user.businessName.length > 18 ? user.businessName.slice(0, 17) + "…" : user.businessName} <ChevronDown className="w-3.5 h-3.5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="text-xs">
                <DropdownMenuLabel>
                  {user.ownerName}
                  <span className="block font-normal text-muted-foreground">{user.email}</span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/orders")}>
                  <ClipboardList className="w-3.5 h-3.5" /> My Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/account")}>
                  <UserRound className="w-3.5 h-3.5" /> Account
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => logout()}>
                  <LogOut className="w-3.5 h-3.5" /> Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button variant="outline" size="sm" className="hidden sm:inline-flex text-xs border-input bg-white" onClick={() => navigate("/account")}>
              Login / Register
            </Button>
          )}
          <Button
            variant="outline"
            size="sm"
            className="relative text-xs border-input bg-white"
            onClick={() => navigate("/cart")}
            aria-label={`Cart, ${lines.length} items`}
          >
            <ShoppingCart className="w-4 h-4" />
            <span className="hidden sm:inline">Cart</span>
            {lines.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 min-w-[16px] h-4 px-1 rounded-full bg-orange text-white text-[9px] font-bold flex items-center justify-center">
                {lines.length}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* nav row */}
      {!hideNavRow && (
        <nav className="hidden md:flex items-center gap-4 px-7 py-2 bg-panel border-b border-border text-[12px]" aria-label="Primary">
          <a href="#/categories" className="inline-flex items-center gap-1 font-semibold text-foreground border border-input rounded bg-white px-2 py-1 text-[11px]">
            All Categories <ChevronDown className="w-3 h-3" />
          </a>
          <a href="#/" className="font-extrabold text-foreground border-b-2 border-orange pb-0.5">Home</a>
          <a href="#/categories" className="hover:text-navy">Categories</a>
          <a href="#/companies" className="hover:text-navy">Companies</a>
          <a href="#/bulk-offers" className="hover:text-navy">Bulk Offers</a>
          <a href="#/about" className="hover:text-navy">About Us</a>
          <span className="flex-1" />
          <a href="#/orders" className="hover:text-navy font-medium">My Orders</a>
        </nav>
      )}
    </header>
  );
}

function MobileMenu() {
  const [open, setOpen] = useState(false);
  const user = useSession((s) => s.user);
  return (
    <div className="md:hidden">
      <button
        aria-label="Open menu"
        aria-expanded={open}
        onClick={() => setOpen(true)}
        className="w-9 h-9 rounded-md border border-input bg-white flex flex-col items-center justify-center gap-[3px]"
      >
        <span className="w-3.5 h-[2px] bg-muted-foreground" />
        <span className="w-3.5 h-[2px] bg-muted-foreground" />
        <span className="w-3.5 h-[2px] bg-muted-foreground" />
      </button>
      {open && (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true">
          <div className="absolute inset-0 bg-black/40" onClick={() => setOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64 bg-card p-4 flex flex-col gap-1 shadow-xl">
            <div className="flex items-center justify-between mb-3">
              <Logo compact />
              <button aria-label="Close menu" onClick={() => setOpen(false)} className="text-muted-foreground text-lg px-2">✕</button>
            </div>
            {[
              ["Home", "/"],
              ["Categories", "/categories"],
              ["Bulk Offers", "/bulk-offers"],
              ["Companies", "/companies"],
              ["About Us", "/about"],
              ["My Orders", "/orders"],
              ["Help & Support", "/help"],
            ].map(([label, to]) => (
              <a key={to} href={`#${to}`} onClick={() => setOpen(false)} className="py-2 px-2 rounded hover:bg-muted text-[13px] font-medium">
                {label}
              </a>
            ))}
            <div className="mt-auto pt-3 border-t border-border text-xs text-muted-foreground">
              {user ? (
                <button
                  onClick={() => {
                    setOpen(false);
                    logout();
                  }}
                  className="text-left w-full py-1.5 text-destructive"
                >
                  Logout — {user.businessName}
                </button>
              ) : (
                <a href="#/account" onClick={() => setOpen(false)} className="text-navy font-semibold">
                  Login / Register
                </a>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
