---
title: getCurvyConfig
description: Returns the ambient Curvy config and throws when none is registered.
---

# getCurvyConfig

Returns the [ambient config](/sdk/config/#ambient-config) registered by a config constructor or [`setCurvyConfig`](/sdk/config/setCurvyConfig).

## Import

```ts
import { getCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const config = getCurvyConfig();
```

## Returns

`CurvyConfig`

## Parameters

This function takes no parameters.

## Errors

Throws `NoCurvyConfigError` when no ambient config is registered.

## Related

- [`peekCurvyConfig`](/sdk/config/peekCurvyConfig) — read without throwing
- [`setCurvyConfig`](/sdk/config/setCurvyConfig) — replace or clear the ambient value
- [`destroyConfig`](/sdk/config/destroyConfig) — destroy resources before clearing a config
