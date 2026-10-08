# estimatePortalEntry

Estimate a deposit sent to an entry portal, end to end: where it shields and what it costs to get there. A deposit
on a network that accepts portal shields shields in place. Any other deposit is bridged by the portal
broadcaster, which picks the destination by the deposit's value, so the broadcaster's own route estimate supplies
the destination and the bridge cost. The destination vault's shielding fees then apply to the bridge's expected
output. Fails with `FeeEstimateUnavailableError` rather than guessing a destination or a fee.

## Import

```ts
import { estimatePortalEntry } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await estimatePortalEntry({ network, currency, amount, config });
```

## Signature

```ts
function estimatePortalEntry(parameters: EstimatePortalEntryParameters): Promise<PortalEntryEstimate>
```

## Returns

`Promise<PortalEntryEstimate>`

The action resolves or returns the value shown in the signature.

## Parameters

### `network`

- **Type:** `Network`
- **Required:** yes

The network and currency the deposit is sent on.

```ts
const result = await estimatePortalEntry({
  network, // [!code focus]
  currency,
  amount,
});
```

### `currency`

- **Type:** `Currency`
- **Required:** yes

The currency the deposit is sent in on `network`.

```ts
const result = await estimatePortalEntry({
  network,
  currency, // [!code focus]
  amount,
});
```

### `amount`

- **Type:** `bigint`
- **Required:** yes

The deposited amount in the currency's base units.

```ts
const result = await estimatePortalEntry({
  network,
  currency,
  amount, // [!code focus]
});
```

### `portalAddress`

- **Type:** `string`
- **Required:** no

The deposit's entry portal address, when it already exists; prices a bridge route exactly.

```ts
const result = await estimatePortalEntry({
  network,
  currency,
  amount,
  portalAddress, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the route and fee reads.

```ts
const result = await estimatePortalEntry({
  network,
  currency,
  amount,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await estimatePortalEntry({
  network,
  currency,
  amount,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/planner/estimatePortalEntry.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/planner/estimatePortalEntry.ts)
