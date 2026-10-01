---
title: getDefaultAggregatorNetwork
description: Returns the active network funds are shielded on by default.
---

# getDefaultAggregatorNetwork

Returns the active aggregator network that funds are shielded on when they land on a
chain with no aggregator of its own — the one flagged as the default for the current
(testnet or mainnet) environment.

Curvy can run an aggregator on several networks, at most one per network. Each
testnet/mainnet group names one of them as the default, and that is the network portals
bridge deposits to. Prefer this over picking the first network that happens to carry an
`aggregatorContractAddress`: with several aggregators live, that is whichever the
registry listed first.

## Import

```ts
import { getDefaultAggregatorNetwork } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const shielding = getDefaultAggregatorNetwork({ config });
```

Shield on the source chain when it has its own aggregator, and fall back to the default
otherwise — this mirrors how the backend routes deposits:

```ts
const shielding = fromNetwork.aggregatorContractAddress ? fromNetwork : getDefaultAggregatorNetwork();
```

## Returns

`Network | undefined`

`undefined` when the current environment has no aggregator network at all.

## Parameters

### `config` (optional)

- **Type:** `CurvyConfig`

The config to read. When omitted, the ambient config is used.

```ts
const shielding = getDefaultAggregatorNetwork({
  config, // [!code focus]
});
```

## Related

- [`getActiveNetworks`](/sdk/config/getActiveNetworks)
- [`getEnvironment`](/sdk/config/getEnvironment)
- [`getProtocol`](/sdk/config/getProtocol)
