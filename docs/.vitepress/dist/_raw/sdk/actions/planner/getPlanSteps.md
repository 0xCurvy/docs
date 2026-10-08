# getPlanSteps

Return the ordered, sanitized steps an integrator can present to a user.

## Import

```ts
import { getPlanSteps } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = getPlanSteps(plan);
```

## Signature

```ts
function getPlanSteps<C extends DraftCommand>(plan: Plan<C>): PlanStep[]
```

## Returns

`PlanStep[]`

The action resolves or returns the value shown in the signature.

## Parameters

### `plan`

- **Type:** `Plan<C>`
- **Required:** yes

A plan whose sanitized command and wait metadata should be returned.

```ts
const result = getPlanSteps(
  plan, // [!code focus]
);
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`estimateIntent`](/sdk/actions/planner/estimateIntent) — Select spendable notes and return fees, delivered amount, a sanitized route, and an in-memory handle that can be passed to executeIntent.
- [`executeIntent`](/sdk/actions/planner/executeIntent) — Execute a handle returned by estimateIntent.
- [`estimateExternalTransfer`](/sdk/actions/planner/estimateExternalTransfer) — Pre-deposit estimate for a swap-public-style external transfer.
- [`estimateBridge`](/sdk/actions/bridge/estimateBridge) — Quote a bridge/swap before committing — for the swap UI (in-app/public) and send-with-exit-bridge.

## Source

[packages/@0xcurvy/sdk/src/actions/planner/getPlanSteps.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/planner/getPlanSteps.ts)
