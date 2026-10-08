---
title: getProtocol
description: Returns an aggregator deployment's ZK proving configuration.
---

# getProtocol

Returns the ZK proving parameters — the aggregation, withdrawal, and note-ownership
circuits — for one aggregator deployment, loaded during config creation.

Proving config is **per network**. Each aggregator deployment may run its own circuit
dimensions (a cheap L2 can afford a 10-input aggregation circuit where an L1 wants 2),
so the circuit a proof is built against depends on which network it will be submitted
to. Always pass the spend's `network`; a proof built with another chain's dimensions
will not verify.

## Import

```ts
import { getProtocol } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const proving = getProtocol({ config, network });

proving.aggregation.maxInputs; // how many notes one aggregation can consume
proving.withdrawal.groupFee; // the deployment's withdrawal fee, per thousand
```

## Returns

`ProvingConfig`

## Parameters

### `network` (optional)

- **Type:** `Network`

The network the proof will be submitted to. Omit it to get the **default** aggregator's
config — the one portals route to for the current environment (see
[`getDefaultAggregatorNetwork`](/sdk/config/getDefaultAggregatorNetwork)). A network with
no entry of its own also falls back to the default.

```ts
const proving = getProtocol({
  network, // [!code focus]
});
```

### `config` (optional)

- **Type:** `CurvyConfig`

The config to read. When omitted, the ambient config is used.

```ts
const proving = getProtocol({
  config, // [!code focus]
});
```

## Errors

Throws when no config is available or protocol metadata has not finished loading.

## Notes

The protocol **fee collector** is not returned here — it is genuinely protocol-global
(one collector identity shared by every aggregator) and lives at
`config.state.protocol.feeCollector`.

## Related

- [`createCurvyConfig`](/sdk/config/createCurvyConfig)
- [`getActiveNetworks`](/sdk/config/getActiveNetworks)
- [`getDefaultAggregatorNetwork`](/sdk/config/getDefaultAggregatorNetwork)
