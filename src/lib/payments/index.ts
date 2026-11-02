import type { PaymentProvider } from "./types";
import { MockProvider } from "./mock-provider";
import { StripeProvider } from "./stripe-provider";
import { JuspayProvider } from "./juspay-provider";

/**
 * Provider registry.
 *   PAYMENT_PROVIDER=mock      → sandbox simulation (default, no keys needed)
 *   PAYMENT_PROVIDER=stripe    → Stripe (see stripe-provider.ts for go-live)
 *   PAYMENT_PROVIDER=juspay    → JusPay  (see juspay-provider.ts for go-live)
 *   PAYMENT_PROVIDER=razorpay  → add a razorpay-provider.ts on the same seam
 */
export function getPaymentProvider(): PaymentProvider {
  switch ((process.env.PAYMENT_PROVIDER || "mock").toLowerCase()) {
    case "stripe":
      return new StripeProvider();
    case "juspay":
      return new JuspayProvider();
    case "razorpay":
    case "mock":
    default:
      // Razorpay: copy juspay-provider.ts, rename to razorpay-provider.ts and
      // swap in the Razorpay Orders API — the seam stays identical.
      return new MockProvider();
  }
}

export type { PaymentProvider, PaymentIntentRequest, PaymentIntentResult } from "./types";
