# login

Log in (add an existing account) from an account signature.

Verifies the signature, derives the spending/viewing private keys, fetches
the Curvy keypairs, runs the pre-login checks (which authenticate), then
creates and registers the account.

## Import

```ts
import { login } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await login({ signature });
```

## Signature

```ts
function login(parameters: LoginParameters): Promise<CurvyAccount>
```

## Returns

`Promise<CurvyAccount>`

The action resolves or returns the value shown in the signature.

## Parameters

### `signature`

- **Type:** `EvmSignatureData`
- **Required:** yes

The EVM authentication signature and its signing address.

```ts
const result = await login({
  signature, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await login({
  signature,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`loginWithPasskey`](/sdk/actions/auth/loginWithPasskey) — Log in via a passkey PRF output.
- [`loginWithPrivateKeys`](/sdk/actions/auth/loginWithPrivateKeys) — Log in from raw spending/viewing private keys.
- [`logout`](/sdk/actions/auth/logout) — Remove an account and re-point (or clear) the active account.
- [`restoreSession`](/sdk/actions/auth/restoreSession) — Rehydrate authenticated accounts from host-supplied private key material or, when no accounts are supplied, from the optional session keystore.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/login.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/login.ts)
