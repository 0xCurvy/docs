# markActivitySeen

Acknowledge explicit entries, or the rows a captured watermark's view held (its filters and search).
Never called by paging, filtering, or export.

## Import

```ts
import { markActivitySeen } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await markActivitySeen({ config });
```

## Signature

```ts
function markActivitySeen(parameters: MarkActivitySeenParameters): Promise<ActivityAcknowledgement>
```

## Returns

`Promise<ActivityAcknowledgement>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose activity is acknowledged. Defaults to the active account.

```ts
const result = await markActivitySeen({
  accountId, // [!code focus]
});
```

### `ids`

- **Type:** `readonly string[] | undefined`
- **Required:** no

The activity entries to acknowledge explicitly. Mutually exclusive with `watermark`.

```ts
const result = await markActivitySeen({
  ids, // [!code focus]
});
```

### `watermark`

- **Type:** `string | undefined`
- **Required:** no

A `watermark` captured from an activity page; acknowledges everything present when that page was created. Mutually exclusive with `ids`.

```ts
const result = await markActivitySeen({
  watermark, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await markActivitySeen({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/markActivitySeen.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/markActivitySeen.ts)
