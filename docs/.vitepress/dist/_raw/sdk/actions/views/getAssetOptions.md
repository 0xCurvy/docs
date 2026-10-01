# getAssetOptions

Full current-environment registry for pickers, retaining zero balances and unavailable choices.

## Import

```ts
import { getAssetOptions } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getAssetOptions({ config });
```

## Signature

```ts
function getAssetOptions(parameters?: GetAssetOptionsParameters): Promise<AssetOptionsSnapshot>
```

## Returns

`Promise<AssetOptionsSnapshot>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose balances decide which options are selectable. Defaults to the active account.

```ts
const result = await getAssetOptions({
  accountId, // [!code focus]
});
```

### `purpose`

- **Type:** `AssetOptionsSnapshot["purpose"]`
- **Required:** no

What the picker selects: `"private-input"`, `"public-input"` or `"public-output"`. Decides which reasons make an option unavailable.

```ts
const result = await getAssetOptions({
  purpose, // [!code focus]
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Only return options on this network.

```ts
const result = await getAssetOptions({
  networkSlug, // [!code focus]
});
```

### `query`

- **Type:** `string`
- **Required:** no

A free-text filter on asset names and symbols.

```ts
const result = await getAssetOptions({
  query, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the read.

```ts
const result = await getAssetOptions({
  signal, // [!code focus]
});
```

### `inputFinalityPolicy`

- **Type:** `GetPortfolioParameters["inputFinalityPolicy"]`
- **Required:** no

Which balance buckets count as spendable when evaluating private inputs.

```ts
const result = await getAssetOptions({
  inputFinalityPolicy: "finalized", // [!code focus]
});
```

### `priceMaxAgeMs`

- **Type:** `number`
- **Required:** no

How old prices may be before they are refreshed. Defaults to five minutes.

```ts
const result = await getAssetOptions({
  priceMaxAgeMs, // [!code focus]
});
```

### `metadataMaxAgeMs`

- **Type:** `number`
- **Required:** no

How old registry metadata may be before it is refreshed. Defaults to thirty minutes.

```ts
const result = await getAssetOptions({
  metadataMaxAgeMs, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getAssetOptions({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getAssetOptions.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getAssetOptions.ts)
