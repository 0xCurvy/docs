# Interacting With Assets

The Curvy SDK uses an `Intent -> estimateIntent -> executePlan` flow.

## Step 1: Define An Intent

```ts
import { getNetwork } from "@0xcurvy/curvy-sdk";
import type { TransferIntent } from "@0xcurvy/curvy-sdk";

const network = getNetwork({ config, filter: "ethereum" });
const currency = network.currencies.find((c) => c.symbol === "ETH");
if (!currency) throw new Error("ETH not found");

const intent: TransferIntent = {
  type: "curvy-transfer",
  amount: 1_000_000_000_000_000_000n,
  currency,
  network,
  recipient: "vitalik.curvy.name",
};
```

## Step 2: Estimate The Intent

```ts
import { estimateIntent } from "@0xcurvy/curvy-sdk/actions/planner";

const estimation = await estimateIntent({ config, intent });

console.log("Gas fee:", estimation.gas);
console.log("Curvy fee:", estimation.curvyFee);
console.log("Effective amount:", estimation.effectiveAmount);
```

## Step 3: Execute The Plan

```ts
import { executePlan } from "@0xcurvy/curvy-sdk/actions/planner";

const executionResult = await executePlan({
  config,
  plan: estimation.plan,
});

console.log(executionResult);
```
