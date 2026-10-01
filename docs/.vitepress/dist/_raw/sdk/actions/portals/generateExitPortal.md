# generateExitPortal

Generate (insert) an exit portal — the off-ramp that unshields funds out of
Curvy to a destination address. Delegates to the backend, which derives and
returns the portal `address` and its `flavour`.

## Import

```ts
import { generateExitPortal } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const { address, flavour } = await generateExitPortal({
  curvyId: "alice.curvy.name",
  currencyId: 1,
  exitAddress: "0x...",
});
```

## Signature

```ts
function generateExitPortal(parameters: GenerateExitPortalParameters): Promise<{ address: HexString; flavour: NETWORK_FLAVOUR_VALUES; }>
```

## Returns

`Promise<{ address: HexString; flavour: NETWORK_FLAVOUR_VALUES; }>`

The action resolves or returns the value shown in the signature.

## Parameters

### `curvyId`

- **Type:** `\`${string}.staging-curvy.name\` | \`${string}.curvy.name\` | \`${string}.local-curvy.name\` | undefined`
- **Required:** no

The Curvy handle whose keys should own the portal.

```ts
const result = await generateExitPortal({
  curvyId, // [!code focus]
  currencyId,
  exitAddress,
});
```

### `publicKeys`

- **Type:** `PortalPublicKeysInput | undefined`
- **Required:** no

Explicit public keys to use instead of resolving a Curvy handle.

```ts
const result = await generateExitPortal({
  publicKeys, // [!code focus]
  currencyId,
  exitAddress,
});
```

### `currencyId`

- **Type:** `number`
- **Required:** yes

The Curvy currency identifier for the asset being withdrawn.

```ts
const result = await generateExitPortal({
  currencyId, // [!code focus]
  exitAddress,
});
```

### `exitAddress`

- **Type:** `string`
- **Required:** yes

The public destination address that receives the withdrawn funds.

```ts
const result = await generateExitPortal({
  currencyId,
  exitAddress, // [!code focus]
});
```

### `coinType`

- **Type:** `string`
- **Required:** no

An optional coin-type selector for the portal's network flavour.

```ts
const result = await generateExitPortal({
  currencyId,
  exitAddress,
  coinType, // [!code focus]
});
```

### `exitNetworkId`

- **Type:** `number`
- **Required:** no

The optional destination network identifier.

```ts
const result = await generateExitPortal({
  currencyId,
  exitAddress,
  exitNetworkId, // [!code focus]
});
```

### `exitCurrencyId`

- **Type:** `number`
- **Required:** no

The optional destination currency identifier used by an exit bridge.

```ts
const result = await generateExitPortal({
  currencyId,
  exitAddress,
  exitCurrencyId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await generateExitPortal({
  currencyId,
  exitAddress,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`generateEntryPortal`](/sdk/actions/portals/generateEntryPortal) — Generate (insert) an entry portal — the on-ramp address that shields funds into Curvy.
- [`getPortalRecords`](/sdk/actions/portals/getPortalRecords) — Fetch a page of global portal records via keyset pagination.
- [`getPortalStatus`](/sdk/actions/portals/getPortalStatus) — Fetch the lifecycle status of a single portal by address.

## Source

[packages/@0xcurvy/sdk/src/actions/portals/generateExitPortal.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/portals/generateExitPortal.ts)
