# resumeBalanceRefresh

Allow balance refreshes for an account after a matching pause.

Defaults `accountId` to the active account (`state.activeAccountId`).

## Import

```ts
import { resumeBalanceRefresh } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
resumeBalanceRefresh();             // active account
resumeBalanceRefresh({ accountId }); // explicit account
```

## Signature

```ts
function resumeBalanceRefresh(parameters?: ResumeBalanceRefreshParameters): void
```

## Returns

`void`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose balance-refresh lock should be resumed. Defaults to the active account.

```ts
resumeBalanceRefresh({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
resumeBalanceRefresh({
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
- [`pauseBalanceRefresh`](/sdk/actions/balances/pauseBalanceRefresh) — Pause new balance refreshes for an account.

## Source

[packages/@0xcurvy/sdk/src/actions/balances/resumeBalanceRefresh.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/balances/resumeBalanceRefresh.ts)
