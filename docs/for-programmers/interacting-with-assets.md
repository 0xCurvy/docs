# Interacting With Assets

The Curvy SDK uses an `Intent -> estimateIntent -> executePlan` flow. This abstracts away the complexity of stealth addresses, bridging, and shielding/unshielding.

## Step 1: Define An Intent

An intent describes _what_ the user wants to do. There are four intent types:

- **`curvy-transfer`** — Send to a Curvy ID (`.curvy.name` handle)
- **`curvy-swap`** — Swap currencies within the Curvy Protocol
- **`external-transfer`** — Transfer to an external wallet address on any of the supported chains
- **`send-to-anyone`** — Generate a secure link that lets you send funds to anyone, prompting them to register or sign in

```ts
import { getNetwork } from "@0xcurvy/curvy-sdk";
import type { TransferIntent } from "@0xcurvy/curvy-sdk";

const network = getNetwork({ config, filter: "ethereum" });
const currency = network.currencies.find((c) => c.symbol === "ETH");
if (!currency) throw new Error("ETH not found");

const intent: TransferIntent = {
  type: "curvy-transfer",
  amount: 1_000_000_000_000_000_000n, // 1 ETH in wei
  currency,
  network,
  recipient: "vitalik.curvy.name", // Must be a Curvy ID ending in .curvy.name
};
```

## Step 2: Estimate The Intent

The SDK generates a local execution plan based on the user's current balances to fulfill the intent.

```ts
import { estimateIntent } from "@0xcurvy/curvy-sdk/actions";

const estimation = await estimateIntent({ config, intent });

console.log("Gas fee:", estimation.gas);
console.log("Curvy fee:", estimation.curvyFee);
console.log("Effective amount:", estimation.effectiveAmount);
```

## Step 3: Execute The Plan

Once estimated, execute the plan. The SDK handles generating zero-knowledge proofs and broadcasting transactions.

```ts
import { executePlan } from "@0xcurvy/curvy-sdk/actions";

const executionResult = await executePlan({
  config,
  plan: estimation.plan,
});

console.log(executionResult);
```

## Cross-chain external transfers

When the recipient should receive funds on a network other than the one hosting the Privacy Aggregator, first record an [exit Portal](/for-the-curious/building-blocks/portals#exit-portals) and use its address as the intent's recipient:

```ts
import { generateExitPortal } from "@0xcurvy/curvy-sdk/actions";
import type { ExternalTransferIntent } from "@0xcurvy/curvy-sdk";

const { address: exitPortalAddress } = await generateExitPortal({
  curvyId: account.curvyHandle,
  currencyId: currency.id,
  exitNetworkId: destinationNetwork.id,
  exitAddress: recipientAddress,
});

const intent = {
  type: "external-transfer",
  amount,
  currency,
  network,               // the aggregator network the funds leave from
  recipient: exitPortalAddress,
  exitNetwork: destinationNetwork,
  exitAddress: recipientAddress,
} satisfies ExternalTransferIntent;
```

The plan will unshield into the exit Portal, wait for the Portal Broadcaster to deploy it, and let the Portal bridge the funds to the destination via LiFi. Estimations for such intents include a `bridgeFee` on top of `gas` and `curvyFee`.

## Swaps

A `curvy-swap` unshields into an exit Portal, swaps via LiFi, and auto-shields the proceeds back into Curvy through a fresh entry Portal. The plan waits for both Portal deployments before completing:

```ts
import type { SwapIntent } from "@0xcurvy/curvy-sdk";

const intent = {
  type: "curvy-swap",
  amount,
  currency,               // what you're swapping from
  network,
  exitCurrency,           // what you're swapping to
  recipient: exitPortalAddress,  // from generateExitPortal with exitCurrencyId set
  entryAddress,                  // from generateEntryPortal — receives the swapped asset
} satisfies SwapIntent;
```

## Send to anyone

A `send-to-anyone` intent addresses the output note to a single-use key pair instead of a Curvy ID — the basis of [claim links](/for-the-curious/walkthroughs/sending-funds-to-anyone):

```ts
import type { SendToAnyoneIntent } from "@0xcurvy/curvy-sdk";

const intent = {
  type: "send-to-anyone",
  amount,
  currency,
  network,
  recipientPublicKeys: { S, V, babyJubjubPublicKey }, // freshly generated, single-use
} satisfies SendToAnyoneIntent;
```

You are responsible for delivering the claim capability to the recipient. Curvy App encodes the deployment ID, scan starting hint, lowercase `s` and `v` private keys, and derived note tag in the claim link's URL fragment.
