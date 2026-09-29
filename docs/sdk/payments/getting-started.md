---
title: Getting started with the Payments SDK
description: Install @0xcurvy/payments-sdk and create a signed Curvy checkout URL on your backend.
---

# Getting started

Accept Curvy checkout payments from a Node backend in a few steps.

## Installation

Install the Payments SDK on the **server**. Payment request creation needs the Rust WASM peer on that same package:

::: code-group

```bash [pnpm]
pnpm add @0xcurvy/payments-sdk @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

```bash [npm]
npm install @0xcurvy/payments-sdk @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

```bash [yarn]
yarn add @0xcurvy/payments-sdk @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

:::

Node.js 22.16 or newer is required. Browser-only packages that only verify signed requests or scan receipts can omit `@0xcurvy/rs-core-wasm` and skip the `/merchant` entry point.

Do **not** install `@0xcurvy/curvy-sdk` for merchant checkout. That package is the privacy wallet.

## 1. Initialize the SDK

Use only **public** receiving keys on the server (`S`, `V`, BabyJubjub). Keep spending and viewing keys offline.

Bind SDK-wide settings once — recipient, chain, origin, confirmations, and request TTL:

```ts
import { initialize } from "@0xcurvy/payments-sdk/merchant";

const sdk = initialize({
  recipient: {
    S: process.env.CURVY_PUBLIC_S!,
    V: process.env.CURVY_PUBLIC_V!,
    babyJubjubPublicKey: process.env.CURVY_PUBLIC_BABYJUBJUB!,
  },
  chainId,
  merchantOrigin: "https://shop.example",
  confirmations: 12,
  ttlSeconds: 600, // optional; defaults to 10 minutes
  // optional: checkoutCompletePath: "/orders/paid",
});
```

Create the client once at process startup and reuse it for every checkout.

## 2. Create a payment request

For each checkout, pass only `amount` and `token`:

```ts
const request = await sdk.createPaymentRequest({
  amount: 10_000_000n, // token base units
  token: usdcAddress,
});
```

Each request includes a fresh **payment reference** (`ephemeralKeyX`, `ephemeralKeyY`). Store these values — you need them later to call `verifyPayment`.

::: warning Minimum amount
Human checkout payments must be worth **at least USD 0.50**. Curvy's portal broadcaster fails smaller payments *after* the customer has paid, and the customer then has to reclaim the funds. Protocol fees are deducted from the amount you receive. See [Fees and minimum amounts](./fees).
:::

Omitted `checkoutCompletePath` defaults to `/checkout/complete` and is always included in the EIP-712 typed data.

For one-off or advanced use, the standalone `createPaymentRequest({ recipient, amount, token, chainId, merchantOrigin, ... })` export remains available on `/merchant`.

## 3. Sign and build the checkout URL

```ts
import { signPaymentIntent } from "@0xcurvy/payments-sdk/intent";
import { buildCheckoutUrl } from "@0xcurvy/payments-sdk/transport";

const payment = await signPaymentIntent(request, (typedData) =>
  merchantSigner.signTypedData(typedData),
);

const checkoutUrl = buildCheckoutUrl(CURVY_CHECKOUT_URL, payment);
```

The first argument is the URL of Curvy's hosted checkout page. `buildCheckoutUrl` keeps its origin, path and query and puts the signed package in the URL **fragment**, not the query string. Redirect the customer to `checkoutUrl`.

## 4. Publish your signers

Serve `GET https://shop.example/.well-known/curvy-payments.json` with CORS so Curvy checkout can verify the signature before showing a pay UI. See [Human checkout](./human-checkout#publishing-your-signing-keys).

## 5. Confirm on-chain

Call `sdk.verifyPayment` with the stored **payment reference** (`ephemeralKeyX`, `ephemeralKeyY`). When checkout returns `#txHash=…`, pass that hash as well — it speeds up confirmation by checking the shield transaction directly. If you do not have a hash yet, omit `txHash` and the SDK queries on-chain logs for batch commitment of that payment reference. Retry on your own schedule until the call returns `true`. See [Confirming payments](./confirming-payments).

## Production values

Curvy runs one production stack, and the SDK points at it by default:

| Setting | Production value |
| --- | --- |
| Portal broadcaster | `https://api.curvy.box`, the default `broadcaster` of `createX402Merchant` and of `createBroadcasterClient` |
| x402 facilitator | `https://api.curvy.box/portal/x402`, served by the broadcaster; the default `facilitator` |
| Network | Arbitrum One, `chainId` `42161` |
| USDC (`token`) | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`, 6 decimals, vault token id `2` |
| USDT | `0xfd086bc7cd5c481dcc9c85ebe478a1c0b69fcbb9`, 6 decimals, vault token id `3` |
| Aggregator (`aggregatorAddress` for `verifyPayment`) | `0xe51924cef003a654ec9735c4d97f5d4862cbcbb1` |
| Vault (`vaultAddress` for `readChainFees`) | `0xcc8d5c60a8fb15aa3793647ef531f1ba7df24f00` |
| Portal factory | `0x4f32082C5647F8fE0f0Fb567b98F2a5516361389` |
| Minimum per payment | USD 0.50 (see [Fees and minimum amounts](./fees)) |
| Checkout page (`buildCheckoutUrl` first argument) | Provided during onboarding |

The broadcaster serves the same values live, for every network it shields on:

```bash
curl https://api.curvy.box/portal/networks/42161
```

```json
{
  "data": {
    "chainId": 42161,
    "name": "Arbitrum",
    "testnet": false,
    "aggregator": "0xe51924cef003a654ec9735c4d97f5d4862cbcbb1",
    "portalFactory": "0x4f32082C5647F8fE0f0Fb567b98F2a5516361389",
    "vault": "0xcc8d5c60a8fb15aa3793647ef531f1ba7df24f00",
    "minPortalUsd": 0.5,
    "currencies": [
      { "address": "0xaf88d065e77c8cC2239327C5EDb3A432268e5831", "symbol": "USDC", "decimals": 6, "vaultTokenId": "2" }
    ]
  }
}
```

`GET /portal/networks/<chainId>` answers 404 for a chain Curvy does not shield on. Read the addresses once, from this table or that endpoint, and pin them in your configuration, so that confirming a payment never depends on what a service advertises.

::: tip Onboarding
The hosted checkout URL for human checkout comes with onboarding. Contact **<hey@curvy.box>**.
:::

## Next steps

- [Human checkout integration](./human-checkout)
- [Fees and minimum amounts](./fees)
- [API surface](./api)
- [Wallet SDK](/sdk/) if you are building a private-balance app instead of a shop
