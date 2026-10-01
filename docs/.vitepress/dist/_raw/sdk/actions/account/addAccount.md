# addAccount

Decompose a `CurvyAccount` DTO into the runtime stores, make it active, and
persist it.

The raw keypairs go into `config.keyring` (never `state`). For non-partial
(registered) accounts the serializable `CurvyAccountData` is published to
`state.accounts` so `watch*` fire, the metadata is written to durable storage,
and the keypairs are stashed in the browser keystore for refresh survival.
A partial account lives only in the keyring.

## Import

```ts
import { addAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await addAccount({ account });
```

## Signature

```ts
function addAccount(parameters: AddAccountParameters): Promise<void>
```

## Returns

`Promise<void>`

The action resolves or returns the value shown in the signature.

## Parameters

### `account`

- **Type:** `CurvyAccount`
- **Required:** yes

The complete Curvy account to add to the runtime stores and make active.

```ts
await addAccount({
  account, // [!code focus]
});
```

### `skipBearerTokenUpdate`

- **Type:** `boolean`
- **Required:** no

Whether to leave the current bearer token unchanged while adding the account.

```ts
await addAccount({
  account,
  skipBearerTokenUpdate, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
await addAccount({
  account,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`addPartialAccount`](/sdk/actions/account/addPartialAccount) — Add a partial (handle-less, owner-less) account built from a subset of keypairs and make it active.
- [`removeAccount`](/sdk/actions/account/removeAccount) — Evict an account from the runtime without re-pointing the session.
- [`setActiveAccount`](/sdk/actions/account/setActiveAccount) — Make accountId the active account.

## Source

[packages/@0xcurvy/sdk/src/actions/account/addAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/addAccount.ts)
