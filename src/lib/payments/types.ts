// ─────────────────────────────────────────────────────────────────────────────
// Payment provider contract — the single seam where Stripe / JusPay / Razorpay
// (or any PCI-DSS gateway) plugs in. The rest of the app only talks to this
// interface via /api/orders/pay, so swapping providers never touches UI code.
// ─────────────────────────────────────────────────────────────────────────────

export type PayMethod = "UPI" | "Card" | "Netbanking" | "Wallet";

export interface PaymentIntentRequest {
  orderNo: string;
  /** "advance" = the 10% placed at checkout · "balance" = the 90% after delivery */
  kind: "advance" | "balance";
  /** amount in paise (INR × 100) — gateway-native precision */
  amountPaise: number;
  currency: "INR";
  method: PayMethod;
  description: string;
  customer: {
    name: string;
    email: string;
    phone?: string;
    gstin?: string;
  };
}

export interface PaymentIntentResult {
  provider: string;
  status: "succeeded" | "requires_action" | "failed";
  /** receipt / transaction reference stored on the order */
  reference: string;
  /**
   * Opaque payload handed to the frontend when the gateway needs a client step
   * (e.g. Stripe PaymentIntent `client_secret`, JusPay order token, Razorpay
   * order_id). The SecurePay modal forwards it to the gateway SDK.
   */
  clientPayload?: Record<string, unknown>;
  message?: string;
}

export interface PaymentProvider {
  readonly name: string;
  /** Create the charge. In live providers this calls the gateway's server API. */
  createIntent(req: PaymentIntentRequest): Promise<PaymentIntentResult>;
  /** Optional server-side verification / settlement check. */
  verify?(reference: string): Promise<{ status: "succeeded" | "failed" }>;
}
