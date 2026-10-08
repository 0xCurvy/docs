# generateEntryPortal

Generate (insert) an entry portal — the on-ramp address that shields funds
into Curvy. Delegates to the backend, which derives and returns the portal
`address` and its `flavour`.

## Import

```ts
import { generateEntryPortal } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const { address, flavour } = await generateEntryPortal({ curvyId: "alice.curvy.name" });
```

## Signature

```ts
function generateEntryPortal(parameters: GenerateEntryPortalParameters): Promise<{ address: HexString; flavour: NETWORK_FLAVOUR_VALUES; }>
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
const result = await generateEntryPortal({
  curvyId, // [!code focus]
});
```

### `publicKeys`

- **Type:** `PortalPublicKeysInput | undefined`
- **Required:** no

Explicit public keys to use instead of resolving a Curvy handle.

```ts
const result = await generateEntryPortal({
  publicKeys, // [!code focus]
});
```

### `coinType`

- **Type:** `string`
- **Required:** no

An optional coin-type selector for the portal's network flavour.

```ts
const result = await generateEntryPortal({
  coinType, // [!code focus]
});
```

### `currencyId`

- **Type:** `number`
- **Required:** no

An optional Curvy currency identifier for the deposited asset.

```ts
const result = await generateEntryPortal({
  currencyId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await generateEntryPortal({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`generateExitPortal`](/sdk/actions/portals/generateExitPortal) — Generate (insert) an exit portal — the off-ramp that unshields funds out of Curvy to a destination address.
- [`getPortalRecords`](/sdk/actions/portals/getPortalRecords) — Fetch a page of global portal records via keyset pagination.
- [`getPortalStatus`](/sdk/actions/portals/getPortalStatus) — Fetch the lifecycle status of a single portal by address.

## Source

[packages/@0xcurvy/sdk/src/actions/portals/generateEntryPortal.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/portals/generateEntryPortal.ts)
