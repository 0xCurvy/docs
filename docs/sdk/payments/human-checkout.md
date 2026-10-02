---
title: Human checkout with the Payments SDK
description: Create signed Curvy payment requests, publish signers, and confirm payments on your shop.
---

# Human checkout

In human checkout, Curvy hosts the **payment page** and your shop never shows a wallet UI. The steps are:

1. Your backend creates a payment request: a one-time destination for an amount and token. It signs the request and stores it.
2. You redirect the buyer to Curvy’s page. The signed request travels in the URL fragment.
3. Curvy’s page checks your signature against `/.well-known/curvy-payments.json` on your origin. The buyer then sends one ERC-20 transfer to a one-time payment address.
4. Before any money is sent, the page registers the payment with Curvy’s operator: when it shows the payment address for an exchange, or just before the buyer’s wallet sends. The operator waits for the funds, so the buyer can close the page. It then screens them and shields exactly your amount into a note that only you can spend. Anything sent above the amount stays at the payment address, and the buyer takes it back on the checkout page.
5. The buyer returns to your site with the shield transaction hash as a hint. Your backend confirms the payment with `verifyPayment` against the stored request.
6. Later, Curvy’s batch prover commits the note, and from then on your wallet can spend it. By default (`paidWhen: "shielded"`) `verifyPayment` says `paid` at step 5, once the money is safe in the vault; with `paidWhen: "committed"` it says `confirming` until this step. See [When a payment counts as paid](./confirming-payments#when-a-payment-counts-as-paid-paidwhen).

If a payment cannot complete, Curvy’s checkout gets the money back to the buyer. Your shop never holds those funds.

Your server stays part of the flow while a payment is in progress: checkout reads your key file, and the buyer returns to your completion page to settle or to start a fresh attempt. Today you write these routes yourself; keep each one a separate handler over the SDK calls, so a later SDK release can supply them, including a route Curvy’s checkout may call during payment.

See [Getting started](./getting-started) for the code, and for where each value comes from.

::: warning Minimum amount: USD 0.50
Curvy's portal broadcaster settles human checkout. It fails any payment worth less than **USD 0.50**, and it only checks this *after* the buyer has sent the funds. The buyer then has to reclaim them to their recovery wallet from the checkout page, and you are not paid. Only create requests of $0.50 or more. For smaller amounts, see [choosing a rail for small amounts](./fees#choosing-a-rail-for-small-amounts).

Protocol fees (a percentage fee plus fixed portal-deployment and note-commitment fees) are deducted from the note, so you receive slightly less than `amount`. Use `quotePayment({ …, rail: "portal" })` to see how much. See [Fees and minimum amounts](./fees).
:::

## Keys

| Material | Where | Purpose |
| --- | --- | --- |
| Spending / viewing keys | Offline, in your Curvy wallet | Spending your Curvy balance later. Never put them on the shop. |
| Public key for payments (one `01…` value: public `S`, `V`, BabyJubjub) | Shop backend (`CURVY_PAYMENTS_PUBLIC_KEY`) | Deriving one-time payment destinations. Copy it from the web app's **Payments** setup: the `CURVY_PAYMENTS_PUBLIC_KEY` line of the `.env` block in step 3. It is public (packing is not encryption): a leak moves no money. |
| Request signing key (secp256k1) | Shop backend, ideally a KMS/HSM | Signing the checkout payload. Create it with `npx @0xcurvy/payments-sdk@0.2.0-rc.2 create-signer` or `generateCheckoutSigningKey()` from `/merchant/keys`. |
| Signer address list | `/.well-known/curvy-payments.json` | Lets Curvy verify the signature |

In the first release, payments go to **the Curvy account you are signed in with**: copy its `CURVY_PAYMENTS_PUBLIC_KEY` value from the web app's Payments setup. That account is already registered and has a handle. Payments land in the same account as your personal funds, and anyone who holds that account's viewing key can see both. Separate business accounts come in a later release; switching then means putting the business account's value in your backend for new payments. Checkout itself never looks a handle up. Configure the value on your backend directly. It carries only the account's public keys, with a format version (`01`) and a checksum that refuses typos and cut-off copies; see [Receiving keys value](./api#receiving-keys-value). `recipient: { S, V, babyJubjubPublicKey }` also works in its place.

The **request signing key decides where buyers’ money goes.** Anyone who holds it can sign a request under your origin that sends future payments to a destination they control. Checkout will show that request as yours. The key cannot touch your shielded balance, and it cannot change a request that was already paid.

Treat it like a payment credential:

- Keep it in a KMS or HSM. `signPaymentIntent` takes any async `(typedData) => signature` adapter (see [Signing with a KMS or HSM](#signing-with-a-kms-or-hsm)).
- Publish it with a short `notAfter`.
- Remove it from the well-known file at once if it leaks.

## Creating a payment

```ts
const fromBlock = await publicClient.getBlockNumber();
const request = await sdk.createPaymentRequest({ amount: orderTotal });
const signed = await signPaymentIntent(request, (typedData) => signer.signTypedData(typedData));
await db.paymentAttempts.insert({
  orderId,
  record: serializePaymentRecord({ payment: signed, fromBlock, verification: null }),
});
const checkoutUrl = buildCheckoutUrl(signed);
```

[Getting started](./getting-started) defines `sdk`, `publicClient` and `signer`. `serializePaymentRecord` comes from `@0xcurvy/payments-sdk/merchant`. Here `orderTotal` is your order price in the token's base units (4 USDC is `4_000_000n`), and `db` is your own storage. The request charges in the token set in `initialize`, USDC by default; pass `token` to charge one request in another, such as `{ amount: orderTotal, token: "USDT" }` on mainnet.

`buildCheckoutUrl(signed)` writes the signed package into the URL fragment of Curvy's hosted checkout page, the Curvy web app's `/checkout` route at `https://app.curvy.box/checkout` (`CURVY_CHECKOUT_URL`). To send buyers to another checkout page, such as a staging app's `https://app.curvy.dev/checkout`, pass it first: `buildCheckoutUrl(checkoutUrl, signed)`. Any path and query on that URL are kept.

Storage rules:

- **Store one payment record per attempt, server-side.** `serializePaymentRecord({ payment, fromBlock, verification })` returns one versioned JSON string: the signed package, the block to scan from and the latest `verifyPayment` result. Keep it whole, in one column, and read it back with `parsePaymentRecord`, which refuses versions and fields it does not know. Do not split it into your own columns: later SDK versions add fields under a new record version. Your own order status can live beside it.
- Keep the record in a database, never only in a cookie. A cookie is controlled by the client, and a server-side reconciler cannot read it after the buyer closes the tab. The session cookie should carry only an opaque order id.
- One order can have several **attempts**. You need a new attempt after a payment that could not complete or an expired link, and checkout may start more in future (for example when the buyer switches wallets). Each attempt has its own record. Check every unpaid attempt of the order.
- Do not put your order id or any other commerce identifier in the signed package. The payment reference `R` (`ephemeralKeyX`, `ephemeralKeyY`) is already in it, and it is public.

### Link lifetime is the funding window

`ttlSeconds` (default `600`) sets `expiry` on the signed request. The whole flow must finish before that time:

- the checkout page registers the payment with Curvy, before the buyer sends anything;
- the buyer’s transfer arrives;
- Curvy screens the funds and shields them.

After `expiry`, Curvy no longer registers or shields the payment, and Curvy’s checkout gets the money back to the buyer. Exchange withdrawals are often slow. If you expect them, use a longer TTL, for example 30–60 minutes. The cost is that a signed link stays usable for longer.

**Keep requests short-lived.** The SDK refuses a `ttlSeconds` above **86400** (24 hours, `MAX_PAYMENT_REQUEST_TTL_SECONDS`): `initialize`, `createPaymentRequest` and `buildPaymentRequest` throw `ttlSeconds must be at most 86400 (24 hours)`. `signPaymentIntent` also refuses a request whose `expiry` is more than 24 hours away, however it was built, and checkout’s `verifyPaymentIntent` refuses one that lives longer than 24 hours plus 5 minutes of clock skew. Prefer minutes. When Curvy upgrades its payment contracts, a link signed before the switch and paid after it cannot complete, so short links keep that window small.

`verifyPayment` does not look at `expiry`. If a note does arrive late, it is still reported. Whether you accept a late payment is your decision.

## Tokens and other networks {#payments-from-other-networks}

A request takes every stablecoin Curvy takes on your network unless you name fewer: **USDC and USDT on mainnet**, USDC on testnet. The amount means the same in each, since both have 6 decimals. The buyer picks which one they pay in, and `verifyPayment` tells you which arrived as `payment.token`.

```ts
const sdk = initialize({
  environment: "mainnet",
  tokens: ["USDC"], // optional: only USDC (the default takes USDC and USDT)
  // …
});
// Per request: other tokens, the first one preferred.
const request = await sdk.createPaymentRequest({ amount: orderTotal, tokens: ["USDT", "USDC"] });
```

On mainnet, buyers can also pay in one of your tokens on another network where Curvy has a payment address, such as Base, Ethereum, Optimism, Polygon or BNB Chain. Curvy bridges the **same token** to Arbitrum One, never swaps it, and delivers it to you as usual.

**You absorb what bridging costs, the way you absorb card fees.** The buyer always pays exactly your price.

- **Up to 3% can be missing.** A payment on Arbitrum One that arrives up to 3% short still counts as paid, and `verifyPayment` reports what bridging cost you as `payment.shortfall`. See [Fees and net amount](./confirming-payments#fees-and-net-amount). Checkout offers another network only when its bridge is expected to cost less than that, and stablecoin bridges usually cost far less.
- **Mainnet only.** On testnet, checkout takes USDC on Ethereum Sepolia only.
- **No swaps.** A buyer holding only USDT can't pay a shop that takes only USDC, on any network.
- **The buyer pays their own network fee.** They pay the gas for their own wallet transaction; checkout shows it. Nothing else is added to your price.

## Publishing your signing keys

Serve this from your origin, with CORS `*` and a short cache:

```http
GET https://shop.example/.well-known/curvy-payments.json
Access-Control-Allow-Origin: *
Cache-Control: public, max-age=60
```

```json
{
  "version": 1,
  "signers": [
    {
      "address": "0xYourSignerAddress",
      "alg": "eip712-secp256k1",
      "notAfter": "2027-01-01T00:00:00.000Z"
    }
  ]
}
```

Build the document with `buildMerchantKeySet([{ address, notAfter }])` from `@0xcurvy/payments-sdk/merchant/keys`. `notAfter` is an ISO timestamp string or a `Date`. Checkout accepts a request only when its signer is listed and `notAfter` has not passed.

Optionally, name your shop's icon so checkout shows it next to your name: `buildMerchantKeySet(signers, { icon: "/curvy-icon.png" })` adds `"icon": "/curvy-icon.png"`. It must be an absolute path on the same origin to a square `.png` or `.webp` image (no SVG, no other host, no query), at most 256 characters; keep the image small. `parseMerchantKeySet` refuses any other value, and checkout then can't verify the link, so check the file after adding it. Without an icon, checkout shows the first letter of your name, or of your domain.

Optionally, give your shop's name too: `buildMerchantKeySet(signers, { name: "Overprint" })` adds `"name": "Overprint"`. Checkout shows it in the payment card, with your domain beside it, and uses it in its text ("Return to Overprint"); the receipt reads `Overprint (shop.example)`. The name is your own claim, so checkout never shows it without the domain it verified your signature against. It must be plain text of at most 60 characters, without leading or trailing spaces or control and text-direction characters. Without a name, checkout uses your domain.

Checkout fetches this file from the buyer’s browser, uncached, before it shows anything. Serve it over `https:` from a publicly reachable host, directly (no redirect), as small JSON, and test the URL from outside your network.

**Rotation:** add the new signer, and wait until every cached copy of the file lists it (at least your `max-age`, if a CDN or proxy caches it) before you sign with it. Checkout refuses a request whose signer it cannot find (`unknown payment intent signer`). Remove the old signer after every link it signed has passed its `expiry`. Remove a compromised signer at once.

## Signing with a KMS or HSM

A secp256k1 key held in a KMS, an HSM or an MPC service works with the current SDK. `signPaymentIntent` accepts any `(typedData) => Promise<Hex>` signer, but it checks only that the result is 65 bytes, not who signed. Providers return a DER or 64-byte `r‖s` signature with no recovery byte, so you need a small adapter. It must:

1. sign the 32-byte EIP-712 digest, `hashTypedData(typedData)` from viem, **as a digest**. With AWS KMS use `MessageType: "DIGEST"`, never `RAW`, which hashes again and gives a signature from a different address;
2. turn the output into a 65-byte signature: parse DER (or split the 64-byte `r‖s`), normalise `s` to the low half of the curve order, then find the recovery byte by trial recovery;
3. check that the signature recovers to the signer address you published, and throw otherwise. Without this self-check, a wrong key or key version is found only on the buyer’s checkout page (“unknown payment intent signer”).

The code below was tested locally on 2026-09-27 with viem 2.56.8 against `signPaymentIntent` and `verifyPaymentIntent`. The “KMS” was an OpenSSL-generated secp256k1 key exported as SPKI, with signatures fed in as DER and as raw `r‖s`, with low and high `s`. All were accepted by the verifier, the output was byte-identical to viem’s `signTypedData`, and a key that did not match the published signer threw at the merchant. **No real KMS, HSM or MPC service was called.**

```ts
import type { PaymentIntentSigner } from "@0xcurvy/payments-sdk/intent";
import { type Address, bytesToHex, hashTypedData, hexToBytes, isAddressEqual,
  keccak256, numberToHex, recoverAddress, serializeSignature } from "viem";

const N = 0xfffffffffffffffffffffffffffffffebaaedce6af48a03bbfd25e8cd0364141n; // secp256k1 order
const SPKI_SECP256K1_PREFIX = "3056301006072a8648ce3d020106052b8104000a034200";

/** Address from a DER SPKI secp256k1 public key (88 bytes, uncompressed point), as AWS GetPublicKey returns. */
export function addressFromSpki(spki: Uint8Array): Address {
  const hex = bytesToHex(spki).slice(2);
  if (hex.length !== 176 || !hex.startsWith(SPKI_SECP256K1_PREFIX) || hex.slice(46, 48) !== "04")
    throw new Error("expected a DER SPKI secp256k1 key with an uncompressed point");
  return `0x${keccak256(`0x${hex.slice(48)}`).slice(-40)}` as Address;
}

/** Strict DER ECDSA-Sig-Value parser. */
export function parseDerSignature(der: Uint8Array): { r: bigint; s: bigint } {
  let i = 0;
  const byte = () => { if (i >= der.length) throw new Error("truncated DER"); return der[i++]!; };
  if (byte() !== 0x30) throw new Error("DER signature must be a SEQUENCE");
  const len = byte();
  if (len & 0x80 || len !== der.length - 2) throw new Error("bad DER sequence length");
  const int = () => {
    if (byte() !== 0x02) throw new Error("DER component must be an INTEGER");
    const l = byte();
    if (l === 0 || l > 33 || i + l > der.length) throw new Error("bad DER integer length");
    const b = der.slice(i, (i += l));
    if (b[0]! & 0x80) throw new Error("negative DER integer");
    if (l > 1 && b[0] === 0 && !(b[1]! & 0x80)) throw new Error("non-minimal DER integer");
    return BigInt(bytesToHex(b));
  };
  const r = int(), s = int();
  if (i !== der.length || r <= 0n || r >= N || s <= 0n || s >= N) throw new Error("bad DER signature");
  return { r, s };
}

/** Any digest signer: AWS DIGEST, GCP digest.sha256, Azure ES256K, PKCS#11 CKM_ECDSA, MPC raw signing. */
export function createDigestPaymentIntentSigner(o: {
  expectedSigner: Address; // the address published in /.well-known/curvy-payments.json
  signDigest: (digest: Uint8Array) => Promise<Uint8Array>; // DER, or raw 64-byte r||s
}): PaymentIntentSigner {
  return async (typedData) => {
    const digest = hashTypedData(typedData);
    const out = await o.signDigest(hexToBytes(digest));
    let { r, s } = out.length === 64
      ? { r: BigInt(bytesToHex(out.slice(0, 32))), s: BigInt(bytesToHex(out.slice(32))) }
      : parseDerSignature(out);
    if (s > N >> 1n) s = N - s; // low-s (EIP-2); the parity is found below
    for (const yParity of [0, 1] as const) {
      const signature = serializeSignature({ r: numberToHex(r, { size: 32 }), s: numberToHex(s, { size: 32 }), yParity });
      if (isAddressEqual(await recoverAddress({ hash: digest, signature }), o.expectedSigner)) return signature;
    }
    throw new Error(`KMS signature does not recover to the published signer ${o.expectedSigner}`);
  };
}
```

Wiring for AWS KMS. **This part was not run against AWS.**

```ts
import { GetPublicKeyCommand, KMSClient, SignCommand } from "@aws-sdk/client-kms";

const kms = new KMSClient({});
const KeyId = process.env.CHECKOUT_SIGNER_KMS_KEY_ID!; // pin a specific key, not an alias that can move
const { PublicKey } = await kms.send(new GetPublicKeyCommand({ KeyId }));
const expectedSigner = addressFromSpki(PublicKey!); // publish this address with buildMerchantKeySet
const kmsSigner = createDigestPaymentIntentSigner({
  expectedSigner,
  signDigest: async (Message) =>
    (await kms.send(new SignCommand({ KeyId, Message, MessageType: "DIGEST", SigningAlgorithm: "ECDSA_SHA_256" }))).Signature!,
});
const signed = await signPaymentIntent(request, kmsSigner);
```

Provider notes. These come from the providers’ documentation; none of these services was called in testing.

| Provider | Key type | Digest signing | Output | Automatic rotation |
| --- | --- | --- | --- | --- |
| AWS KMS | `ECC_SECG_P256K1` ([key specs](https://docs.aws.amazon.com/kms/latest/developerguide/symm-asymm-choose-key-spec.html)) | `MessageType: "DIGEST"` ([Sign](https://docs.aws.amazon.com/kms/latest/APIReference/API_Sign.html)) | DER; low-s not documented | None for asymmetric keys ([rotation](https://docs.aws.amazon.com/kms/latest/developerguide/rotate-keys.html)) |
| Google Cloud KMS | `EC_SIGN_SECP256K1_SHA256` ([algorithms](https://docs.cloud.google.com/kms/docs/algorithms)) | `digest` field ([signatures](https://docs.cloud.google.com/kms/docs/create-validate-signatures)) | DER | None for asymmetric keys ([rotation](https://docs.cloud.google.com/kms/docs/key-rotation)) |
| Azure Key Vault, Managed HSM | `P-256K`, algorithm `ES256K` ([Key Vault](https://learn.microsoft.com/en-us/azure/key-vault/keys/about-keys-details), [Managed HSM](https://learn.microsoft.com/en-us/azure/key-vault/managed-hsm/about-keys-details)) | Sign takes a hash ([sign](https://learn.microsoft.com/en-us/rest/api/keyvault/keys/sign/sign?tabs=HTTP)) | Raw `r‖s` (from a secondary source) | **Yes**, rotation policies: pin the key version |
| HashiCorp Vault Transit | No secp256k1 ([Transit API](https://developer.hashicorp.com/vault/api-docs/secret/transit)) | — | — | — |

PKCS#11 HSMs (`CKM_ECDSA`) and MPC services that sign a raw secp256k1 digest fit the same `signDigest` shape; their output formats were not checked.

**Rotation with a vault.** A new key version is a new key and a new address. Publish it, wait until every cached copy of the key file lists it, then sign with it, and pin the key version in your adapter. Automatic rotation would start signing with an unpublished key. Tie `notAfter` to your rotation schedule.

A KMS or HSM can hold **only this checkout signing key**. Your Curvy spending and viewing keys cannot live there: keep them in your Curvy wallet, offline from the shop. Only `eip712-secp256k1` signers are accepted, so P-256, Ed25519 and contract (ERC-1271) signers are not supported yet.

## What you sign

The request is EIP-712 typed data. The domain has exactly three fields, and no `verifyingContract` or `salt`:

```ts
{ name: "Curvy Payments", version: "1", chainId: request.chainId }
```

The primary type, with the fields in this order:

```
PaymentIntent(address token,uint256 amount,uint256 chainId,uint256 ownerHash,uint256 ephemeralKeyX,uint256 ephemeralKeyY,uint16 viewTag,string merchantOrigin,string checkoutCompletePath,uint64 expiry)
```

With a `description`, the primary type is `DescribedPaymentIntent`: the same fields in the same order, then `string description`. It is a separate type so that a description can't be added to a signed intent or removed from one.

When the request takes more than one token, the primary type is `MultiTokenPaymentIntent`: the same fields in the same order, then `string description` (empty when the request has none) and `address[] tokens`. It is a separate type for the same reason: a token can't be added to a signed request.

If you sign outside TypeScript, for example through a KMS, reproduce this exactly. `buildPaymentIntentTypedData(request)` from `/intent` returns the payload `signPaymentIntent` signs.

| Field | Type | Meaning |
| --- | --- | --- |
| `token` | `address` | ERC-20 the customer sends: the first of `tokens` when there are several |
| `amount` | `uint256` | Gross amount the customer sends, in token base units. You receive this minus Curvy fees (see [Fees](./confirming-payments#fees-and-net-amount)). |
| `chainId` | `uint256` | Network. It is also in the domain. |
| `ownerHash` | `uint256` | Binds the note and the portal to your receiving identity |
| `ephemeralKeyX` / `ephemeralKeyY` | `uint256` | **Payment reference** `R`. It is public and is not proof of payment on its own. |
| `viewTag` | `uint16` | Lets your wallet find the note |
| `merchantOrigin` | `string` | Your origin for the return |
| `checkoutCompletePath` | `string` | Absolute path on that origin (default `/checkout/complete`) |
| `expiry` | `uint64` | Unix seconds: the end of the funding window |
| `description` | `string` | Optional. What the buyer is paying for, at most 120 characters of plain text. Checkout shows it and prints it on the buyer's receipt. |
| `tokens` | `address[]` | Only when the request takes more than one token: all of them, `token` first, each once. See [Tokens and other networks](#payments-from-other-networks). |

There is no refund field and no `paymentId`. What happens to the money if a payment cannot complete is handled on Curvy’s checkout page, not in your signed package.

The domain version is `"1"` today. The format is versioned so that a later checkout can refuse a retired version; `parsePaymentIntent` rejects any field it does not know.

## Return URL

After a successful shield, checkout navigates the top-level window to:

```
{merchantOrigin}{checkoutCompletePath}#txHash=<shield tx>
```

| Piece | Value |
| --- | --- |
| Origin | Signed `merchantOrigin` |
| Path | Signed `checkoutCompletePath`, or `/checkout/complete` |
| Query | Empty |
| Fragment | `txHash=` plus the **shield** hash (not the customer’s transfer) |

`buildCheckoutCompleteUrl(request, txHash)` from `/transport` builds the same URL. The hash is only a hint. Your page should send it to your backend, which calls `verifyPayment` with the stored request. Keep retrying until the order reaches a final state. With `paidWhen: "committed"`, `confirming` lasts until the next batch commit, so word your page as “confirming your payment”, not as a block count. Your background reconciler must also finish the order without the hint. See [Confirming payments](./confirming-payments).

## Failed funding and new attempts

If Curvy refuses the funding source, or the link expires before shielding, the payment cannot complete: your order stays unpaid, and Curvy’s checkout gets the money back to the buyer. Your shop never holds those funds. A retry needs a **new** attempt with a new request; never reuse the old one.

Curvy screens the address that sent the largest transfer, then shields exactly the request's `amount`. Anything sent above it stays at the payment address, and checkout lets the buyer take it back. `verifyPayment` reports the note that was actually shielded.

### Fresh payment attempts

After a payment that could not complete, or an expired link, checkout’s **Return for a fresh payment** button navigates the top-level window to your completion page:

```
{merchantOrigin}{checkoutCompletePath}#retry=<ephemeralKeyX>
```

`ephemeralKeyX` is the `R` of the attempt the buyer is leaving; `buildCheckoutRetryUrl(request)` from `/transport` builds this URL. Checkout does not call your order API, so you need no cross-site cookies and no credentialed CORS. Your completion page runs on your origin, where the session cookie is first-party. When it sees `#retry=`, it should:

1. read the value and remove the fragment from the address bar (`history.replaceState`), so a reload cannot create another attempt;
2. load the order, and only when that `R` is the order’s **latest** attempt and the order is still unpaid, create a new attempt with a same-origin request to your backend, then `location.replace` to the new checkout URL;
3. otherwise show the order as usual, with a retry button. Any site can link to `#retry`, so never create an attempt for an `R` that is not the latest one.

Require a JSON body on the route that creates attempts, so a cross-site form post cannot create them.

Always confirm payments with `verifyPayment`, never with checkout’s status.

## Related

- [Getting started](./getting-started)
- [Confirming payments](./confirming-payments)
- [Fees and minimum amounts](./fees)
- [Accepting payments for businesses](/for-businesses/accepting-payments)
