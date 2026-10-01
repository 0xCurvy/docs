# reviewForResume

Inspect an interrupted operation without submitting or replaying it.

## Import

```ts
import { reviewForResume } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await reviewForResume({ operationId, config });
```

## Signature

```ts
function reviewForResume(parameters: ReviewForResumeParameters): Promise<OperationResumeReview>
```

## Returns

`Promise<OperationResumeReview>`

The action resolves or returns the value shown in the signature.

## Parameters

### `operationId`

- **Type:** `string`
- **Required:** yes

The interrupted operation to inspect.

```ts
const result = await reviewForResume({
  operationId, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The account that owns the operation. Defaults to the active account.

```ts
const result = await reviewForResume({
  operationId,
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await reviewForResume({
  operationId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/reviewForResume.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/reviewForResume.ts)
