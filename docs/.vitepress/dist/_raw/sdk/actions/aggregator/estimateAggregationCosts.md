# estimateAggregationCosts

Load the inputs needed to allocate an aggregation. Relay estimates require a
current paymaster quote; direct estimates do not contact the paymaster.

## Import

```ts
import { estimateAggregationCosts } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const costs = await estimateAggregationCosts({
  config,
  networkSlug: network.slug,
  token: inputNotes[0].token,
  spentToOthers,
});
```

## Signature

```ts
function estimateAggregationCosts(params: EstimateAggregationCostsParams): Promise<AggregationCostEstimate>
```

## Returns

`Promise<AggregationCostEstimate>`

The action resolves or returns the value shown in the signature.

## Parameters

### `config`

- **Type:** `CurvyConfig`
- **Required:** yes

Curvy config to use. Defaults to the ambient config.

```ts
const result = await estimateAggregationCosts({
  config, // [!code focus]
  networkSlug,
  token,
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** yes

The aggregator network whose proving and relay costs should be estimated.

```ts
const result = await estimateAggregationCosts({
  config,
  networkSlug, // [!code focus]
  token,
});
```

### `token`

- **Type:** `bigint`
- **Required:** yes

Aggregation token (vault token id).

```ts
const result = await estimateAggregationCosts({
  config,
  networkSlug,
  token, // [!code focus]
});
```

### `submissionMode`

- **Type:** `"relay" | "direct"`
- **Required:** no

Direct submissions do not create a relay reimbursement output.

```ts
const result = await estimateAggregationCosts({
  config,
  networkSlug,
  token,
  submissionMode, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`aggregate`](/sdk/actions/aggregator/aggregate) — One-call AGGREGATE: build the proof from committed notes and send it in one shot, either via the user's wallet (via.kind === "wallet") or the relay service (via.kind === "relay").
- [`withdraw`](/sdk/actions/aggregator/withdraw) — One-call WITHDRAW: build the proof from committed notes and send it in one shot, via the user's wallet or the relay service.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/internal/estimateAggregationCosts.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/internal/estimateAggregationCosts.ts)
