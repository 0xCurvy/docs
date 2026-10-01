# logout

Remove an account and re-point (or clear) the active account. Defaults to the
active account id.

Stops the JWT refresh timer, clears the bearer token, deletes the account's
keyring entry (and its metadata + keystore entry), then activates the next
remaining REGISTERED account (re-authenticating it) — preferring a full
account over a partial (unauthenticated, handle-less) one. If only partials
remain, `activeAccountId` is cleared.

## Import

```ts
import { logout } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await logout();             // active account
await logout({ accountId }); // explicit account
```

## Signature

```ts
function logout(parameters?: LogoutParameters): Promise<void>
```

## Returns

`Promise<void>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose authenticated session should be ended. Defaults to the active account.

```ts
await logout({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
await logout({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`login`](/sdk/actions/auth/login) — Log in (add an existing account) from an account signature.
- [`loginWithPasskey`](/sdk/actions/auth/loginWithPasskey) — Log in via a passkey PRF output.
- [`loginWithPrivateKeys`](/sdk/actions/auth/loginWithPrivateKeys) — Log in from raw spending/viewing private keys.
- [`restoreSession`](/sdk/actions/auth/restoreSession) — Rehydrate authenticated accounts from host-supplied private key material or, when no accounts are supplied, from the optional session keystore.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/logout.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/logout.ts)
