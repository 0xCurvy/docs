---
title: Introduction to config
description: Understand CurvyConfig, runtime defaults, ambient state, and lifecycle.
---

# Introduction to config

A `CurvyConfig` is the runtime context used by Curvy actions. It owns service clients, storage, reactive account and network state, proving, note synchronization, and lifecycle resources.

## Choose a constructor

| Constructor | Use it for | Defaults |
| --- | --- | --- |
| [`createBrowserCurvyConfig`](/sdk/config/createBrowserCurvyConfig) | Browser applications | IndexedDB, session restoration, ambient config |
| [`createServerCurvyConfig`](/sdk/config/createServerCurvyConfig) | Servers and multi-tenant processes | In-memory storage, no keystore, no ambient config |
| [`createCurvyConfig`](/sdk/config/createCurvyConfig) | Custom runtimes and tests | Explicit control over every adapter |

## Explicit config

Pass `config` to actions in tests, servers, and applications that can host more than one Curvy instance.

```ts
const balances = await getBalances({ config });
```

This makes ownership and lifecycle unambiguous and prevents one request from reading another request's ambient state.

## Ambient config

Browser constructors register the new config as the ambient default. A single-instance browser application may omit it from subsequent calls.

```ts
await createBrowserCurvyConfig();
const balances = await getBalances();
```

Prefer explicit config in shared libraries even when the host application uses the ambient form.

## State and subscriptions

`config.state` is the current serializable snapshot. `config.subscribe` observes changes without coupling the SDK to a UI framework. Higher-level event actions such as [`on`](/sdk/actions/events/on) are useful for lifecycle events.

## Lifecycle

Always call [`destroyConfig`](/sdk/config/destroyConfig) when a config's owner is finished with it.

```ts
await config.destroy();
```

Creating a replacement ambient config does not destroy the previous one automatically.

## Reading config state

- [`getCurvyConfig`](/sdk/config/getCurvyConfig) reads the ambient config and throws when none exists.
- [`peekCurvyConfig`](/sdk/config/peekCurvyConfig) performs the same read without throwing.
- [`getActiveNetworks`](/sdk/config/getActiveNetworks), [`getEnvironment`](/sdk/config/getEnvironment), and [`getProtocol`](/sdk/config/getProtocol) read commonly needed config state.
- [`getDefaultAggregatorNetwork`](/sdk/config/getDefaultAggregatorNetwork) returns the network funds are shielded on when a deposit lands on a chain without its own aggregator.
- [`setCurvyConfig`](/sdk/config/setCurvyConfig) replaces or clears the ambient config; it does not destroy the previous value.
