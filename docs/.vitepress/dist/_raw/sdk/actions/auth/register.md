# register

Register a new Curvy handle from an account signature.

Runs the pre-registration checks, verifies the signature, derives the private
keys, then registers and adds the account.

## Import

```ts
import { register } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await register({ handle, signature });
```

## Signature

```ts
function register(parameters: RegisterParameters): Promise<CurvyAccount>
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
const result = await register({
  handle, // [!code focus]
  signature,
});
```

### `signature`

- **Type:** `EvmSignatureData`
- **Required:** yes

The EVM registration signature and its signing address.

```ts
const result = await register({
  handle,
  signature, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await register({
  handle,
  signature,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`registerWithPasskey`](/sdk/actions/auth/registerWithPasskey) — Register a new Curvy handle via a passkey PRF output.
- [`registerWithPrivateKeys`](/sdk/actions/auth/registerWithPrivateKeys) — Register a new Curvy handle from raw spending and viewing private keys.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/register.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/register.ts)
