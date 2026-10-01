# pauseBalanceRefresh

Pause new balance refreshes for an account.

Defaults `accountId` to the active account (`state.activeAccountId`).

## Import

```ts
import { pauseBalanceRefresh } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
pauseBalanceRefresh();             // active account
pauseBalanceRefresh({ accountId }); // explicit account
```

## Signature

```ts
function pauseBalanceRefresh(parameters?: PauseBalanceRefreshParameters): void
```

## Returns

`void`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose balance-refresh lock should be paused. Defaults to the active account.

```ts
pauseBalanceRefresh({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
pauseBalanceRefresh({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`getBalances`](/sdk/actions/balances/getBalances) — Get an account's shielded balances from storage, optionally refreshing first.
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.
- [`getScanProgress`](/sdk/actions/balances/getScanProgress) — Read the current balance-scan progress from 0 to 100.
- [`resumeBalanceRefresh`](/sdk/actions/balances/resumeBalanceRefresh) — Allow balance refreshes for an account after a matching pause.

## Source

[packages/@0xcurvy/sdk/src/actions/balances/pauseBalanceRefresh.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/balances/pauseBalanceRefresh.ts)
