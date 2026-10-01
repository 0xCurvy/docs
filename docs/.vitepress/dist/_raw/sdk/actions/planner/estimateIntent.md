# estimateIntent

Select spendable notes and return fees, delivered amount, a sanitized route,
and an in-memory handle that can be passed to [`executeIntent`](/sdk/actions/planner/executeIntent).

## Import

```ts
import { estimateIntent } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const estimation = await estimateIntent({ intent });
```

## Signature

```ts
function estimateIntent(parameters: EstimateIntentParameters): Promise<IntentEstimation>
```

## Returns

`Promise<IntentEstimation>`

The action resolves or returns the value shown in the signature.

## Parameters

### `intent`

- **Type:** `Intent`
- **Required:** yes

The transfer intent to plan and estimate.

```ts
const result = await estimateIntent({
  intent, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

Explicit account guard. This config has one bearer session, so it must be the active account.

```ts
const result = await estimateIntent({
  intent,
  accountId, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel a superseded estimate; cancelled results are never published.

```ts
const result = await estimateIntent({
  intent,
  signal, // [!code focus]
});
```

### `minimumInputFinalityPolicy`

- **Type:** `InputFinalityPolicy`
- **Required:** no

Integration-level lower bound that account/intent settings cannot weaken.

```ts
const result = await estimateIntent({
  intent,
  minimumInputFinalityPolicy, // [!code focus]
});
```

### `submissionMode`

- **Type:** `SubmissionMode`
- **Required:** no

Override the config's submission path for this estimate and its prepared execution.

```ts
const result = await estimateIntent({
  intent,
  submissionMode, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await estimateIntent({
  intent,
  config, // [!code focus]
});
```

## Errors

- `NoActiveAccountError` when no account is active.
- a typed `CurvyError` when selection or estimation fails.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`executeIntent`](/sdk/actions/planner/executeIntent) — Execute a handle returned by estimateIntent.
- [`getPlanSteps`](/sdk/actions/planner/getPlanSteps) — Return the ordered, sanitized steps an integrator can present to a user.
- [`estimateExternalTransfer`](/sdk/actions/planner/estimateExternalTransfer) — Pre-deposit estimate for a swap-public-style external transfer.
- [`estimateBridge`](/sdk/actions/bridge/estimateBridge) — Quote a bridge/swap before committing — for the swap UI (in-app/public) and send-with-exit-bridge.

## Source

[packages/@0xcurvy/sdk/src/actions/planner/estimateIntent.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/planner/estimateIntent.ts)
