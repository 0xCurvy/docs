---
title: Getting started with the Payments SDK
description: Install @0xcurvy/payments-sdk, create a signed Curvy checkout URL on your backend, and confirm the payment.
---

# Getting started

Accept Curvy checkout payments from a Node backend.

::: warning Preview
This page describes `@0xcurvy/payments-sdk@0.2.0-rc.1`, a release candidate under npm's `next` tag. The `latest` tag still points to `0.1.2`, whose older `verifyPayment` is unsafe, so install the exact version below. Curvy's hosted checkout page is the Curvy web app's `/checkout` route; Curvy provides its URL during onboarding. See [What is not ready yet](./human-checkout#what-is-not-ready-yet).
:::

## What you need

Collect these values before you write any code. The snippets on this page read them from environment variables with the names below. The Curvy web app's **Payments** setup gives you a `.env` block with these names (step 3, **Connect your backend**), filled in for the network and token you choose; you add the signing key and your RPC URL.

| Value | Env var used here | Where it comes from |
| --- | --- | --- |
| Public key for payments | `CURVY_PAYMENTS_PUBLIC_KEY` | In the Curvy web app: **Payments** setup, step 3, the `CURVY_PAYMENTS_PUBLIC_KEY` line of the `.env` block. It is one line of about 268 characters, such as `01Q1JL…f57Q`: your three public receiving keys (`S`, `V` and the BabyJubjub key) packed into one value. It is public: packing is not encryption, and the value lets people pay you but not spend or see your funds. The first two characters are the format version (`01` today); an SDK that does not know a newer version refuses it and asks you to upgrade. The value ends in a checksum, so a typo or a cut-off copy is refused instead of paying the wrong keys. A business account exports only these public keys. The web app computes the value locally from your own keys, so it is the source to trust. Every business account must have a registered Curvy handle before it goes live, so you can cross-check with `GET <metadata API>/user/resolve/<full handle>`, where the handle includes its parent domain (for example `bakery.<parent domain>`; any other form returns `400 Unsupported parent domain`): pass the response's `data.publicKeys.spendingKey`, `viewingKey` and `babyJubjubPublicKey` as `S`, `V` and `babyJubjubPublicKey` to `encodeReceivingKeys` and compare the result with the value from Payments setup. If `data` is `null`, the handle is not registered: register it first. If `babyJubjubPublicKey` is `null`, Payments setup offers no value and says the account can't receive checkout payments: the account cannot receive private payments to its own name, so it is not acceptable as a business account; use a separate account for the business. Configure the value on your backend; do not resolve the handle at runtime, because a name can be repointed. |
| Checkout signing key | `MERCHANT_INTENT_SIGNING_KEY` | A new secp256k1 key used only to sign checkout requests. Create it with `npx @0xcurvy/payments-sdk@0.2.0-rc.1 create-signer [--out <file>]`, which prints the public address and writes the key to an owner-only file (default `curvy-checkout-signer.secret.json`), or with `generateCheckoutSigningKey()` from `@0xcurvy/payments-sdk/merchant/keys`. Move the key into your secret store, or keep it in a KMS/HSM (see [Signing with a KMS or HSM](./human-checkout#signing-with-a-kms-or-hsm)). Never use a wallet or Curvy spending key. |
| Chain id | `CHAIN_ID` | The EVM network where buyers pay. |
| Token | `TOKEN_ADDRESS` | The ERC-20 the buyer pays with. It must be registered in the Curvy vault on that chain. |
| Aggregator | `AGGREGATOR_ADDRESS` | The Curvy aggregator proxy on that chain. Payments setup fills it in for the network you pick; see also [Production values](#production-values). |
| Checkout page | `CHECKOUT_URL` | The full URL of Curvy’s hosted checkout page, with its path: the Curvy web app’s `/checkout` route. Curvy provides it during onboarding. |
| Your origin | `MERCHANT_ORIGIN` | Your shop’s bare origin, such as `https://shop.example`. Checkout returns the buyer there. |
| RPC | `RPC_URL` | Your own RPC endpoint for that chain. The SDK uses it to read receipts, logs and fees. |
| Confirmations | `CONFIRMATIONS` | How many blocks, counting the shield block, before a payment is `paid`. |
| Paid when | `PAID_WHEN` | Optional. `shielded` (default): `paid` once the money is safe in the Curvy vault. `committed`: `paid` only once the note is also spendable in your wallet, which waits for Curvy’s next batch commit. See [When a payment counts as paid](./confirming-payments#when-a-payment-counts-as-paid-paidwhen). |
| A database | — | Store each payment request server-side (see [step 2](#_2-create-store-sign-and-redirect)). |

## Installation

Install the Payments SDK on the **server**, at this exact release-candidate version. Creating and verifying payments needs the Rust WASM peer at exactly this version too:

::: code-group

```bash [pnpm]
pnpm add @0xcurvy/payments-sdk@0.2.0-rc.1 @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

```bash [npm]
npm install @0xcurvy/payments-sdk@0.2.0-rc.1 @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

```bash [yarn]
yarn add @0xcurvy/payments-sdk@0.2.0-rc.1 @0xcurvy/rs-core-wasm@0.1.0-rc.4
```

:::

Node.js 22.16 or newer is required. Pin `@0xcurvy/rs-core-wasm` as shown: the npm `latest` tag points at an older release candidate that does not satisfy the SDK’s peer range. Browser code that only verifies signed requests can omit `@0xcurvy/rs-core-wasm` and must not import `/merchant`.

Do **not** install `@0xcurvy/curvy-sdk` for merchant checkout. That package is the privacy wallet.

## 1. Initialize the SDK

Create the SDK, a viem public client and the signer once, when the process starts:

```ts
import { initialize, type PaidWhen } from "@0xcurvy/payments-sdk/merchant";
import { type Address, type Hex, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";

const CHAIN_ID = Number(process.env.CHAIN_ID);
const TOKEN_ADDRESS = process.env.TOKEN_ADDRESS as Address;
const AGGREGATOR_ADDRESS = process.env.AGGREGATOR_ADDRESS as Address;
const CHECKOUT_URL = process.env.CHECKOUT_URL!; // Curvy's hosted checkout page, from onboarding

export const sdk = initialize({
  receivingKeys: process.env.CURVY_PAYMENTS_PUBLIC_KEY!, // "01…" from the web app's Payments setup
  chainId: CHAIN_ID,
  merchantOrigin: process.env.MERCHANT_ORIGIN!, // e.g. "https://shop.example"
  confirmations: Number(process.env.CONFIRMATIONS), // e.g. 12 on Ethereum mainnet
  paidWhen: (process.env.PAID_WHEN ?? "shielded") as PaidWhen, // optional; default "shielded"
  ttlSeconds: 600, // optional; default 600. Also the buyer's funding window. At most 86400 (24 h): the SDK refuses longer.
  // optional: checkoutCompletePath: "/orders/paid",
});

export const publicClient = createPublicClient({ transport: http(process.env.RPC_URL) });
export const signer = privateKeyToAccount(process.env.MERCHANT_INTENT_SIGNING_KEY as Hex);
```

`initialize` checks its inputs and throws on a bad value. `receivingKeys` must be the whole, unedited value from Payments setup (the error says whether the version, length, checksum or a key is wrong). `recipient: { S, V, babyJubjubPublicKey }` still works in place of `receivingKeys`; pass exactly one. `merchantOrigin` must be a bare `http(s)` origin with no path, `confirmations` must be a positive integer, and `paidWhen` must be `"shielded"` or `"committed"`.

`paidWhen` decides what `paid` means. With the default `"shielded"`, a payment is `paid` once the money is in the Curvy vault under your keys and has enough confirmations: it is safe, but your wallet cannot spend it until Curvy’s batch prover commits it. With `"committed"`, the payment stays `confirming` until that commit, so `paid` means the money is spendable. Use `"shielded"` to ship goods; use `"committed"` if you spend the money right after the sale. A later protocol version (v4) will likely require `"committed"`.

## 2. Create, store, sign and redirect

For each checkout attempt:

```ts
import { signPaymentIntent } from "@0xcurvy/payments-sdk/intent";
import { serializePaymentRecord } from "@0xcurvy/payments-sdk/merchant";
import { buildCheckoutUrl } from "@0xcurvy/payments-sdk/transport";

// 1. Record where to start scanning, before the buyer can pay.
const fromBlock = await publicClient.getBlockNumber();

// 2. Derive a fresh one-time destination for this amount and token.
const request = await sdk.createPaymentRequest({
  amount: 10_000_000n, // token base units: 10 USDC with 6 decimals
  token: TOKEN_ADDRESS,
  description: "Order #1048 · Blue hour print", // optional; shown at checkout and on the buyer's receipt
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
const checkoutUrl = buildCheckoutUrl(CHECKOUT_URL, signed);
```

The first argument of `buildCheckoutUrl` is the URL of Curvy's hosted checkout page. `buildCheckoutUrl` keeps its origin, path and query and puts the signed package in the URL **fragment**, not the query string. Redirect the customer to `checkoutUrl`.

::: warning Minimum amount
Human checkout payments must be worth **at least USD 0.50**. Curvy's portal broadcaster fails smaller payments *after* the customer has paid, and the customer then has to reclaim the funds. Protocol fees are deducted from the amount you receive. See [Fees and minimum amounts](./fees).
:::

Store the record in your **database**, not in a cookie. The session cookie should hold only an opaque order id. Read it back with `parsePaymentRecord(value)`: `verifyPayment` takes its `payment.intent` as the stored request, and your background reconciler needs its `fromBlock`. Keep the value whole, in one column, and write each new `verifyPayment` result back into it (`serializePaymentRecord({ ...record, verification })`); your own order status can live beside it. Later SDK versions add fields under a new record version, so splitting the value into your own columns would have to be redone.

If `checkoutCompletePath` is omitted, it defaults to `/checkout/complete`. It is always included in the signed EIP-712 data.

For one-off use, the standalone `createPaymentRequest({ receivingKeys, amount, token, chainId, merchantOrigin, ... })` is also exported from `/merchant`.

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
    publicClient,
    aggregatorAddress: AGGREGATOR_ADDRESS,
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

The hash is only a hint. Also run a background job that calls `sdk.verifyPayment({ publicClient, aggregatorAddress, request: record.payment.intent, fromBlock: record.fromBlock })` without a hash for every unfinished attempt. That job completes orders whose buyer closed the tab. Fulfil the order once, when the status is `paid`. With `paidWhen: "committed"`, `confirming` can last until the next batch commit, so keep reconciling `confirming` attempts. See [Confirming payments](./confirming-payments) for every status and error, reconciliation and fees.

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
- [Confirming payments](./confirming-payments)
- [Fees and minimum amounts](./fees)
- [API surface](./api)
- [Wallet SDK](/sdk/) if you are building a private-balance app instead of a shop
