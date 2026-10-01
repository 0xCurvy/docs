# getAccountProfile

Safe, referentially stable profile snapshot; never includes keys, pending notes or scan state.

## Import

```ts
import { getAccountProfile } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = getAccountProfile({ config });
```

## Signature

```ts
function getAccountProfile(parameters?: GetAccountProfileParameters): AccountProfile | null
```

## Returns

`Readonly<{ id: string; createdAt: number | null; ownerAddress: string | null; curvyHandle: CurvyId | null; capabilities: AccountCapabilities; }> | null`

The action resolves or returns the value shown in the signature.

## Parameters

### `accountId`

- **Type:** `string`
- **Required:** no

The account whose profile snapshot is returned. Defaults to the active account.

```ts
const result = getAccountProfile({
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getAccountProfile({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)

## Source

[packages/@0xcurvy/sdk/src/actions/account/profile.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/profile.ts)
