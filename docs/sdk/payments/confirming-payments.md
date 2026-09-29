---
title: Confirming payments
description: Verify Curvy payments with verifyPayment, reconcile in the background, and understand fees and net amounts.
---

# Confirming payments

A payment is confirmed when `verifyPayment` returns `paid` for the request **you stored**. Do not trust a transaction hash, a checkout page status or a broadcaster status on its own.

## What `verifyPayment` checks

The Curvy aggregator emits a `PendingNotes` event for every shield. Each note in it carries a `noteId`, the payment reference `R`, a `viewTag`, a vault token id and a net amount. The `noteId` is a hash of the owner, the net amount and the token. `R` and `viewTag` are chosen by whoever shields, and they are not part of `noteId`.

So a buyer can shield a small amount into a note **they** own and put **your** `R` on it. Matching `R` alone would accept that fake. `verifyPayment` accepts a note only when all of these hold:

1. The event was emitted by the aggregator you configured.
2. The note carries the stored request’s `R` and `viewTag`.
3. Its `noteId` recomputes from the stored `ownerHash`, the note’s amount and its token. That proves the note is yours.
4. Its token is the vault token id of `request.token`.
5. Its net amount is at least what `request.amount` yields after Curvy’s fees at the shield block (see [Fees](#fees-and-net-amount)).
6. The shield block has at least `confirmations` blocks, counting itself.
7. Only with `paidWhen: "committed"`: the note is in a `CommittedNotes` batch whose block also has `confirmations` blocks (see [When a payment counts as paid](#when-a-payment-counts-as-paid-paidwhen)).

`verifyPayment` is exported from `@0xcurvy/payments-sdk/merchant` and is Node-only, because it recomputes `noteId` with rs-core. `initialize()` returns a bound `sdk.verifyPayment`, which uses `confirmations` and `paidWhen` from the config. Neither can be overridden per call. For agent payments, `createX402Merchant` runs the same check in the background (see [x402](./x402#_3-shield-and-confirm)).

## Calling it

Both calls start from the attempt’s stored payment record (see [Getting started](./getting-started#_2-create-store-sign-and-redirect)):

```ts
import { parsePaymentRecord, serializePaymentRecord } from "@0xcurvy/payments-sdk/merchant";

const record = parsePaymentRecord(attempt.record);
```

With the hint from the return URL:

```ts
const result = await sdk.verifyPayment({
  publicClient,
  aggregatorAddress: AGGREGATOR_ADDRESS,
  request: record.payment.intent, // exactly what createPaymentRequest returned, as signed
  txHash,                         // untrusted hint; only this transaction is examined
});
```

Block confirmations are configured once on `initialize({ confirmations: … })`; you do not pass them again here. `AGGREGATOR_ADDRESS` is the aggregator contract on your chain (`0xe51924cef003a654ec9735c4d97f5d4862cbcbb1` on Arbitrum One; see [Production values](./getting-started#production-values)).

Without a hint, from a background job:

```ts
const result = await sdk.verifyPayment({
  publicClient,
  aggregatorAddress: AGGREGATOR_ADDRESS,
  request: record.payment.intent,
  fromBlock: record.fromBlock, // block number stored when the request was created
});
```

Write each result you accept back into the same value, `serializePaymentRecord({ ...record, verification: result })`, and keep it whole. Never let a later `not_found` overwrite a note already found.

Without `txHash`, the SDK scans aggregator `PendingNotes` logs from `fromBlock` to the latest block and keeps the notes that belong to the request (checks 1–3). Look-alike notes are skipped. It then judges token, amount and confirmations on each of them and reports the first note that is `paid`, else the first that is `confirming`. Only when none pays does it report the earliest match, as `underpaid` or `wrong_token`. With `paidWhen: "shielded"` this is simply the earliest note that pays. With `paidWhen: "committed"` a later note that is already committed wins over an earlier one still waiting for its batch, because the batch prover chooses which pending notes it commits first. With `txHash` the same rule applies to the notes inside that one transaction. `fromBlock` is required when `txHash` is omitted, and ignored when it is present.

The standalone `verifyPayment({ ..., confirmations, paidWhen })` from `/merchant` takes `confirmations` and `paidWhen` directly.

## When a payment counts as paid (`paidWhen`)

A payment goes through two stages on chain:

1. **Shielded.** The buyer’s transaction puts the money into the Curvy vault as a note that only your keys can spend. From here the money is safe: the buyer cannot take it back and nobody else can spend it. But your wallet cannot spend it **yet**.
2. **Committed.** Curvy’s batch prover adds pending notes to the notes tree in batches, and the aggregator emits `CommittedNotes`. From this point your wallet can spend the note.

`paidWhen` picks the stage at which `verifyPayment` says `paid`:

| `paidWhen` | `paid` means | Pick it when |
| --- | --- | --- |
| `"shielded"` (default) | The note has `confirmations` blocks. The money is safe in the vault. | You ship goods or grant access. This is the fastest answer and enough for most shops. |
| `"committed"` | Also: the note is in a `CommittedNotes` batch whose block also has `confirmations` blocks. The money is spendable. | You spend or forward the money right after the sale (pay a supplier, move it to an exchange), or you want `paid` to mean “in my spendable balance”. |

With `"committed"` a payment stays `confirming` after it has enough confirmations, until the batch prover commits it. How long that takes depends on the prover, not on your settings, so let your UI and your reconciler treat `confirming` as a normal wait.

`underpaid`, `wrong_token` and `not_found` do not depend on `paidWhen`. `payment.committed` is reported in both modes.

In a later protocol version (v4), `"committed"` will likely become required. Code that already handles a long `confirming` stage will not need to change.

```ts
const sdk = initialize({ /* ... */ confirmations: 12, paidWhen: "committed" });
```

## Statuses

`verifyPayment` returns `{ status, payment }`. `payment` is `null` only when the status is `not_found`.

| `status` | Meaning | What to do |
| --- | --- | --- |
| `not_found` | No matching note yet. With a `txHash`, the transaction is still pending. | Keep polling. |
| `confirming` | The right note, token and amount, but fewer than `confirmations` blocks so far, or (with `paidWhen: "committed"`) not yet committed | Show “confirming” and poll. |
| `paid` | The right note, token and amount, with enough confirmations (and, with `paidWhen: "committed"`, committed) | Fulfil the order **once**. Record `payment.txHash`, `noteId` and `netAmount`. |
| `underpaid` | The note is yours, but `netAmount < minimumNetAmount` | Do not fulfil. Resolve it with the buyer manually. |
| `wrong_token` | The note is yours, but in a different vault token | Do not fulfil. Resolve it with the buyer manually. |

`underpaid` and `wrong_token` are reported as soon as the note is seen, before it has enough confirmations. A reorg can still remove the note, so keep reconciling until you close the order.

`payment` is a `VerifiedPayment`:

| Field | Meaning |
| --- | --- |
| `txHash`, `blockNumber` | The shield transaction |
| `confirmations` | `latest − blockNumber + 1` when checked (`0n` if your RPC is behind) |
| `noteId` | The note that pays this request. Spend this one (see [One spendable note per request](#one-spendable-note-per-request)). |
| `vaultTokenId` | Vault token id of the note, not the ERC-20 address |
| `netAmount` | Amount credited to your note, after fees |
| `minimumNetAmount` | The net amount a gross payment of `request.amount` yields |
| `portalShield` | `true` when the note came through a Curvy portal (human checkout) |
| `committed` | Whether the note is already in a `CommittedNotes` batch, which makes it spendable in your wallet. `paid` needs it only with `paidWhen: "committed"`. |
| `siblingNoteIds` | Other notes this check saw that share this request’s `ownerHash`. For information only; `paid` does not depend on it. |

### One spendable note per request

Every note under one `ownerHash` has the same nullifier, so only one of them can ever be spent. A second note to the same request, such as a buyer’s mistaken extra transfer or a dust note someone else shields with your public `ownerHash`, `R` and `viewTag`, competes with the one that paid you. Spend the verified `payment.noteId`. If `siblingNoteIds` is not empty, escalate: do not let your wallet spend a sibling first. The list covers only what this check saw; a sibling can still be shielded later.

## Errors

When the SDK cannot produce a status, it throws `PaymentVerificationError` with a `code`:

| `code` | Meaning | What to do |
| --- | --- | --- |
| `TX_NOT_FOUND` | Your RPC does not know the hinted transaction | Your RPC may lag behind checkout’s. Retry for a short while, then drop the hint and rely on the scan. |
| `REVERTED` | The hinted transaction reverted | Reject the hint. |
| `NOT_A_SHIELD` | The hinted transaction emitted no `PendingNotes` from your aggregator | Reject the hint. |
| `UNRELATED` | The transaction shielded notes, but none pays this request | Reject the hint and do not poll it again. The order keeps reconciling. |
| `WRONG_CHAIN` | `publicClient` is not on `request.chainId` | Fix your configuration. |
| `MISSING_FROM_BLOCK` | Neither `txHash` nor `fromBlock` was given | Store `fromBlock` when you create the request. |
| `INVALID_INPUT` | Malformed request, address, hash, `confirmations`, `paidWhen` or `fromBlock` | Fix the caller. A stored request that no longer parses was altered, or was stored before the stricter parser. |

Other errors, such as RPC failures, are thrown as plain errors, not `PaymentVerificationError`. Retry them. A failed read at the shield block or a failed `eth_getLogs` names the block or block range in its message, with the RPC error as `cause`.

`verifyPayment` reads the vault and aggregator (`curvyVault`, `getTokenId`, `depositFee`, `perTokenGasFees`, `portalFactory`) **at the shield block**. Your RPC must serve contract state at that block. A pruned (non-archive) node keeps only recent state, which on a fast L2 such as Arbitrum can be minutes. Verifying a payment older than that fails on every retry, with an error saying the RPC must serve contract state at the shield block (the node’s own error, such as `missing trie node`, is the `cause`). Use an archive RPC, or at least verify each payment soon after it is shielded.

## Reconciliation

The return URL is a convenience. Your backend must work correctly without it:

- **On return:** your confirmation page posts `txHash` to your backend, which calls `verifyPayment` with the stored request. If the response is not final, the page should poll your order API. Do not show “expired” while an attempt is still being reconciled.
- **In the background:** a job, such as a timer or a queue worker, lists unfinished attempts and calls `verifyPayment({ ..., fromBlock })` for each one. This completes orders whose buyer closed the tab.
- **Idempotent:** once an attempt is `paid`, stop checking it and never fulfil twice. This also keeps log queries and historical reads off old blocks. Several attempts on one order are verified separately.
- **When to stop:** after `expiry` Curvy no longer registers or shields a payment for that request. A shield sent just before `expiry` can land a few blocks after it, so keep scanning until a short grace period after `expiry`, then close the attempt as unpaid.
- **RPC limits:** many providers cap `eth_getLogs` block ranges, and the scan is one `eth_getLogs` call from `fromBlock` to the latest block. Keep `fromBlock` recent (the block when the request was created), stop polling once an attempt is `paid`, and stop scanning closed attempts. The `committed` flag also queries logs from the shield block to the latest block, so re-checking an old payment can reach that cap. Old payments also need an archive RPC (see [Errors](#errors)).

## Fees and net amount

The buyer sends exactly `amount`. The Curvy vault takes its fees from that amount, and your note holds the rest:

```
netAmount = amount
          − amount × depositFee / 10000
          − pendingNoteCommitment
          − portalDeployment      (portal shields only, which is every human checkout)
```

- `depositFee` is in basis points: `vault.depositFee()`.
- `pendingNoteCommitment` and `portalDeployment` are per-token gas fees, in token units: `vault.perTokenGasFees(tokenId)`.
- `vault` is `aggregator.curvyVault()`.

`verifyPayment` reads these values at the shield block and returns the result as `minimumNetAmount`. It is floored at `1`. To quote a price before the sale, use `readChainFees` and `quotePayment({ …, rail: "portal" })` from `@0xcurvy/payments-sdk/economics` (see [Fees and minimum amounts](./fees)).

Consequences for pricing:

- **Set `amount` to the gross price the buyer pays.** You receive less. The fixed gas fees make up a larger share of small orders.
- Curvy’s broadcaster refuses to shield portals worth less than USD 0.50, and it checks only after the buyer has paid. Never create a smaller request (see [Fees and minimum amounts](./fees#minimum-amount-for-the-portal-broadcaster)).
- Fees are read at the shield block. If Curvy changes them after you created the request, the minimum follows the new fees.
- A buyer who pays more than `amount` gets `paid`, and the larger note is yours. Today Curvy shields the whole balance of the payment address when it shields, including tokens that arrived after screening (see [What is not ready yet](./human-checkout#what-is-not-ready-yet)).
- The percentage fee is rounded down. In rare cases a buyer who sends one base unit less than `amount` gets the same net amount, so the payment passes.

## Discovery hints (`/chain`)

`findNoteInReceipt(receipt, [ephemeralKeyX, ephemeralKeyY], aggregatorAddress)` from `/chain` is browser-safe. It returns `{ noteId, netAmount, token }` or `null`, where `token` is the **vault token id** (a `bigint`), not the ERC-20 address. It matches only `R`, so it is a **discovery hint** and does **not** prove you were paid. The checkout page uses it to know when to redirect. Your backend must use `verifyPayment`.

## Build the return URL yourself

To build the same URL checkout opens after a shield:

```ts
import { buildCheckoutCompleteUrl } from "@0xcurvy/payments-sdk/transport";

const url = buildCheckoutCompleteUrl(request, shieldTxHash);
// https://shop.example/checkout/complete#txHash=0x…
```

## Upgrading from 0.1.x

These changes apply to the released `0.1.0` and `0.1.1`:

- `verifyPayment` moved from `/chain` and the root entry to `/merchant`. `PaymentVerifyClient` moved with it, and it now also needs `getChainId` and `readContract`. A viem `PublicClient` has all of these.
- It takes the stored `request` in place of `ephemeralKey`, and it returns `{ status, payment }` instead of a boolean.
- `fromBlock` is required when you omit `txHash`. The old no-hash path scanned from block `0` and waited for `CommittedNotes`; pass `paidWhen: "committed"` to wait for the commit again.
- `parsePaymentIntent` now rejects out-of-range numbers and non-canonical decimals. Requests from `createPaymentRequest` still parse.

## Related

- [Human checkout](./human-checkout)
- [Fees and minimum amounts](./fees)
- [API surface](./api)
- [Portals](/for-the-curious/building-blocks/portals)
