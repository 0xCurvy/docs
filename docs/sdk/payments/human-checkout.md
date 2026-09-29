---
title: Human checkout with the Payments SDK
description: Create signed Curvy payment requests, publish signers, and confirm payments on your shop.
---

# Human checkout

Curvy hosts the **payment page**. Your shop creates a signed deposit request (without a recovery address), redirects the buyer to Curvy, and confirms the payment with `verifyPayment` using the attempt’s **payment reference**.

::: warning Minimum amount: USD 0.50
Curvy's portal broadcaster settles human checkout. It fails any payment worth less than **USD 0.50**, and it only checks this *after* the buyer has sent the funds. The buyer then has to reclaim them to their recovery wallet from the checkout page, and you are not paid. Only create requests of $0.50 or more. For smaller amounts, see [choosing a rail for small amounts](./fees#choosing-a-rail-for-small-amounts).

Protocol fees (a percentage fee plus fixed portal-deployment and note-commitment fees) are deducted from the note, so you receive slightly less than `amount`. Use `quotePayment({ …, rail: "portal" })` to see how much. See [Fees and minimum amounts](./fees).
:::

## Keys

| Material | Where | Purpose |
| --- | --- | --- |
| Spending / viewing keys | Offline | Later spend of your Curvy balance — never on the shop |
| Public `S`, `V`, BabyJubjub | Shop backend | Derive one-time payment destinations |
| Request signing key (secp256k1) | Shop backend | Sign the checkout payload |
| Signer address list | `/.well-known/curvy-payments.json` | Let Curvy verify the signature |

A breach of public receiving keys plus the request signing key can mint fraudulent **links to you**. It cannot steal your shielded balance or redirect an existing payment.

## Creating a payment

```ts
import { initialize } from "@0xcurvy/payments-sdk/merchant";
import { signPaymentIntent } from "@0xcurvy/payments-sdk/intent";
import { buildCheckoutUrl } from "@0xcurvy/payments-sdk/transport";

const sdk = initialize({
  recipient: {
    S: process.env.CURVY_PUBLIC_S!,
    V: process.env.CURVY_PUBLIC_V!,
    babyJubjubPublicKey: process.env.CURVY_PUBLIC_BABYJUBJUB!,
  },
  chainId,
  merchantOrigin: "https://shop.example",
  confirmations: 12,
  ttlSeconds: 600,
});

const request = await sdk.createPaymentRequest({
  amount: orderTotal,
  token: usdcAddress,
});

const signed = await signPaymentIntent(request, (typedData) =>
  yourSigner.signTypedData(typedData),
);

const checkoutUrl = buildCheckoutUrl(CURVY_CHECKOUT_URL, signed);
```

The first argument to `buildCheckoutUrl` is the URL of Curvy's hosted checkout page, which Curvy provides during onboarding. The signed package is written into the URL fragment. Any path and query on the checkout URL are kept.

Store the payment reference (`ephemeralKeyX`, `ephemeralKeyY`) when you create the request — for example in your database or in an httpOnly session cookie, whichever fits your stack. Do not put your payment reference in the signed checkout package.

## Confirming a payment

After checkout, the customer is redirected to `{merchantOrigin}{checkoutCompletePath}#txHash=…`. Call `verifyPayment` with the stored payment reference and the hash from the URL fragment:

```ts
const confirmed = await sdk.verifyPayment({
  publicClient,
  aggregatorAddress: CURVY_AGGREGATOR,
  ephemeralKey: [ephemeralKeyX, ephemeralKeyY],
  txHash: shieldTxHash,
});
```

`CURVY_AGGREGATOR` is the aggregator contract on your chain; see [Production values](./getting-started#production-values). See [Confirming payments](./confirming-payments) for optional `txHash` omission and retry guidance.

## Publishing your signing keys

Serve this from your origin (CORS `*`, short cache):

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

Build the document with `buildMerchantKeySet` from `@0xcurvy/payments-sdk/merchant/keys`.

## What you sign

EIP-712 domain name `"Curvy Payments"`, version `"1"`. If `checkoutCompletePath` is omitted from input, it defaults to `/checkout/complete` and is **always** present in the typed data.

| Field | Meaning |
| --- | --- |
| `ephemeralKeyX` / `ephemeralKeyY` | **Payment reference** — the on-chain identity for this attempt |
| `token` | Asset the customer must send |
| `amount` | Exact amount (token units) |
| `chainId` | Network |
| `ownerHash` | Binds the portal destination to your identity |
| `viewTag` | Protocol discovery aid |
| `merchantOrigin` | Your origin for the return |
| `checkoutCompletePath` | Absolute path on that origin (optional; default `/checkout/complete`) |
| `expiry` | Unix seconds |

No `recovery` and no `paymentId`. Recovery is chosen on Curvy’s page (connected wallet by default).

## Return URL

After a successful shield, checkout navigates top-level to:

```
{merchantOrigin}{checkoutCompletePath}#txHash=<shield tx>
```

| Piece | Value |
| --- | --- |
| Origin | Signed `merchantOrigin` |
| Path | Signed `checkoutCompletePath`, or `/checkout/complete` |
| Query | Empty |
| Fragment | `txHash=` plus the **shield** hash (not the customer’s transfer) |

The hash is a hint. Confirm with `verifyPayment` on your server — see [Confirming payments](./confirming-payments).

## Related

- [Getting started](./getting-started)
- [Confirming payments](./confirming-payments)
- [Fees and minimum amounts](./fees)
- [Accepting payments for businesses](/for-businesses/accepting-payments)
