# What is a Relayer?
A Relayer is an intermediary service (like a server) that receives your transaction off-chain and submits it to the blockchain on your behalf.

Its main roles are:

1. Enhancing Privacy: When you send your transaction to a Relayer, your wallet address (EOA) does not interact directly with the on-chain smart contract. The Relayer does this for you, which helps to hide your address and breaks the direct link between you and the on-chain transaction.

2. Paying Gas Fees: The Relayer is responsible for paying the network gas fees required to process the transaction. This enables gasless transactions for the user, meaning you don't need to hold the native token (e.g., ETH) just to pay for gas. The Relayer typically covers this fee by taking a small cut from the transaction amount itself.

3. Batching Transactions: Instead of sending each transaction to the blockchain individually, the Relayer collects multiple transactions from different users. Once it has a sufficient number, it bundles them together into a single "batch" to be processed.

:::info
In short, the Relayer acts as the "gateway" to the system—it takes your private intent (to send funds) and handles the technical complexities of submitting it to the blockchain.
:::



# What is an Aggregator?
The Aggregator is a smart contract that lives on the blockchain. Its job is to process the batched transactions sent to it by the Relayer.

Its main roles are:

1. Proof Validation: This is its most critical function. The Aggregator doesn't see the specific details of the transactions (who sent what to whom). Instead, it receives a cryptographic proof (like a Zero-Knowledge Proof) which mathematically confirms that all transactions within the batch are valid (e.g., the senders had sufficient funds). The Aggregator's only job is to verify that this proof is correct.

2. Enforcing On-Chain Privacy: Because the Aggregator processes an entire batch of transactions at once, it becomes impossible for an outside observer to link specific inputs to specific outputs. Your transaction is effectively mixed with many others, creating what is known as an "anonymity set." The more transactions in the batch, the greater the privacy.

3. Updating the State: After successfully verifying the proof, the Aggregator updates the state of the system on-chain. This means it records that new private "notes" have been created and are now available for the recipients to claim.

:::info
In short, the Aggregator acts as the "privacy guard" on the blockchain—it efficiently and cheaply confirms the validity of many transactions without ever revealing their underlying details.
:::

# Bidirectional Send/Receive Flow

Unlike traditional crypto transfers where funds are "pushed" directly from one address to another, Curvy v2 uses a bidirectional, or "note-based," model. This fundamentally enhances privacy by decoupling the act of sending from the act of receiving.

Think of it less like a direct bank transfer and more like placing a secure, anonymous message in a public drop box for someone else to retrieve.

### The "Send" Action: Creating a Note
When you send funds, you are not directly transferring assets to a recipient's address. Instead, you are creating a private, encrypted **"note"**. This note contains the value and ownership information, which only the intended recipient can decrypt and use. This note is then submitted to the **Aggregator** as part of a larger batch of transactions.

### The "Receive" Action: Claiming a Note
The recipient does not automatically see a balance increase. They actively scan the system for notes addressed to them. Once they discover a note, they can "claim" it by creating a zero-knowledge proof that they are the rightful owner. This claim transaction is also processed privately, completing the transfer without ever linking your "send" action to their "receive" action on-chain.

:::tip Why is this better for privacy?
This two-step process breaks the on-chain link. The sender's action is mixed with many others during the "send" phase. The receiver's "claim" can happen in a completely different transaction, at a different time, making it extremely difficult to trace the flow of funds.
:::

# What is a Privacy Score?

Not all private transactions are created equal. A **Privacy Score** is a metric that quantifies how anonymous your transaction is within the Curvy system. It gives you a clear, understandable measure of the privacy you are achieving.

Think of it as a "strength meter" for your anonymity. A higher score means your transaction is better hidden among others.

This score is calculated based on several key factors:

1.  **Anonymity Set Size:** This is the most important factor. It refers to the number of other transactions (notes) your transaction is mixed with in a batch. The larger the "crowd" you are hiding in, the higher your privacy score.

2.  **Transaction Patterns:** The system analyzes for common patterns that could weaken privacy. For example, depositing and immediately withdrawing an identical, unique amount (e.g., 1.23456 ETH) could be linked. The score encourages behavior that avoids such "heuristic" links.

3.  **Temporal Decoupling:** The amount of time that passes between a note being created (sent) and it being claimed (received) can also contribute to privacy. A longer delay makes tracing more difficult.

:::tip Why does this matter to you?
The Privacy Score empowers you to make informed decisions. The user interface can use this score to provide feedback, for instance, suggesting you wait for a larger batch to form before sending your transaction to maximize your privacy.
:::