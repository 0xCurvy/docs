# getAccountById

Get a single account's serializable metadata by id, or `undefined` if unknown.

## Import

```ts
import { getAccountById } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = getAccountById({ id });
```

## Signature

```ts
function getAccountById(parameters: GetAccountByIdParameters): CurvyAccountData | undefined
```

## Returns

`CurvyAccountData | undefined`

The action resolves or returns the value shown in the signature.

## Parameters

### `id`

- **Type:** `string`
- **Required:** yes

The deterministic account identifier to look up.

```ts
const result = getAccountById({
  id, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getAccountById({
  id,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`getAccounts`](/sdk/actions/account/getAccounts) — Get the serializable metadata for every known account.
- [`getActiveAccount`](/sdk/actions/account/getActiveAccount) — Get the active account's registered profile metadata.
- [`hasAccount`](/sdk/actions/account/hasAccount) — Check whether an account with the given id is known.
- [`hasActiveAccount`](/sdk/actions/account/hasActiveAccount) — Check whether an account is currently active.

## Source

[packages/@0xcurvy/sdk/src/actions/account/getAccountById.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/getAccountById.ts)
