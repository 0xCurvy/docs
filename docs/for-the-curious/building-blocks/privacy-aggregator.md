# Privacy aggregator

The Privacy Aggregator is the set of on-chain and off-chain components that allow for complete privacy when transacting with other Curvy users.

## How it works?

The Curvy Privacy Aggregator expands on the concepts introduced by other Note-based ZK privacy systems.

Like those systems, the Privacy Aggregator verifies proofs that a state transition of an ordered list of tuples, called "Notes" and "Nullifiers," produced a valid end-state.

Notes are arranged into an incremental Merkle tree built with zk-SNARK-friendly Poseidon hashes: spending a Note requires proving its inclusion under a committed tree root, without revealing which Note is being spent. Spent Notes are tracked through their Nullifiers — unique, one-way identifiers registered on-chain the moment a Note is consumed, making double spending impossible while keeping the Note itself hidden.

Given a set of simple rules (no double spending, no negative balances, transactions can only affect a single token's balance, etc.), the state transition is validated. Proofs are generated **client-side** by the SDK and submitted to the Aggregator smart contract through the [Relayer](#off-chain-services). With each accepted proof,
new Notes and/or Nullifiers are emitted through EVM events, and the root of the Notes tree advances on-chain with every committed batch of new Notes.

Unlike systems that utilize a similar basic approach, such as Railgun, the Curvy Privacy Aggregator combines the best of both worlds: Stealth Addresses and ZK technology. This allows users to address notes to different recipients, not merely using the ZK pool as a crypto mixer. 

*Utilizing ZK proofs allows for provable on-chain data and state transition rule integrity without exposing the exact state transitions that took place.*

## The Vault

On-chain, the Privacy Aggregator splits its responsibilities across two contracts:

- **Aggregator** — verifies the zk-SNARK proofs and keeps the Notes tree and Nullifier bookkeeping.
- **Vault** — holds the actual tokens. Funds can only move in or out of the Vault on the Aggregator's instruction, after a proof has been verified.

Protocol fees are charged where the money moves: the Vault takes the shielding fee on deposit and the unshielding fee on withdrawal, while the aggregation fee is enforced by the aggregation proof itself (see [How does Curvy make money?](/faq) for the current rates). During a withdrawal, the Vault also reimburses the gas of the [Relayer](#off-chain-services) that submitted the proof — one of the mechanisms that keep Curvy gasless for its users.

Throughout these docs, we refer to the Aggregator and the Vault together as **Aggregator.sol** for simplicity.

## Note Registry

The Note Registry is the public API offered by Curvy, which can easily be used with the Curvy SDK to serve all the indexed data of emitted Notes and Nullifiers from the Aggregator smart contract.
The Notes and Nullifiers data is essential so that every client can verify the validity of the Notes tree and subsequently prove ownership of the Notes they wish to spend.

## Off-chain services

The Curvy backend is a set of independent, horizontally-scalable microservices. Each owns a single responsibility and speaks to the SDK over HTTP, so a client can point at a different provider for any of them via the [config](/for-programmers/installing-the-sdk) (`indexerBaseUrl`, `relayerBaseUrl`, `metadataBaseUrl`).

| Service | Responsibility |
| --- | --- |
| **Indexer** | Watches Aggregator events, builds the Note/Nullifier shards and the Notes Merkle tree, and serves Note status — the engine behind the [Note Registry](#note-registry). |
| **Relayer** | Accepts client-proved aggregation/withdrawal submissions and submits them on-chain, so users never need gas or an on-chain identity to transact — see [gasless & anonymous relaying](#gasless-and-anonymous-relaying). |
| **Batch Prover** | Builds pending-notes-commitment proofs for uncommitted Notes and submits them on-chain, advancing the committed SMT state. |
| **Metadata** | Owns network/contract metadata, currencies, [Curvy ID](./curvy-id) registration & resolution, JWT auth, and Privacy Pass token issuance. |
| **ENS Resolver** | ERC-3668 offchain ENS gateway that resolves a Curvy ID to a fresh stealth entry-[Portal](./portals) address — so any ENS-aware wallet can pay a `.curvy.name` handle — and records the resolved Portal for the Portal Broadcaster to pick up. |
| **Portal Broadcaster** | Drives the [Portal](./portals#portal-broadcasters) state machine — balance checking, compliance screening, and deployment (bridging / shielding / exit) — and serves the portal API the SDK uses to create Portals, query their status and history, and estimate bridge costs. |
| **RPC** | Multi-chain, multi-upstream JSON-RPC proxy with failover, so the SDK reaches every supported network through one endpoint. |

> [!NOTE]
> Because proofs are generated on the client and only relayed on-chain, no service ever sees a user's spending keys or the plaintext of their transactions.

### Gasless and anonymous relaying

Two mechanisms keep the Relayer from becoming a UX or privacy choke point:

- **Gas is paid from the shielded balance.** Instead of requiring native gas tokens, an aggregation simply includes an output Note addressed to the Relayer's operator, sized to cover the gas cost in the token being transacted (the Relayer publishes its accepted tokens and current gas pricing). The Relayer verifies the Note covers the cost and sponsors the on-chain submission.
- **Anonymous rate limiting with Privacy Pass.** Submissions are gated by single-use [Privacy Pass](https://datatracker.ietf.org/doc/rfc9576/) tokens. The Metadata service issues them in batches against a Curvy ID's daily budget, but they are *blind-signed*: a redeemed token is statistically unlinkable to the Curvy ID it was issued to and to every other token. The Relayer can throttle abuse without ever learning who is submitting.

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
