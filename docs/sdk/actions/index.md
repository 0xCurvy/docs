---
title: Introduction to actions
description: Understand and browse the Curvy SDK's public actions.
---

# Introduction to actions

Actions are standalone functions that read or change Curvy state. They are imported from `@0xcurvy/curvy-sdk/actions` and operate through a [`CurvyConfig`](/sdk/config/).

```ts
import { getBalances, refreshBalances } from "@0xcurvy/curvy-sdk/actions";

await refreshBalances({ config });
const balances = await getBalances({ config });
```

## Parameters

Most actions use parameter objects so optional values remain explicit and signatures can evolve without positional arguments. Event subscription actions retain a natural listener signature.

```ts
const balances = await getBalances({
  accountId,
  cached: false,
  config,
});
```

The `config` property is optional when an ambient browser config exists. Pass it explicitly in shared libraries, tests, and server applications.

## Action groups

| Group | Purpose |
| --- | --- |
| Account | Manage accounts, active-account state, keys, and subscriptions. |
| Authentication | Register, log in, restore sessions, and log out. |
| Balances | Read balances and control note synchronization. |
| Networks | Read networks, switch environments, and resolve Curvy IDs. |
| Events | Subscribe and unsubscribe from typed SDK events. |
| History | Read user-facing transaction and intent history. |
| Planner | Estimate intents and execute plan trees. |
| Aggregator | Build, submit, relay, and price private transactions. |
| Bridge | Estimate cross-chain bridge routes. |
| Portals | Generate and inspect entry and exit Portals. |
| Recovery | Find owned Portals and recover assets. |
| Notes | Synchronize notes and resolve spend witnesses. |
| Proving | Generate aggregation and withdrawal proofs. |
| Storage | Reset and reconstruct SDK-derived storage. |

Every public action is available in the Actions navigation. Each reference page contains its import, usage, signature, return type, parameters, errors, and source.

## High-level and low-level actions

Prefer high-level actions such as `aggregate`, `withdraw`, and `executePlan` for ordinary application flows. Builder, proving, submission, and tree-walking actions are available when an integration needs control over an intermediate step.

## Errors

Actions propagate typed SDK errors and errors from their underlying runtime or transport. Handle errors at the boundary where the application can offer a meaningful retry or recovery path.
