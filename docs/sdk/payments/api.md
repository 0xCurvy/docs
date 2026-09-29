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
| `@0xcurvy/payments-sdk/economics` | Browser and Node | Fee reads, quotes, minimum amounts |
| `@0xcurvy/payments-sdk/x402` | Browser and Node | x402 wire types, broadcaster and facilitator clients, payer helper, EIP-712 types, parsers, header codec |
| `@0xcurvy/payments-sdk/x402/merchant` | Node only | `createX402Merchant`: the merchant side of `exact` and `curvy-transfer` in one object |
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

## Economics

```ts
import {
  feeBreakdown,
  minimumPaymentAmount,
  quotePayment,
  readChainFees,
} from "@0xcurvy/payments-sdk/economics";
```

| Export | Role |
| --- | --- |
| `readChainFees` | Read `ChainFees` (`depositFeeBps`, `portalDeployment`, `pendingNoteCommitment`) for a token from the vault, optionally at a past `blockNumber` |
| `quotePayment` | `FeeBreakdown` for a gross amount on a `PaymentRail` (`"portal"` or `"direct"`) |
| `feeBreakdown` | The same breakdown from positional values `(gross, depositFeeBps, portalDeployment, pendingNoteCommitment)` |
| `minimumPaymentAmount` | Smallest gross amount whose net is at least `minNetAmount` (on-chain floor only) |

`FeeBreakdown` fields are decimal strings in token base units: `depositFeeBps`, `percentageFee`, `portalDeployment`, `pendingNoteCommitment`, `totalFees`, `netAmount`. `ChainFees`, `FeeBreakdown`, `PaymentRail`, `feeBreakdown`, `minimumPaymentAmount`, `quotePayment` and `readChainFees` are also exported from the root `@0xcurvy/payments-sdk`. See [Fees and minimum amounts](./fees).

## x402 merchant

```ts
import { createX402Merchant, createMemoryPaymentStore, toResponse } from "@0xcurvy/payments-sdk/x402/merchant";
```

| Export | Role |
| --- | --- |
| `createX402Merchant(config)` | Async. Reads the chain id, discovers the Curvy addresses from the broadcaster, reads the token's vault id and EIP-712 domain, checks the facilitator's `/supported` if one is set, returns an `X402Merchant` |
| `X402Merchant.charge(request, { price, description?, mimeType?, resource? })` | One call per request: `{ status: "payment-required", response, payment, error? }` or `{ status: "paid", payment, headers }`. `paid` only once `payTo` holds the amount on chain |
| `X402Merchant.getPayment` / `listPayments` | Read stored `X402Payment` records by `payTo` |
| `X402Merchant.shield` / `confirm` | Retry the background steps by hand: register the funded portal with the broadcaster and read its status; one `verifyPayment` attempt |
| `X402Merchant.fees` / `quote(price)` / `minimumPrice` | Portal-rail fee reads for this token; `minimumPrice` is the on-chain floor or the broadcaster's USD minimum in token units, whichever is higher |
| `X402Merchant.minimumPortalUsd` | The broadcaster's USD minimum per portal, when it reports one |
| `X402Merchant.close` | Stop background shield and confirmation work |
| `toResponse(response)` | Turn a 402 result into a Fetch `Response` |
| `createMemoryPaymentStore({ maxEntries })` | The default `X402PaymentStore`; implement `{ get, put, list }` for a database, plus `claim(payTo, from, to)` (atomic compare-and-set) when several instances share it |
| `ShieldRefusedError` | Thrown by `shield` (and reported as an `error` event) when the broadcaster reaches a terminal state for the portal; retrying is pointless |

