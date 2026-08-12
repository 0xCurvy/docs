---
title: getActiveNetworks
description: Returns the networks active for a Curvy config's current environment.
---

# getActiveNetworks

Returns the networks active for the config's current `"mainnet"` or `"testnet"` environment.

## Import

```ts
import { getActiveNetworks } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const networks = getActiveNetworks({ config });
```

Use [`getNetworks`](/sdk/actions/networks/getNetworks) when you also need to apply a network filter.

## Returns

`Network[]`

## Parameters

### `config` (optional)

- **Type:** `CurvyConfig`

The config to read. When omitted, the ambient config is used.

```ts
const networks = getActiveNetworks({
  config, // [!code focus]
});
```

## Related

- [`getEnvironment`](/sdk/config/getEnvironment)
- [`getNetworks`](/sdk/actions/networks/getNetworks)
- [`switchNetworkEnvironment`](/sdk/actions/networks/switchNetworkEnvironment)
