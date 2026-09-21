---
title: Getting started
description: Install the Curvy SDK, create a config, and call your first action.
---

# Getting started

Get a Curvy client running in a few lines of TypeScript.

## Installation

::: code-group

```bash [pnpm]
pnpm add @0xcurvy/curvy-sdk
```

```bash [npm]
npm install @0xcurvy/curvy-sdk
```

```bash [yarn]
yarn add @0xcurvy/curvy-sdk
```

:::

Node.js 22.16 or newer is required for server applications.

## 1. Create a config

Browser applications should start with [`createBrowserCurvyConfig`](/sdk/config/createBrowserCurvyConfig). It enables IndexedDB persistence and session restoration by default.

```ts
import { createBrowserCurvyConfig } from "@0xcurvy/curvy-sdk/config";

const config = await createBrowserCurvyConfig({
  environment: "mainnet",
});
```

Use [`createServerCurvyConfig`](/sdk/config/createServerCurvyConfig) in a server process. It avoids ambient global state, so pass the config to every action.

## 2. Consume actions

Actions are imported from the single `actions` entrypoint.

```ts
import { getBalances, getNetworks } from "@0xcurvy/curvy-sdk/actions";

const networks = getNetworks({ config });
const balances = await getBalances({ config });
```

Every action accepts typed parameters. Most actions accept `config`; browser applications with one ambient config may omit it.

## 3. Clean up

Destroy the config when its owner unmounts or the process stops.

```ts
await config.destroy();
```

This stops timers, detaches listeners, clears memoized clients, and releases the proving runtime.

## Vite applications

Add the SDK plugin so Vite handles the packaged WASM modules, proving worker, and development isolation headers correctly.

```ts
import { curvy } from "@0xcurvy/curvy-sdk/vite";
import { defineConfig } from "vite";

export default defineConfig({
  plugins: [curvy()],
});
```

## Next steps

- [Understand config and lifecycle](/sdk/config/)
- [Browse public actions](/sdk/actions/)
- [Authenticate a user](/for-programmers/authentication)
- [Query private balances](/for-programmers/querying-balances)
- [Accept payments as a merchant](/sdk/payments/) — separate `@0xcurvy/payments-sdk` package

