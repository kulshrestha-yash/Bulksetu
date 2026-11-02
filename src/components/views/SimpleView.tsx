"use client";

import { Header } from "@/components/site/Header";
import { Footer, MobileTabBar } from "@/components/site/Footer";
import ImagePlaceholder from "@/components/site/ImagePlaceholder";
import { Button } from "@/components/ui/button";
import { useRoute } from "@/lib/hash-router";
import { toast } from "sonner";
import { BadgeCheck, Handshake, ShieldCheck, Truck, IndianRupee, Rocket, ClipboardCheck } from "lucide-react";

// Static informational pages: About, Companies, Bulk Offers, Sell, Help and
// policy stubs — content mirrors the client's About-us screenshot.
const PAGES: Record<string, { title: string; intro: string; body: { h: string; p: string }[]; cta?: { label: string; to: string } }> = {
  about: {
    title: "About BulkSetu",
    intro: "Connecting businesses, growing together — a single platform where manufacturers, wholesalers, distributors and retailers trade directly.",
    body: [
      { h: "Our Mission", p: "Empower Indian businesses with transparent bulk trade: verified suppliers, honest slab pricing and a payment structure that protects buyers — pay 10% to place an order and the 90% balance only after you accept the delivery." },
      { h: "Our Vision", p: "Become India's #1 B2B marketplace — the first call a kirana, caterer, canteen or distributor makes when stocking up." },
      { h: "What we offer", p: "Certified suppliers, bulk product listings, best wholesale prices, secure payments, fast nationwide delivery and live inventory visibility on every listing." },
      { h: "Why BulkSetu", p: "Verified sellers, competitive quantity-slab pricing, national logistics with POD, and a dedicated key-account manager for every registered business." },
    ],
    cta: { label: "Start Buying", to: "/products" },
  },
  companies: {
    title: "Companies on BulkSetu",
    intro: "Browse verified manufacturers, wholesalers and distributors across 18 departments — every profile is GST, FSSAI and trade-licence checked.",
    body: [
      { h: "Verified by design", p: "Each company profile carries its registration, years in business, fulfilment rate and response time. Only suppliers who pass document verification can list." },
      { h: "Find the right partner", p: "Filter by category, state and supplier type — manufacturer, wholesaler, distributor or exporter — and request quotes directly from the product page." },
    ],
    cta: { label: "Explore suppliers via products", to: "/products" },
  },
  "bulk-offers": {
    title: "Bulk Offers",
    intro: "Time-boxed price drops on high-velocity staples. Offer slabs refresh every Monday for registered buyers.",
    body: [
      { h: "How offers work", p: "Suppliers publish discounted slabs for large quantities — the discount applies automatically in your cart as your quantity crosses each threshold." },
      { h: "Never miss a drop", p: "Subscribe to the newsletter and enable WhatsApp updates from your account page — offer alerts land before stock runs out." },
    ],
    cta: { label: "See live slab prices", to: "/products" },
  },
  sell: {
    title: "Sell on BulkSetu",
    intro: "Reach 50,000+ verified business buyers with zero listing fees. You focus on supply — we bring demand, logistics and payment protection.",
    body: [
      { h: "Why suppliers join", p: "Pre-qualified bulk buyers, faster working-capital cycles (10% advance collected at order), and fulfilment tools from packing to e-way bills." },
      { h: "Onboarding in 4 steps", p: "Register → submit GST & FSSAI documents → verification within 48 hrs → list your catalogue with slab pricing and start receiving orders." },
    ],
    cta: { label: "Register as a buyer to get started", to: "/account" },
  },
  help: {
    title: "Help & Support",
    intro: "Answers on ordering, the 10/90 payment plan, delivery and invoicing.",
    body: [
      { h: "The 10/90 payment plan", p: "Pay 10% of the order value at checkout to confirm your order with the supplier. The remaining 90% becomes payable only after the delivery is inspected and accepted — within 48 hours of delivery, by UPI, card or netbanking. Nothing is auto-debited, ever." },
      { h: "Cancellations & refunds", p: "Cancel any time before dispatch for a full refund of the 10% advance. After dispatch, raise an issue from the order page — support responds within 4 working hours." },
      { h: "Invoices", p: "A consolidated GST tax invoice is generated automatically once the order is fully paid, and stays available under Completed orders." },
      { h: "Contact", p: "Email support@bulksetu.in or use Raise Issue on any order. Key-account buyers get a dedicated WhatsApp line." },
    ],
  },
  careers: {
    title: "Careers at BulkSetu",
    intro: "We're building India's most trusted bulk-trade rails. Join teams across category management, logistics, risk and engineering.",
    body: [{ h: "Open roles", p: "Category Managers (Staples, Oils), Zonal Logistics Leads, Risk & Verification Analysts, Full-stack Engineers. Write to careers@bulksetu.in with your focus area." }],
  },
  privacy: {
    title: "Privacy Policy",
    intro: "What we collect, why, and how it's protected. This demo summary will be replaced by the final legal text before go-live.",
    body: [
      { h: "Data we process", p: "Business identity (name, GSTIN), contact details, order history and payment references. Card and UPI credentials never touch BulkSetu servers — they live with our PCI-DSS gateway partner." },
      { h: "Your rights", p: "Request an export or deletion of your data at privacy@bulksetu.in. Order and invoice records are retained as required by tax law." },
    ],
  },
  terms: {
    title: "Terms of Use",
    intro: "The ground rules for trading on BulkSetu. Demo summary — final legal text ships with the production release.",
    body: [
      { h: "Marketplace role", p: "BulkSetu is a marketplace: contracts for goods are between buyer and supplier. We facilitate verification, payments in 10/90 milestones, logistics and dispute resolution." },
      { h: "Payment milestones", p: "The 10% advance confirms the order; the 90% balance is due within 48 hours of accepted delivery. Cancellation before dispatch refunds the advance in full." },
    ],
  },
  refunds: {
    title: "Refund Policy",
    intro: "Simple, buyer-first refund rules aligned with the 10/90 structure.",
    body: [
      { h: "Before dispatch", p: "Cancel from the order page — the full 10% advance returns to the original payment method within 5–7 working days." },
      { h: "After delivery", p: "Raise an issue within 48 hours with photos and the POD reference. Approved claims refund the affected proportion of the balance payment." },
    ],
  },
};

