---
title: createBrowserCurvyConfig
description: Creates a Curvy config with browser-safe persistence and session defaults.
---

# createBrowserCurvyConfig

Creates a [`CurvyConfig`](/sdk/config/) with defaults for a browser application.

## Import

```ts
import { createBrowserCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const config = await createBrowserCurvyConfig({
  environment: "mainnet",
});
```

The constructor uses IndexedDB storage, enables session key and JWT restoration, selects sharded note synchronization, and registers the config as the ambient default.

## Returns

`Promise<CurvyConfig>`

## Parameters

Accepts the same parameters as [`createCurvyConfig`](/sdk/config/createCurvyConfig). Browser defaults can be overridden explicitly.

### `storage`

- **Type:** `StorageInterface | undefined`
- **Default:** `IndexedDBStorage`

### `enableKeystore`

- **Type:** `boolean`
- **Default:** `true`

### `notesSyncEngine`

- **Type:** `"global" | "sharded"`
- **Default:** `"sharded"`

## Lifecycle

Call `config.destroy()` when the application instance is disposed.

