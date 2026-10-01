# getBalances

Get an account's shielded balances from storage, optionally refreshing first.

## Import

```ts
import { getBalances } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await getBalances();                       // active account, cached
await getBalances({ accountId });           // explicit account
await getBalances({ cached: false });      // refresh from chain first
```

## Signature

```ts
function getBalances(parameters?: GetBalancesParameters): Promise<BalanceEntry[]>
```

## Returns

`Promise<BalanceEntry[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `cached`

- **Type:** `boolean`
- **Required:** no

When `false`, refresh from chain first. Defaults to `true` (cached).

```ts
const result = await getBalances({
  cached: false, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

Target a specific account; defaults to the active account.

```ts
const result = await getBalances({
  accountId, // [!code focus]
});
```

### `inputFinalityPolicy`

- **Type:** `InputFinalityPolicy`
- **Required:** no

Override account preference for this read.

```ts
const result = await getBalances({
  inputFinalityPolicy: "finalized", // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getBalances({
  config, // [!code focus]
});
```

## Errors

- `NoActiveAccountError` when no `accountId` is given and no account is active.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.
- [`getScanProgress`](/sdk/actions/balances/getScanProgress) — Read the current balance-scan progress from 0 to 100.
- [`pauseBalanceRefresh`](/sdk/actions/balances/pauseBalanceRefresh) — Pause new balance refreshes for an account.
- [`resumeBalanceRefresh`](/sdk/actions/balances/resumeBalanceRefresh) — Allow balance refreshes for an account after a matching pause.

## Source

[packages/@0xcurvy/sdk/src/actions/balances/getBalances.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/balances/getBalances.ts)
