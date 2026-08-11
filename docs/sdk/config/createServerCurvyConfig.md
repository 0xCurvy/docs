---
title: createServerCurvyConfig
description: Creates an isolated Curvy config with server-safe defaults.
---

# createServerCurvyConfig

Creates a [`CurvyConfig`](/sdk/config/) with defaults for servers, workers, and multi-tenant processes.

## Import

```ts
import { createServerCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const config = await createServerCurvyConfig({
  environment: "mainnet",
  apiBaseUrl: process.env.CURVY_API_BASE_URL,
});

const balances = await getBalances({ config, accountId });
```

## Returns

`Promise<CurvyConfig>`

## Parameters

Accepts the same parameters as [`createCurvyConfig`](/sdk/config/createCurvyConfig).

### `enableKeystore`

- **Type:** `boolean`
- **Default:** `false`

Browser session persistence is disabled.

### `setAsActive`

- **Type:** `boolean`
- **Default:** `false`

The config is not registered globally. Pass it explicitly to every action so concurrent requests cannot share ambient account state.

## Lifecycle

Destroy request-scoped or tenant-scoped configs when their owner is released.

```ts
await config.destroy();
```

