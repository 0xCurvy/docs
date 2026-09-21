---
title: Payments SDK
description: Merchant payment primitives for Curvy checkout and payment evidence — separate from the wallet SDK.
---

# Payments SDK

`@0xcurvy/payments-sdk` is the TypeScript package shops and APIs use to **accept** Curvy payments. It is not the wallet SDK.

| Package | Audience | What it does |
| --- | --- | --- |
| [`@0xcurvy/curvy-sdk`](/sdk/) | Wallets and private-balance apps | Deposit, aggregate, transfer, withdraw, recovery |
| `@0xcurvy/payments-sdk` | Merchants and checkout | Create signed payment requests, verify them, confirm payments on-chain |

A payment is confirmed when on-chain evidence matches the **payment reference** for that checkout - not when a browser or facilitator returns a transaction hash alone.

## Payment reference

Each payment request includes a fresh **payment reference**: `ephemeralKeyX` and `ephemeralKeyY` from the derived request. Store these values when you create the request; pass them to `verifyPayment` when confirming the shield.

Do **not** put your payment reference in the signed checkout package. Curvy confirms the reference on chain; you connect it back to your own commerce identifiers in your application.

## Products that use this package

1. **[Human checkout](./human-checkout)** — customer pays on Curvy’s hosted payment page; your backend creates and signs the deposit request.
2. **[Agent / x402](./x402)** — shopper uses a standard x402 client; resource server uses Payments SDK against Curvy’s facilitator.

You do **not** need Curvy spending or viewing keys on the shop or API server. Public receiving keys plus (for checkout) a request signing key are enough to accept money.

## Package layout

| Entry point | Runtime | Responsibility |
| --- | --- | --- |
| `@0xcurvy/payments-sdk` | Browser and Node | Browser-safe convenience barrel |
| `@0xcurvy/payments-sdk/intent` | Browser and Node | Parse, sign, and verify payment requests |
| `@0xcurvy/payments-sdk/transport` | Browser and Node | Fragment encode/decode and checkout URLs |
| `@0xcurvy/payments-sdk/chain` | Browser and Node | Portal prediction and payment verification |
| `@0xcurvy/payments-sdk/contracts` | Browser and Node | Payment contract ABIs |
| `@0xcurvy/payments-sdk/merchant/keys` | Browser and Node | Build and parse `/.well-known/curvy-payments.json` |
| `@0xcurvy/payments-sdk/merchant` | **Node only** | `initialize`, `createPaymentRequest` |

The request signing key and `@0xcurvy/rs-core-wasm` stay on the **backend**. Checkout pages import only the browser-safe entry points.

## Documentation

- [Getting started](./getting-started) — install and create your first signed checkout URL
- [Human checkout](./human-checkout) — request fields, well-known signers, return URL
- [x402](./x402) — exact rail roles and how to run merchant integrator tests
- [Confirming payments](./confirming-payments) — verify received payments
- [API surface](./api) — exports by entry point

## Related

- [Wallet SDK](/sdk/) — private balances and intents for end users
- [Accepting payments (businesses)](/for-businesses/accepting-payments) — product overview for shops
- [Portals](/for-the-curious/building-blocks/portals) — how entry portals fit the human rail
