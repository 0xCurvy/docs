# Portals & Recovery

Most apps never call these APIs directly — the [Planner](./interacting-with-assets) creates and tracks Portals automatically when it executes an intent. Use them when you're building custom receive flows, a portal dashboard, or an asset-recovery tool.

> [!TIP]
> For the concepts behind Portals (entry, shielding, and exit), see [Portals in Curvy for the Curious](/for-the-curious/building-blocks/portals).

## Creating Portals

`generateEntryPortal` records a fresh on-ramp address that shields incoming funds into Curvy. `generateExitPortal` records an off-ramp that unshields funds toward a destination address:

```ts
import { generateEntryPortal, generateExitPortal } from "@0xcurvy/curvy-sdk/actions";

// A fresh receiving address for a Curvy ID
const entry = await generateEntryPortal({ curvyId: "alice.curvy.name" });
console.log(entry.address, entry.flavour); // "0x..." | base58, "evm" | "solana"

// An off-ramp toward an external address
const exit = await generateExitPortal({
  curvyId: "alice.curvy.name",
  currencyId: currency.id,
  exitAddress: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045",
  exitNetworkId: destinationNetwork.id, // omit for a same-network exit
});
```

Both delegate derivation to the backend and return the deterministic portal `address` plus its `flavour`. The recorded portal is picked up and executed by the Portal Broadcasters.

## Tracking a Portal

```ts
import { getPortalStatus } from "@0xcurvy/curvy-sdk/actions";

const status = await getPortalStatus({ address: entry.address });
```

Returns `null` when no portal matches. A portal moves through the following lifecycle states: `awaiting_funds` → `compliance_checking` → `bridging` / `shielding` / `exiting` → `completed`, with `compliance_failed` and `failed` as terminal error states.

## Scanning the portal record feed

The portal record feed is public and anonymous. Paginate it with a keyset cursor — for example, to scan for Portals owned by the active account's keys:

```ts
import { getPortalRecords } from "@0xcurvy/curvy-sdk/actions";

let cursor: string | undefined;
do {
  const { portals, nextCursor } = await getPortalRecords({ cursor, limit: 200 });
  // ...process portals...
  cursor = nextCursor ?? undefined;
} while (cursor);
```

## Recovering funds

When an unsupported token lands on a Portal address, or a Portal is blocked by compliance, the funds can be recovered to any address by the owner of the Portal's recovery key — a stealth address only the recipient controls:

```ts
import { findOwnedPortals, recoverPortal } from "@0xcurvy/curvy-sdk/actions";

// Enumerate every portal (entry and exit) owned by the active account on a network
const owned = await findOwnedPortals({ network });

// Sweep a token from one of them
const txHash = await recoverPortal({
  networkId: network.id,
  tokenAddress: "0x...",
  portalRecord: owned[0],
  destinationAddress: "0x...",
});
```

`findPortal` performs the same ownership check for a single known address. Recovery is a transparent on-chain action signed with the recovery key; on Solana, pass a `solanaSigner` as well.