`createX402Merchant` config fields:

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `broadcaster` | yes | — | Curvy portal broadcaster URL or `BroadcasterClient`. Shields every funded portal into your note and reports the Curvy contract addresses |
| `facilitator` | no | — | Any x402 v2 facilitator URL or `FacilitatorClient` that settles `exact` (EIP-3009). Without it only `curvy-transfer` is offered |
| `schemes` | no | `["exact", "curvy-transfer"]` with a facilitator, else `["curvy-transfer"]` | `X402Scheme[]`; `exact` needs a facilitator |
| `rpcUrl` or `publicClient` | one | — | Chain access (`X402MerchantClient` is the subset of viem's `PublicClient` used) |
| `recipient` | yes | — | Your public receiving keys |
| `token` | yes | — | Token address, registered in the Curvy vault (EIP-3009 for `exact`) |
| `tokenDomain` | no | read on chain | `{ name, version }` for tokens without `version()` |
| `addresses` | no | from the broadcaster's `GET /portal/networks/:chainId` | `aggregator`, `portalFactory`, `vault`; pin them in production |
| `recovery` | no | `NO_RECOVERY_ADDRESS` | Portal recovery address every `payTo` is derived with. The default can never reclaim funds |
| `shieldDeadlineSeconds` | no | `86400` | How long the broadcaster keeps trying to shield a funded portal, and how long the SDK polls it |
| `enforceBroadcasterMinimum` | no | `true` | Refuse prices below the broadcaster's `minPortalUsd`, treating the token as USD-pegged with the decimals the broadcaster reports. Set false only for non-USD tokens with your own guard |
| `settleTimeoutMs` | no | `60000` | `curvy-transfer`: how long `charge()` waits for a presented transaction to be mined |
| `transferConfirmations` | no | `1` | `curvy-transfer`: blocks a transfer needs before the resource is served |
| `confirmations` | no | `12` | Blocks before `confirm` treats a shield as final |
| `challengeTtlSeconds` | no | `300` | Challenge and authorization lifetime |
| `merchantOrigin` | no | request URL origin, else `Host` header | Your public origin; set it behind a proxy or when the framework passes a relative URL |
| `store` | no | in-memory | `X402PaymentStore` |
| `onEvent` | no | — | `challenged`, `settled`, `shielded`, `confirmed`, `failed`, `error` |
| `autoShield` | no | `true` | Shield and confirm in the background after settlement |
| `confirmPollMs` / `confirmTimeoutMs` | no | `2000` / `600000` | Background polling cadence and confirmation give-up time |
| `fetch` | no | global `fetch` | Used for the broadcaster and facilitator clients created from URLs |

`X402Payment` fields: `payTo`, `status` (`pending`, `settling` = settlement requested and possibly landed, `settled`, `shielded`, `confirmed`, `failed` = refused by the facilitator with an empty portal, `expired`), `amount`, `resource`, `createdAt`, `expiresAt`, `accepts` (the 402 rows, one per scheme), `note` (your private payment reference), `payer?`, `settleTxHash?`, `shieldTxHash?`, `noteId?`, `netAmount?`, `portalState?` (the broadcaster's last reported state), `error?`. `X402Merchant` also exposes `chainId`, `network`, `token`, `tokenId`, `tokenDomain`, `addresses`, `schemes`, `recovery`, `broadcaster` and `facilitator?`.

## x402

```ts
import {
  createBroadcasterClient,
  createFacilitatorClient,
  createX402Payer,
  EXACT_SCHEME,
  PAYMENT_REQUIRED_HEADER,
  parsePaymentPayload,
  TRANSFER_SCHEME,
  x402Network,
} from "@0xcurvy/payments-sdk/x402";
```

| Export | Role |
| --- | --- |
| `X402_VERSION` | `2`, the x402 protocol version the SDK speaks |
| `EXACT_SCHEME` / `TRANSFER_SCHEME` | `"exact"` / `"curvy-transfer"` |
| `ASSET_TRANSFER_METHOD` / `TRANSFER_METHOD` | `"eip3009"`, the token authorization payers sign for `exact`; `"erc20-transfer"`, the `curvy-transfer` method |
| `NO_RECOVERY_ADDRESS` | `0x…dEaD`, the default portal recovery address nobody controls |
| `PAYMENT_REQUIRED_HEADER`, `PAYMENT_SIGNATURE_HEADER`, `PAYMENT_RESPONSE_HEADER` | The x402 v2 header names |
| `x402Network` / `parseX402Network` | `chainId` ↔ CAIP-2 `eip155:<chainId>` |
| `X402PaymentRequired`, `X402PaymentRequirements`, `X402PaymentPayload`, `X402ResourceInfo`, `X402VerifyResponse`, `X402SettleResponse`, `X402SupportedResponse`, `X402SupportedKind`, `Eip3009Authorization`, `ExactPaymentPayload`, `TransferPaymentPayload`, `CurvyDeployment` | x402 v2 wire types, plus the Curvy contract addresses the broadcaster reports |
| `createBroadcasterClient({ url, fetch?, timeoutMs?, headers? })` | `network(chainId)` (`GET /portal/networks/:chainId`), `registerPayment` (`POST /portal/payments`), `status` (`GET /portal/status`) on the portal broadcaster; throws `BroadcasterError`. Types: `BroadcasterClient`, `CurvyNetwork`, `CurvyCurrency`, `PortalPaymentRegistration`, `PortalPaymentStatus`, `PortalPaymentState` |
| `TERMINAL_PORTAL_FAILURES` | Portal states the broadcaster never leaves (`compliance_failed`, `expired`, `failed`) |
| `createFacilitatorClient({ url, fetch?, timeoutMs?, headers? })` | `supported`, `verify`, `settle` against any x402 v2 facilitator on plain `fetch`; throws `FacilitatorError` on unexpected replies |
| `createX402Payer({ signer?, send?, maxAmount, fetch?, network?, asset?, now?, retryForMs?, retryEveryMs? })` | Agent-side `fetch` that pays one 402 up to `maxAmount`: `exact` with `signer`, `curvy-transfer` with `send` (`exact` preferred when both are offered); also `pay(required)`. `now` is the clock for `validBefore` |
| `selectExactRequirements`, `createExactPayment`, `selectTransferRequirements`, `createTransferPayment`, `encodePaymentSignature`, `decodePaymentRequired`, `decodePaymentResponse`, `paymentRequiredFrom`, `paymentResponseFrom` | Payer building blocks. Types: `X402Signer`, `X402TransferSender`, `Eip3009TypedData` |
| `parsePaymentRequired`, `parsePaymentRequirements`, `parseResourceInfo`, `parsePaymentPayload`, `parseExactPayload`, `parseTransferPayload`, `parseVerifyResponse`, `parseSettleResponse`, `parseSupportedResponse`, `parseCurvyDeployment` | Validate untrusted JSON into the wire types |
| `requirementsEqual`, `canonicalJson` | Compare requirement rows regardless of key order and address casing |
| `parseUint`, `parseAddress`, `parseHex` | Low-level parse helpers |
| `transferWithAuthorizationTypes`, `eip3009Domain({ chainId, token, name, version })` | EIP-712 types and domain payers sign for `exact` |
| `encodeBase64Json` / `decodeBase64Json` | Browser-safe codec for the `PAYMENT-*` headers |

See [x402 and the Payments SDK](./x402).

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
| `@x402/fetch`, `@x402/evm` | Optional standard x402 client packages for paying agents; the merchant side needs none of them |
| `@0xcurvy/curvy-sdk` | Wallet SDK — do not use for shop checkout |

For agent payments (`exact` and `curvy-transfer`), see [x402 and the Payments SDK](./x402). Everything x402 lives in `@0xcurvy/payments-sdk/x402` and `@0xcurvy/payments-sdk/x402/merchant`; there is no separate x402 package to install.
