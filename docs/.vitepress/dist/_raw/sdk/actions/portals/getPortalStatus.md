# getPortalStatus

Fetch the lifecycle status of a single portal by address. Delegates to the
backend, which returns `null` when no portal matches (404).

## Import

```ts
import { getPortalStatus } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const status = await getPortalStatus({ address: "0x..." });
```

## Signature

```ts
function getPortalStatus(parameters: GetPortalStatusParameters): Promise<PortalStatusResponse | null>
```

## Returns

`Promise<PortalStatusResponse | null>`

The action resolves or returns the value shown in the signature.

## Parameters

### `address`

- **Type:** `string`
- **Required:** yes

Portal address (EVM hex or Solana base58) to look up.

```ts
const result = await getPortalStatus({
  address, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getPortalStatus({
  address,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`generateEntryPortal`](/sdk/actions/portals/generateEntryPortal) — Generate (insert) an entry portal — the on-ramp address that shields funds into Curvy.
- [`generateExitPortal`](/sdk/actions/portals/generateExitPortal) — Generate (insert) an exit portal — the off-ramp that unshields funds out of Curvy to a destination address.
- [`getPortalRecords`](/sdk/actions/portals/getPortalRecords) — Fetch a page of global portal records via keyset pagination.

## Source

[packages/@0xcurvy/sdk/src/actions/portals/getPortalStatus.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/portals/getPortalStatus.ts)
