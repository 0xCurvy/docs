# findPortal

Find the portal owned by the active account at a specific on-chain address.

Dispatches by network flavour:
Solana matches a vault PDA directly; EVM enumerates every owned portal and
matches the checksummed target address.

## Import

```ts
import { findPortal } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await findPortal({ address: "0x…", network });
```

## Signature

```ts
function findPortal(parameters: FindPortalParameters): Promise<MatchedPortalRecord | null>
```

## Returns

`Promise<MatchedPortalRecord | null>`

The action resolves or returns the value shown in the signature.

## Parameters

### `address`

- **Type:** `HexString | (string & {})`
- **Required:** yes

The on-chain portal address to match.

```ts
const result = await findPortal({
  address, // [!code focus]
  network,
});
```

### `network`

- **Type:** `Network`
- **Required:** yes

The network on which the portal address exists.

```ts
const result = await findPortal({
  address,
  network, // [!code focus]
});
```

### `portalFactoryContractAddress`

- **Type:** `HexString`
- **Required:** no

Override the EVM factory used to derive portals, e.g. a retired factory after an upgrade.

```ts
const result = await findPortal({
  address,
  network,
  portalFactoryContractAddress, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await findPortal({
  address,
  network,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`findOwnedPortals`](/sdk/actions/recovery/findOwnedPortals) — Enumerate every portal owned by the active account's keys on the given network.
- [`recoverPortal`](/sdk/actions/recovery/recoverPortal) — Recover (sweep) the funds held in a portal to destinationAddress.

## Source

[packages/@0xcurvy/sdk/src/actions/recovery/findPortal.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/recovery/findPortal.ts)
