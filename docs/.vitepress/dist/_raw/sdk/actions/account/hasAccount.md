# hasAccount

Check whether an account with the given id is known.

## Import

```ts
import { hasAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
if (hasAccount({ id })) { ... }
```

## Signature

```ts
function hasAccount(parameters: HasAccountParameters): boolean
```

## Returns

`boolean`

The action resolves or returns the value shown in the signature.

## Parameters

### `id`

- **Type:** `string`
- **Required:** yes

The deterministic account identifier to test.

```ts
const result = hasAccount({
  id, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = hasAccount({
  id,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`getAccounts`](/sdk/actions/account/getAccounts) — Get the serializable metadata for every known account.
- [`getAccountById`](/sdk/actions/account/getAccountById) — Get a single account's serializable metadata by id, or undefined if unknown.
- [`getActiveAccount`](/sdk/actions/account/getActiveAccount) — Get the active account's registered profile metadata.
- [`hasActiveAccount`](/sdk/actions/account/hasActiveAccount) — Check whether an account is currently active.

## Source

[packages/@0xcurvy/sdk/src/actions/account/hasAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/hasAccount.ts)
