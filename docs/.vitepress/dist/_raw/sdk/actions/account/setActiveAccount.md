# setActiveAccount

Make `accountId` the active account.

Resolves the keypairs from `config.keyring`, records the id in
`state.activeAccountId`, refreshes the bearer token (unless skipped or the
account is partial — i.e. not registered in `state.accounts`), and (re)starts
the JWT refresh timer.

## Import

```ts
import { setActiveAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await setActiveAccount({ accountId });
```

## Signature

```ts
function setActiveAccount(parameters: SetActiveAccountParameters): Promise<void>
```

## Returns

`Promise<void>`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** yes

The account to make active.

```ts
await setActiveAccount({
  accountId, // [!code focus]
});
```

### `skipBearerTokenUpdate`

- **Type:** `boolean`
- **Required:** no

Whether to skip bearer-token refresh when activating a registered account.

```ts
await setActiveAccount({
  accountId,
  skipBearerTokenUpdate, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
await setActiveAccount({
  accountId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`addAccount`](/sdk/actions/account/addAccount) — Decompose a CurvyAccount DTO into the runtime stores, make it active, and persist it.
- [`addPartialAccount`](/sdk/actions/account/addPartialAccount) — Add a partial (handle-less, owner-less) account built from a subset of keypairs and make it active.
- [`removeAccount`](/sdk/actions/account/removeAccount) — Evict an account from the runtime without re-pointing the session.

## Source

[packages/@0xcurvy/sdk/src/actions/account/setActiveAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/setActiveAccount.ts)
