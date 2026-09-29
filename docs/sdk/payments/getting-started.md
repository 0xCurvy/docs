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

## Local development

You can run the whole payments stack locally from the Curvy monorepo: Anvil, Curvy contracts, the portal broadcaster, the demo merchant and the hosted checkout page. Follow `packages/demo/README.md` (`pnpm demo:payments`). Then use these **local** values:

| Setting | Local devnet value |
| --- | --- |
| `chainId` | `31337` (Anvil) |
| RPC URL | `http://127.0.0.1:8545` |
| Checkout page (`buildCheckoutUrl` first argument) | `http://127.0.0.1:4032` |
| Portal broadcaster (`broadcaster` for `createX402Merchant`) | `http://127.0.0.1:4035` |
| Token | "Local USDC" mock (6 decimals, vault token id `3`) |
| Contract addresses | `packages/contracts/evm/ignition/deployments/local_anvil/deployed_addresses.json`, written by `pnpm run deploy:local` |

The keys to read from `deployed_addresses.json`:

| Contract | Key |
| --- | --- |
| Aggregator (`aggregatorAddress` for `verifyPayment`) | `CurvyAggregator#CurvyAggregatorAlphaV2` |
| Vault (`vaultAddress` for `readChainFees`) | `CurvyVault#CurvyVaultV2` |
| Portal factory | `PortalFactory#PortalFactory` |
| Token (`token` for `createPaymentRequest`) | `Devenv#EIP3009TokenMock` |

`deploy:local` can reassign addresses, so read them from that file after each deploy instead of hard-coding them. The demo merchant on `http://127.0.0.1:4031` is a working end-to-end example of this page.

::: warning Local only
These values exist only on your machine. Curvy provides production checkout URLs and contract addresses during onboarding. Contact **<hey@curvy.box>**.
:::

## Next steps

- [Human checkout integration](./human-checkout)
- [Fees and minimum amounts](./fees)
- [API surface](./api)
- [Wallet SDK](/sdk/) if you are building a private-balance app instead of a shop
