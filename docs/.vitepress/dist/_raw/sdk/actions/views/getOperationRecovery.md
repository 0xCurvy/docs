# getOperationRecovery

Locate only this swap's stopped, owned portals. This never restarts its withdrawal or submits recovery.

## Import

```ts
import { getOperationRecovery } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getOperationRecovery({ operationId, config });
```

## Signature

```ts
function getOperationRecovery(parameters: WithConfig<{ operationId: string; accountId?: string; signal?: AbortSignal; }>): Promise<OperationRecoveryPortal[]>
```

## Returns

`Promise<OperationRecoveryPortal[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `operationId`

- **Type:** `string`
- **Required:** yes

The swap operation whose stopped portals are located.

```ts
const result = await getOperationRecovery({
  operationId, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The account that owns the operation. Defaults to the active account.

```ts
const result = await getOperationRecovery({
  operationId,
  accountId, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the portal lookup.

```ts
const result = await getOperationRecovery({
  operationId,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getOperationRecovery({
  operationId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getOperationRecovery.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getOperationRecovery.ts)
