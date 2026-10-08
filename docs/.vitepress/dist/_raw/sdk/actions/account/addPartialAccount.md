# addPartialAccount

Add a partial (handle-less, owner-less) account built from a subset of
keypairs and make it active.

Partial accounts carry no handle/owner, so they are never serialized to
`state.accounts`, written to storage, or persisted to the keystore; the bearer
token is left untouched (`skipBearerTokenUpdate`).

## Import

```ts
import { addPartialAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const account = await addPartialAccount({ keyPairs: { s, v } });
```

## Signature

```ts
function addPartialAccount(parameters: AddPartialAccountParameters): Promise<CurvyAccount>
```

## Returns

`Promise<CurvyAccount>`

The action resolves or returns the value shown in the signature.

## Parameters

### `keyPairs`

- **Type:** `Partial<CurvyKeyPairs>`
- **Required:** yes

The available subset of Curvy key pairs for the partial account.

```ts
const result = await addPartialAccount({
  keyPairs, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await addPartialAccount({
  keyPairs,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`addAccount`](/sdk/actions/account/addAccount) — Decompose a CurvyAccount DTO into the runtime stores, make it active, and persist it.
- [`removeAccount`](/sdk/actions/account/removeAccount) — Evict an account from the runtime without re-pointing the session.
- [`setActiveAccount`](/sdk/actions/account/setActiveAccount) — Make accountId the active account.

## Source

[packages/@0xcurvy/sdk/src/actions/account/addPartialAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/addPartialAccount.ts)
