---
title: Payments SDK API surface
description: Entry points and exports of @0xcurvy/payments-sdk.
---

# API surface

All public APIs are typed TypeScript exports. Browser and chain helpers stay explicit — pass addresses and viem clients on each call. SDK settings are bound once via `initialize`, not globals.

## Entry points

| Import | Runtime | Contents |
| --- | --- | --- |
| `@0xcurvy/payments-sdk` | Browser and Node | Re-exports browser-safe helpers |
| `@0xcurvy/payments-sdk/intent` | Browser and Node | Request parse / sign / verify |
| `@0xcurvy/payments-sdk/transport` | Browser and Node | Fragment and URL helpers |
| `@0xcurvy/payments-sdk/chain` | Browser and Node | Chain reads and watches |
| `@0xcurvy/payments-sdk/contracts` | Browser and Node | ABIs |
| `@0xcurvy/payments-sdk/merchant/keys` | Browser and Node | Well-known signer document |
| `@0xcurvy/payments-sdk/merchant` | Node only | `initialize`, `createPaymentRequest` |

## Merchant

```ts
import { initialize, createPaymentRequest } from "@0xcurvy/payments-sdk/merchant";
```

| Export | Role |
| --- | --- |
| `initialize` | Bind recipient, chainId, merchantOrigin, confirmations, and TTL; returns `{ createPaymentRequest, verifyPayment }` |
| `createPaymentRequest` | Standalone derive note + unsigned request with full parameters (Node) |
| `buildPaymentRequest` | Derive an unsigned request from fully specified parameters (Node) |

`initialize` config fields:

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `recipient` | yes | — | Your **public** receiving keys (`S`, `V`, `babyJubjubPublicKey`). The SDK uses them to derive a fresh one-time payment destination for each request. Use only public material — keep spending and viewing keys offline. |
| `chainId` | yes | — | EVM network where customers pay and where you call `verifyPayment`. Must match the chain your accepted token and Curvy contracts are deployed on. |
| `merchantOrigin` | yes | — | Your shop’s bare HTTPS origin (`https://shop.example`) — scheme and host only, no path, query, or fragment. Signed into every payment request; Curvy uses it as the base for the post-checkout return URL. |
| `confirmations` | yes | — | Block confirmations required before bound `verifyPayment` returns `true` when you pass a `txHash` (e.g. `12` on Ethereum mainnet). |
| `ttlSeconds` | no | `600` | How long each payment request stays valid, in seconds. Sets `expiry` on the signed request; after that timestamp checkout rejects the request. |
| `checkoutCompletePath` | no | `/checkout/complete` | Absolute path on `merchantOrigin` where Curvy sends the customer after a successful shield: `{merchantOrigin}{path}#txHash=…`. Always included in the EIP-712 payload (default path is used when omitted). |

Bound `createPaymentRequest` requires only `amount` and `token`. Bound `verifyPayment` uses the `confirmations` value from init — pass `publicClient`, `aggregatorAddress`, `ephemeralKey`, and optionally `txHash` / `fromBlock`.

## Request signing (`/intent`)

EIP-712 export names retain `PaymentIntent` for wire compatibility.

```ts
import {
  buildPaymentIntentTypedData,
  parsePaymentIntent,
  parseSignedPaymentIntent,
  paymentIntentTypes,
  signPaymentIntent,
  verifyPaymentIntent,
} from "@0xcurvy/payments-sdk/intent";
```

| Export | Role |
| --- | --- |
| `signPaymentIntent` | Attach EIP-712 signature via your signer adapter |
| `verifyPaymentIntent` | Recover signer address; check well-known set, expiry, chain, token |
| `parsePaymentIntent` / `parseSignedPaymentIntent` | Canonicalize untrusted input |
| `buildPaymentIntentTypedData` / `paymentIntentTypes` | EIP-712 payload |

Unknown fields such as `paymentId` or `recovery` are rejected. Omitted `checkoutCompletePath` becomes `/checkout/complete` (`DEFAULT_CHECKOUT_COMPLETE_PATH`).

## Transport

```ts
import {
  buildCheckoutCompleteUrl,
  buildCheckoutUrl,
  decodePaymentIntentFragment,
  encodePaymentIntentFragment,
} from "@0xcurvy/payments-sdk/transport";
```

| Export | Role |
| --- | --- |
| `buildCheckoutUrl` | Put signed package in checkout URL fragment |
| `encodePaymentIntentFragment` / `decodePaymentIntentFragment` | Base64url fragment codec |
| `buildCheckoutCompleteUrl` | `{merchantOrigin}{path}#txHash=…` |

## Chain

```ts
import {
  findNoteInReceipt,
  predictPortalAddress,
  verifyPayment,
} from "@0xcurvy/payments-sdk/chain";
```

| Export | Role |
| --- | --- |
| `predictPortalAddress` | `PortalFactory.getEntryPortalAddress` |
| `verifyPayment` | Returns `true` when the payment reference is confirmed or batch-settled. Throws on reverted or invalid shield transactions. Standalone `/chain` export requires `confirmations`; bound `sdk.verifyPayment` uses the init value. |
| `findNoteInReceipt` | Match payment reference in aggregator logs on a receipt you already have |

## Merchant keys

```ts
import { buildMerchantKeySet, parseMerchantKeySet } from "@0xcurvy/payments-sdk/merchant/keys";
```

Produces and validates the `/.well-known/curvy-payments.json` document (`version: 1`, `alg: eip712-secp256k1`).

## Contracts

```ts
import {
  aggregatorAbi,
  pendingNotesAbi,
  portalFactoryAbi,
  vaultAbi,
} from "@0xcurvy/payments-sdk/contracts";
```

## Constants

```ts
import { DEFAULT_CHECKOUT_COMPLETE_PATH, DEFAULT_PAYMENT_REQUEST_TTL_SECONDS } from "@0xcurvy/payments-sdk";
// "/checkout/complete"
// 600
```

## Related packages

| Package | Role |
| --- | --- |
| `@0xcurvy/rs-core-wasm` | Peer for `/merchant` note derivation |
| `@0xcurvy/x402-protocol` | x402 wire types (not part of this package) |
| `@0xcurvy/curvy-sdk` | Wallet SDK — do not use for shop checkout |

For the agent x402 exact rail (shopper vs payments-sdk merchant), see [x402 and the Payments SDK](./x402).
