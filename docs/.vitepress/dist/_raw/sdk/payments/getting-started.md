---
title: Getting started with the Payments SDK
description: Install @0xcurvy/payments-sdk, create a signed Curvy checkout URL on your backend, and confirm the payment.
---

# Getting started

Accept Curvy checkout payments from a Node backend.

::: warning Preview
This page describes `@0xcurvy/payments-sdk@0.2.0-rc.3`, a release candidate under npm's `next` tag. The `latest` tag still points to `0.1.2`, whose older `verifyPayment` is unsafe, so install the exact version below. Curvy's hosted checkout page is the Curvy web app's `/checkout` route, `https://app.curvy.box/checkout`, and the SDK sends buyers there by default.
:::

## What you need

Collect these values before you write any code. The snippets on this page read them from environment variables with the names below. The Curvy web app's **Payments** setup gives you a `.env` block with these names (step 3, **Connect your backend**), filled in for the network and token you choose; you add the signing key and your RPC URL.

| Value | Env var used here | Where it comes from |
| --- | --- | --- |
| Public key for payments | `CURVY_PAYMENTS_PUBLIC_KEY` | In the Curvy web app: **Payments** setup, step 3, the `CURVY_PAYMENTS_PUBLIC_KEY` line of the `.env` block. It is one line of about 268 characters, such as `01Q1JL…f57Q`: your three public receiving keys (`S`, `V` and the BabyJubjub key) packed into one value. It is public: packing is not encryption, and the value lets people pay you but not spend or see your funds. The first two characters are the format version (`01` today); an SDK that does not know a newer version refuses it and asks you to upgrade. The value ends in a checksum, so a typo or a cut-off copy is refused instead of paying the wrong keys. A business account exports only these public keys. The web app computes the value locally from your own keys, so it is the source to trust. Every business account must have a registered Curvy handle before it goes live, so you can cross-check with `GET <metadata API>/user/resolve/<full handle>`, where the handle includes its parent domain (for example `bakery.<parent domain>`; any other form returns `400 Unsupported parent domain`): pass the response's `data.publicKeys.spendingKey`, `viewingKey` and `babyJubjubPublicKey` as `S`, `V` and `babyJubjubPublicKey` to `encodeReceivingKeys` and compare the result with the value from Payments setup. If `data` is `null`, the handle is not registered: register it first. If `babyJubjubPublicKey` is `null`, Payments setup offers no value and says the account can't receive checkout payments: the account cannot receive private payments to its own name, so it is not acceptable as a business account; use a separate account for the business. Configure the value on your backend; do not resolve the handle at runtime, because a name can be repointed. |
| Checkout signing key | `MERCHANT_INTENT_SIGNING_KEY` | A new secp256k1 key used only to sign checkout requests. Create it with `npx @0xcurvy/payments-sdk@0.2.0-rc.3 create-signer [--out <file>]`, which prints the public address and writes the key to an owner-only file (default `curvy-checkout-signer.secret.json`), or with `generateCheckoutSigningKey()` from `@0xcurvy/payments-sdk/merchant/keys`. Move the key into your secret store, or keep it in a KMS/HSM (see [Signing with a KMS or HSM](./human-checkout#signing-with-a-kms-or-hsm)). Never use a wallet or Curvy spending key. |
| Environment | `CURVY_ENVIRONMENT` | `mainnet` to take real money on Arbitrum One, or `testnet` to take test money on Ethereum Sepolia. Payments setup fills it in for the network you pick. The SDK knows Curvy’s contracts on both; see [Networks](#production-values). |
| Tokens | `TOKENS` | Optional. What buyers may pay in, comma-separated: `USDC`, `USDT` or token addresses. Default: USDC and USDT on mainnet, USDC on testnet. |
| Your origin | `MERCHANT_ORIGIN` | Your shop’s bare origin, such as `https://shop.example`. Checkout returns the buyer there. |
| RPC | `RPC_URL` | Your own RPC endpoint for that network. The SDK uses it to read receipts, logs and fees. |
| Confirmations | `CONFIRMATIONS` | How many blocks, counting the shield block, before a payment is `paid`. |
| Paid when | `PAID_WHEN` | Optional. `shielded` (default): `paid` once the money is safe in the Curvy vault. `committed`: `paid` only once the note is also spendable in your wallet, which waits for Curvy’s next batch commit. See [When a payment counts as paid](./confirming-payments#when-a-payment-counts-as-paid-paidwhen). |
| A database | — | Store each payment request server-side (see [step 2](#_2-create-store-sign-and-redirect)). |

The Payments setup of a staging or local Curvy app also gives `CHAIN_ID`, `AGGREGATOR_ADDRESS` and `CHECKOUT_URL`: pass the first two to `initialize` as `network`, and the checkout URL to `buildCheckoutUrl` (see [Other networks](#other-networks)).

## Installation

Install the Payments SDK on the **server**, at this exact release-candidate version. Creating and verifying payments needs the Rust WASM peer at exactly this version too:

::: code-group

```bash [pnpm]
pnpm add @0xcurvy/payments-sdk@0.2.0-rc.3 @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

```bash [npm]
npm install @0xcurvy/payments-sdk@0.2.0-rc.3 @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

```bash [yarn]
yarn add @0xcurvy/payments-sdk@0.2.0-rc.3 @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

:::

Node.js 22.16 or newer is required. Pin `@0xcurvy/rs-core-wasm` as shown: the npm `latest` tag points at an older release candidate that does not satisfy the SDK’s peer range. Browser code that only verifies signed requests can omit `@0xcurvy/rs-core-wasm` and must not import `/merchant`.

Do **not** install `@0xcurvy/curvy-sdk` for merchant checkout. That package is the privacy wallet.

## 1. Initialize the SDK

Create the SDK, a viem public client and the signer once, when the process starts:

```ts
import type { CurvyEnvironment } from "@0xcurvy/payments-sdk";
import { initialize, type PaidWhen } from "@0xcurvy/payments-sdk/merchant";
import { type Hex, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

export const sdk = initialize({
  environment: process.env.CURVY_ENVIRONMENT as CurvyEnvironment, // required: "mainnet" or "testnet"
  receivingKeys: process.env.CURVY_PAYMENTS_PUBLIC_KEY!, // "01…" from the web app's Payments setup
  tokens: process.env.TOKENS?.split(","), // optional, e.g. "USDC"; default: USDC and USDT on mainnet, USDC on testnet
  merchantOrigin: process.env.MERCHANT_ORIGIN!, // e.g. "https://shop.example"
  confirmations: Number(process.env.CONFIRMATIONS), // e.g. 12
  paidWhen: (process.env.PAID_WHEN ?? "shielded") as PaidWhen, // optional; default "shielded"
  ttlSeconds: 600, // optional; default 600. Also the buyer's funding window. At most 86400 (24 h): the SDK refuses longer.
  // optional: checkoutCompletePath: "/orders/paid",
});

export const publicClient = createPublicClient({ transport: http(process.env.RPC_URL) }); // must serve sdk.chainId
export const signer = privateKeyToAccount(process.env.MERCHANT_INTENT_SIGNING_KEY as Hex);
```

`environment` is required and has no default, so nobody takes real money, or runs a test, by accident. `"mainnet"` is Arbitrum One (chain id `42161`), with real money; `"testnet"` is Ethereum Sepolia (chain id `11155111`), with test money. The SDK has Curvy’s contracts for both built in (see [Networks](#production-values)). `sdk.chainId`, `sdk.tokens` and `sdk.aggregatorAddress` show what it picked. Your RPC endpoint must serve `sdk.chainId`.

`initialize` checks its inputs and throws on a bad value. Each of `tokens` must be a symbol Curvy takes on that network or an address, listed once. `receivingKeys` must be the whole, unedited value from Payments setup (the error says whether the version, length, checksum or a key is wrong). `recipient: { S, V, babyJubjubPublicKey }` still works in place of `receivingKeys`; pass exactly one. `merchantOrigin` must be a bare `http(s)` origin with no path, `confirmations` must be a positive integer, and `paidWhen` must be `"shielded"` or `"committed"`.

`paidWhen` decides what `paid` means. With the default `"shielded"`, a payment is `paid` once the money is in the Curvy vault under your keys and has enough confirmations: it is safe, but your wallet cannot spend it until Curvy’s batch prover commits it. With `"committed"`, the payment stays `confirming` until that commit, so `paid` means the money is spendable. Use `"shielded"` to ship goods; use `"committed"` if you spend the money right after the sale. A later protocol version (v4) will likely require `"committed"`.

## 2. Create, store, sign and redirect

For each checkout attempt:

```ts
import { signPaymentIntent } from "@0xcurvy/payments-sdk/intent";
import { serializePaymentRecord } from "@0xcurvy/payments-sdk/merchant";
import { buildCheckoutUrl } from "@0xcurvy/payments-sdk/transport";

// 1. Record where to start scanning, before the buyer can pay.
const fromBlock = await publicClient.getBlockNumber();

// 2. Derive a fresh one-time destination for this amount, in the tokens set in initialize.
const request = await sdk.createPaymentRequest({
  amount: 10_000_000n, // token base units: 10 USDC (or USDT) with 6 decimals
  description: "Order #1048 · Blue hour print", // optional; shown at checkout and on the buyer's receipt
  // optional: tokens: ["USDT"], to take this request in other tokens
});

// 3. Sign it.
const signed = await signPaymentIntent(request, (typedData) => signer.signTypedData(typedData));

// 4. Persist the attempt as ONE opaque value in your database: the signed package, fromBlock and,
//    later, the latest verifyPayment result. `db` stands for your own storage layer.
await db.paymentAttempts.insert({
  id: attemptId, // e.g. crypto.randomUUID(); one order can have several attempts
  orderId: order.id,
  record: serializePaymentRecord({ payment: signed, fromBlock, verification: null }), // a versioned JSON string
});

// 5. Build the checkout URL.
const checkoutUrl = buildCheckoutUrl(signed); // Curvy's checkout page, https://app.curvy.box/checkout
```

`buildCheckoutUrl(signed)` puts the signed package in the URL **fragment** of Curvy's hosted checkout page, `https://app.curvy.box/checkout` (`CURVY_CHECKOUT_URL`), not in the query string. To send buyers to another checkout page, such as a staging app's, pass its URL first: `buildCheckoutUrl(checkoutUrl, signed)` keeps that URL's origin, path and query. Redirect the customer to `checkoutUrl`.

::: warning Minimum amount
Human checkout payments must be worth **at least USD 0.50**. Curvy's portal broadcaster fails smaller payments *after* the customer has paid, and the customer then has to reclaim the funds. Protocol fees are deducted from the amount you receive. See [Fees and minimum amounts](./fees).
:::

Store the record in your **database**, not in a cookie. The session cookie should hold only an opaque order id. Read it back with `parsePaymentRecord(value)`: `verifyPayment` takes its `payment.intent` as the stored request, and your background reconciler needs its `fromBlock`. Keep the value whole, in one column, and write each new `verifyPayment` result back into it (`serializePaymentRecord({ ...record, verification })`); your own order status can live beside it. Later SDK versions add fields under a new record version, so splitting the value into your own columns would have to be redone.

If `checkoutCompletePath` is omitted, it defaults to `/checkout/complete`. It is always included in the signed EIP-712 data.

For one-off use, the standalone `createPaymentRequest({ receivingKeys, amount, token, chainId, merchantOrigin, ... })` is also exported from `/merchant`. It takes `chainId` directly and `token` as an address.

## 3. Publish your signers

Serve `GET {MERCHANT_ORIGIN}/.well-known/curvy-payments.json` from your backend, so Curvy checkout can verify the signature before it shows any payment UI. It lists only public signer addresses. Checkout fetches it from the buyer’s browser while the buyer pays, so keep it up and serve it with `Access-Control-Allow-Origin: *`, over `https:` from a publicly reachable host, without a redirect (plain `http:` is fine on localhost):

```ts
import { buildMerchantKeySet } from "@0xcurvy/payments-sdk/merchant/keys";
import { privateKeyToAddress } from "viem/accounts";

const signerList = buildMerchantKeySet([
  {
    address: privateKeyToAddress(process.env.MERCHANT_INTENT_SIGNING_KEY as `0x${string}`),
    notAfter: "2027-10-01T00:00:00Z", // checkout stops accepting the signer after this
  },
]);

app.get("/.well-known/curvy-payments.json", (_req, res) => {
  res.set({ "Access-Control-Allow-Origin": "*", "Cache-Control": "public, max-age=60" });
  res.json(signerList);
});
```

See [Human checkout](./human-checkout#publishing-your-signing-keys) for the document format and rotation.

The SDK does not ship route handlers yet, so you write this route, the settlement route and the completion page yourself. Keep each one a thin, separate handler over the SDK calls, and keep them up while payments are in progress: a later SDK release can supply them, and can add a route Curvy’s checkout calls during payment.

## 4. Confirm on-chain

After a successful shield, checkout sends the buyer to `{MERCHANT_ORIGIN}{checkoutCompletePath}#txHash=0x…`. Your page posts that hash to your backend, and the backend checks it against the stored request:

```ts
import { PaymentVerificationError, parsePaymentRecord, serializePaymentRecord } from "@0xcurvy/payments-sdk/merchant";

const attempt = await db.paymentAttempts.get(attemptId); // check the hint against each open attempt of the order
const record = parsePaymentRecord(attempt.record);
try {
  const verification = await sdk.verifyPayment({
    publicClient, // on sdk.chainId
    request: record.payment.intent,
    txHash, // untrusted hint from the return URL
  });
  // verification.status: "not_found" | "confirming" | "paid" | "underpaid" | "wrong_token"
  // Anyone can shield a small note to the same ownerHash and R (both are public in the checkout link) and send its
  // txHash as a hint, so a hint never replaces a paid record; not_found never erases a note already found either.
  if (verification.status !== "not_found" && record.verification?.status !== "paid") {
    // The record stores bigints safely.
    await db.paymentAttempts.update(attemptId, { record: serializePaymentRecord({ ...record, verification }) });
  }
} catch (error) {
  if (error instanceof PaymentVerificationError && error.code === "UNRELATED") {
    // This transaction does not pay this request: reject the hint.
  } else throw error;
}
```

`sdk.verifyPayment` checks against Curvy’s aggregator on your network (`sdk.aggregatorAddress`), so you do not pass one. The hash is only a hint. Also run a background job that calls `sdk.verifyPayment({ publicClient, request: record.payment.intent, fromBlock: record.fromBlock })` without a hash for every unfinished attempt. That job completes orders whose buyer closed the tab. Fulfil the order once, when the status is `paid`. With `paidWhen: "committed"`, `confirming` can last until the next batch commit, so keep reconciling `confirming` attempts. See [Confirming payments](./confirming-payments) for every status and error, reconciliation and fees.

## Networks {#production-values}

`environment` picks the network you are paid on. The SDK has Curvy’s contracts for both networks built in, so you configure nothing else:

| | `"mainnet"` | `"testnet"` |
| --- | --- | --- |
| Network | Arbitrum One, chain id `42161`, real money | Ethereum Sepolia, chain id `11155111`, test money |
| USDC | `0xaf88d065e77c8cC2239327C5EDb3A432268e5831`, 6 decimals, vault token id `2` | `0x1c7D4B196Cb0C7B01d743Fbc6116a902379C7238`, 6 decimals, vault token id `2` |
| USDT | `0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9`, 6 decimals, vault token id `3` | — |
| Aggregator (`sdk.aggregatorAddress`) | `0xE51924cEF003a654EC9735c4d97f5D4862cBcbB1` | `0x5D4A04d6c9Bdf4613e7acD92E570539A5a6DBa84` |
| Vault (`readChainFees` finds it from `chainId`) | `0xcC8d5c60A8fb15Aa3793647eF531f1bA7dF24f00` | `0x4a817f82210F17b24577ebAd474E14333A1cB85d` |
| Portal factory | `0x4f32082C5647F8fE0f0Fb567b98F2a5516361389` | `0x4f32082C5647F8fE0f0Fb567b98F2a5516361389` |
| Minimum per payment | USD 0.50 (see [Fees and minimum amounts](./fees)) | USD 0.50 |

The addresses are built into the SDK (`CURVY_NETWORKS`, `getCurvyNetwork(chainId)` and `getDefaultCurvyNetwork(environment)`, from the root entry and `/chain`) rather than read from a Curvy service at runtime, because whoever controls the aggregator address decides what counts as a payment. The aggregator and the vault are upgradeable proxies, so their addresses stay the same when Curvy upgrades the contracts.

Curvy’s services serve both networks, and the SDK points at them by default:

| Service | URL |
| --- | --- |
| Checkout page | `https://app.curvy.box/checkout` (`CURVY_CHECKOUT_URL`), the default of `buildCheckoutUrl(signed)` |
| Portal broadcaster | `https://api.curvy.box`, the default `broadcaster` of `createX402Merchant` and of `createBroadcasterClient` |
| x402 facilitator | `https://api.curvy.box/portal/x402`, served by the broadcaster; the default `facilitator` |

### Other networks

Any other chain works with `network`: a staging or local Curvy deployment, or a Curvy network this SDK version does not know yet. The Payments setup of a staging or local Curvy app gives you its `CHAIN_ID`, `AGGREGATOR_ADDRESS` and `CHECKOUT_URL`:

```ts
import type { Address } from "viem";

export const sdk = initialize({
  environment: process.env.CURVY_ENVIRONMENT as CurvyEnvironment,
  network: {
    chainId: Number(process.env.CHAIN_ID),
    aggregatorAddress: process.env.AGGREGATOR_ADDRESS as Address, // required on a chain the SDK does not know
  },
  tokens: process.env.TOKENS?.split(","), // token addresses on a chain the SDK does not know
  // ...the other fields as in step 1
});

const checkoutUrl = buildCheckoutUrl(process.env.CHECKOUT_URL!, signed); // e.g. https://app.curvy.dev/checkout on staging
```

- On a chain the SDK does not know, pass `aggregatorAddress`. Without it, `sdk.aggregatorAddress` is `undefined` and `verifyPayment` throws `INVALID_INPUT`. On a chain it knows, the aggregator defaults to Curvy’s.
- On a chain the SDK does not know, give the tokens by address. Without `tokens`, `sdk.tokens` is empty and every `createPaymentRequest` must name them.
- A chain the SDK knows must match the environment: `environment: "mainnet"` with Sepolia’s chain id `11155111` throws.

::: tip Onboarding
For production onboarding, contact **<hey@curvy.box>**.
:::

## Next steps

- [Human checkout integration](./human-checkout)
- [Confirming payments](./confirming-payments)
- [Fees and minimum amounts](./fees)
- [API surface](./api)
- [Wallet SDK](/sdk/) if you are building a private-balance app instead of a shop
