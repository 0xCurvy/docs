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

::: warning Preview
The API on these pages is a **release candidate**: `@0xcurvy/payments-sdk@0.2.0-rc.3`, published under npm's `next` tag. A plain install still gets `0.1.2` (`latest`), which exports an older `verifyPayment` from `/chain`. That version matches only the payment reference and returns a boolean, so do not use it to credit orders: install `0.2.0-rc.3` exactly. Curvy's hosted checkout page is the Curvy web app's `/checkout` route, `https://app.curvy.box/checkout`, and the SDK sends buyers there by default.
:::

A payment counts as confirmed when an on-chain note matches the **whole request you stored**: the right owner, token and amount. A transaction hash sent by a browser or a facilitator does not confirm a payment by itself.

## What a payment request contains

Each payment request gets a fresh one-time destination:

- `ownerHash`: binds the note to your receiving identity, so only you can spend it.
- the **payment reference** `R` (`ephemeralKeyX`, `ephemeralKeyY`) and a `viewTag`. Your wallet uses these to find the note later.
- the `token`, `amount` and `chainId` you ask for, and an `expiry`.

Store each attempt on your server as **one payment record**: `serializePaymentRecord` turns the signed package, the block to scan from and the latest verification result into one versioned value, and `parsePaymentRecord` reads it back. Keep it whole; `verifyPayment` needs the whole request inside it. Anyone can put your `R` on a note they own, so matching `R` alone proves nothing.

Do **not** put your order id or any other commerce identifier in the signed checkout package. The package already contains `R`, and `R` is public: it is in the checkout URL fragment and on-chain. Link the request to your order in your own database.

## Products that use this package

1. **[Human checkout](./human-checkout)**: the customer pays on Curvy’s payment page, and your backend creates and signs the request.
2. **[Agent / x402](./x402)**: an agent pays per request, through Curvy’s x402 facilitator (`exact`; any other x402 v2 facilitator works too) or with a plain transfer (`curvy-transfer`); your resource server uses `createX402Merchant` with Curvy’s portal broadcaster, both preconfigured, and confirms each payment with the same `verifyPayment` check.

You do **not** need Curvy spending or viewing keys on the shop or API server. To accept money you need your public receiving keys, plus a request signing key for checkout. The web app's **Payments** setup gives the receiving keys as one value to copy, your public key for payments (`CURVY_PAYMENTS_PUBLIC_KEY`, in the `.env` block of step 3); see [Receiving keys value](./api#receiving-keys-value).

## Package layout

| Entry point | Runtime | Responsibility |
| --- | --- | --- |
| `@0xcurvy/payments-sdk` | Browser and Node | Browser-safe convenience barrel |
| `@0xcurvy/payments-sdk/intent` | Browser and Node | Parse, sign, and verify payment requests |
| `@0xcurvy/payments-sdk/transport` | Browser and Node | Fragment encode/decode and checkout URLs (`CURVY_CHECKOUT_URL`) |
| `@0xcurvy/payments-sdk/chain` | Browser and Node | Curvy's built-in networks (`CURVY_NETWORKS`); receipt discovery hints (not payment proof); portal prediction, which is internal and unstable |
| `@0xcurvy/payments-sdk/contracts` | Browser and Node | Payment contract ABIs |
| `@0xcurvy/payments-sdk/economics` | Browser and Node | Protocol fee reads, quotes, and minimum amounts |
| `@0xcurvy/payments-sdk/x402` | Browser and Node | x402 wire types, broadcaster and facilitator clients, payer helper, EIP-712 types, parsers, header codec |
| `@0xcurvy/payments-sdk/x402/merchant` | **Node only** | `createX402Merchant`: charge agents per request over x402 (`exact` and `curvy-transfer`) |
| `@0xcurvy/payments-sdk/merchant/keys` | Browser and Node | Build and parse `/.well-known/curvy-payments.json`; encode and parse the receiving-keys value; `generateCheckoutSigningKey` |
| `@0xcurvy/payments-sdk/merchant` | **Node only** | `initialize`, `createPaymentRequest`, `verifyPayment`, `serializePaymentRecord` / `parsePaymentRecord` |

The request signing key and `@0xcurvy/rs-core-wasm` stay on the **backend**. Checkout pages import only the browser-safe entry points. Payment verification is in `/merchant` because it recomputes the note commitment with rs-core.

## Documentation

- [Getting started](./getting-started): install, create a signed checkout URL, confirm the payment
- [Human checkout](./human-checkout): keys, request fields, signers and the return URL
- [Confirming payments](./confirming-payments): `verifyPayment` statuses, reconciliation, fees
- [x402](./x402): accept agent payments with the `exact` and `curvy-transfer` schemes
- [Fees and minimum amounts](./fees): protocol fees per rail, the portal broadcaster's minimum, choosing a rail for small amounts
- [API surface](./api): exports by entry point

## Related

- [Wallet SDK](/sdk/): private balances and intents for end users
- [Accepting payments (businesses)](/for-businesses/accepting-payments): product overview for shops
- [Portals](/for-the-curious/building-blocks/portals): how entry portals fit the human rail
