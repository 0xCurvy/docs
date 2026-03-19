# Interacting with Assets

The Curvy Protocol uses an Intent -> Estimate -> Execute model for interacting with assets. This abstracts away the complexity of stealth addresses, bridging, and shielding/unshielding.

## Step 1: Define an Intent

An intent describes _what_ the user wants to do. There are four intent types:

- **`curvy-transfer`** — Send to a Curvy ID (`.curvy.name` handle)
- **`curvy-swap`** — Swap currencies within the Curvy Protocol
- **`external-transfer`** — Transfer to an external wallet address on any of the supported chains
- **`send-to-anyone`** — Generate a secure link that will allow you to send funds to anyone, prompting them to register or sign in

```typescript
import type { TransferIntent } from "@0xcurvy/curvy-sdk";

// Fetch network and currency details from the SDK
const network = sdk.getNetwork("ethereum");
const currency = network.currencies.find((c) => c.symbol === "ETH");

const intent: TransferIntent = {
  type: "curvy-transfer",
  amount: 1000000000000000000n, // 1 ETH in wei
  currency: currency,
  network: network,
  recipient: "vitalik.curvy.name", // Must be a Curvy ID ending in .curvy.name
};
```

## Step 2: Estimate the Intent

The SDK generates a local execution plan based on the user's current balances to fulfill the intent.

```typescript
const estimation = await sdk.estimate(intent);

console.log("Gas fee:", estimation.gas);
console.log("Curvy fee:", estimation.curvyFee);
console.log("Effective amount:", estimation.effectiveAmount);
```

## Step 3: Execute the Plan

Once estimated, execute the plan. The SDK handles generating zero-knowledge proofs and broadcasting transactions.

```typescript
const executionResult = await sdk.execute(estimation.plan);

if (executionResult.success) {
  console.log("Assets transferred successfully!");
} else {
  console.error("Execution failed:", executionResult.error);
}
```
