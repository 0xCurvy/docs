# estimateExternalTransfer

Pre-deposit estimate for a swap-public-style external transfer.

Models the full pipeline with every fee it charges: the entry bridge (when the
deposit is not shielded in place), shielding into the private balance, the
withdrawal's protocol and network fees, and the exit bridge (when the destination
differs from the shielding side). Both bridges and the shielding destination come
from the portal broadcaster's own routing, so the estimate prices the route it runs.

## Import

```ts
import { estimateExternalTransfer } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const estimate = await estimateExternalTransfer({ fromNetwork, fromCurrency, fromAmount, toNetwork, toCurrency });
```

## Signature

```ts
function estimateExternalTransfer(parameters: EstimateExternalTransferParameters): Promise<EstimateExternalTransferResult>
```

## Returns

`Promise<EstimateExternalTransferResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the estimate; an aborted estimate is never published.

```ts
const result = await estimateExternalTransfer({
  signal, // [!code focus]
  fromNetwork,
  fromCurrency,
  fromAmount,
  toNetwork,
  toCurrency,
});
```

### `fromNetwork`

- **Type:** `Network`
- **Required:** yes

The public network from which funds enter the transfer.

```ts
const result = await estimateExternalTransfer({
  fromNetwork, // [!code focus]
  fromCurrency,
  fromAmount,
  toNetwork,
  toCurrency,
});
```

### `fromCurrency`

- **Type:** `Currency`
- **Required:** yes

The source currency.

```ts
const result = await estimateExternalTransfer({
  fromNetwork,
  fromCurrency, // [!code focus]
  fromAmount,
  toNetwork,
  toCurrency,
});
```

### `fromAmount`

- **Type:** `bigint`
- **Required:** yes

The gross source amount in the source currency's base units.

```ts
const result = await estimateExternalTransfer({
  fromNetwork,
  fromCurrency,
  fromAmount, // [!code focus]
  toNetwork,
  toCurrency,
});
```

### `toNetwork`

- **Type:** `Network`
- **Required:** yes

The public network on which the recipient receives funds.

```ts
const result = await estimateExternalTransfer({
  fromNetwork,
  fromCurrency,
  fromAmount,
  toNetwork, // [!code focus]
  toCurrency,
});
```

### `toCurrency`

- **Type:** `Currency`
- **Required:** yes

The currency the recipient receives.

```ts
const result = await estimateExternalTransfer({
  fromNetwork,
  fromCurrency,
  fromAmount,
  toNetwork,
  toCurrency, // [!code focus]
});
```

### `shieldingNetworkSlug`

- **Type:** `string`
- **Required:** no

The aggregator network the caller expects the deposit to shield on, by slug. The portal broadcaster decides
(in place when the source accepts portal shields, otherwise by the deposit's value), so a different network
fails the estimate instead of pricing a route that will not run.

```ts
const result = await estimateExternalTransfer({
  fromNetwork,
  fromCurrency,
  fromAmount,
  toNetwork,
  toCurrency,
  shieldingNetworkSlug, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await estimateExternalTransfer({
  fromNetwork,
  fromCurrency,
  fromAmount,
  toNetwork,
  toCurrency,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`estimateIntent`](/sdk/actions/planner/estimateIntent) — Select spendable notes and return fees, delivered amount, a sanitized route, and an in-memory handle that can be passed to executeIntent.
- [`executeIntent`](/sdk/actions/planner/executeIntent) — Execute a handle returned by estimateIntent.
- [`getPlanSteps`](/sdk/actions/planner/getPlanSteps) — Return the ordered, sanitized steps an integrator can present to a user.
- [`estimateBridge`](/sdk/actions/bridge/estimateBridge) — Quote a bridge/swap before committing — for the swap UI (in-app/public) and send-with-exit-bridge.

## Source

[packages/@0xcurvy/sdk/src/actions/planner/estimateExternalTransfer.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/planner/estimateExternalTransfer.ts)
