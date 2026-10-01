# getTransactionHistory

Merge local actions and chain fallbacks using account-wide ordering and deduplication.

## Import

```ts
import { getTransactionHistory } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const history = await getTransactionHistory({
  accountId,
  networkSlug,
  config,
});
```

## Signature

```ts
function getTransactionHistory(parameters?: GetTransactionHistoryParameters): Promise<TransactionHistoryItem[]>
```

## Returns

`Promise<TransactionHistoryItem[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose transaction records should be returned. Defaults to the active account.

```ts
const result = await getTransactionHistory({
  accountId, // [!code focus]
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Limit results to this network slug.

```ts
const result = await getTransactionHistory({
  networkSlug, // [!code focus]
});
```

### `token`

- **Type:** `string`
- **Required:** no

Vault token id as a decimal string.

```ts
const result = await getTransactionHistory({
  token, // [!code focus]
});
```

### `limit`

- **Type:** `number`
- **Required:** no

The maximum number of transaction records to return.

```ts
const result = await getTransactionHistory({
  limit, // [!code focus]
});
```

### `ids`

- **Type:** `readonly string[]`
- **Required:** no

Hydrate selected stable activity IDs without reading every history record or attempt.

```ts
const result = await getTransactionHistory({
  ids, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the history read.

```ts
const result = await getTransactionHistory({
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getTransactionHistory({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`executeIntent`](/sdk/actions/planner/executeIntent) — Execute a handle returned by estimateIntent.

## Source

[packages/@0xcurvy/sdk/src/actions/history/getTransactionHistory.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/history/getTransactionHistory.ts)
