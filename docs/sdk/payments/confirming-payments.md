---
title: Confirming payments
description: Verify Curvy payment evidence with verifyPayment from the Payments SDK.
---

# Confirming payments

Curvy’s evidence that a payment shielded successfully is a match between the return-url transaction hash and the **payment reference** you stored when creating the request. A client-supplied hash is untrusted until `verifyPayment` returns `true`.

## verifyPayment

`verifyPayment` returns a **boolean**:

- `true` — the shield transaction has enough block confirmations, or the note is batch-committed via `CommittedNotes`
- `false` — the payment is not yet confirmed or the receipt does not match this payment reference (keep polling)
- **throws** — malformed `txHash`, unknown hash, non-shield transaction, or reverted shield transaction

```ts
const confirmed = await sdk.verifyPayment({
  publicClient,
  aggregatorAddress: CURVY_AGGREGATOR,
  ephemeralKey: [ephemeralKeyX, ephemeralKeyY],
  txHash: shieldTxHash, // optional
});
```

Block confirmations are configured once on `initialize({ confirmations: … })` — you do not pass them again here. `CURVY_AGGREGATOR` is the aggregator contract on your chain (`0xe51924cef003a654ec9735c4d97f5d4862cbcbb1` on Arbitrum One; see [Production values](./getting-started#production-values)).

When `txHash` is omitted, the SDK checks only whether the payment reference’s note appears in aggregator `CommittedNotes` (batch settlement). When `txHash` is provided, the SDK validates the receipt, matches your payment reference in `PendingNotes`, checks block confirmations, and optionally detects batch commitment.

Retry `verifyPayment` on whatever schedule fits your application until it returns `true` or you give up waiting.

For lower-level control, use `findNoteInReceipt` directly on a receipt you already have.

## Build the return URL yourself

If you need the same URL checkout would open after a shield:

```ts
import { buildCheckoutCompleteUrl } from "@0xcurvy/payments-sdk/transport";

const url = buildCheckoutCompleteUrl(request, shieldTxHash);
// https://shop.example/checkout/complete#txHash=0x…
```

## Related

- [Human checkout](./human-checkout)
- [API surface](./api)
- [Portals](/for-the-curious/building-blocks/portals)
