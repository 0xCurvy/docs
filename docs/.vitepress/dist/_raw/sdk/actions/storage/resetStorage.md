# resetStorage

Clear chain-derived cache and rebuild it from the live account registry:

1. stop the price-refresh timer,
2. atomically clear balances, notes-tree state, and the hot projection,
3. restart the price-refresh timer (running once immediately),
4. ensure each known account remains persisted, then
5. refresh balances for each unlocked account and return their outcomes.
Locked accounts retain their metadata and rescan after unlocking.

Finalized transaction history and locally-authored transfer workflow records
are preserved. Account discovery cursors are reset so the next sync backfills
every committed note instead of skipping leaves from the cleared tree.

## Import

```ts
import { resetStorage } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await resetStorage();
```

## Signature

```ts
function resetStorage(parameters?: ResetStorageParameters): Promise<RefreshBalancesResult[]>
```

## Returns

`Promise<RefreshBalancesResult[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the rebuild after the cache has been cleared.

```ts
const result = await resetStorage({
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await resetStorage({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Config guide](/sdk/config/)
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.

## Source

[packages/@0xcurvy/sdk/src/actions/storage/resetStorage.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/storage/resetStorage.ts)
