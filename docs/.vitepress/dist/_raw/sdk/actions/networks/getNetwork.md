# getNetwork

Get exactly one network matching the filter, throwing if zero or many match.

## Import

```ts
import { getNetwork } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const ethereum = getNetwork({ filter: "ethereum" });
```

## Signature

```ts
function getNetwork(parameters?: GetNetworkParameters): Network
```

## Returns

`Network`

The action resolves or returns the value shown in the signature.

## Parameters

### `filter`

- **Type:** `NetworkFilter`
- **Required:** no

Optional filter (slug, id, array, boolean testnet flag, or callback).

```ts
const result = getNetwork({
  filter, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getNetwork({
  config, // [!code focus]
});
```

## Errors

- when no network matches or more than one network matches.

## Related

- [Config guide](/sdk/config/)
- [`getNetworks`](/sdk/actions/networks/getNetworks) — Get the known networks, optionally narrowed by a filter.
- [`switchNetworkEnvironment`](/sdk/actions/networks/switchNetworkEnvironment) — Switch the active network environment, recomputing the active network set.
- [`watchEnvironment`](/sdk/actions/networks/watchEnvironment) — Subscribe to changes of the config's network environment.
- [`ensResolveCurvyId`](/sdk/actions/networks/ensResolveCurvyId) — Resolve a Curvy handle to an on-chain address via ENS for the active environment.

## Source

[packages/@0xcurvy/sdk/src/actions/networks/getNetwork.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/networks/getNetwork.ts)
