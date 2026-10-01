# getNetworks

Get the known networks, optionally narrowed by a filter.

## Import

```ts
import { getNetworks } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const all = getNetworks();                       // every known network
const testnets = getNetworks({ filter: true });  // testnets only
const sepolia = getNetworks({ filter: "ethereum-sepolia" });
```

## Signature

```ts
function getNetworks(parameters?: GetNetworksParameters): Network[]
```

## Returns

`Network[]`

The action resolves or returns the value shown in the signature.

## Parameters

### `filter`

- **Type:** `NetworkFilter`
- **Required:** no

Optional filter (slug, id, array, boolean testnet flag, or callback).

```ts
const result = getNetworks({
  filter, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getNetworks({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Config guide](/sdk/config/)
- [`getNetwork`](/sdk/actions/networks/getNetwork) — Get exactly one network matching the filter, throwing if zero or many match.
- [`switchNetworkEnvironment`](/sdk/actions/networks/switchNetworkEnvironment) — Switch the active network environment, recomputing the active network set.
- [`watchEnvironment`](/sdk/actions/networks/watchEnvironment) — Subscribe to changes of the config's network environment.
- [`ensResolveCurvyId`](/sdk/actions/networks/ensResolveCurvyId) — Resolve a Curvy handle to an on-chain address via ENS for the active environment.

## Source

[packages/@0xcurvy/sdk/src/actions/networks/getNetworks.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/networks/getNetworks.ts)
