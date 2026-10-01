# exportActivity

Collect the full matching local export. Hydration is bounded; the returned
string necessarily occupies memory for the complete export. Use iterateActivity
to write incrementally to a host file/stream instead. No seen-state mutation.

## Import

```ts
import { exportActivity } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await exportActivity({ config });
```

## Signature

```ts
function exportActivity(parameters?: ExportActivityParameters): Promise<{ data: string; mimeType: string; count: number; }>
```

## Returns

`Promise<{ data: string; mimeType: string; count: number; }>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose activity is exported. Defaults to the active account.

```ts
const result = await exportActivity({
  accountId, // [!code focus]
});
```

### `filters`

- **Type:** `ActivityFilters`
- **Required:** no

Restrict the export by free-text query, kinds, network slug or vault token id.

```ts
const result = await exportActivity({
  filters, // [!code focus]
});
```

### `format`

- **Type:** `"csv" | "json"`
- **Required:** no

The output format, `"csv"` or `"json"`.

```ts
const result = await exportActivity({
  format, // [!code focus]
});
```

### `batchSize`

- **Type:** `number`
- **Required:** no

How many rich history rows are hydrated at a time. Defaults to 100.

```ts
const result = await exportActivity({
  batchSize, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the export before later batches are hydrated.

```ts
const result = await exportActivity({
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await exportActivity({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/exportActivity.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/exportActivity.ts)
