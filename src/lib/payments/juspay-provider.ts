import type { PaymentIntentRequest, PaymentIntentResult, PaymentProvider } from "./types";

/**
 * JUSPAY PROVIDER — integration stub (activate with PAYMENT_PROVIDER=juspay).
 *
 * ── HOW TO GO LIVE ────────────────────────────────────────────────────────────
 * 1. Set env:
 *      JUSPAY_API_KEY=***            (from Juspay dashboard)
 *      JUSPAY_MERCHANT_ID=***
 *      JUSPAY_ENV=sandbox|production (https://api.juspay.in / sandbox base URL)
 * 2. Server-side "Create Order" inside createIntent() below:
 *
 *      const res = await fetch(`${base}/orders`, {
 *        method: "POST",
 *        headers: {
 *          Authorization: `Basic ${Buffer.from(process.env.JUSPAY_API_KEY + ":").toString("base64")}`,
 *          "Content-Type": "application/json",
 *          "x-merchantid": process.env.JUSPAY_MERCHANT_ID!,
 *        },
 *        body: JSON.stringify({
 *          order_id: `${req.orderNo}-${req.kind}-${Date.now()}`,
 *          amount: (req.amountPaise / 100).toFixed(2),   // rupees, 2 decimals
 *          currency: "INR",
 *          customer_id: req.customer.email,
 *          customer_email: req.customer.email,
 *          customer_phone: req.customer.phone,
 *          description: req.description,
 *          // UPI / Card / Netbanking all available inside Juspay's checkout
 *        }),
 *      });
 *      const order = await res.json();
 *      return {
 *        provider: "juspay",
 *        status: "requires_action",
 *        reference: order.order_id,
 *        clientPayload: { orderToken: order.order_token ?? order.txn_token },
 *      };
 *
 * 3. Frontend: pass clientPayload.orderToken into the Juspay Express Checkout
 *    / Headless SDK, then call POST /api/orders/pay?confirm=1 once the SDK
 *    returns success.
 * 4. Webhook: add /api/payments/webhook/juspay and match the webhook signature
 *    before marking the order paid.
 *
 * JusPay handles UPI collect/intent, 58-bank netbanking, cards and wallets —
 * exactly the method set of the BulkSetu SecurePay modal.
 */
export class JuspayProvider implements PaymentProvider {
  readonly name = "juspay";
  private configured = false; // true once JUSPAY_API_KEY is present

  async createIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult> {
    if (!this.configured) {
      throw new Error(
        "JusPay provider is not configured. Add JUSPAY_API_KEY to .env and implement createIntent() — see comments in src/lib/payments/juspay-provider.ts."
      );
    }
    // TODO: implement the Juspay Create Order call documented above.
    return { provider: this.name, status: "failed", reference: "", message: "Not implemented" };
  }
}
