---
title: createNativeCurvyConfig
description: Creates a Curvy config for React Native and other hosts that supply their own core, crypto, prover and storage.
---

# createNativeCurvyConfig

Creates a [`CurvyConfig`](/sdk/config/) for hosts without a browser or Node runtime, such as React Native. The host owns every native dependency: the Rust core, the crypto backend, the prover and the durable storage. Secrets are not kept in a browser keystore; restore them from the host's secure storage with [`restoreSession`](/sdk/actions/auth/restoreSession).

## Import

```ts
import { createNativeCurvyConfig } from "@0xcurvy/curvy-sdk/config";
```

The `react-native` export condition resolves this entry point to the native build.

## Usage

```ts
const config = await createNativeCurvyConfig({
  environment: "mainnet",
  core,     // host-provided Rust core binding
  crypto,   // host-provided crypto backend
  prover,   // host-provided prover
  storage,  // host-provided durable storage adapter
});

const portfolio = await getPortfolio({ config, accountId });
```

## Returns

`Promise<CurvyConfig>`

## Parameters

Accepts the parameters of [`createCurvyConfig`](/sdk/config/createCurvyConfig) except the browser and Node specific ones (`wasmUrl`, `wasmModule`, `rustCoreThreads`, `rustProverThreads`, `enableKeystore`). Two shapes are accepted:

- **Live config:** `core`, `crypto`, `prover` and `storage` are all required.
- **Bootstrap config:** `bootstrap` and `storage` are required, and `core`, `crypto` and `prover` are optional. A bootstrap config serves cached reads and cannot make network, RPC or proving requests.

Missing a required dependency throws before any config is created.

### `setAsActive`

- **Type:** `boolean`
- **Default:** `false`

The config is not registered globally. Pass it explicitly to every action.

### `enableKeystore`

Always `false`. Session persistence belongs to the host's secure storage.

## Lifecycle

Destroy the config with [`destroyConfig`](/sdk/config/destroyConfig) when the host releases it.

```ts
await config.destroy();
```
