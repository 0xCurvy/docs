# Privacy aggregator

The Privacy Aggregator is the set of on-chain and off-chain components that allow for complete privacy when transacting with other Curvy users.

## How it works?

The Curvy Privacy Aggregator expands on the concepts introduced by other Note-based ZK privacy systems.

Like those systems, the Privacy Aggregator verifies proofs that a state transition of an ordered list of tuples, called "Notes" and "Nullifiers," produced a valid end-state.

Notes and Nullifiers are each arranged into a Sparse Merkle Tree, a data-structure that allows for proofs of integrity, inclusion and non-inclusion (like Merkle Trees) in a manner that is much more friendly to zk-SNARK protocols.

Given a set of simple rules (no double spending, no negative balances, transactions can only affect a single token's balance, etc.), the state transition is validated. With each proof submitted by the **ZK Prover** to the Aggregator smart contract, 
new Notes and/or Nullifiers are emitted through EVM events, and the roots of the SMT trees are updated on-chain.

Unlike systems that utilize a similar basic approach, such as Railgun, the Curvy Privacy Aggregator combines the best of both worlds: Stealth Addresses and ZK technology. This allows users to address notes to different recipients, not merely using the ZK pool as a crypto mixer. 

*Utilizing ZK proofs allows for provable on-chain data and state transition rule integrity without exposing the exact state transitions that took place.*

## Note Registry

The Note Registry is the public API offered by Curvy, which can easily be used with the Curvy SDK to serve all the indexed data of emitted Notes and Nullifiers from the Aggregator smart contract.
The Notes and Nullifiers data is essential so that every client can verify the validity of the SMTs and subsequently prove ownership of the Notes they wish to spend.

## Actions

There are three actions, or proof types, that the Privacy Aggregator can verify and allow as valid state transitions.

Luckily, all of these actions are automatically orchestrated by the [Curvy SDK](./curvy-sdk.md), which translates users' intents into a set of Privacy Aggregator actions (among other things).

### Shielding

Shielding is the process of putting funds into the Privacy Aggregator.

During proof verification, a new Note is created, indicating a not-yet-spent balance of a certain currency.

### Aggregation

Aggregation is the process of combining one or many "input" Notes into one or many "output" notes.

> [!TIP]
> It's easiest to think about a single Aggregation as a Bitcoin transaction: Multiple inputs can spawn multiple outputs; the sum of the inputs and outputs must be equal; and the actor making the transaction must be able to prove ownership of all inputs.

Using Aggregation, one can:

- Split one Note into multiple smaller ones
- Merge multiple Notes into one Note
- Change ownership of any output Note, effectively doing a transfer

### Unshielding

Unshielding is the process of moving funds out of the Privacy Aggregator.

After a successfully verified unshielding proof, funds are transferred from the Privacy Aggregator to the address specified in the proof itself. 

> [!NOTE]
> Curvy's contracts are 100% open-source and verified on block explorers. We invite you to examine the [0xCurvy/contracts](https://github.com/0xCurvy/contracts/) GitHub repository
