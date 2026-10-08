---
title: acceptsPortalShield
description: Returns whether portals may be shielded on a network.
---

# acceptsPortalShield

Returns whether portal deposits may be shielded on a network.

Carrying an `aggregatorContractAddress` is not enough. A direct-shield-only deployment
(such as Gnosis) has no portal factory, so every portal shield there reverts. Network
metadata flags such a network with `portalShieldEnabled: false`, and the backend applies
the same predicate. Anything that models the deposit pipeline — the shielding target, the
entry bridge, fee estimates — should use this rather than the bare address.

Direct shielding from a wallet the user controls is unaffected.

## Import

```ts
import { acceptsPortalShield } from "@0xcurvy/curvy-sdk/config";
```

## Usage

Shield on the source chain when it accepts portal deposits, and fall back to the default
aggregator network otherwise:

```ts
const shielding = acceptsPortalShield(fromNetwork) ? fromNetwork : getDefaultAggregatorNetwork();
```

## Returns

`boolean`

`true` when the network has an aggregator and does not opt out of portal shielding.
Metadata that predates `portalShieldEnabled` is treated as portal-capable.

## Parameters

### `network`

- **Type:** `Network`

The network to check.

## Related

- [`getDefaultAggregatorNetwork`](/sdk/config/getDefaultAggregatorNetwork)
- [`getActiveNetworks`](/sdk/config/getActiveNetworks)
