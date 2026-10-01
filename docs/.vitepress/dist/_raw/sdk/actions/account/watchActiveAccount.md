# watchActiveAccount

Subscribe to changes of the active account; returns an unsubscribe function.

## Import

```ts
import { watchActiveAccount } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const unsubscribe = watchActiveAccount({ onChange: (account) => render(account) });
```

## Signature

```ts
function watchActiveAccount(parameters: WatchActiveAccountParameters): () => void
```

## Returns

`() => void`

The action resolves or returns the value shown in the signature.

## Parameters

### `onChange`

- **Type:** `(account: CurvyAccountData | null) => void`
- **Required:** yes

Invoked with the active account (or `null`) whenever it changes.

```ts
const result = watchActiveAccount({
  onChange, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = watchActiveAccount({
  onChange,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`watchAccounts`](/sdk/actions/account/watchAccounts) — Subscribe to changes of the known accounts; returns an unsubscribe function.

## Source

[packages/@0xcurvy/sdk/src/actions/account/watchActiveAccount.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/watchActiveAccount.ts)
