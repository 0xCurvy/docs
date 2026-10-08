# watchOperations

Subscribe with immediate delivery; stale async reads cannot overwrite a newer account or revision.

## Import

```ts
import { watchOperations } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = watchOperations({ onChange, onError, config });
```

## Signature

```ts
function watchOperations(parameters: WatchOperationsParameters): () => void
```

## Returns

`() => void`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose operations are watched. Defaults to the active account.

```ts
const result = watchOperations({
  accountId, // [!code focus]
  onChange,
  onError,
});
```

### `onChange`

- **Type:** `(operations: OperationSnapshot[]) => void`
- **Required:** yes

Called immediately and on every change with the current operation snapshots.

```ts
const result = watchOperations({
  onChange, // [!code focus]
  onError,
});
```

### `onError`

- **Type:** `(error: unknown) => void`
- **Required:** yes

Called when a background read fails.

```ts
const result = watchOperations({
  onChange,
  onError, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Stops the subscription; the returned function does the same.

```ts
const result = watchOperations({
  onChange,
  onError,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = watchOperations({
  onChange,
  onError,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/watchOperations.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/watchOperations.ts)
