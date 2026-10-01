# watchAccounts

Subscribe to changes of the known accounts; returns an unsubscribe function.

## Import

```ts
import { watchAccounts } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const unsubscribe = watchAccounts({ onChange: (accounts) => render(accounts) });
```

## Signature

```ts
function watchAccounts(parameters: WatchAccountsParameters): () => void
```

## Returns

`() => void`

The action resolves or returns the value shown in the signature.

## Parameters

### `onChange`

- **Type:** `(accounts: CurvyAccountData[]) => void`
- **Required:** yes

Invoked with the full account list whenever the set of accounts changes.

```ts
const result = watchAccounts({
  onChange, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = watchAccounts({
  onChange,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)
- [`watchActiveAccount`](/sdk/actions/account/watchActiveAccount) — Subscribe to changes of the active account; returns an unsubscribe function.

## Source

[packages/@0xcurvy/sdk/src/actions/account/watchAccounts.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/watchAccounts.ts)
