---
title: createCurvyConfig
description: Creates and initializes a Curvy SDK config.
---

# createCurvyConfig

Creates a [`CurvyConfig`](/sdk/config/) containing the SDK's API clients, storage, reactive state, event emitter, keyring, proving runtime, and network metadata.

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
Call [`destroyConfig`](/sdk/config/destroyConfig) when the config is no longer needed. It stops refresh timers, detaches event listeners, releases memoized clients, and destroys the prover when supported.
:::

## Returns

`Promise<CurvyConfig>`

The returned config exposes the current `state`, a reactive `subscribe` function, storage and API adapters, the in-memory account `keyring`, and `destroy()`.

## Parameters

### `environment`

- **Type:** `"mainnet" | "testnet"`
- **Default:** `"mainnet"`

Selects the active network environment.

```ts
const config = await createCurvyConfig({
  environment: "testnet", // [!code focus]
});
```

### Service URLs

- **Type:** `string | undefined`

`apiBaseUrl` is the fallback backend URL. `metadataBaseUrl`, `indexerBaseUrl`, and `relayerBaseUrl` can route those services independently. Use `indexerBaseUrlsByChainId` for per-chain indexers:

```ts
const config = await createCurvyConfig({
  apiBaseUrl: "https://api.example.com", // [!code focus]
  metadataBaseUrl: "https://metadata.example.com", // [!code focus]
  indexerBaseUrl: "https://indexer.example.com", // [!code focus]
  indexerBaseUrlsByChainId: { // [!code focus:4]
    "1": "https://ethereum-indexer.example.com",
    "8453": "https://base-indexer.example.com",
  },
  relayerBaseUrl: "https://relayer.example.com", // [!code focus]
});
```

### `storage`

- **Type:** `CurvyStorage | undefined`
- **Default:** in-memory `MapStorage`

Controls persistence for accounts, balances, note synchronization, and transaction history. Browser integrations normally use [`createBrowserCurvyConfig`](/sdk/config/createBrowserCurvyConfig), which supplies persistent IndexedDB storage.

```ts
const config = await createCurvyConfig({
  storage, // [!code focus]
});
```

### `enableKeystore`

- **Type:** `boolean`
- **Default:** `false`

Enables browser-only session key and JWT rehydration. It has no effect when no browser `window` is available.

```ts
const config = await createCurvyConfig({
  enableKeystore: true, // [!code focus]
});
```

### `setAsActive`

- **Type:** `boolean`
- **Default:** `true`

Registers this config as the ambient default used by actions that receive no explicit `config`.

```ts
const config = await createCurvyConfig({
  setAsActive: false, // [!code focus]
});

const balances = await getBalances({ config });
```

Set this to `false` in multi-tenant processes and pass `config` to every action.

### Planner submission

- **`submissionMode` type:** `"relay" | "direct"`
- **Default:** `"relay"`

Relay mode obtains paymaster terms during estimation and sends proofs through
the Curvy relayer. Direct mode submits from a viem `WalletClient` supplied by
the integration:

```ts
const config = await createCurvyConfig({
  submissionMode: "direct", // [!code focus]
  directSubmitter: ({ network }) => getWalletClientForChain(network.chainId), // [!code focus]
});
```

`directSubmitter` receives the target `Network` and returns a `WalletClient`.
Keep private keys in the wallet implementation; the SDK neither accepts nor
stores a submitter private key. An estimate retains its selected mode through
execution because relay reimbursement changes aggregation outputs and fees.
Override the mode on `estimateIntent` or the wallet resolver on `executeIntent`
when an operation needs different settings.

Direct aggregation does not require a paymaster. Withdrawal estimation still
reads the vault's per-token fee because the contract deducts it from delivery
whether the relayer or the caller submits the transaction.

### Runtime and proving options

Advanced integrations can provide `customFetch`, `timerProvider`, `wasmUrl`, `wasmModule`, `core`, `prover`, `circuitKeysBaseUrl`, or `circuitKeyCache`. `notesSyncEngine`, `rustCoreThreads`, and `rustProverThreads` select synchronization and threaded WASM behavior.

```ts
const config = await createCurvyConfig({
  notesSyncEngine: "sharded", // [!code focus]
  rustCoreThreads: 4, // [!code focus]
  rustProverThreads: 1, // [!code focus]
});
```

Use these options when embedding Curvy in a constrained runtime or replacing a platform service; ordinary browser applications can rely on the defaults.
