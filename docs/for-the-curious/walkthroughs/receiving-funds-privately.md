# Receiving funds privately

**Alice, the client**, wants to send a salary to her **consultant, Bob**.

Alice uses MetaMask with Ledger to manage her company's treasury, while Bob, a privacy-savvy crypto professional, uses Curvy to ensure his clients don't get unnecessary insight into his earnings and spending.

Bob has provided Alice with instructions to complete the payment to his ENS: bob.curvy.name, or to simply
open https://bob.curvy.name and continue with payment there.

Bob made it clear that **he only accepts payment in USDC, but hasn't specified which network to use**.

Without asking, Alice sent the funds to Bob's private address on Ethereum, but was reassured by Bob that *the system
he's using should pick up transfers on any of the [supported networks](/for-users/#supported-networks-and-tokens) — Polygon, BSC, Arbitrum, Optimism, Linea, Base, Gnosis, or even Solana.*

**Bob uses Curvy, but Alice, the sender, can keep using Ledger + MetaMask without knowing what Curvy is.**

![Receiving funds privately](./curvy-full-flow.png)

## Steps explained in detail

### 🔵 Alice

**1.** Alice enters `bob.curvy.name` into her wallet of choice. In the background, an **ENS resolver** powered by the **Curvy SDK**
fetches Bob's public keys from the **Identity Registry**.

**2.** Using the **Curvy SDK**, a random nonce, and Bob's public keys, a new **Portal** address is generated to which Bob can receive funds; no contract is deployed at that address yet. The resolved Portal is recorded so that the **Portal Broadcasters** can later pick it up.

**3.** Alice sends the funds to the generated Portal address, as she would to any regular address.

### ⚫ Curvy

**4.** After observing that a Portal address has received any of the supported funds, the **Portal Broadcasters** have the necessary incentive to
deploy the **Portal** contract through the **Portal Factory**. Because the address of the Portal is deterministically calculated,
the deployment lands exactly where the funds are: on networks without the aggregator, an entry Portal automatically bridges the funds over the
cross-chain bridge; on the network with the aggregator, a shielding Portal shields them directly into the **Privacy Aggregator** (**Aggregator.sol**).

**6.** The **Batch Prover** picks up the pending shielded notes, constructs a commitment proof for the new notes batch, and commits it on-chain to
**Aggregator.sol**. After successful on-chain verification, the new note becomes part of the committed Notes tree.

### 🟢 Bob

**7.** Some unknown time later, Bob logs into his **Curvy App**. In the background, immediately upon starting, the Curvy App,
using the open-source **Curvy SDK**, syncs its local Merkle tree from the **Indexer**, which serves as a fast index of on-chain events emitted by **Aggregator.sol**.

![Receiver flow](./curvy-receiver-flow.png)

In Bob's browser, the **Curvy SDK** simultaneously scans the synced notes with his private keys to
detect which notes are secretly in his ownership and to decrypt their balances.

> [!NOTE]
> Steps **5a/5b** (transfer proofs) and **8** (withdrawal request) from the drawing above belong to the other two flows: [Sending funds privately](./sending-funds-privately.md) and [Unshielding funds privately](./unshielding-funds-privately.md).

> [!IMPORTANT]
> From the perspective of an on-chain observer, Alice has sent funds to a regular EOA address to which a smart contract (Portal) was later deployed by the Portal Broadcaster. This deployment moved the funds to the Curvy Privacy Protocol (Aggregator.sol), **and most importantly, the new owner of these funds (Bob) is completely hidden**.
