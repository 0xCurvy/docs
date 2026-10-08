# estimatePortalRecovery

Prices the transaction [`recoverPortal`](/sdk/actions/recovery/recoverPortal) will send for an EVM portal, from the same factory call, and reads what
its recovery address holds to pay for it. Needs no private key, and works before the address is funded.

## Import

```ts
import { estimatePortalRecovery } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const estimate = await estimatePortalRecovery({ networkId, tokenAddress, portalRecord, destinationAddress });
if (estimate.available < estimate.required) // ask the user to send gasAsset to estimate.fundingAddress
```

## Signature

```ts
function estimatePortalRecovery(parameters: EstimatePortalRecoveryParameters): Promise<PortalRecoveryEstimate>
```

## Returns

`Promise<PortalRecoveryEstimate>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkId`

- **Type:** `number`
- **Required:** yes

The EVM network the portal lives on, by network id.

```ts
const result = await estimatePortalRecovery({
  networkId, // [!code focus]
  tokenAddress,
  portalRecord,
  destinationAddress,
});
```

### `tokenAddress`

- **Type:** `HexString | (string & {})`
- **Required:** yes

The token contract the portal holds and the recovery moves.

```ts
const result = await estimatePortalRecovery({
  networkId,
  tokenAddress, // [!code focus]
  portalRecord,
  destinationAddress,
});
```

### `portalRecord`

- **Type:** `Extract<MatchedPortalRecord, { flavour: "evm" }>`
- **Required:** yes

Solana portals are recovered with the connected wallet paying the fee, so only EVM portals need this.

```ts
const result = await estimatePortalRecovery({
  networkId,
  tokenAddress,
  portalRecord, // [!code focus]
  destinationAddress,
});
```

### `destinationAddress`

- **Type:** `HexString | (string & {})`
- **Required:** yes

The address the recovered assets are sent to.

```ts
const result = await estimatePortalRecovery({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress, // [!code focus]
});
```

### `portalFactoryContractAddress`

- **Type:** `HexString`
- **Required:** no

Override the EVM factory used for recovery, e.g. a retired factory after an upgrade.

```ts
const result = await estimatePortalRecovery({
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
const result = await estimatePortalRecovery({
  networkId,
  tokenAddress,
  portalRecord,
  destinationAddress,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)

## Source

[packages/@0xcurvy/sdk/src/actions/recovery/estimatePortalRecovery.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/recovery/estimatePortalRecovery.ts)
