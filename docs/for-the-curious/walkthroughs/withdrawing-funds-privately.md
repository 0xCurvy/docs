# Scenario: Withdrawing funds privately

After some time, and many payments privately and securely received by Bob from his clients, Bob is ready to sell a portion of his crypto on a centralized exchange (CEX) to buy a house.

In the previous scenario we covered the first of the three actions of the **Aggregator.sol**: deposit.

Now we are going to need to use the other two: aggregations and withdrawals.

![Withdrawing funds privately](withdrawing-funds-privately.png)

## Steps explained in detail

### 🟢 Bob

1. Bob syncs and scans the notes from the public **Notes Registry**.
2. After having matched some notes for ownership during scanning, the **Curvy SDK** generates local ownership proofs that are used to decrypt the note balances and the exact token.

### ⚫ Curvy
3. The **Curvy SDK** on Bob's side next submits aggregation requests which merge multiple notes together, and a subsequent withdrawal request.
4. The **ZK Prover** after generating the proofs, submits them on-chain to the **Aggregator.sol** which in turn automatically after verifying the withdrawal proof initiates the unshielding process from the **Aggregator.sol** to the address of the Centralized Exchange.


> [!IMPORTANT]
> From the perspective of an on-chain observer, funds have simply moved from the **Aggregator.sol** to the address of the CEX. The information about the previous owner of the funds, and the notes themselves that got aggregated into a single note for withdrawal is completely hidden.
