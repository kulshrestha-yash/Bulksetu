import type { Metadata, Viewport } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "BulkSetu — India's Trusted B2B Marketplace",
  description:
    "Buy kitchen staples and more in true bulk from verified manufacturers, wholesalers & distributors. Pay 10% to place the order, 90% only after delivery.",
  keywords: ["B2B marketplace", "bulk wholesale", "India", "staples", "BulkSetu"],
  authors: [{ name: "BulkSetu" }],
  openGraph: {
    title: "BulkSetu — India's Trusted B2B Marketplace",
    description: "Verified suppliers · slab pricing · 10/90 milestone payments",
    siteName: "BulkSetu",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#1E4C9A",
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className="antialiased bg-background text-foreground min-h-screen flex flex-col">
        {children}
      </body>
    </html>
  );
}
