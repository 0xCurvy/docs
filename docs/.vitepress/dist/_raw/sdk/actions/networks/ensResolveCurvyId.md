# ensResolveCurvyId

Resolve a Curvy handle to an on-chain address via ENS for the active environment.

## Import

```ts
import { ensResolveCurvyId } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const address = await ensResolveCurvyId({ handle: "alice.curvy.name" });
```

## Signature

```ts
function ensResolveCurvyId(parameters: EnsResolveCurvyIdParameters): Promise<HexString>
```

## Returns

`Promise<\`0x${string}\`>`

The action resolves or returns the value shown in the signature.

## Parameters

### `handle`

- **Type:** `CurvyId`
- **Required:** yes

The Curvy handle to resolve via ENS.

```ts
const result = await ensResolveCurvyId({
  handle, // [!code focus]
});
```

### `slip0044`

- **Type:** `bigint`
- **Required:** no

Optional SLIP-0044 coin type to resolve a chain-specific address.

```ts
const result = await ensResolveCurvyId({
  handle,
  slip0044, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await ensResolveCurvyId({
  handle,
  config, // [!code focus]
});
```

## Errors

- when the handle cannot be resolved.

## Related

- [Config guide](/sdk/config/)
- [`getNetworks`](/sdk/actions/networks/getNetworks) — Get the known networks, optionally narrowed by a filter.
- [`getNetwork`](/sdk/actions/networks/getNetwork) — Get exactly one network matching the filter, throwing if zero or many match.
- [`switchNetworkEnvironment`](/sdk/actions/networks/switchNetworkEnvironment) — Switch the active network environment, recomputing the active network set.
- [`watchEnvironment`](/sdk/actions/networks/watchEnvironment) — Subscribe to changes of the config's network environment.

## Source

[packages/@0xcurvy/sdk/src/actions/networks/ensResolveCurvyId.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/networks/ensResolveCurvyId.ts)
