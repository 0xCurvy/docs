---
title: Curvy SDK
description: A typed, functional SDK for building private asset flows with Curvy.
---

# Curvy SDK

The Curvy SDK is a framework-agnostic TypeScript interface for private transfers, swaps, withdrawals, and recovery. It provides a small configuration layer and standalone actions with typed parameters and results.

```ts
import { createBrowserCurvyConfig } from "@0xcurvy/curvy-sdk/config";
import { getBalances } from "@0xcurvy/curvy-sdk/actions";

const config = await createBrowserCurvyConfig();
const balances = await getBalances({ config });
```

## Overview

The SDK is organized around two concepts:

- A [`CurvyConfig`](/sdk/config/) owns network metadata, storage, account state, API clients, proving, and lifecycle.
- [Actions](/sdk/actions/) are standalone functions that read or change protocol state through a config.

This keeps the API composable: applications can use the ambient browser config for convenience or pass an explicit config for tests, servers, and multi-instance processes.

## Design goals

### Typed

Parameters, results, events, plans, networks, and protocol values are TypeScript-first. Action pages show the exact public signatures and are generated from the SDK source.

### Composable

High-level actions such as `aggregate` and `executePlan` cover common flows. Lower-level actions remain available when an application needs to inspect, submit, or relay intermediate results itself.

### Runtime-aware

Browser and server constructors choose safe defaults for storage, session handling, and ambient state. The same actions work in both environments.

### Explicit about lifecycle

A config can own timers, listeners, caches, and a proving runtime. Destroy it when its lifetime ends.

## Documentation

- [Getting started](/sdk/getting-started) installs the package and runs the first action.
- [Config](/sdk/config/) explains browser, server, and custom configuration.
- [Actions](/sdk/actions/) introduces the action model and links to every public action.
- [TypeScript](/sdk/typescript) covers inference, imports, literal types, and `bigint` values.
- [Developer guides](/for-programmers/) combine actions into complete application flows.

