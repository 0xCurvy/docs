# getOperations

Reconstruct durable progress and merge the config's live jobs without exposing proofs or note commitments.

## Import

```ts
import { getOperations } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getOperations({ config });
```

## Signature

```ts
function getOperations(parameters?: GetOperationsParameters): Promise<OperationSnapshot[]>
```

## Returns

`Promise<OperationSnapshot[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose operations are reconstructed. Defaults to the active account.

```ts
const result = await getOperations({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getOperations({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getOperations.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getOperations.ts)
