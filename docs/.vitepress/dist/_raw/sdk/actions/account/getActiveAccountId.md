# getActiveAccountId

Get the selected account ID, including temporary swap/recovery accounts.
Returns `null` when no account is selected. This identifies the account;
signing actions separately require its keys to be available.

## Import

```ts
import { getActiveAccountId } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = getActiveAccountId({ config });
```

## Signature

```ts
function getActiveAccountId(parameters?: GetActiveAccountIdParameters): string | null
```

## Returns

`string | null`

The action resolves or returns the value shown in the signature.

## Parameters

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = getActiveAccountId({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)

## Source

[packages/@0xcurvy/sdk/src/actions/account/getActiveAccountId.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/getActiveAccountId.ts)
