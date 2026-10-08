# estimateBridge

Quote a bridge/swap before committing — for the swap UI (in-app/public) and send-with-exit-bridge.
Uses the broadcaster’s route planner, including its exit-portal carve. The route costs
`carve + providerFee` in `fromToken` units: `nativeFeeWei` is already inside `carve`, and
`providerFee` is what the provider (LiFi, the bridge, the integrator) deducts on the way.
`toAmount` is the expected delivery and `toAmountMin` the current route's slippage floor.
Execution quotes a fresh route, so neither is guaranteed. Amounts are bigint base units.
Throws `FeeEstimateUnavailableError` when the provider's fees could not be priced.

## Import

```ts
import { estimateBridge } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const q = await estimateBridge({
  fromChainId, toChainId, fromToken, toToken,
  fromAmount: amount.toString(), fromAddress: portalAddress,
});
// q.toAmount → expected delivery; q.carve + q.providerFee → route cost in fromToken
```

## Signature

```ts
function estimateBridge(parameters: EstimateBridgeParameters): Promise<BridgeEstimate>
```

## Returns

`Promise<BridgeEstimate>`

The action resolves or returns the value shown in the signature.

## Parameters

### `fromChainId`

- **Type:** `number`
- **Required:** yes

The source chain identifier.

```ts
const result = await estimateBridge({
  fromChainId, // [!code focus]
  toChainId,
  fromToken,
  toToken,
  fromAmount,
  fromAddress,
});
```

### `toChainId`

- **Type:** `number`
- **Required:** yes

The destination chain identifier.

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId, // [!code focus]
  fromToken,
  toToken,
  fromAmount,
  fromAddress,
});
```

### `fromToken`

- **Type:** `string`
- **Required:** yes

The source token address.

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId,
  fromToken, // [!code focus]
  toToken,
  fromAmount,
  fromAddress,
});
```

### `toToken`

- **Type:** `string`
- **Required:** yes

The destination token address.

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId,
  fromToken,
  toToken, // [!code focus]
  fromAmount,
  fromAddress,
});
```

### `fromAmount`

- **Type:** `string`
- **Required:** yes

Gross input amount, decimal string (base units of `fromToken`).

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId,
  fromToken,
  toToken,
  fromAmount, // [!code focus]
  fromAddress,
});
```

### `fromAddress`

- **Type:** `string`
- **Required:** yes

The sender address used for the quote (typically the deterministic portal address).

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId,
  fromToken,
  toToken,
  fromAmount,
  fromAddress, // [!code focus]
});
```

### `toAddress`

- **Type:** `string`
- **Required:** no

Destination receiver; defaults to `fromAddress` when omitted.

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId,
  fromToken,
  toToken,
  fromAmount,
  fromAddress,
  toAddress, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await estimateBridge({
  fromChainId,
  toChainId,
  fromToken,
  toToken,
  fromAmount,
  fromAddress,
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
- [`estimateExternalTransfer`](/sdk/actions/planner/estimateExternalTransfer) — Pre-deposit estimate for a swap-public-style external transfer.

## Source

[packages/@0xcurvy/sdk/src/actions/bridge/estimateBridge.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/bridge/estimateBridge.ts)
