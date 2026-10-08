# getPortalDeposit

Read the SDK's note evidence for one portal. A service shielding receipt is not a committed private balance.

## Import

```ts
import { getPortalDeposit } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await getPortalDeposit({ portal, config });
```

## Signature

```ts
function getPortalDeposit(parameters: GetPortalDepositParameters): Promise<PortalDepositSnapshot>
```

## Returns

`Promise<PortalDepositSnapshot>`

The action resolves or returns the value shown in the signature.

## Parameters

### `portal`

- **Type:** `MatchedPortalRecord`
- **Required:** yes

An entry portal resolved by findPortal for this account. Never correlate deposits by ticker or amount.

```ts
const result = await getPortalDeposit({
  portal, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

The account that owns the portal. Defaults to the active account.

```ts
const result = await getPortalDeposit({
  portal,
  accountId, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the read.

```ts
const result = await getPortalDeposit({
  portal,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getPortalDeposit({
  portal,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/views/getPortalDeposit.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/views/getPortalDeposit.ts)
