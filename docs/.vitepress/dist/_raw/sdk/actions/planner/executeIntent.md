# executeIntent

Execute a handle returned by [`estimateIntent`](/sdk/actions/planner/estimateIntent).

## Import

```ts
import { executeIntent } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await executeIntent({ prepared, config });
```

## Signature

```ts
function executeIntent(parameters: ExecuteIntentParameters): Promise<PlanSuccessfulExecution>
```

## Returns

`Promise<PlanSuccessfulExecution>`

The action resolves or returns the value shown in the signature.

## Parameters

### `prepared`

- **Type:** `PreparedIntent`
- **Required:** yes

The in-memory prepared handle returned by estimateIntent.

```ts
const result = await executeIntent({
  prepared, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Stops local execution/observation. Already-submitted funds stay reserved.

```ts
const result = await executeIntent({
  prepared,
  signal, // [!code focus]
});
```

### `directSubmitter`

- **Type:** `DirectSubmitter`
- **Required:** no

Override the config's direct signer adapter; the prepared submission mode cannot be changed.

```ts
const result = await executeIntent({
  prepared,
  directSubmitter, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await executeIntent({
  prepared,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`estimateIntent`](/sdk/actions/planner/estimateIntent) — Select spendable notes and return fees, delivered amount, a sanitized route, and an in-memory handle that can be passed to executeIntent.
- [`getPlanSteps`](/sdk/actions/planner/getPlanSteps) — Return the ordered, sanitized steps an integrator can present to a user.
- [`estimateExternalTransfer`](/sdk/actions/planner/estimateExternalTransfer) — Pre-deposit estimate for a swap-public-style external transfer.
- [`estimateBridge`](/sdk/actions/bridge/estimateBridge) — Quote a bridge/swap before committing — for the swap UI (in-app/public) and send-with-exit-bridge.
- [`getTransactionHistory`](/sdk/actions/history/getTransactionHistory) — Merge local actions and chain fallbacks using account-wide ordering and deduplication.

## Source

[packages/@0xcurvy/sdk/src/actions/planner/executeIntent.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/planner/executeIntent.ts)
