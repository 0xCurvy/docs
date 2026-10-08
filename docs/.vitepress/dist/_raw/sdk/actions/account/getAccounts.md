# getAccounts

Get the serializable metadata for every known account.

## Import

```ts
import { getAccounts } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const accounts = getAccounts();
```

## Signature

```ts
function getAccounts(parameters?: GetAccountsParameters): CurvyAccountData[]
```

## Returns

`CurvyAccountData[]`

The action resolves or returns the value shown in the signature.

## Parameters

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getAccounts({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`getAccountById`](/sdk/actions/account/getAccountById) — Get a single account's serializable metadata by id, or undefined if unknown.
- [`getActiveAccount`](/sdk/actions/account/getActiveAccount) — Get the active account's registered profile metadata.
- [`hasAccount`](/sdk/actions/account/hasAccount) — Check whether an account with the given id is known.
- [`hasActiveAccount`](/sdk/actions/account/hasActiveAccount) — Check whether an account is currently active.

## Source

[packages/@0xcurvy/sdk/src/actions/account/getAccounts.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/getAccounts.ts)
