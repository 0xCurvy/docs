# registerWithPrivateKeys

Register a new Curvy handle from raw spending and viewing private keys.

## Import

```ts
import { registerWithPrivateKeys } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await registerWithPrivateKeys({ s, v, handle, userAddress });
```

## Signature

```ts
function registerWithPrivateKeys(parameters: RegisterWithPrivateKeysParameters): Promise<CurvyAccount>
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
const result = await registerWithPrivateKeys({
  s, // [!code focus]
  v,
  handle,
  userAddress,
});
```

### `v`

- **Type:** `string`
- **Required:** yes

The lowercase Curvy viewing private key.

```ts
const result = await registerWithPrivateKeys({
  s,
  v, // [!code focus]
  handle,
  userAddress,
});
```

### `handle`

- **Type:** `CurvyId`
- **Required:** yes

The Curvy handle to register.

```ts
const result = await registerWithPrivateKeys({
  s,
  v,
  handle, // [!code focus]
  userAddress,
});
```

### `userAddress`

- **Type:** `HexString`
- **Required:** yes

The wallet address that will own the registered handle.

```ts
const result = await registerWithPrivateKeys({
  s,
  v,
  handle,
  userAddress, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await registerWithPrivateKeys({
  s,
  v,
  handle,
  userAddress,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`register`](/sdk/actions/auth/register) — Register a new Curvy handle from an account signature.
- [`registerWithPasskey`](/sdk/actions/auth/registerWithPasskey) — Register a new Curvy handle via a passkey PRF output.

## Source

[packages/@0xcurvy/sdk/src/actions/auth/registerWithPrivateKeys.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/registerWithPrivateKeys.ts)
