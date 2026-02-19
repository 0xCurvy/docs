# Privacy aggregator

Privacy aggregator is the set of on-chain and off-chain components that allow complete privacy when transacting with other Curvy users.

## How it works?

Curvy Privacy Aggregator expands on the concepts introduced by other Note-based ZK privacy systems.

Like those systems, Privacy Aggregator works by verifying the proofs that a state transition of an ordered list of tuples called "Notes" and "Nullifiers" produced a valid end-state.

Notes and Nullifiers are each arranged into a Sparse Merkle Tree, a data-structure that allows for proofs of integrity, inclusion and non-inclusion (like Merkle Trees) in a manner that is much more friendly to zk-SNARK protocols.

Given a set of simple rules (no double spending, no negative balances, transactions can only affect single token's balances, etc.) the state transition is validated, and with each proof submitted by the **ZK Prover** to the Aggregator smart contract, 
new Notes and/or Nullifiers that are created are emitted through EVM events and the roots of the SMT trees are update on-chain.

Unlike systems that utilize a similar base approach, such as Railgun, Curvy Privacy Aggregator combines the best of both worlds of Stealth Addresses and ZK technology, allowing users to addresses notes to different recipients, not only using the ZK pool as a crypto mixer. 

*Utilizing ZK proofs allows for provable on-chain data and state transition rule integrity without exposing what exact state transitions really took place.*

## Note Registry

Note Registry is the public API offered by Curvy which can easily be used with the Curvy SDK which serves all the indexed data of emitted Notes and Nullifiers from the Aggregator smart contract.
The Notes and Nullifiers data is essential so that every client can verify that the SMTs are valid, and to subsequently prove that they can spend the Notes they have ownership of.

## Actions

There are three actions, or proof types that the Privacy Aggregator can verify and allow as valid state transitions.

Luckily, all of the mentioned actions are orchestrated automatically by the [Curvy SDK](./curvy-sdk.md) which translates users' intents into a set of Privacy Aggregator actions (among other things).

### Shielding

Shielding is the process of putting funds into the Privacy Aggregator.

During the proof verification, a new Note is created indicating a not yet spent balance of a certain currency.

### Aggregation

Aggregation is the process of combining one or many "input" Notes into one or many "output" notes.

> [!TIP]
> It's easiest to think about a single Aggregation as a Bitcoin transaction. Multiple inputs can spawn multiple outputs, the sum of the inputs and outputs must be equal, and the actor making the transaction must be able to prove ownership of all the inputs.

Using Aggregation, one can:

- Split one Note into multiple smaller ones
- Merge multiple Notes into one Note
- Change ownership of any output Note, effectively doing a transfer

### Unshielding

Unshielding is the process of moving funds out of the Privacy Aggregator.

After a successfully verified unshielding proof, funds are being withdrawn to the address specified in the proof itself. 

> [!NOTE]
> Curvy's contracts are 100% open-source and verified on block explorers, we invite you to take a look at the [0xCurvy/contracts](https://github.com/0xCurvy/contracts/) GitHub repository
