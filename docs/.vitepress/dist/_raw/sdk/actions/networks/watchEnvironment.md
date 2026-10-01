# watchEnvironment

Subscribe to changes of the config's network environment.

## Import

```ts
import { watchEnvironment } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const unsubscribe = watchEnvironment({ onChange: (env) => console.log(env) });
// later: unsubscribe();
```

## Signature

```ts
function watchEnvironment(parameters: WatchEnvironmentParameters): () => void
```

## Returns

`() => void`

The action resolves or returns the value shown in the signature.

## Parameters

### `onChange`

- **Type:** `(environment: NETWORK_ENVIRONMENT_VALUES) => void`
- **Required:** yes

Invoked whenever the config's environment changes.

```ts
const result = watchEnvironment({
  onChange, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = watchEnvironment({
  onChange,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Config guide](/sdk/config/)
- [`getNetworks`](/sdk/actions/networks/getNetworks) — Get the known networks, optionally narrowed by a filter.
- [`getNetwork`](/sdk/actions/networks/getNetwork) — Get exactly one network matching the filter, throwing if zero or many match.
- [`switchNetworkEnvironment`](/sdk/actions/networks/switchNetworkEnvironment) — Switch the active network environment, recomputing the active network set.
- [`ensResolveCurvyId`](/sdk/actions/networks/ensResolveCurvyId) — Resolve a Curvy handle to an on-chain address via ENS for the active environment.

## Source

[packages/@0xcurvy/sdk/src/actions/networks/watchEnvironment.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/networks/watchEnvironment.ts)
