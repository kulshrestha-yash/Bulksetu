"use client";

// BulkSetu — single-route SPA shell.
// The sandbox preview exposes one page, so the storefront ships as a hash-routed
// app: every view is deep-linkable (#/products, #/order/BS-2026-00847 …) and the
// same build deploys unchanged to a normal host with the multi-page router if
// preferred. API routes under /api are real server endpoints.

import { useEffect } from "react";
import { useRoute } from "@/lib/hash-router";
import { useSession } from "@/store/session";
import { Toaster } from "@/components/ui/sonner";
import { SecurePayModal } from "@/components/site/SecurePayModal";

import HomeView from "@/components/views/HomeView";
import CategoriesView from "@/components/views/CategoriesView";
import ListingView from "@/components/views/ListingView";
import PdpView from "@/components/views/PdpView";
import CartView from "@/components/views/CartView";
import CheckoutView from "@/components/views/CheckoutView";
import ConfirmationView from "@/components/views/ConfirmationView";
import OrdersView from "@/components/views/OrdersView";
import TrackingView from "@/components/views/TrackingView";
import InvoiceView from "@/components/views/InvoiceView";
import AuthView from "@/components/views/AuthView";
import SimpleView from "@/components/views/SimpleView";

function Router() {
  const route = useRoute();
  const [root, second] = route.segments;

  switch (root) {
    case undefined:
      return <HomeView />;
    case "categories":
      return <CategoriesView />;
    case "products":
      return <ListingView />;
    case "product":
      return <PdpView />;
    case "cart":
      return <CartView />;
    case "checkout":
      return <CheckoutView />;
    case "order":
      return route.path.endsWith("/confirmed") || second === "confirmed" ? <ConfirmationView /> : <TrackingView />;
    case "orders":
      return <OrdersView />;
    case "invoice":
      return <InvoiceView />;
    case "account":
      return <AuthView />;
    case "about":
    case "companies":
    case "bulk-offers":
    case "sell":
    case "help":
    case "careers":
    case "privacy":
    case "terms":
    case "refunds":
      return <SimpleView />;
    default:
      return (
        <div className="min-h-screen flex flex-col items-center justify-center gap-3 text-center px-6">
          <p className="text-[40px] font-extrabold text-navy">404</p>
          <p className="text-[14px] font-bold text-ink">This page doesn&apos;t exist on BulkSetu.</p>
          <a href="#/" className="text-[12.5px] font-semibold text-navy hover:underline">← Back to the marketplace</a>
        </div>
      );
  }
}

export default function Page() {
  const load = useSession((s) => s.load);
  useEffect(() => {
    load();
  }, [load]);

  return (
    <>
      <Router />
      <SecurePayModal />
      <Toaster position="top-center" richColors />
    </>
  );
}
