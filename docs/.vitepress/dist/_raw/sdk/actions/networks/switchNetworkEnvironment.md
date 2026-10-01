# switchNetworkEnvironment

Switch the active network environment, recomputing the active network set.

When `environment` is omitted the current environment is toggled. The RPC
client is rebuilt lazily by `config.getRpc` per environment, so no transport
is touched here — only reactive state is updated.

## Import

```ts
import { switchNetworkEnvironment } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await switchNetworkEnvironment();                          // toggle
await switchNetworkEnvironment({ environment: "testnet" });
```

## Signature

```ts
function switchNetworkEnvironment(parameters?: SwitchNetworkEnvironmentParameters): Promise<NETWORK_ENVIRONMENT_VALUES>
```

## Returns

`Promise<"testnet" | "mainnet">`

The action resolves or returns the value shown in the signature.

## Parameters

### `environment`

- **Type:** `"mainnet" | "testnet"`
- **Required:** no

Target environment. When omitted, toggles the current environment.

```ts
const result = await switchNetworkEnvironment({
  environment, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await switchNetworkEnvironment({
  config, // [!code focus]
});
```

## Errors

- when no networks match the target environment after filtering.
- when the filtered networks mix mainnet and testnet.

## Related

- [Config guide](/sdk/config/)
- [`getNetworks`](/sdk/actions/networks/getNetworks) — Get the known networks, optionally narrowed by a filter.
- [`getNetwork`](/sdk/actions/networks/getNetwork) — Get exactly one network matching the filter, throwing if zero or many match.
- [`watchEnvironment`](/sdk/actions/networks/watchEnvironment) — Subscribe to changes of the config's network environment.
- [`ensResolveCurvyId`](/sdk/actions/networks/ensResolveCurvyId) — Resolve a Curvy handle to an on-chain address via ENS for the active environment.

## Source

[packages/@0xcurvy/sdk/src/actions/networks/switchNetworkEnvironment.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/networks/switchNetworkEnvironment.ts)
