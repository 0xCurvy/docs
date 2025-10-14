# Curvy v2 Architecture Overview

The Curvy v2 architecture is a modular, multi-component system designed to enable fully private transactions on public blockchains. Its core principle is to decouple the user's intent from the on-chain execution, using a combination of off-chain services and on-chain smart contracts to break the link between sender and receiver.

This document provides a technical overview of the system's components and their interactions.

:::info The Goal of the Architecture
The primary goal is to achieve privacy and scalability. This is done by moving complex computations off-chain, batching multiple transactions together, and using Zero-Knowledge proofs to verify the validity of transactions on-chain without revealing any sensitive data.
:::

## Core Components

The architecture consists of four main components that work in concert:

### 1. User (Client-Side)
The **User** interacts with the system through a client interface (like a web app or wallet). The client is responsible for all sensitive operations, ensuring that private keys and transaction details never leave the user's device.

**Key Responsibilities:**
-   **Managing Private State:** Tracking ownership of private "notes" (UTXO-like objects representing funds).
-   **Creating Transactions:** Constructing the details of a send or withdrawal operation.
-   **Generating Proofs:** Using the ZK circuits to generate a Zero-Knowledge proof that proves the transaction's validity (e.g., that the user owns the funds they are trying to spend).

### 2. Relayer
The **Relayer** is an off-chain service that acts as an intermediary between the User and the blockchain. Its primary function is to improve user experience and enhance privacy.

**Key Responsibilities:**
-   **Receiving User Intents:** Accepts transaction requests (including the generated proof) from users via an API.
-   **Batching Transactions:** Collects multiple transactions from various users into a single batch. This is critical for creating a large "anonymity set."
-   **Managing Gas Fees:** Submits the batched transaction to the blockchain and pays the associated gas fees, enabling a "gasless" experience for the end-user.
-   **Privacy Enhancement:** Since the Relayer submits the transaction, the user's primary wallet address (EOA) is not directly linked to the on-chain privacy protocol.

### 3. Aggregator
The **Aggregator** is the main smart contract on the blockchain. It is the central point of trust and the keeper of the system's state.

**Key Responsibilities:**
-   **Receiving Batched Transactions:** Accepts batches of transactions from a whitelisted Relayer.
-   **State Management:** Maintains the official state of all private notes, typically stored in a Merkle tree. When a transaction is valid, it adds the new note commitments to this tree.
-   **Coordinating Verification:** It does not verify the proof itself. Instead, it delegates this task to the Verifier contract to save gas and maintain modularity.

### 4. Verifier
The **Verifier** is a highly-optimized, specialized smart contract. Its one and only job is to verify Zero-Knowledge proofs.

**Key Responsibilities:**
-   **Proof Handling:** Implements the mathematical logic required to validate a ZK proof (e.g., for Groth16 or PLONK). This logic is auto-generated from the ZK circuit.
-   **Returning a Boolean:** It takes a proof and public inputs from the Aggregator and returns a simple `true` (if valid) or `false` (if invalid). This separation of concerns makes the system more secure and easier to audit.

## Transaction Lifecycle & Data Flow

Here is a step-by-step flow of a typical private transaction:

1.  **Creation (User):** A user decides to send funds. Their client crafts a transaction, generates a ZK proof of its validity, and encrypts the new note for the recipient.
2.  **Submission (User → Relayer):** The user sends the transaction data and proof to the Relayer (off-chain).
3.  **Batching (Relayer):** The Relayer waits to receive multiple transactions and bundles them into one large batch.
4.  **Submission (Relayer → Aggregator):** The Relayer calls the `transact` function on the Aggregator smart contract, passing the entire batch of data and an aggregated proof.
5.  **Verification (Aggregator → Verifier):** The Aggregator takes the proof from the batch and passes it to the `Verifier` contract for validation.
6.  **State Update (Aggregator):** If the Verifier returns `true`, the Aggregator updates its internal state by adding the new note commitments to its Merkle tree. The transaction is now officially part of the private state.

### Data Flow Diagram (Mermaid)

```mermaid
graph TD
    subgraph Client-Side
        User[User Wallet]
    end

    subgraph Off-Chain Services
        Relayer
    end

    subgraph On-Chain Smart Contracts
        Aggregator
        Verifier
        Blockchain[Blockchain State / Merkle Tree]
    end

    User -- 1. Creates Note & ZK Proof --> User
    User -- 2. Submits TX Intent (Off-Chain) --> Relayer
    Relayer -- 3. Batches Multiple Transactions --> Relayer
    Relayer -- 4. Submits Batch (On-Chain TX) --> Aggregator
    Aggregator -- 5. Delegates Proof Verification --> Verifier
    Verifier -- 6. Returns true/false --> Aggregator
    Aggregator -- 7. Updates State --> Blockchain