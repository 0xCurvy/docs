# reconcileOperation

Recheck chain evidence before releasing intermediate outputs from an interrupted operation.

## Import

```ts
import { reconcileOperation } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await reconcileOperation({ operationId, config });
```

## Signature

```ts
function reconcileOperation(parameters: ReconcileOperationParameters): Promise<ReconcileOperationResult>
```

## Returns

`Promise<ReconcileOperationResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `operationId`

- **Type:** `string`
- **Required:** yes

The interrupted operation whose chain evidence is rechecked.

```ts
const result = await reconcileOperation({
  operationId, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The account that owns the operation. Defaults to the active account.

```ts
const result = await reconcileOperation({
  operationId,
  accountId, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the chain reads.

```ts
const result = await reconcileOperation({
  operationId,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await reconcileOperation({
  operationId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/reconcileOperation.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/reconcileOperation.ts)
