---
title: createCurvyConfig
description: Creates and initializes a Curvy SDK config.
---

# createCurvyConfig

Creates a [`CurvyConfig`](#returns) containing the SDK's API clients, storage, reactive state, event emitter, keyring, proving runtime, and network metadata.

## Import

```ts
import { createCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const config = await createCurvyConfig({
  environment: "mainnet",
  enableKeystore: true,
});

try {
  // Call Curvy actions.
} finally {
  await config.destroy();
}
```

`createCurvyConfig` fetches network and protocol metadata before resolving. It throws if the chosen environment has no active networks.

::: warning Lifecycle
Call `config.destroy()` when the config is no longer needed. It stops refresh timers, detaches event listeners, releases memoized clients, and destroys the prover when supported.
:::

## Returns

`Promise<CurvyConfig>`

The returned config exposes the current `state`, a reactive `subscribe` function, storage and API adapters, the in-memory account `keyring`, and `destroy()`.

## Parameters

### `environment`

- **Type:** `"mainnet" | "testnet"`
- **Default:** `"mainnet"`

Selects the active network environment.

### Service URLs

- **Type:** `string | undefined`

`apiBaseUrl` is the fallback backend URL. `metadataBaseUrl`, `indexerBaseUrl`, and `relayerBaseUrl` can route those services independently. Use `indexerBaseUrlsByChainId` for per-chain indexers:

```ts
const config = await createCurvyConfig({
  apiBaseUrl: "https://api.example.com",
  metadataBaseUrl: "https://metadata.example.com",
  indexerBaseUrl: "https://indexer.example.com",
  indexerBaseUrlsByChainId: {
    "1": "https://ethereum-indexer.example.com",
    "8453": "https://base-indexer.example.com",
  },
  relayerBaseUrl: "https://relayer.example.com",
});
```

### `storage`

- **Type:** `StorageInterface | undefined`
- **Default:** in-memory `MapStorage`

Controls persistence for accounts, balances, note synchronization, and transaction history. Browser integrations normally use [`createBrowserCurvyConfig`](/sdk/config/createBrowserCurvyConfig), which supplies persistent IndexedDB storage.

### `enableKeystore`

- **Type:** `boolean`
- **Default:** `false`

Enables browser-only session key and JWT rehydration. It has no effect when no browser `window` is available.

### `setAsActive`

- **Type:** `boolean`
- **Default:** `true`

Registers this config as the ambient default used by actions that receive no explicit `config`.

```ts
const config = await createCurvyConfig({
  setAsActive: false,
});

const balances = await getBalances({ config });
```

Set this to `false` in multi-tenant processes and pass `config` to every action.

### Runtime and proving options

Advanced integrations can provide `customFetch`, `timerProvider`, `wasmUrl`, `wasmModule`, `core`, `prover`, `circuitKeysBaseUrl`, or `circuitKeyCache`. `notesSyncEngine`, `rustCoreThreads`, and `rustProverThreads` select synchronization and threaded WASM behavior.

Use these options when embedding Curvy in a constrained runtime or replacing a platform service; ordinary browser applications can rely on the defaults.
