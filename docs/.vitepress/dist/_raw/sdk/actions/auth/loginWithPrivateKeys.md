# loginWithPrivateKeys

Log in from raw spending/viewing private keys.

## Import

```ts
import { loginWithPrivateKeys } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await loginWithPrivateKeys({ s, v, requestingAddress });
```

## Signature

```ts
function loginWithPrivateKeys(parameters: LoginWithPrivateKeysParameters): Promise<CurvyAccount>
```

## Returns

`Promise<CurvyAccount>`

The action resolves or returns the value shown in the signature.

## Parameters

### `s`

- **Type:** `string`
- **Required:** yes

The lowercase Curvy spending private key.

```ts
const result = await loginWithPrivateKeys({
  s, // [!code focus]
  v,
  requestingAddress,
});
```

### `v`

- **Type:** `string`
- **Required:** yes

The lowercase Curvy viewing private key.

```ts
const result = await loginWithPrivateKeys({
  s,
  v, // [!code focus]
  requestingAddress,
});
```

### `requestingAddress`

- **Type:** `HexString`
- **Required:** yes

The wallet address requesting access to the registered account.

```ts
const result = await loginWithPrivateKeys({
  s,
  v,
  requestingAddress, // [!code focus]
});
```

### `credId`

- **Type:** `ArrayBuffer`
- **Required:** no

An optional WebAuthn credential identifier to associate with the session.

```ts
const result = await loginWithPrivateKeys({
  s,
  v,
  requestingAddress,
  credId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await loginWithPrivateKeys({
  s,
  v,
  requestingAddress,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`login`](/sdk/actions/auth/login) — Log in (add an existing account) from an account signature.
- [`loginWithPasskey`](/sdk/actions/auth/loginWithPasskey) — Log in via a passkey PRF output.
- [`logout`](/sdk/actions/auth/logout) — Remove an account and re-point (or clear) the active account.
- [`restoreSession`](/sdk/actions/auth/restoreSession) — Rehydrate authenticated accounts from host-supplied private key material or, when no accounts are supplied, from the optional session keystore.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/loginWithPrivateKeys.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/loginWithPrivateKeys.ts)
