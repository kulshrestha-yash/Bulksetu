# BulkSetu — Payment Gateway Integration Guide

The site ships with a **sandbox payment provider** (simulated UPI / Card /
Netbanking / Wallet) so the entire buyer journey works end-to-end without any
keys. Swapping in Stripe, JusPay, Razorpay or any other PCI-DSS partner touches
**exactly one seam** — no UI or order logic changes needed.

## Architecture

```
SecurePayModal (UI, wireframe screens 08 & 12)
        │  POST /api/orders/pay { orderNo, kind: "advance"|"balance", method }
        ▼
src/app/api/orders/pay  ── resolves amount SERVER-SIDE from the stored order
        │
        ▼
getPaymentProvider()  ← src/lib/payments/index.ts   ← the ONLY switch point
        │
        ├── MockProvider    (default — sandbox, no keys)
        ├── StripeProvider  (src/lib/payments/stripe-provider.ts — stub + recipe)
        ├── JuspayProvider  (src/lib/payments/juspay-provider.ts — stub + recipe)
        └── razorpay        (copy juspay-provider.ts, same seam)
```

- **10% advance** is charged at checkout (`kind: "advance"`) → order stands.
- **90% balance** is chargeable **only** when order status = `DELIVERED`
  (`kind: "balance"`) → enforced server-side in `/api/orders/pay`.
- Amounts are recomputed from the DB on every call — the client can never set a
  price. `amountPaise` is sent to the gateway in paise (INR × 100).

## Activate a real gateway

1. **Pick the provider** in `.env`:

   ```bash
   PAYMENT_PROVIDER=stripe      # or juspay / razorpay / mock
   ```

2. **Add keys** (never commit them):

   ```bash
   # Stripe
   STRIPE_SECRET_KEY=sk_live_***
   STRIPE_WEBHOOK_SECRET=whsec_***
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_live_***

   # JusPay
   JUSPAY_API_KEY=***
   JUSPAY_MERCHANT_ID=***
   JUSPAY_ENV=production
   ```

3. **Implement `createIntent()`** in the provider file — each stub contains a
   copy-paste recipe for its gateway (Stripe PaymentIntents / Juspay Create
   Order). Return `status: "requires_action"` with a `clientPayload`
   (`clientSecret` / `orderToken`) when the gateway needs a client-side SDK
   step; the SecurePayModal is where the SDK call drops in (marked
   `▶ GATEWAY SDK STEP`).

4. **Add a webhook** (recommended): create `src/app/api/payments/webhook/[provider]/route.ts`,
   verify the signature, and settle the order there for asynchronous
   confirmations. The order-update code to reuse is in `/api/orders/pay`.

## Notes for India

- UPI collect/intent, 58-bank netbanking, cards + wallets out of the box →
  **JusPay** or **Razorpay** are the fastest fit for the domestic method set.
- **Stripe** works for cards (with 3DS) and international buyers.
- The 10/90 milestone model maps cleanly to two gateway transactions per order
  (`advance` and `balance`), both recorded on the order with method + receipt
  reference and shown on the tax invoice.
