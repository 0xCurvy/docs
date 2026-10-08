# getActivityPage

Query the complete local private history, keeping page membership stable as new entries arrive.

## Import

```ts
import { getActivityPage } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getActivityPage({ config });
```

## Signature

```ts
function getActivityPage(parameters?: GetActivityPageParameters): Promise<ActivityPage>
```

## Returns

`Promise<ActivityPage>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose history is paged. Defaults to the active account.

```ts
const result = await getActivityPage({
  accountId, // [!code focus]
});
```

### `filters`

- **Type:** `ActivityFilters`
- **Required:** no

Restrict the page by free-text query, kinds, network slug or vault token id.

```ts
const result = await getActivityPage({
  filters, // [!code focus]
});
```

### `cursor`

- **Type:** `string`
- **Required:** no

A cursor from a previous page. Reusing a page's own `cursor` refreshes statuses without changing membership.

```ts
const result = await getActivityPage({
  cursor, // [!code focus]
});
```

### `pageSize`

- **Type:** `number`
- **Required:** no

The number of items per page.

```ts
const result = await getActivityPage({
  pageSize, // [!code focus]
});
```

### `seenIds`

- **Type:** `readonly string[]`
- **Required:** no

Optional legacy host acknowledgements. SDK storage is restored automatically.

```ts
const result = await getActivityPage({
  seenIds, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the read.

```ts
const result = await getActivityPage({
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getActivityPage({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getActivityPage.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getActivityPage.ts)
