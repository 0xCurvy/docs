# loginWithPasskey

Log in via a passkey PRF output.

Derives a signature (and owner address) from the PRF value, computes the
private keys, runs the pre-login checks, then creates and adds the account.

## Import

```ts
import { loginWithPasskey } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await loginWithPasskey({ prfValue, credId });
```

## Signature

```ts
function loginWithPasskey(parameters: LoginWithPasskeyParameters): Promise<CurvyAccount>
```

## Returns

`Promise<CurvyAccount>`

The action resolves or returns the value shown in the signature.

## Parameters

### `prfValue`

- **Type:** `PasskeyPrfValue`
- **Required:** yes

The passkey PRF output used to derive the account's Curvy keys.

```ts
const result = await loginWithPasskey({
  prfValue, // [!code focus]
});
```

### `credId`

- **Type:** `ArrayBuffer`
- **Required:** no

The WebAuthn credential identifier associated with the passkey.

```ts
const result = await loginWithPasskey({
  prfValue,
  credId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await loginWithPasskey({
  prfValue,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`login`](/sdk/actions/auth/login) — Log in (add an existing account) from an account signature.
- [`loginWithPrivateKeys`](/sdk/actions/auth/loginWithPrivateKeys) — Log in from raw spending/viewing private keys.
- [`logout`](/sdk/actions/auth/logout) — Remove an account and re-point (or clear) the active account.
- [`restoreSession`](/sdk/actions/auth/restoreSession) — Rehydrate authenticated accounts from host-supplied private key material or, when no accounts are supplied, from the optional session keystore.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/loginWithPasskey.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/loginWithPasskey.ts)
