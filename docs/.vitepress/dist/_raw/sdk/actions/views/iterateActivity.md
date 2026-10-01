# iterateActivity

Iterate local activity in globally deduplicated newest-first order, without
acknowledging rows. Compact IDs/commitments remain an account-wide index;
full rows, attempts and asset metadata are hydrated in bounded batches.
Membership/order is captured when iteration starts; display fields are read
per batch. Stop iteration or abort signal to avoid loading later batches.

## Import

```ts
import { iterateActivity } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = iterateActivity({ config });
```

## Signature

```ts
function iterateActivity(parameters?: IterateActivityParameters): AsyncGenerator<ActivityItem, void, void>
```

## Returns

`AsyncGenerator<ActivityItem, void, void>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose activity is iterated. Defaults to the active account.

```ts
const result = iterateActivity({
  accountId, // [!code focus]
});
```

### `filters`

- **Type:** `ActivityFilters`
- **Required:** no

Restrict the iteration by free-text query, kinds, network slug or vault token id.

```ts
const result = iterateActivity({
  filters, // [!code focus]
});
```

### `batchSize`

- **Type:** `number`
- **Required:** no

Maximum rich history rows hydrated together; defaults to 100.

```ts
const result = iterateActivity({
  batchSize, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the iteration before later batches are hydrated.

```ts
const result = iterateActivity({
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = iterateActivity({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/iterateActivity.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/iterateActivity.ts)
