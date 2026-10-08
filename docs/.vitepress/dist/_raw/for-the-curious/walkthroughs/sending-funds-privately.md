# Sending funds privately

Alice needs to pay her subcontractor, Bob, who also uses Curvy, for the services he provided.

Bob has a registered Curvy ID: `bob.curvy.name`

![Sending funds privately](./curvy-sender-flow.png)

## Steps explained in detail

### 🔵 Alice

**1.** Alice queries bob.curvy.name in the **Identity Registry**, fetching Bob's public keys.

**2.** Using the **Curvy SDK**, a new note is created for which Bob is the owner. This information is hidden from everyone except Alice and Bob.

**3.** The **Local ZK prover**, running entirely on Alice's device, generates a transfer proof that spends Alice's notes and creates the new output note owned by Bob. The proof is submitted to the **Relayer**, so Alice needs no gas tokens or on-chain identity.

### ⚫ Curvy

**4.** The **Relayer** relays the transfer proof on-chain to **Aggregator.sol**, which verifies it and marks the spent notes' nullifiers.

**5.** The **Batch Prover** constructs a commitment proof for the new notes batch and commits it on-chain to **Aggregator.sol**. After successful verification, Bob's new note becomes part of the committed Notes tree.

### 🟢 Bob

**6.** Some time later, after logging into the Curvy App, Bob's **Curvy SDK** syncs its local Merkle tree from the **Indexer** and simultaneously scans the notes for ownership, detecting his new balance.

> [!NOTE]
> The equivalent actions also appear in the [full protocol drawing](./receiving-funds-privately.md), where they use the combined flow's numbering. Steps **2** and **3** are specific to this flow.

> [!IMPORTANT]
> Although this is the simplest process in Curvy, it is also the most private, as the exact:
> **amount, currency, sender and recipient are completely hidden from the public eye.**
