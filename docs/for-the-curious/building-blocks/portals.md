# Portals

Portals are a cornerstone of UX and an elegant solution to time-based privacy leaks within Curvy.

> [!TIP]
> To better understand the privacy problem of time locality and how Portals solve it, refer to the [Time locality in Privacy section of the docs](../privacy-model#time-locality).

Portal addresses appear to senders as regular EOA addresses they can send any asset to, but in reality they are deterministically derived addresses using `CREATE2` through the [PortalFactory contract](https://github.com/0xCurvy/contracts/blob/develop/contracts/portal/PortalFactory.sol), **basically deterministic addresses of contracts that are not yet deployed**.

Curvy Portals carry multiple important responsibilities:

- **Compliance:** As only Portal Broadcasters, a set of entities that are deploying portals using publicly available (and completely anonymous) Announcement data can deploy portals that shield into the Privacy Aggregator, **they are in charge of conducting compliance checks before deploying the Portals**. More about this in the [Compliance model](../compliance-model.md).
- **Privacy & UX:** Portals automatically shield any incoming assets into the [Privacy Aggregator](./privacy-aggregator.md), without sender intervention, solving the problem of [time locality](../privacy-model#time-locality)

Portal addresses change every time they are resolved for each user because they are composed of:

- Note's `ownerHash`, which holds the address and is unique per every Portal created. The `ownerHash` makes the Portal's owner anonymous but gives them the ability to spend the Notes created in the **Privacy Aggregator** after shielding the funds
- Portal's `recoveryAddress`, which will be the stealth address whose private key the recipient has access to and can use to recover non-compliant or unsupported assets.

## Portal Factory

The smart contract deployed on each network maintains code integrity of every deployed Portal and has helper view functions to calculate the Portal address given the `ownerHash` and `recoveryAddress`.

## Announcement

Announcement is an anonymous and public tuple `(ownerHash, recoveryAddress)` that anyone can query and calculate the expected Portal address from.
It is used by Portal Broadcasters to find Portals where they expect assets to land.

## Portal Broadcasters

Off-chain workers that scan announcements to identify Portal addresses that have received funds, in order to deploy a Portal.

## Automatic bridging with LiFi

Arbitrum is the only network right now that hosts the Privacy Aggregator smart contract. This is done to avoid fragmentation of liquidity (which can sacrifice privacy) and to minimize gas fees.

Portal Factories are deployed on each network, but in a different manner:

- On networks other than Arbitrum, PortalFactory is configured to bridge funds through LiFi to Arbitrum so that it can be shielded.
- On Arbitrum, the PortalFactory only performs shielding and can never bridge.

Bridging is accomplished through Curvy's partnership with [LiFi](https://li.fi/).

> [!NOTE]
> Curvy's contracts are 100% open-source and verified on block explorers. We invite you to examine the [0xCurvy/contracts](https://github.com/0xCurvy/contracts/) GitHub repository
