# getPortfolio

Storage-independent, note-free portfolio including pending-only assets and recovery ownership.

## Import

```ts
import { getPortfolio } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getPortfolio({ config });
```

## Signature

```ts
function getPortfolio(parameters?: GetPortfolioParameters): Promise<PortfolioSnapshot>
```

## Returns

`Promise<PortfolioSnapshot>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose portfolio is built. Defaults to the active account.

```ts
const result = await getPortfolio({
  accountId, // [!code focus]
});
```

### `inputFinalityPolicy`

- **Type:** `InputFinalityPolicy`
- **Required:** no

Which balance buckets count as spendable.

```ts
const result = await getPortfolio({
  inputFinalityPolicy: "finalized", // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the read.

```ts
const result = await getPortfolio({
  signal, // [!code focus]
});
```

### `priceMaxAgeMs`

- **Type:** `number`
- **Required:** no

Host freshness policy; defaults to five minutes.

```ts
const result = await getPortfolio({
  priceMaxAgeMs, // [!code focus]
});
```

### `balanceMaxAgeMs`

- **Type:** `number`
- **Required:** no

How old balance data may be before it is refreshed.

```ts
const result = await getPortfolio({
  balanceMaxAgeMs, // [!code focus]
});
```

### `metadataMaxAgeMs`

- **Type:** `number`
- **Required:** no

Registry metadata freshness policy; defaults to thirty minutes.

```ts
const result = await getPortfolio({
  metadataMaxAgeMs, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getPortfolio({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getPortfolio.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getPortfolio.ts)
