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
import { estimateIntent } from "@0xcurvy/curvy-sdk/actions/planner";

const estimation = await estimateIntent({ config, intent });

console.log("Gas fee:", estimation.gas);
console.log("Curvy fee:", estimation.curvyFee);
console.log("Effective amount:", estimation.effectiveAmount);
```

## Step 3: Execute The Plan

Once estimated, execute the plan. The SDK handles generating zero-knowledge proofs and broadcasting transactions.

```ts
import { executePlan } from "@0xcurvy/curvy-sdk/actions/planner";

const executionResult = await executePlan({
  config,
  plan: estimation.plan,
});

console.log(executionResult);
```
