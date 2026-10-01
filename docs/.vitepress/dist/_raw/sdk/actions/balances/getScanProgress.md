# getScanProgress

Read the current balance-scan progress from 0 to 100.

## Import

```ts
import { getScanProgress } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const pct = getScanProgress();
```

## Signature

```ts
function getScanProgress(parameters?: GetScanProgressParameters): number
```

## Returns

`number`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose scan progress is read. Defaults to the active account.

```ts
const result = getScanProgress({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getScanProgress({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`getBalances`](/sdk/actions/balances/getBalances) — Get an account's shielded balances from storage, optionally refreshing first.
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.
- [`pauseBalanceRefresh`](/sdk/actions/balances/pauseBalanceRefresh) — Pause new balance refreshes for an account.
- [`resumeBalanceRefresh`](/sdk/actions/balances/resumeBalanceRefresh) — Allow balance refreshes for an account after a matching pause.

## Source

[packages/@0xcurvy/sdk/src/actions/balances/getScanProgress.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/balances/getScanProgress.ts)
