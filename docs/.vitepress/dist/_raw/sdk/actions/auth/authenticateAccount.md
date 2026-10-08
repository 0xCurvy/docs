# authenticateAccount

Login/register facade for application state: returns only a safe profile, retaining keys in the config.

## Import

```ts
import { authenticateAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await authenticateAccount({ action, credential, config });
```

## Signature

```ts
function authenticateAccount(parameters: AuthenticateAccountParameters): Promise<AccountProfile>
```

## Returns

`Promise<Readonly<{ id: string; createdAt: number | null; ownerAddress: string | null; curvyHandle: CurvyId | null; capabilities: AccountCapabilities; }>>`

The action resolves or returns the value shown in the signature.

## Parameters

### `action`

- **Type:** `"login" | "register"`
- **Required:** yes

Whether to `"login"` to an existing account or `"register"` a new one.

```ts
const result = await authenticateAccount({
  action, // [!code focus]
  credential,
});
```

### `credential`

- **Type:** `"signature" | "privateKeys" | "passkey"`
- **Required:** yes

The credential kind the remaining parameters describe: `"signature"`, `"privateKeys"` or `"passkey"`.

```ts
const result = await authenticateAccount({
  action,
  credential, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await authenticateAccount({
  action,
  credential,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)

## Source

[packages/@0xcurvy/sdk/src/actions/auth/authenticateAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/auth/authenticateAccount.ts)
