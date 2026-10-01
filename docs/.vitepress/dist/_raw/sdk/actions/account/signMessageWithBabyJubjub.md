# signMessageWithBabyJubjub

Sign a message with an account's BabyJubjub spending key. Resolves the active
(or explicit) live account and delegates to `core.signWithBabyJubjubPrivateKey`.

## Import

```ts
import { signMessageWithBabyJubjub } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const signature = await signMessageWithBabyJubjub({ message: 42n });
```

## Signature

```ts
function signMessageWithBabyJubjub(parameters: SignMessageWithBabyJubjubParameters): Promise<StringifyBigInts<Signature>>
```

## Returns

`Promise<Prettify<{ S: string; R8: string[]; }>>`

The action resolves or returns the value shown in the signature.

## Parameters

### `message`

- **Type:** `bigint`
- **Required:** yes

The message bytes to sign.

```ts
const result = await signMessageWithBabyJubjub({
  message, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The signing account. Defaults to the active account.

```ts
const result = await signMessageWithBabyJubjub({
  message,
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await signMessageWithBabyJubjub({
  message,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`getBabyJubjubPublicKey`](/sdk/actions/account/getBabyJubjubPublicKey) — Derive the BabyJubjub public key for an account's spending key.

## Source

[packages/@0xcurvy/sdk/src/actions/account/signMessageWithBabyJubjub.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/signMessageWithBabyJubjub.ts)
