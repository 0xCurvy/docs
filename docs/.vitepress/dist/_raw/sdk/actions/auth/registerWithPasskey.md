# registerWithPasskey

Register a new Curvy handle via a passkey PRF output.

## Import

```ts
import { registerWithPasskey } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await registerWithPasskey({ handle, prfValue, credId });
```

## Signature

```ts
function registerWithPasskey(parameters: RegisterWithPasskeyParameters): Promise<CurvyAccount>
```

## Returns

`Promise<CurvyAccount>`

The action resolves or returns the value shown in the signature.

## Parameters

### `handle`

- **Type:** `CurvyId`
- **Required:** yes

The Curvy handle to register.

```ts
const result = await registerWithPasskey({
  handle, // [!code focus]
  prfValue,
});
```

### `prfValue`

- **Type:** `PasskeyPrfValue`
- **Required:** yes

The passkey PRF output used to derive the new account's Curvy keys.

```ts
const result = await registerWithPasskey({
  handle,
  prfValue, // [!code focus]
});
```

### `credId`

- **Type:** `ArrayBuffer`
- **Required:** no

The WebAuthn credential identifier associated with the passkey.

```ts
const result = await registerWithPasskey({
  handle,
  prfValue,
  credId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await registerWithPasskey({
  handle,
  prfValue,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`register`](/sdk/actions/auth/register) — Register a new Curvy handle from an account signature.
- [`registerWithPrivateKeys`](/sdk/actions/auth/registerWithPrivateKeys) — Register a new Curvy handle from raw spending and viewing private keys.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/registerWithPasskey.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/registerWithPasskey.ts)
