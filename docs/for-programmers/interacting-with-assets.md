## Interacting with Assets

Curvy Protocol uses an Intent -> Plan -> Execution model for interacting with assets. This abstracts away the complexity of stealth addresses, bridging, and shielding/unshielding.

### Step 1: Define an Intent

An intent describes _what_ the user wants to do. For example, sending an amount of a specific currency to a recipient.

```typescript
import type { CurvyIntent } from "@0xcurvy/curvy-sdk";

// Fetch network and currency details from the SDK
const network = sdk.getNetwork("localnet");
const currency = network.currencies.find((c) => c.symbol === "ETH");

const intent: CurvyIntent = {
  amount: 1000000000000000000n, // 1 ETH in wei
  currency: currency,
  network: network,
  recipient: "vitalik.curvy.name", // Can be a CurvyHandle or address
};
```

### Step 2: Generate a Plan

The SDK generates a local execution plan based on the user's current balances to fulfill the intent.

```typescript
import { generatePlan } from "@0xcurvy/curvy-sdk";

// 'balances' comes from sdk.storage.getNoteBalances(...)
const { plan, usedBalances } = generatePlan(balances, intent);
```

### Step 3: Estimate the Plan

Before sending transactions, the plan is dry-run and estimated by the Curvy backend to calculate exact fees and verify validity.

```typescript
const estimation = await sdk.estimatePlan(plan);

if (!estimation.success) {
  console.error("Plan estimation failed:", estimation.error);
  return;
}
```

### Step 4: Execute the Plan

Once estimated successfully, the plan is executed. The SDK handles generating necessary zero-knowledge proofs and broadcasting transactions.

```typescript
// Execute the plan using the estimated plan object
const executionResult = await sdk.executePlan(estimation.result.plan);

if (executionResult.success) {
  console.log("Assets transferred successfully!");
} else {
  console.error("Execution failed:", executionResult.error);
}
```
