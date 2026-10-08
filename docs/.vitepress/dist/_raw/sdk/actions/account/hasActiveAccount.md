# hasActiveAccount

Check whether an account is currently active.

## Import

```ts
import { hasActiveAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
if (hasActiveAccount()) { ... }
```

## Signature

```ts
function hasActiveAccount(parameters?: HasActiveAccountParameters): boolean
```

## Returns

`boolean`

The action resolves or returns the value shown in the signature.

## Parameters

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = hasActiveAccount({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`getAccounts`](/sdk/actions/account/getAccounts) — Get the serializable metadata for every known account.
- [`getAccountById`](/sdk/actions/account/getAccountById) — Get a single account's serializable metadata by id, or undefined if unknown.
- [`getActiveAccount`](/sdk/actions/account/getActiveAccount) — Get the active account's registered profile metadata.
- [`hasAccount`](/sdk/actions/account/hasAccount) — Check whether an account with the given id is known.

## Source

[packages/@0xcurvy/sdk/src/actions/account/hasActiveAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/hasActiveAccount.ts)
