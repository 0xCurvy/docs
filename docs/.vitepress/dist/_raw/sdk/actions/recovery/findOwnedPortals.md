# findOwnedPortals

Enumerate every portal owned by the active account's keys on the given network.

EVM portals are discovered from public portal records and verified against
the active account's keys. Solana portal enumeration is not supported and
returns an empty array.

## Import

```ts
import { findOwnedPortals } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await findOwnedPortals({ network });
```

## Signature

```ts
function findOwnedPortals(parameters: FindOwnedPortalsParameters): Promise<MatchedPortalRecord[]>
```

## Returns

`Promise<MatchedPortalRecord[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `network`

- **Type:** `Network`
- **Required:** yes

The network on which to discover portals owned by the active account.

```ts
const result = await findOwnedPortals({
  network, // [!code focus]
});
```

### `portalFactoryContractAddress`

- **Type:** `HexString`
- **Required:** no

Override the EVM factory used to derive portals, e.g. a retired factory after an upgrade.

```ts
const result = await findOwnedPortals({
  network,
  portalFactoryContractAddress, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await findOwnedPortals({
  network,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`findPortal`](/sdk/actions/recovery/findPortal) — Find the portal owned by the active account at a specific on-chain address.
- [`recoverPortal`](/sdk/actions/recovery/recoverPortal) — Recover (sweep) the funds held in a portal to destinationAddress.

## Source

[packages/@0xcurvy/sdk/src/actions/recovery/findOwnedPortals.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/recovery/findOwnedPortals.ts)
