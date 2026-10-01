# dismissOperation

Hide a transfer notice durably without deleting its history or changing fund reservations.

## Import

```ts
import { dismissOperation } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await dismissOperation({ operationId, config });
```

## Signature

```ts
function dismissOperation(parameters: WithConfig<{ operationId: string; accountId?: string; }>): Promise<void>
```

## Returns

`Promise<void>`

The action resolves or returns the value shown in the signature.

## Parameters

### `operationId`

- **Type:** `string`
- **Required:** yes

The operation whose transfer notice should be hidden.

```ts
await dismissOperation({
  operationId, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The account that owns the operation. Defaults to the active account.

```ts
await dismissOperation({
  operationId,
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
await dismissOperation({
  operationId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/dismissOperation.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/dismissOperation.ts)
