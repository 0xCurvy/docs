# getAccountProfiles

Registered profiles by default; opt into temporary swap/recovery identities explicitly.

## Import

```ts
import { getAccountProfiles } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = getAccountProfiles({ config });
```

## Signature

```ts
function getAccountProfiles(parameters?: GetAccountProfilesParameters): AccountProfile[]
```

## Returns

`Readonly<{ id: string; createdAt: number | null; ownerAddress: string | null; curvyHandle: CurvyId | null; capabilities: AccountCapabilities; }>[]`

The action resolves or returns the value shown in the signature.

## Parameters

### `includeTemporary`

- **Type:** `boolean`
- **Required:** no

Whether to include temporary swap and recovery identities alongside registered accounts.

```ts
const result = getAccountProfiles({
  includeTemporary, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getAccountProfiles({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)

## Source

[packages/@0xcurvy/sdk/src/actions/account/profile.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/profile.ts)
