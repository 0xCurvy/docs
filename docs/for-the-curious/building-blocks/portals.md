# Portals

Portals are a cornerstone of UX and an elegant solution to time-based privacy leaks within Curvy.

> [!TIP]
> To better understand the privacy problem of time locality and how Portals solve it, refer to the [Time locality in Privacy section of the docs](../privacy-model#time-locality).

Portal addresses appear to senders as regular EOA addresses they can send any asset to, but in reality they are deterministically derived addresses using `CREATE2` through the [PortalFactory contract](https://github.com/0xCurvy/contracts/blob/develop/contracts/portal/PortalFactory.sol), **basically deterministic addresses of contracts that are not yet deployed**.

Curvy Portals carry multiple important responsibilities:

- **Compliance:** As only Portal Broadcasters, a set of entities that deploy portals using completely anonymous portal records, can deploy portals that shield into the Privacy Aggregator, **they are in charge of conducting compliance checks before deploying the Portals**. More about this in the [Compliance model](../compliance-model.md).
- **Privacy & UX:** Portals automatically shield any incoming assets into the [Privacy Aggregator](./privacy-aggregator.md), without sender intervention, solving the problem of [time locality](../privacy-model#time-locality)

Portal addresses change every time they are resolved for each user because they are composed of:

- Note's `ownerHash`, which holds the address and is unique per every Portal created. The `ownerHash` makes the Portal's owner anonymous but gives them the ability to spend the Notes created in the **Privacy Aggregator** after shielding the funds
- Portal's `recoveryAddress`, which will be the stealth address whose private key the recipient has access to and can use to recover non-compliant or unsupported assets.

## Portal Factory

The smart contract deployed on each network maintains code integrity of every deployed Portal and has helper view functions to calculate the Portal address given the `ownerHash` and `recoveryAddress`.

## Announcement

An announcement is the anonymous data (`ownerHash`, `recoveryAddress`, an ephemeral public key, and a view tag) from which the expected Portal address is deterministically calculated.

Since the v2 protocol, announcements are no longer stored in a separate public registry. Instead, they are recorded as part of a **portal record** at the moment a Curvy ID is resolved (by the ENS Resolver or the SDK). The [Portal Broadcasters](#portal-broadcasters) then execute these records, and the SDK can scan the portal record feed with the user's viewing key to find Portals it owns — for example, to recover non-compliant or unsupported assets.

## Portal Broadcasters

Off-chain workers that execute portal records: they monitor the recorded Portal addresses for incoming funds, run compliance checks, and deploy the Portal contracts that bridge and shield the funds.

## Automatic bridging with LiFi

Arbitrum is the only network right now that hosts the Privacy Aggregator smart contract. This is done to avoid fragmentation of liquidity (which can sacrifice privacy) and to minimize gas fees.

Portal Factories are deployed on each network, but in a different manner:

- On networks other than Arbitrum, PortalFactory is configured to bridge funds through LiFi to Arbitrum so that it can be shielded.
- On Arbitrum, the PortalFactory only performs shielding and can never bridge.

Bridging is accomplished through Curvy's partnership with [LiFi](https://li.fi/).

Deposits on Solana and Tempo are also bridged to Arbitrum before shielding. The received token is shielded as its Arbitrum counterpart — for example, SOL is shielded as SOL, while PathUSD arrives as USDC.

> [!NOTE]
> Curvy's contracts are 100% open-source and verified on block explorers. We invite you to examine the [0xCurvy/contracts](https://github.com/0xCurvy/contracts/) GitHub repository
