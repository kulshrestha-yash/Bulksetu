import type { PaymentIntentRequest, PaymentIntentResult, PaymentProvider } from "./types";

/**
 * SANDBOX PROVIDER — active by default (PAYMENT_PROVIDER=mock).
 * Simulates the full gateway round-trip (UPI / Card / Netbanking / Wallet) so
 * the entire 10/90 buyer journey is demoable end-to-end without keys.
 *
 * In production this file stays as the fallback for local dev; set
 * PAYMENT_PROVIDER=stripe|juspay|razorpay to route charges to a real gateway.
 */
export class MockProvider implements PaymentProvider {
  readonly name = "mock";

  async createIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult> {
    // simulate network + processing latency
    await new Promise((r) => setTimeout(r, 900));
    const ref = `R-${Math.floor(1000 + Math.random() * 9000)}${req.kind === "advance" ? "A" : "B"}`;
    return {
      provider: this.name,
      status: "succeeded",
      reference: ref,
      clientPayload: {
        simulated: true,
        method: req.method,
        note: "Sandbox transaction — no real money moved.",
      },
    };
  }
}