export default function SimpleView() {
  const route = useRoute();
  const key = route.segments[0] || "about";
  const page = PAGES[key] ?? {
    title: "Coming soon",
    intro: "This section is part of the full BulkSetu rollout.",
    body: [{ h: "In the meantime", p: "Browse live staples with real slab pricing, or register as a buyer to get launch updates." }],
    cta: { label: "Browse products", to: "/products" },
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header searchPlaceholder={`Search BulkSetu…`} hideNavRow />
      <div className="px-5 md:px-7 py-2.5 bg-card border-b border-dashed border-border text-[11px] text-muted-foreground">
        <a href="#/" className="hover:text-navy">Home</a> / <b className="text-ink">{page.title}</b>
      </div>
      <div className="flex-1 w-full max-w-4xl mx-auto px-5 py-8">
        <h1 className="text-[22px] font-extrabold text-ink">{page.title}</h1>
        <p className="text-[13px] text-foreground mt-2 leading-relaxed max-w-2xl">{page.intro}</p>

        <div className="grid sm:grid-cols-2 gap-3 mt-6">
          {[
            [BadgeCheck, "Certified companies"],
            [IndianRupee, "Best wholesale prices"],
            [ShieldCheck, "Secure payments"],
            [Truck, "Fast delivery"],
            [ClipboardCheck, "Live inventory"],
            [Handshake, "Dedicated support"],
          ].map(([Icon, label]) => {
            const I = Icon as React.ComponentType<{ className?: string }>;
            return (
              <div key={label as string} className="flex items-center gap-2.5 bg-card border border-border rounded-lg px-4 py-3">
                <I className="w-4.5 h-4.5 text-navy" />
                <span className="text-[12px] font-bold text-ink">{label as string}</span>
              </div>
            );
          })}
        </div>

        <div className="mt-8 space-y-6">
          {page.body.map((b) => (
            <section key={b.h}>
              <h2 className="text-[15px] font-extrabold text-ink">{b.h}</h2>
              <p className="text-[12.5px] text-foreground mt-1.5 leading-relaxed">{b.p}</p>
            </section>
          ))}
        </div>

        {page.cta && (
          <div className="mt-8 flex flex-wrap gap-3 items-center">
            <Button className="font-bold" onClick={() => (window.location.hash = `#${page.cta!.to}`)}>
              {page.cta.label}
            </Button>
            <Button
              variant="outline"
              className="border-input bg-white font-bold"
              onClick={() => toast.success("Noted — we'll keep you posted on the rollout.")}
            >
              <Rocket className="w-3.5 h-3.5" /> Notify me at launch
            </Button>
          </div>
        )}

        <ImagePlaceholder label={`${page.title} — banner artwork`} className="w-full h-36 mt-10" rounded="rounded-xl" />
      </div>
      <Footer />
      <div className="h-[52px] md:hidden"><MobileTabBar /></div>
    </div>
  );
}
