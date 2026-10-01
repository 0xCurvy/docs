---
title: getEnvironment
description: Returns a Curvy config's current network environment.
---

# getEnvironment

Returns the config's current network environment.

## Import

```ts
import { getEnvironment } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const environment = getEnvironment({ config });
```

## Returns

`"mainnet" | "testnet"`

## Parameters

### `config` (optional)

- **Type:** `CurvyConfig`

The config to read. When omitted, the ambient config is used.

```ts
const environment = getEnvironment({
  config, // [!code focus]
});
```

## Related

- [`getActiveNetworks`](/sdk/config/getActiveNetworks)
- [`switchNetworkEnvironment`](/sdk/actions/networks/switchNetworkEnvironment)
- [`watchEnvironment`](/sdk/actions/networks/watchEnvironment)
