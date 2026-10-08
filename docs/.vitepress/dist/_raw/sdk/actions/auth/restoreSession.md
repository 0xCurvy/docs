# restoreSession

Rehydrate authenticated accounts from host-supplied private key material or,
when no accounts are supplied, from the optional session keystore.

If the keystore holds entries, the persisted JWT (under `__jwt__`) is
restored first so adding accounts can skip the re-auth round trip (TOTP sign +
POST /auth). Each remaining key is an account whose keypairs come from the
keystore and whose metadata comes from storage; they are rebuilt into a
`CurvyAccount` and added. Per-account failures (missing metadata, corrupt data)
are returned in `failures` — the host can request re-authentication to re-derive
keypairs without losing the successfully restored accounts.

Hosts retain ownership of secret storage. The SDK owns reconstruction and
authentication. `mode: "unlock"` supports hosts that authenticate separately
after restoring local access. Invalid identities are rejected before mutation.

## Import

```ts
import { restoreSession } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await restoreSession();
```

## Signature

```ts
function restoreSession(parameters?: RestoreSessionParameters): Promise<RestoreSessionResult>
```

## Returns

`Promise<RestoreSessionResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accounts`

- **Type:** `readonly RestorableAccount[]`
- **Required:** no

Host-supplied accounts (`id`, `s`, `v`) to restore. When omitted, accounts come from the session keystore.

```ts
const result = await restoreSession({
  accounts, // [!code focus]
});
```

### `mode`

- **Type:** `"authenticate" | "unlock"`
- **Required:** no

Authenticate by default; `unlock` restores local access without any auth request or timer.

```ts
const result = await restoreSession({
  mode, // [!code focus]
});
```

### `continueOnError`

- **Type:** `boolean`
- **Required:** no

Continue past account failures. Defaults to false for supplied accounts, true for persisted adapters.

```ts
const result = await restoreSession({
  continueOnError, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await restoreSession({
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
- [`logout`](/sdk/actions/auth/logout) — Remove an account and re-point (or clear) the active account.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/restoreSession.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/restoreSession.ts)
