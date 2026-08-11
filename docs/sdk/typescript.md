---
title: TypeScript
description: Type inference and TypeScript conventions in the Curvy SDK.
---

# TypeScript

Curvy is written in strict TypeScript. Public actions expose typed parameter objects, return values, event payloads, and domain models.

## Requirements

Enable strict mode for the strongest inference and error checking.

```json
{
  "compilerOptions": {
    "strict": true
  }
}
```

## Inference

Return types are inferred from the action call, so most application code does not need an explicit annotation.

```ts
import { getBalances } from "@0xcurvy/curvy-sdk/actions";

const balances = await getBalances({ config });
//    ^? BalanceEntry[]
```

Public domain types can be imported from the root package. Action-specific parameter and result types are also exported from `actions`.

```ts
import type { CurvyConfig, Network } from "@0xcurvy/curvy-sdk";
import type { EstimateIntentParameters } from "@0xcurvy/curvy-sdk/actions";
```

## Literal values

Use `as const` when constructing reusable intent or filter objects outside a call. It preserves discriminant values such as `type: "curvy-transfer"`.

```ts
const intent = {
  type: "curvy-transfer",
  amount: 1_000_000n,
  currency,
  network,
  recipient: "alice.curvy.name",
} as const;
```

## Integer values

Token amounts, fees, note values, and on-chain identifiers use `bigint`. Convert display input using the currency's decimals; do not use floating-point numbers for base-unit values.

```ts
const amount = 1_500_000n; // 1.5 units for a token with 6 decimals
```

## Errors

SDK errors extend `CurvyError` and expose a stable `code`. Narrow with `instanceof` when an application has a specific recovery path.

```ts
import { NoActiveAccountError } from "@0xcurvy/curvy-sdk";

try {
  await getBalances({ config });
} catch (error) {
  if (error instanceof NoActiveAccountError) {
    // Prompt the user to log in.
  }
}
```

