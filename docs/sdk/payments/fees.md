---
title: Fees and minimum amounts
description: How Curvy protocol fees are charged per payment rail, how to quote them with @0xcurvy/payments-sdk/economics, and the portal broadcaster's minimum amount for human checkout and x402.
---

# Fees and minimum amounts

Every Curvy payment ends as a shielded **note** credited to you. Protocol fees are deducted from that note when it is created: the customer pays the **gross** amount, and you receive the **net** amount. You do not pay fees separately and you do not add them on top of the price.

## Fee model

The Curvy vault stores three fee values for each token:

| Fee | Kind | Charged on |
| --- | --- | --- |
| `depositFee` | Percentage of the gross amount, in basis points (1 bp = 0.01%) | Every note |
| `portalDeployment` | Fixed amount in token base units | Only payments that arrive through a one-time entry portal |
| `pendingNoteCommitment` | Fixed amount in token base units | Every note |

```
net = gross − floor(gross × depositFeeBps / 10 000) − portalDeployment (portal rail only) − pendingNoteCommitment
```

The values are set on chain for each network and token, and they can change. Read them from the vault at runtime. Do not hard-code them.

::: warning Fees differ per network and token
The three values are stored in the Curvy vault of each network and can be changed by governance. Always call `readChainFees` against the network and token you actually accept payments on (the vault address is in [Production values](./getting-started#production-values)).
:::

## Which rail pays what

The SDK calls the route a payment takes to the aggregator a `PaymentRail`:

| Rail | Used by | Percentage fee | `portalDeployment` | `pendingNoteCommitment` |
| --- | --- | :---: | :---: | :---: |
| `"portal"` | [Human checkout](./human-checkout), [x402](./x402) (`exact` and `curvy-transfer`) | ✓ | ✓ | ✓ |
| `"direct"` | A shield straight into the vault with no entry portal | ✓ | — | ✓ |

On the portal rail, each payment deploys its own single-use entry portal, which is why it pays the extra `portalDeployment` fee. The direct rail skips that fee because nothing is deployed; no Payments SDK product currently uses it, but `quotePayment` supports it for wallets that shield directly.

## Quoting fees in code

The fee helpers live in `@0xcurvy/payments-sdk/economics`. The root barrel `@0xcurvy/payments-sdk` also exports them. They are browser-safe and need only a viem public client.

```ts
import { createPublicClient, http } from "viem";
import {
  minimumPaymentAmount,
  quotePayment,
  readChainFees,
} from "@0xcurvy/payments-sdk/economics";

const publicClient = createPublicClient({ chain, transport: http(RPC_URL) });

// 1. Read the vault's current fees for the token you accept.
const fees = await readChainFees({
  publicClient,
  vaultAddress: CURVY_VAULT,
  token: usdcAddress,
  // blockNumber: shieldBlock, // optional: fees as of a past block
});
// { depositFeeBps: bigint, portalDeployment: bigint, pendingNoteCommitment: bigint }

// 2. Quote a price on a rail.
const quote = quotePayment({ grossAmount: 10_000_000n, fees, rail: "portal" });
// {
//   depositFeeBps, percentageFee, portalDeployment, pendingNoteCommitment,
//   totalFees, netAmount
// }  ← decimal strings in token base units

// 3. Smallest gross amount that leaves at least `minNetAmount` in your note.
const floor = minimumPaymentAmount({ fees, rail: "portal", minNetAmount: 1n });
```

`readChainFees` reads the vault's `getTokenId`, `depositFee` and `perTokenGasFees`. It throws if the token is not registered in the vault.

| Export | Returns |
| --- | --- |
| `readChainFees({ publicClient, vaultAddress, token, blockNumber? })` | `ChainFees` (`depositFeeBps`, `portalDeployment`, `pendingNoteCommitment`, all `bigint`) |
| `quotePayment({ grossAmount, fees, rail })` | `FeeBreakdown` for that rail. The portal fee is only included when `rail` is `"portal"` |
| `feeBreakdown(gross, depositFeeBps, portalDeployment, pendingNoteCommitment)` | The same `FeeBreakdown` from positional values. Pass `0n` as `portalDeployment` for the direct rail |
| `minimumPaymentAmount({ fees, rail, minNetAmount? })` | Smallest gross `bigint` whose net is at least `minNetAmount` (default `1n`) |

To charge a price that nets you an exact amount, use `minimumPaymentAmount({ fees, rail, minNetAmount: desiredNet })` as the gross price.

::: tip Reconciling a payment
The net amount actually credited is emitted in the aggregator's `PendingNotes` event. `findNoteInReceipt` from `@0xcurvy/payments-sdk/chain` returns it as `netAmount` for the shield transaction. See [Confirming payments](./confirming-payments).
:::

## Minimum amount for the portal broadcaster

`minimumPaymentAmount` gives you the **on-chain** floor only. Every payment the portal broadcaster shields, human checkout and x402 alike, also has an **off-chain** minimum:

::: danger Human checkout: at least $0.50
Curvy's portal broadcaster settles human-checkout portals. It fails any portal whose funded value is **below USD 0.50**. The check runs **after** the customer has already sent the funds to the portal. The payment then never reaches you, and the customer has to reclaim the funds to their recovery wallet from the checkout page.

Never create a human-checkout payment request worth less than $0.50. Add a margin if the token's USD price can move.

The check is part of the broadcaster's compliance step and applies on mainnets. On a testnet whose compliance provider does not support testnets, the compliance step is skipped, and the minimum with it. Don't rely on that: size requests for the mainnet rule.
:::

The effective minimum on a rail is the larger of the on-chain floor and any off-chain minimum:

| Rail | Off-chain minimum | Effective minimum |
| --- | --- | --- |
| Human checkout | USD 0.50 (portal broadcaster) | max($0.50, on-chain floor) |
| x402 (`exact` or `curvy-transfer`) | USD 0.50 (portal broadcaster; reported as `minPortalUsd` by `GET /portal/networks/:chainId` and as `x402.minimumPortalUsd`) | max($0.50 in token units, on-chain floor), which `x402.minimumPrice()` returns |

After a human-checkout reclaim, the old portal address is permanently spent, so create a **fresh** payment request if the customer retries.

::: danger x402 portals below the minimum are lost
An x402 `payTo` is derived with `recovery = NO_RECOVERY_ADDRESS` unless you set your own, so a portal the broadcaster refuses (too small, wrong token, failed screening) can never be reclaimed by anyone. Never charge an agent less than the broadcaster's minimum. See [x402](./x402#_1-create-the-merchant-once).
:::

## Choosing a rail for small amounts

| Price per payment | Recommended rail | Why |
| --- | --- | --- |
| $0.50 and above, paid by a person | [Human checkout](./human-checkout) | Hosted payment page, any wallet or exchange withdrawal |
| Per API request, paid by an agent | [x402](./x402) (`exact` or `curvy-transfer`) | One payment per request. Each request pays the full portal-rail fees and must clear the broadcaster's USD minimum, so check `quotePayment` and price at or above that minimum |

Every rail ends in one note per payment, so there is no way to spread the fixed fees across several requests. Bundle work into one paid call rather than charging sub-minimum amounts.

## Related

- [x402 and the Payments SDK](./x402)
- [Human checkout](./human-checkout)
- [Confirming payments](./confirming-payments)
- [API surface](./api#economics)
