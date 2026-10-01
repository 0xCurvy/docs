# getQuote

Estimate a review screen without exposing note inputs, bearer outputs, or mutable plans.

## Import

```ts
import { getQuote } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getQuote({ intent, config });
```

## Signature

```ts
function getQuote(parameters: EstimateIntentParameters): Promise<Quote>
```

## Returns

`Promise<Quote>`

The action resolves or returns the value shown in the signature.

## Parameters

### `intent`

- **Type:** `Intent`
- **Required:** yes

The transfer intent to estimate for the review screen.

```ts
const result = await getQuote({
  intent, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

Explicit account guard. This config has one bearer session, so it must be the active account.

```ts
const result = await getQuote({
  intent,
  accountId, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel a superseded estimate; cancelled results are never published.

```ts
const result = await getQuote({
  intent,
  signal, // [!code focus]
});
```

### `minimumInputFinalityPolicy`

- **Type:** `InputFinalityPolicy`
- **Required:** no

Integration-level lower bound that account/intent settings cannot weaken.

```ts
const result = await getQuote({
  intent,
  minimumInputFinalityPolicy, // [!code focus]
});
```

### `submissionMode`

- **Type:** `SubmissionMode`
- **Required:** no

Override the config's submission path for this estimate and its prepared execution.

```ts
const result = await getQuote({
  intent,
  submissionMode, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getQuote({
  intent,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getQuote.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getQuote.ts)
