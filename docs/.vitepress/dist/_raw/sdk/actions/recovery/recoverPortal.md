# recoverPortal

Recover (sweep) the funds held in a portal to `destinationAddress`.

Re-derives the recovery private
key from the announcement via `core.scan`, then dispatches to the EVM or
Solana recovery flow based on the matched portal's flavour.

## Import

```ts
import { recoverPortal } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
await recoverPortal({ networkId, tokenAddress, portalRecord, destinationAddress });
```

## Signature

```ts
function recoverPortal(parameters: RecoverPortalParameters): Promise<string>
```

## Returns

`Promise<string>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkId`

- **Type:** `number`
- **Required:** yes

The Curvy network identifier on which the portal holds funds.

```ts
const result = await recoverPortal({
  networkId, // [!code focus]
  tokenAddress,
  portalRecord,
  destinationAddress,
});
```

### `tokenAddress`

- **Type:** `HexString | (string & {})`
- **Required:** yes

The EVM token contract or Solana mint held by the portal.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress, // [!code focus]
  portalRecord,
  destinationAddress,
});
```

### `portalRecord`

- **Type:** `MatchedPortalRecord`
- **Required:** yes

The matched portal record containing the recovery announcement.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord, // [!code focus]
  destinationAddress,
});
```

### `destinationAddress`

- **Type:** `HexString | (string & {})`
- **Required:** yes

The public address that should receive the recovered funds.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress, // [!code focus]
});
```

### `solanaSigner`

- **Type:** `SolanaSigner`
- **Required:** no

The connected signer required to submit a Solana recovery transaction.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress,
  solanaSigner, // [!code focus]
});
```

### `onSubmitted`

- **Type:** `(transactionHash: string) => void`
- **Required:** no

Reports the public transaction reference before waiting for confirmation.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress,
  onSubmitted, // [!code focus]
});
```

### `onSubmitting`

- **Type:** `() => void`
- **Required:** no

Called immediately before the network submission attempt, after local preparation/signing.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress,
  onSubmitting, // [!code focus]
});
```

### `portalFactoryContractAddress`

- **Type:** `HexString`
- **Required:** no

Override the EVM factory used for recovery, e.g. a retired factory after an upgrade.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress,
  portalFactoryContractAddress, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await recoverPortal({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress,
  config, // [!code focus]
});
```

## Errors

- when the active account has no private keys, no matching recovery key
is found, the network id is unknown, or a Solana recovery is requested
without a signer.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`findOwnedPortals`](/sdk/actions/recovery/findOwnedPortals) — Enumerate every portal owned by the active account's keys on the given network.
- [`findPortal`](/sdk/actions/recovery/findPortal) — Find the portal owned by the active account at a specific on-chain address.

## Source

[packages/@0xcurvy/sdk/src/actions/recovery/recoverPortal.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/recovery/recoverPortal.ts)
