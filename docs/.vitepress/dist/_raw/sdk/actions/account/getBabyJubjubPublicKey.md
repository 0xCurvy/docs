# getBabyJubjubPublicKey

Derive the BabyJubjub public key for an account's spending key. Resolves the
active (or explicit) live account and delegates to `core.getBabyJubjubPublicKey`.

## Import

```ts
import { getBabyJubjubPublicKey } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const bjjPubKey = await getBabyJubjubPublicKey();
```

## Signature

```ts
function getBabyJubjubPublicKey(parameters?: GetBabyJubjubPublicKeyParameters): Promise<string>
```

## Returns

`Promise<string>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose Baby Jubjub public key should be returned. Defaults to the active account.

```ts
const result = await getBabyJubjubPublicKey({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getBabyJubjubPublicKey({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`signMessageWithBabyJubjub`](/sdk/actions/account/signMessageWithBabyJubjub) — Sign a message with an account's BabyJubjub spending key.

## Source

[packages/@0xcurvy/sdk/src/actions/account/getBabyJubjubPublicKey.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/getBabyJubjubPublicKey.ts)
