# removeAccount

Evict an account from the runtime without re-pointing the session.

Removes the account's keypairs from `config.keyring`, its keystore entry, and
its `state.accounts` metadata (when registered). Durable storage is left
intact — same as [`logout`](/sdk/actions/auth/logout) — so a registered account can be restored on a
later login.

Unlike [`logout`](/sdk/actions/auth/logout), this does NOT clear the bearer token or auto-activate another
account; it only clears `activeAccountId` (and stops the JWT refresh timer)
when the removed account WAS the active one. This makes it safe to evict an
ephemeral/partial account while a different account stays authenticated —
the primary use case is cleaning up temp keypairs created via
[`addPartialAccount`](/sdk/actions/account/addPartialAccount) (for example, a public swap). Idempotent: removing an unknown
id is a no-op.

## Import

```ts
import { removeAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await removeAccount({ accountId });
```

## Signature

```ts
function removeAccount(parameters: RemoveAccountParameters): Promise<void>
```

## Returns

`Promise<void>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** yes

The account to remove from runtime state and persistent storage.

```ts
await removeAccount({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
await removeAccount({
  accountId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`addAccount`](/sdk/actions/account/addAccount) — Decompose a CurvyAccount DTO into the runtime stores, make it active, and persist it.
- [`addPartialAccount`](/sdk/actions/account/addPartialAccount) — Add a partial (handle-less, owner-less) account built from a subset of keypairs and make it active.
- [`setActiveAccount`](/sdk/actions/account/setActiveAccount) — Make accountId the active account.

## Source

[packages/@0xcurvy/sdk/src/actions/account/removeAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/removeAccount.ts)
