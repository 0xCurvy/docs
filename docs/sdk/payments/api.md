---
title: Payments SDK API surface
description: Entry points and exports of @0xcurvy/payments-sdk.
---

# API surface

All public APIs are typed TypeScript exports. Browser and chain helpers are explicit: you pass addresses and viem clients on each call. SDK settings are bound once through `initialize`; there are no globals.

## Entry points

| Import | Runtime | Contents |
| --- | --- | --- |
| `@0xcurvy/payments-sdk` | Browser and Node | Re-exports browser-safe helpers, types and constants |
| `@0xcurvy/payments-sdk/intent` | Browser and Node | Request parse / sign / verify |
| `@0xcurvy/payments-sdk/transport` | Browser and Node | Fragment and URL helpers |
| `@0xcurvy/payments-sdk/chain` | Browser and Node | Receipt discovery hints; portal prediction (internal and unstable) |
| `@0xcurvy/payments-sdk/contracts` | Browser and Node | ABIs |
| `@0xcurvy/payments-sdk/economics` | Browser and Node | Fee reads, quotes, minimum amounts |
| `@0xcurvy/payments-sdk/x402` | Browser and Node | x402 wire types, broadcaster and facilitator clients, payer helper, EIP-712 types, parsers, header codec |
| `@0xcurvy/payments-sdk/x402/merchant` | Node only | `createX402Merchant`: the merchant side of `exact` and `curvy-transfer` in one object |
| `@0xcurvy/payments-sdk/merchant/keys` | Browser and Node | Well-known signer document; receiving-keys value (`encodeReceivingKeys`, `parseReceivingKeys`); `generateCheckoutSigningKey` |
| `@0xcurvy/payments-sdk/merchant` | Node only | `initialize`, `createPaymentRequest`, `verifyPayment`, `serializePaymentRecord` / `parsePaymentRecord` |

## Merchant (`/merchant`, Node only)

```ts
import {
  initialize,
  createPaymentRequest,
  buildPaymentRequest,
  verifyPayment,
  PaymentVerificationError,
  serializePaymentRecord,
  parsePaymentRecord,
} from "@0xcurvy/payments-sdk/merchant";
```

| Export | Role |
| --- | --- |
| `initialize(config)` | Binds the receiving keys, chainId, merchantOrigin, confirmations, paidWhen and TTL. Returns `{ createPaymentRequest, verifyPayment }`. |
| `createPaymentRequest(parameters)` | Standalone: derives a note and returns an unsigned request. `ttlSeconds` is optional (default `600`, at most `86400`). `description` is optional: what the buyer is paying for, at most 120 characters of plain text, signed with the payment and shown at checkout and on the buyer's receipt. |
| `buildPaymentRequest(parameters)` | Same as `createPaymentRequest`, but `ttlSeconds` is required |
| `verifyPayment(parameters)` | Decides whether a stored request has been paid on chain. See [Confirming payments](./confirming-payments). |
| `PaymentVerificationError` | Thrown by `verifyPayment` when it cannot produce a status. It has a `code`. |
| `serializePaymentRecord(record)` / `parsePaymentRecord(value)` | The one value to store per payment attempt: `{ payment, fromBlock, verification }` (the signed package, the scan start and the latest `verifyPayment` result) as a versioned JSON string. Store it whole; `parsePaymentRecord` refuses unknown versions and fields. `PAYMENT_RECORD_VERSION` is `1` today. |
| `buildMerchantKeySet`, `parseMerchantKeySet`, `encodeReceivingKeys`, `parseReceivingKeys`, `RECEIVING_KEYS_VERSION` | Also re-exported from `/merchant/keys` and the root entry |

