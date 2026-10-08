# refreshBalances

Re-sync and persist an account's shielded balances.

Owns the state-store + event-emitter choreography: flip `state.scan`, emit
`balance-refresh-*`, and guard re-entrancy with a per-`accountId` lock. The
actual work delegates to [`syncNotes`](/sdk/actions/notes/syncNotes), which folds the notes-tree delta,
discovers owned notes locally (WASM-Core ECDH), reconciles spends, and writes
balance entries + tx history through `config.storage` for every active
aggregator network. A wallet with no such network is a graceful no-op.

## Import

```ts
import { refreshBalances } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await refreshBalances();               // active account
await refreshBalances({ accountId });   // explicit account
```

## Signature

```ts
function refreshBalances(parameters?: RefreshBalancesParameters): Promise<RefreshBalancesResult>
```

## Returns

`Promise<RefreshBalancesResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

An abort signal used to cancel the refresh between network and paging operations.

```ts
const result = await refreshBalances({
  signal, // [!code focus]
});
```

### `silent`

- **Type:** `boolean`
- **Required:** no

Whether to suppress balance-refresh lifecycle events for this refresh.

```ts
const result = await refreshBalances({
  silent: true, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose shielded balances should be refreshed. Defaults to the active account.

```ts
const result = await refreshBalances({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await refreshBalances({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`getBalances`](/sdk/actions/balances/getBalances) — Get an account's shielded balances from storage, optionally refreshing first.
- [`getScanProgress`](/sdk/actions/balances/getScanProgress) — Read the current balance-scan progress from 0 to 100.
- [`pauseBalanceRefresh`](/sdk/actions/balances/pauseBalanceRefresh) — Pause new balance refreshes for an account.
- [`resumeBalanceRefresh`](/sdk/actions/balances/resumeBalanceRefresh) — Allow balance refreshes for an account after a matching pause.
- [`syncNotes`](/sdk/actions/notes/syncNotes) — Run one notes-tree sync pass per network: pull the indexer delta, discover owned notes, reconcile spends, verify the assembled root against a DIRECT chain read, persist, and apply the account-facing effects (balance entries + tx history).

## Source

[packages/@0xcurvy/sdk/src/actions/balances/refreshBalances.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/balances/refreshBalances.ts)
