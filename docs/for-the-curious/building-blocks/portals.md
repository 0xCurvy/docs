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

## Exit Portals

Entry and shielding Portals move funds *into* Curvy; **exit Portals** are the same mechanism pointed the other way — they let funds leave the Privacy Aggregator toward any supported network or currency, without linking the withdrawal to its owner.

An exit Portal address is deterministically derived from the withdrawal's final destination (the *exit address*), the destination chain, and a `recoveryAddress`. Just like entry Portals, it is a valid address before any contract exists there. The flow:

1. The user's SDK records an exit Portal and produces a regular withdrawal proof whose on-chain destination is the exit Portal address.
2. The withdrawn funds land at the not-yet-deployed exit Portal address.
3. A Portal Broadcaster deploys the exit Portal through the Portal Factory, passing it pre-built LiFi routing data. The Portal Factory verifies **on-chain** that the routing data's receiver equals the recorded exit address (and, for cross-chain exits, that the destination chain matches) — a Broadcaster cannot redirect the funds anywhere else.
4. The exit Portal executes the LiFi route: a bridge when the destination is another network, or a swap when the destination is a different currency on the same network.

Exit Portals are also the engine behind Curvy's **private swaps**: the SDK unshields into an exit Portal, LiFi swaps the asset, and the proceeds arrive at a fresh entry Portal that automatically shields them right back into the Privacy Aggregator.

As with entry Portals, the `recoveryAddress` can transparently recover funds from an exit Portal if a route cannot be executed.

> [!NOTE]
> Curvy's contracts are 100% open-source and verified on block explorers. We invite you to examine the [0xCurvy/contracts](https://github.com/0xCurvy/contracts/) GitHub repository
