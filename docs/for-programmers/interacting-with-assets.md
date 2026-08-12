# Interacting With Assets

The Curvy SDK uses an `Intent` → [`estimateIntent`](/sdk/actions/planner/estimateIntent) → [`executeIntent`](/sdk/actions/planner/executeIntent) flow. This abstracts away stealth addresses, bridging, and private-note execution.

## Step 1: Define An Intent

An intent describes _what_ the user wants to do. There are four intent types:

- **`curvy-transfer`** — Send to a Curvy ID (`.curvy.name` handle)
- **`curvy-swap`** — Swap currencies within the Curvy Protocol
- **`external-transfer`** — Transfer to an external wallet address on any of the supported chains
- **`send-to-anyone`** — Generate a secure link that lets you send funds to anyone, prompting them to register or sign in

```ts
import { getNetwork } from "@0xcurvy/curvy-sdk/actions";
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

The SDK prepares an in-memory execution handle based on the user's current balances.

```ts
import { estimateIntent } from "@0xcurvy/curvy-sdk/actions";

const estimation = await estimateIntent({ config, intent });

console.log("Gas fee:", estimation.gas);
console.log("Curvy fee:", estimation.curvyFee);
console.log("Effective amount:", estimation.effectiveAmount);
console.log("Delivery reduced by fees:", estimation.degradedToFeesOnAmount);
console.log("Steps:", estimation.prepared.steps);
```

If `degradedToFeesOnAmount` is true, show `effectiveAmount` before asking the
user to confirm. It means protocol or submission fees made the deliverable
amount lower than the amount in the intent.

Planner submission uses the config's `submissionMode` (`"relay"` by default).
You can override it for one estimate:

```ts
const estimation = await estimateIntent({ config, intent, submissionMode: "direct" });
await executeIntent({
  config,
  prepared: estimation.prepared,
  directSubmitter: ({ network }) => getWalletClientForChain(network.chainId),
});
```

The prepared handle retains the mode used for estimation. To change modes,
estimate again so the delivered amount and proof outputs are recalculated.

## Step 3: Execute The Intent

Pass the prepared handle back to the SDK. Prepared handles are process-local and cannot be serialized; estimate again after a reload.

```ts
import { executeIntent } from "@0xcurvy/curvy-sdk/actions";

const executionResult = await executeIntent({
  config,
  prepared: estimation.prepared,
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
