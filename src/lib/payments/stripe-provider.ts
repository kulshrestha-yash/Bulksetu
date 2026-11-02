import type { PaymentIntentRequest, PaymentIntentResult, PaymentProvider } from "./types";

/**
 * STRIPE PROVIDER — integration stub (activate with PAYMENT_PROVIDER=stripe).
 *
 * ── HOW TO GO LIVE ────────────────────────────────────────────────────────────
 * 1. bun add stripe
 * 2. Set env:
 *      STRIPE_SECRET_KEY=sk_live_***        (server-side only)
 *      STRIPE_WEBHOOK_SECRET=whsec_***
 *      NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_***
 * 3. Create the PaymentIntent inside createIntent() below (the seam is ready):
 *
 *      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
 *      const intent = await stripe.paymentIntents.create({
 *        amount: req.amountPaise,           // paise
 *        currency: "inr",
 *        description: req.description,
 *        metadata: { orderNo: req.orderNo, kind: req.kind },
 *        automatic_payment_methods: { enabled: true },
 *      });
 *      return {
 *        provider: "stripe",
 *        status: "requires_action",         // client completes with Stripe.js
 *        reference: intent.id,
 *        clientPayload: { clientSecret: intent.client_secret },
 *      };
 *
 * 4. Frontend: in SecurePayModal, when clientPayload?.clientSecret exists call
 *    stripe.confirmPayment() with NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY.
 * 5. Add the webhook route /api/payments/webhook/stripe and update the order
 *    when payment_intent.succeeded arrives (verify with STRIPE_WEBHOOK_SECRET).
 *
 * Note: for domestic Indian cards + UPI, Stripe works with 3DS flows; if UPI
 * collect / native netbanking is a must, prefer JusPay or Razorpay (see
 * juspay-provider.ts) — the same seam applies.
 */
export class StripeProvider implements PaymentProvider {
  readonly name = "stripe";
  private configured = false; // becomes true once STRIPE_SECRET_KEY is present

  async createIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult> {
    if (!this.configured) {
      throw new Error(
        "Stripe provider is not configured. Add STRIPE_SECRET_KEY to .env and implement createIntent() — see comments in src/lib/payments/stripe-provider.ts."
      );
    }
    // TODO: implement the Stripe PaymentIntent call documented above.
    return { provider: this.name, status: "failed", reference: "", message: "Not implemented" };
  }
}
