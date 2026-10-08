# getActiveAccount

Get the active account's registered profile metadata. Temporary swap/recovery
accounts have no profile and return `null`; use [`getActiveAccountId`](/sdk/actions/account/getActiveAccountId) for identity.

## Import

```ts
import { getActiveAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = getActiveAccount();
```

## Signature

```ts
function getActiveAccount(parameters?: GetActiveAccountParameters): CurvyAccountData | null
```

## Returns

`CurvyAccountData | null`

The action resolves or returns the value shown in the signature.

## Parameters

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getActiveAccount({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`getAccounts`](/sdk/actions/account/getAccounts) — Get the serializable metadata for every known account.
- [`getAccountById`](/sdk/actions/account/getAccountById) — Get a single account's serializable metadata by id, or undefined if unknown.
- [`hasAccount`](/sdk/actions/account/hasAccount) — Check whether an account with the given id is known.
- [`hasActiveAccount`](/sdk/actions/account/hasActiveAccount) — Check whether an account is currently active.

## Source

[packages/@0xcurvy/sdk/src/actions/account/getActiveAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/getActiveAccount.ts)
