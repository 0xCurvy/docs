---
title: peekCurvyConfig
description: Reads the ambient Curvy config without throwing.
---

# peekCurvyConfig

Reads the [ambient config](/sdk/config/#ambient-config) without requiring one to exist.

## Import

```ts
import { peekCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const config = peekCurvyConfig();
if (config) {
  // An ambient config is registered.
}
```

## Returns

`CurvyConfig | null`

## Parameters

This function takes no parameters.

## Related

- [`getCurvyConfig`](/sdk/config/getCurvyConfig) — require an ambient config
- [`setCurvyConfig`](/sdk/config/setCurvyConfig) — replace or clear the ambient value
- [`destroyConfig`](/sdk/config/destroyConfig) — release a config's resources
