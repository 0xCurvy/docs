---
title: destroyConfig
description: Destroys a Curvy config and clears it when it is the ambient config.
---

# destroyConfig

Stops a config's timers, detaches API listeners, releases its prover, and clears the ambient reference when it points to that config.

## Import

```ts
import { destroyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
await destroyConfig({ config });
```

Call `destroyConfig()` without parameters to destroy the current [ambient config](/sdk/config/#ambient-config).

## Returns

`Promise<void>`

## Parameters

### `config` (optional)

- **Type:** `CurvyConfig`

The config to destroy. When omitted, the ambient config is used.

```ts
await destroyConfig({
  config, // [!code focus]
});
```

## Errors

Throws `NoCurvyConfigError` when no explicit or ambient config is available.

## Related

- [`createCurvyConfig`](/sdk/config/createCurvyConfig)
- [`getCurvyConfig`](/sdk/config/getCurvyConfig)
- [`setCurvyConfig`](/sdk/config/setCurvyConfig)
