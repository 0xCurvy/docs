# Portals

Portals are a cornerstone of UX and an elegant solution to time-based privacy leaks in Curvy.

> [!TIP]
> To better understand the privacy problem of time-locality and how Portals solve it, take a look at [Time locality in Privacy section of the docs](../privacy/time-locality.md).

Portal addresses appear to senders as regular EOA addresses they can send any asset to, but in reality they are deterministically derived addresses using `CREATE2` through the [PortalFactory contract](https://github.com/0xCurvy/contracts/blob/develop/contracts/portal/PortalFactory.sol), **basically deterministic addresses of contracts that are not yet deployed**.

Curvy Portals carry multiple important responsibilities:

- **Compliance:** As only Portal Broadcasters, a set of entities that is deploying portals using publicly available (and completely anonymous) Announcement data can deploy portals that shield into the Privacy Aggregator, **they are in charge of conducting compliance checks before deploying the Portals**. More about this in the [Compliance section](../compliance/index.md).
- **Privacy & UX:** Portals automatically shield any incoming assets into the [Privacy Aggregator](./privacy-aggregator.md), without sender intervetion, solving the problem of [Time locality](../privacy/time-locality.md)

The portal addresses change every time they are resolved for every user because they are made of:

- Note's `ownerHash`, which holds the address, and is unique per every portal being created. The `ownerHash` makes the portal's owner anonymous, but gives him the ability to spend the Notes created in the **Privacy Aggregator** after shielding the funds
- Portal's `recoveryAddress` which will be the stealth address whose private key the recipient has access to, that they can use to recover non-compliant or unsupported assets.

## Portal Factory

The smart contract deployed on every network that maintains code integrity of each deployed portal, and has helper view functions to calculate the portal address given the `ownerHash` and `recoveryAddress`

## Announcement 

Announcement is an anonymous and public tuple `(ownerHash, recoveryAddress)` that anyone can query and calculate the expected Portal address from.
It is used by Portal Broadcasters to find Portals that they expect assets to land on.

## Portal Broadcasters

Off-chain workers that scan the announcements to figure out Portal addresses that have received funds in order to deploy a portal.

## Automatic bridging with LiFi

Arbitrum is the only network right now that hosts the Privacy Aggregator smart contract. This is done to avoid fragmentation of liquidity (which can sacrifice privacy) and to minimize gas fees.

Portal Factories are deployed on each network, but in a different manner:

- On networks other then Arbitrum, PortalFactory is configured to bridge funds through LiFi to Arbitrum so that it can be shielded.
- On Arbitrum the PortalFactory only does shielding, and can never bridge.

Bridging is accomplished through Curvy's partnership with [LiFi](https://li.fi/).

> [!NOTE]
> Curvy's contracts are 100% open-source and verified on block explorers, we invite you to take a look at the [0xCurvy/contracts](https://github.com/0xCurvy/contracts/) GitHub repository