`initialize` config fields:

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `receivingKeys` | one of `receivingKeys` or `recipient` | — | **Preferred.** Your public receiving keys as one value, your public key for payments (`CURVY_PAYMENTS_PUBLIC_KEY` in the `.env` block of the web app's **Payments** setup, step 3), such as `01Q1JL…f57Q`. `initialize` parses it with `parseReceivingKeys` and throws if it is edited, cut off or from a newer format version. The SDK derives a fresh one-time destination from the keys for every request. See [Receiving keys](#receiving-keys-value). |
| `recipient` | one of `receivingKeys` or `recipient` | — | The same public keys as `{ S, V, babyJubjubPublicKey }`, each a decimal `x.y` string. Passing both, or neither, throws `pass exactly one of receivingKeys (preferred) or recipient`. Use only public material. |
| `chainId` | yes | — | EVM network where customers pay and where you call `verifyPayment`. It must be a positive safe integer. |
| `merchantOrigin` | yes | — | Your shop’s bare origin (`https://shop.example`): scheme and host only. It is signed into every request and is the base of the return URL. |
| `confirmations` | yes | — | Blocks, counting the shield block, before bound `verifyPayment` returns `paid` instead of `confirming`. It must be a positive safe integer. |
| `paidWhen` | no | `"shielded"` | When bound `verifyPayment` returns `paid`. `"shielded"`: once the note has `confirmations` blocks (the money is safe in the vault). `"committed"`: also once the note is in a `CommittedNotes` batch (the money is spendable); until then it returns `confirming`. Anything else throws. Bound at init; there is no per-call override. See [When a payment counts as paid](./confirming-payments#when-a-payment-counts-as-paid-paidwhen). |
| `ttlSeconds` | no | `600` | Request lifetime. It sets `expiry`. It is also the buyer’s funding window: Curvy will not register or shield the payment after `expiry`. At most `86400` (24 h); `initialize` and `createPaymentRequest` refuse more. |
| `checkoutCompletePath` | no | `/checkout/complete` | Absolute path on `merchantOrigin` where Curvy sends the customer after a shield: `{merchantOrigin}{path}#txHash=…`. It is always included in the EIP-712 payload. |

Signatures:

```ts
interface PaymentSDK {
  createPaymentRequest(parameters: { amount: bigint; token: Address; description?: string }): Promise<PaymentIntent>;
  verifyPayment(parameters: BoundVerifyPaymentParameters): Promise<PaymentVerification>;
}
type BoundVerifyPaymentParameters = Omit<VerifyPaymentParameters, "confirmations" | "paidWhen">;

type PaidWhen = "shielded" | "committed";

interface VerifyPaymentParameters {
  publicClient: PaymentVerifyClient; // a viem PublicClient works
  aggregatorAddress: Address;        // Curvy aggregator proxy
  request: PaymentIntent;            // exactly what createPaymentRequest returned, stored server-side
  confirmations: number;             // positive safe integer
  paidWhen?: PaidWhen;               // default "shielded"; "committed" also waits for the batch commit
  txHash?: Hex;                      // untrusted hint
  fromBlock?: bigint;                // required when txHash is omitted; ignored with txHash
}

type PaymentStatus = "not_found" | "confirming" | "paid" | "underpaid" | "wrong_token";

interface PaymentVerification {
  status: PaymentStatus;
  payment: VerifiedPayment | null;   // null only for not_found
}

interface VerifiedPayment {
  txHash: Hex;
  blockNumber: bigint;
  confirmations: bigint;
  noteId: bigint;
  vaultTokenId: bigint;
  netAmount: bigint;
  minimumNetAmount: bigint;
  portalShield: boolean;
  committed: boolean;                // in a CommittedNotes batch (spendable); required for paid only with paidWhen "committed"
  siblingNoteIds: bigint[];          // other notes seen under this request's ownerHash; only one can ever be spent
}

type PaymentVerificationErrorCode =
  | "WRONG_CHAIN" | "TX_NOT_FOUND" | "REVERTED" | "NOT_A_SHIELD"
  | "UNRELATED" | "MISSING_FROM_BLOCK" | "INVALID_INPUT";

interface PaymentVerifyClient
  extends Pick<PublicClient,
    "getChainId" | "getBlockNumber" | "getLogs" | "getTransaction" | "getTransactionReceipt" | "readContract"> {}
```

The standalone `createPaymentRequest` takes `{ receivingKeys | recipient, amount, token, chainId, merchantOrigin, checkoutCompletePath?, description?, ttlSeconds? }`: exactly one of `receivingKeys` (preferred) or `recipient`, as in `initialize`. `buildPaymentRequest` and `createX402Merchant` take the same choice.

## Request signing (`/intent`)

The EIP-712 export names keep `PaymentIntent` for wire compatibility.

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
| `signPaymentIntent(request, signer)` | Returns `{ intent, signature }`. `signer` is any `(typedData) => Promise<Hex>`, such as a viem account’s `signTypedData` or a KMS adapter. It checks only that the result is a 65-byte signature, not who signed it (see [Signing with a KMS or HSM](./human-checkout#signing-with-a-kms-or-hsm)). It refuses a request whose `expiry` is more than `86400` seconds (24 h) away, however the request was built. |
| `verifyPaymentIntent(payment, { keySet, expectedChainId, expectedToken, nowSeconds? })` | Recovers the signer and checks it is in `keySet` and before its `notAfter`. Also checks `expiry`, chain and token, and refuses a request whose `expiry` is more than 24 h plus 5 minutes (clock skew) after `nowSeconds`. Returns `{ intent, signer }`. |
| `parsePaymentIntent` / `parseSignedPaymentIntent` | Canonicalize untrusted input |
| `buildPaymentIntentTypedData` / `paymentIntentTypes` | EIP-712 payload: domain `{ name: "Curvy Payments", version: "1", chainId }`. The version is part of the format: a later checkout can refuse a retired one. |

`parsePaymentIntent` rejects:

- unknown fields, such as `paymentId` or `recovery`;
- non-canonical decimals (leading zeros);
- an `amount` outside `[1, 2^256)`;
- an `ownerHash` outside `[1, r)`, where `r` is the BN254 scalar field;
- `ephemeralKeyX` or `ephemeralKeyY` at or above the BN254 base field;
- a `viewTag` outside `uint16`;
- a `chainId` or `expiry` that is not a positive safe integer.

An omitted `checkoutCompletePath` becomes `/checkout/complete`.

## Transport (`/transport`)

```ts
import {
  buildCheckoutCompleteUrl,
  buildCheckoutRetryUrl,
  buildCheckoutUrl,
  decodePaymentIntentFragment,
  encodePaymentIntentFragment,
} from "@0xcurvy/payments-sdk/transport";
```

| Export | Role |
| --- | --- |
| `buildCheckoutUrl(checkoutUrl, signed)` | Puts the signed package in the fragment of Curvy’s checkout page URL (`CHECKOUT_URL`, provided during onboarding). Keeps the URL’s origin, path and query. |
| `encodePaymentIntentFragment` / `decodePaymentIntentFragment` | Unpadded base64url JSON fragment codec |
| `buildCheckoutCompleteUrl(request, txHash)` | `{merchantOrigin}{path}#txHash=…`: the return after a successful shield |
| `buildCheckoutRetryUrl(request)` | `{merchantOrigin}{path}#retry=<ephemeralKeyX>`: the return that asks the merchant for a fresh attempt (see [Fresh payment attempts](./human-checkout#fresh-payment-attempts)) |

## Chain (`/chain`, browser-safe)

```ts
import { findNoteInReceipt } from "@0xcurvy/payments-sdk/chain";
```

| Export | Role |
| --- | --- |
| `predictPortalAddress({ publicClient, portalFactoryAddress, ownerHash, recovery })` | **Internal and unstable**, for Curvy's checkout: `PortalFactory.getEntryPortalAddress(ownerHash, recovery)`. Its inputs change when Curvy migrates portal factories. Merchants do not compute portal addresses; x402 merchants use `createX402Merchant`. |
| `findNoteInReceipt(receipt, [ephemeralKeyX, ephemeralKeyY], aggregatorAddress)` | Returns `{ noteId, netAmount, token }` or `null`. `token` is the **vault token id**. It matches only `R`, so it is a **discovery hint, not proof of payment**. |

`verifyPayment` is no longer exported from `/chain` or from the root entry. Import it from `/merchant`.

## Merchant keys (`/merchant/keys`)

```ts
import {
  buildMerchantKeySet,
  generateCheckoutSigningKey,
  parseMerchantKeySet,
} from "@0xcurvy/payments-sdk/merchant/keys";

const keySet = buildMerchantKeySet([{ address: signer.address, notAfter: "2027-01-01T00:00:00.000Z" }]);
```

| Export | Role |
| --- | --- |
| `buildMerchantKeySet(signers, options?)` / `parseMerchantKeySet(value)` | Produce and validate the `/.well-known/curvy-payments.json` document (`version: 1`, `alg: eip712-secp256k1`). `notAfter` is an ISO string or a `Date`. `options.icon` adds the optional checkout icon: an absolute `.png` or `.webp` path on the merchant origin, at most `MAX_MERCHANT_ICON_PATH_LENGTH` (256) characters. `options.name` adds the optional shop name checkout shows beside your domain: plain text, trimmed, at most `MAX_MERCHANT_NAME_LENGTH` (60) characters, no control or text-direction characters. |
| `generateCheckoutSigningKey()` | Returns `{ privateKey, address }`: a new random secp256k1 key used only to sign checkout requests. It holds no funds, pays no gas and is independent of any wallet or Curvy key. Keep `privateKey` in your secret store; publish `address` with `buildMerchantKeySet`. |
| `encodeReceivingKeys` / `parseReceivingKeys` / `RECEIVING_KEYS_VERSION` | The receiving-keys value (below) |

The same key from the command line, on the backend:

```sh
npx @0xcurvy/payments-sdk create-signer [--out <file>]
```

It prints the public address and writes the private key to an owner-only file (default `curvy-checkout-signer.secret.json`), refusing to replace an existing one. A KMS or HSM can hold the key instead (see [Signing with a KMS or HSM](./human-checkout#signing-with-a-kms-or-hsm)).

### Receiving keys value {#receiving-keys-value}

```ts
import { encodeReceivingKeys, parseReceivingKeys, RECEIVING_KEYS_VERSION } from "@0xcurvy/payments-sdk/merchant/keys";

function encodeReceivingKeys(recipient: PaymentRecipient): string;
function parseReceivingKeys(value: string): PaymentRecipient; // { S, V, babyJubjubPublicKey } as decimal "x.y"
const RECEIVING_KEYS_VERSION: "01";
```

The receiving-keys value is your three public receiving keys packed into one line, so you copy one thing from the web app instead of three. It is the `CURVY_PAYMENTS_PUBLIC_KEY` value in the web app's **Payments** setup, and what `initialize({ receivingKeys })` and `createX402Merchant({ receivingKeys })` take. It holds public keys only; packing is not encryption. It never contains a secret, a derivation index or a reference to a parent account, so a business account exports only its own public keys.

The format is `VERSION + BODY`:

- `VERSION` is two lowercase hex digits. `01` is today's keys: `S` (secp256k1), `V` (BN254) and the BabyJubjub public key. `02` is reserved for a later protocol version that adds keys. `00` is never valid.
- `BODY` is base64url (RFC 4648 §5, no padding) of the ASCII marker `CRK`, then `S.x`, `S.y`, `V.x`, `V.y`, `BabyJubjub.x`, `BabyJubjub.y` as 32-byte big-endian numbers, then a 4-byte checksum. A version `01` body is 199 bytes, and the whole value is 268 characters.
- The checksum is the first 4 bytes of SHA-256 over the version digits, `CRK` and the 192 key bytes. It catches typos and cut-off copies, and it covers the version digits, so changing `01` by hand does not produce another valid value.

`parseReceivingKeys` is strict. It throws when the version is not two lowercase hex digits, is `00`, or is any version other than `01` (that error names the version and says to upgrade `@0xcurvy/payments-sdk`); when the body has characters outside base64url, padding, or a non-canonical ending; when the length is wrong; when the `CRK` marker is missing (`not a Curvy receiving-keys value`); when the checksum does not match; and when a coordinate is zero, is not below its field modulus, or the point is not on its curve (`S` on secp256k1, `V` on BN254 G1, the BabyJubjub key on the BabyJubjub curve). `encodeReceivingKeys` applies the same key checks, so it refuses keys it could not parse back.

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
| `X402Merchant.shield` / `confirm` | Retry the background steps by hand: register the funded portal with the broadcaster and read its status; one `verifyPayment` attempt (the `/merchant` check: the note must pay this request's owner, token and amount after fees) |
| `X402Merchant.fees` / `quote(price)` / `minimumPrice` | Portal-rail fee reads for this token; `minimumPrice` is the on-chain floor or the broadcaster's USD minimum in token units, whichever is higher |
| `X402Merchant.minimumPortalUsd` | The broadcaster's USD minimum per portal, when it reports one |
| `X402Merchant.close` | Stop background shield and confirmation work |
| `toResponse(response)` | Turn a 402 result into a Fetch `Response` |
| `createMemoryPaymentStore({ maxEntries })` | The default `X402PaymentStore`; implement `{ get, put, list }` for a database, plus `claim(payTo, from, to)` (atomic compare-and-set) when several instances share it |
| `ShieldRefusedError` | Thrown by `shield` (and reported as an `error` event) when the broadcaster reaches a terminal state for the portal; retrying is pointless |

`createX402Merchant` config fields:

| Field | Required | Default | Description |
| --- | --- | --- | --- |
| `broadcaster` | no | `https://api.curvy.box` (`CURVY_BROADCASTER_URL`) | Curvy portal broadcaster URL or `BroadcasterClient`. Shields every funded portal into your note and reports the Curvy contract addresses |
| `facilitator` | no | `<broadcaster>/portal/x402`, so `https://api.curvy.box/portal/x402` (`CURVY_FACILITATOR_URL`) | The x402 v2 facilitator that settles `exact` (EIP-3009): Curvy's by default, or any other facilitator URL or `FacilitatorClient`. `false` offers only `curvy-transfer` |
| `schemes` | no | `["exact", "curvy-transfer"]`, or `["curvy-transfer"]` when `facilitator` is `false` | `X402Scheme[]`; `exact` needs a facilitator |
| `rpcUrl` or `publicClient` | one | — | Chain access (`X402MerchantClient` is the subset of viem's `PublicClient` used) |
| `receivingKeys` or `recipient` | one | — | Your public receiving keys: the one `01…` value (`CURVY_PAYMENTS_PUBLIC_KEY`, preferred) or `{ S, V, babyJubjubPublicKey }`. Passing both, or neither, throws |
| `token` | yes | — | Token address, registered in the Curvy vault (EIP-3009 for `exact`) |
| `tokenDomain` | no | read on chain | `{ name, version }` for tokens without `version()` |
| `addresses` | no | from the broadcaster's `GET /portal/networks/:chainId` | `aggregator`, `portalFactory`, `vault`; pin them in production |
| `recovery` | no | `NO_RECOVERY_ADDRESS` | Portal recovery address every `payTo` is derived with. The default can never reclaim funds |
| `shieldDeadlineSeconds` | no | `86400` | How long the broadcaster keeps trying to shield a funded portal, and how long the SDK polls it |
| `enforceBroadcasterMinimum` | no | `true` | Refuse prices below the broadcaster's `minPortalUsd`, treating the token as USD-pegged with the decimals the broadcaster reports. Set false only for non-USD tokens with your own guard |
| `settleTimeoutMs` | no | `60000` | `curvy-transfer`: how long `charge()` waits for a presented transaction to be mined |
| `transferConfirmations` | no | `1` | `curvy-transfer`: blocks a transfer needs before the resource is served |
| `confirmations` | no | `12` | Blocks, counting the shield block, before `confirm` reports the payment `confirmed` (passed to `verifyPayment`) |
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
| `CURVY_BROADCASTER_URL` / `CURVY_FACILITATOR_URL` | `https://api.curvy.box` / `https://api.curvy.box/portal/x402`: Curvy's production endpoints, the defaults of the clients and of `createX402Merchant` |
| `CURVY_FACILITATOR_PATH` / `facilitatorUrlFor(broadcasterUrl)` | `/portal/x402`; the facilitator a given portal broadcaster serves |
| `EXACT_SCHEME` / `TRANSFER_SCHEME` | `"exact"` / `"curvy-transfer"` |
| `ASSET_TRANSFER_METHOD` / `TRANSFER_METHOD` | `"eip3009"`, the token authorization payers sign for `exact`; `"erc20-transfer"`, the `curvy-transfer` method |
| `NO_RECOVERY_ADDRESS` | `0x…dEaD`, the default portal recovery address nobody controls |
| `PAYMENT_REQUIRED_HEADER`, `PAYMENT_SIGNATURE_HEADER`, `PAYMENT_RESPONSE_HEADER` | The x402 v2 header names |
| `x402Network` / `parseX402Network` | `chainId` ↔ CAIP-2 `eip155:<chainId>` |
| `X402PaymentRequired`, `X402PaymentRequirements`, `X402PaymentPayload`, `X402ResourceInfo`, `X402VerifyResponse`, `X402SettleResponse`, `X402SupportedResponse`, `X402SupportedKind`, `Eip3009Authorization`, `ExactPaymentPayload`, `TransferPaymentPayload`, `CurvyDeployment` | x402 v2 wire types, plus the Curvy contract addresses the broadcaster reports |
| `createBroadcasterClient({ url?, fetch?, timeoutMs?, headers? })` | `network(chainId)` (`GET /portal/networks/:chainId`), `registerPayment` (`POST /portal/payments`), `status` (`GET /portal/status`) on the portal broadcaster; throws `BroadcasterError`. Types: `BroadcasterClient`, `CurvyNetwork`, `CurvyCurrency`, `PortalPaymentRegistration`, `PortalPaymentStatus`, `PortalPaymentState` |
| `TERMINAL_PORTAL_FAILURES` | Portal states the broadcaster never leaves (`compliance_failed`, `expired`, `failed`) |
| `createFacilitatorClient({ url?, fetch?, timeoutMs?, headers? })` | `supported`, `verify`, `settle` against an x402 v2 facilitator (Curvy's by default) on plain `fetch`; throws `FacilitatorError` on unexpected replies |
| `createX402Payer({ signer?, send?, maxAmount, fetch?, network?, asset?, now?, retryForMs?, retryEveryMs? })` | Agent-side `fetch` that pays one 402 up to `maxAmount`: `exact` with `signer`, `curvy-transfer` with `send` (`exact` preferred when both are offered); also `pay(required)`. `now` is the clock for `validBefore` |
| `selectExactRequirements`, `createExactPayment`, `selectTransferRequirements`, `createTransferPayment`, `encodePaymentSignature`, `decodePaymentRequired`, `decodePaymentResponse`, `paymentRequiredFrom`, `paymentResponseFrom` | Payer building blocks. Types: `X402Signer`, `X402TransferSender`, `Eip3009TypedData` |
| `parsePaymentRequired`, `parsePaymentRequirements`, `parseResourceInfo`, `parsePaymentPayload`, `parseExactPayload`, `parseTransferPayload`, `parseVerifyResponse`, `parseSettleResponse`, `parseSupportedResponse`, `parseCurvyDeployment` | Validate untrusted JSON into the wire types |
| `requirementsEqual`, `canonicalJson` | Compare requirement rows regardless of key order and address casing |
| `parseUint`, `parseAddress`, `parseHex` | Low-level parse helpers |
| `transferWithAuthorizationTypes`, `eip3009Domain({ chainId, token, name, version })` | EIP-712 types and domain payers sign for `exact` |
| `encodeBase64Json` / `decodeBase64Json` | Browser-safe codec for the `PAYMENT-*` headers |

See [x402 and the Payments SDK](./x402).

## Contracts (`/contracts`)

```ts
import {
  aggregatorAbi,
  pendingNotesAbi,
  portalFactoryAbi,
  vaultAbi,
} from "@0xcurvy/payments-sdk/contracts";
```

`pendingNotesAbi` is the same ABI as `aggregatorAbi`. `vaultAbi` includes the `getTokenId`, `depositFee` and `perTokenGasFees` reads used for fees.

## Constants

These are exported from the root entry only:

```ts
import {
  DEFAULT_CHECKOUT_COMPLETE_PATH,
  DEFAULT_PAYMENT_REQUEST_TTL_SECONDS,
  MAX_PAYMENT_REQUEST_TTL_SECONDS,
} from "@0xcurvy/payments-sdk";
// "/checkout/complete"
// 600
// 86400
```

`RECEIVING_KEYS_VERSION` (`"01"`) is exported from the root entry, `/merchant/keys` and `/merchant`.

## Types

The root entry exports these types: `PaymentIntent`, `SignedPaymentIntent`, `PaymentRecipient`, `MerchantKeySet`, `PublishedSigner`, `PaymentNote`, `PaymentReceipt`, `PaymentReadClient`, `PaymentReceiptClient` and `PaymentPublicClient`. The configuration and verification types (`PaymentSDK`, `PaymentSDKConfig`, `BoundVerifyPaymentParameters`, `VerifyPaymentParameters`, `PaidWhen`, `PaymentVerification`, `VerifiedPayment`, `PaymentStatus`, `PaymentVerificationErrorCode`, `PaymentVerifyClient`, `PaymentRecord`, `RecipientParameters`) come from `/merchant`. `RecipientParameters` is the `receivingKeys`-or-`recipient` choice shared by `initialize`, `createPaymentRequest`, `buildPaymentRequest` and `createX402Merchant`. `ChainFees`, `FeeBreakdown` and `PaymentRail` are exported from the root entry and `/economics`; the x402 types from `/x402` and `/x402/merchant`.

## Related packages

| Package | Role |
| --- | --- |
| `@0xcurvy/rs-core-wasm@0.1.0-rc.4` | Peer for `/merchant` and `/x402/merchant` note derivation and verification |
| `@x402/fetch`, `@x402/evm` | Optional standard x402 client packages for paying agents; the merchant side needs none of them |
| `@0xcurvy/curvy-sdk` | Wallet SDK. Do not use it for shop checkout. |

For agent payments (`exact` and `curvy-transfer`), see [x402 and the Payments SDK](./x402). Everything x402 lives in `@0xcurvy/payments-sdk/x402` and `@0xcurvy/payments-sdk/x402/merchant`; there is no separate x402 package to install.
