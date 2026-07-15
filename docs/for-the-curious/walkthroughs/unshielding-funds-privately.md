# Unshielding funds privately

After some time and many privately and securely received payments from his clients, Bob is ready to sell a portion of his crypto on a centralized exchange (CEX) to buy a house.

In the previous scenarios, we covered the first two of the three actions of **Aggregator.sol**: shielding and aggregation.

Now we will need the third one: unshielding.

![Unshielding funds privately](./curvy-withdrawal-flow.png)

## Steps explained in detail

### 🟢 Bob

**1.** Bob's **Curvy SDK** syncs its local Merkle tree from the **Indexer** and scans the notes to match the ones in his ownership, decrypting their balances and exact tokens.

**2.** The **Local ZK prover**, running entirely on Bob's device, generates the withdrawal proof — aggregating multiple notes into a single one if needed — with the CEX's address as the withdrawal destination, and sends it to the **Relayer**.

### ⚫ Curvy

**3.** The **Relayer** relays the withdrawal proof to **Aggregator.sol**, submitting the withdrawal request on-chain. After verifying the proof, **Aggregator.sol** automatically transfers the funds from itself to the Centralized Exchange's address.

> [!IMPORTANT]
> From the perspective of an on-chain observer, funds have simply moved from **Aggregator.sol** to the CEX's address. The information about the previous owner of the funds, and the notes themselves that were aggregated into a single note for unshielding, is completely hidden.
