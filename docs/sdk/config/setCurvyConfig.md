---
title: setCurvyConfig
description: Replaces or clears the ambient Curvy config.
---

# setCurvyConfig

Sets the [ambient config](/sdk/config/#ambient-config) used by actions that do not receive an explicit `config`.

## Import

```ts
import { setCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
setCurvyConfig(config);
```

Passing `null` clears the ambient reference:

```ts
setCurvyConfig(null);
```

::: warning Lifecycle
Replacing or clearing the ambient reference does not destroy the previous config. Call [`destroyConfig`](/sdk/config/destroyConfig) first when that config is no longer needed.
:::

## Returns

`void`

## Parameters

### `config`

- **Type:** `CurvyConfig | null`
- **Required:** yes

The config to register, or `null` to clear the current ambient value.

```ts
setCurvyConfig(
  config, // [!code focus]
);
```

## Related

- [`getCurvyConfig`](/sdk/config/getCurvyConfig)
- [`peekCurvyConfig`](/sdk/config/peekCurvyConfig)
- [`destroyConfig`](/sdk/config/destroyConfig)
