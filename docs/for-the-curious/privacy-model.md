# Privacy

Privacy is one of the core principles of the Curvy protocol.

We take privacy seriously, our users do to.

On this page we will explain how:

- We define different levels of Privacy
- [Sending](#sending-privacy) and [Receiving](#receiving-privacy) privacy differs and how we accomplish them
- How we tackle the problem of [Time locality](#time-locality) with [Portals](./portals)
- How we enable users to do [Selective disclosure](#selective-disclosure) of their transactions

## Degrees of privacy

To be able to speak about privacy, we need to define two dimensions which we will to describe it. 

### Qualitative scoring of privacy

The first dimension is a qualitative one, the answer to the question: **What do I know about this transaction?**
As you might guess, things you may know about a blockchain transaction are:

- Sender
- Recipient
- Amount
- Currency
- PII

In this list, Personally Identifiable Information (PII) is the worst thing you might know about a transaction, this includes:

- IP address
- Geo location
- Personal information
- Browser fingerprint

### Quantitative scoring of privacy

Quantitative analysis of privacy is a bit trickier, but it measures how hard would it be for a certain party to deduce using methods and data they have at hand
to find different qualities of the transaction (with varying degrees of confidence).

| Legend |  Description |
| - | - |
| None | Lowest degree of privacy, no analysis needs to be done with data at hand it's just read. |
| Trusted | Privacy is questionable because we need to trust this party that they are not collecting and/or analyzing the data to learn more about the users involved in the transaction |
| Obfuscated | |
| Pseudonymous | Degree of sender & recipient privacy natively offered by blockchains, there are no usernames, only hex addresses, but these addresses tell a story everybody can read on block explorers. |
| Complete | Highest degree of privacy, no matter how much analysis is done with data possibly at hand, nothing can be deduced.|

### Example of a typical transaction

Let's take for example a centralized exchange you are depositing funds to through a mainstream non-custodial wallet:

- Everybody can see the sender, amount and currency looking at the transaction on the block explorer.
- Everybody can also deduce (but not see clearly without analysis) that the recipient is most probably this specific exchange, since funds later moved to exchange's well-known "colder wallets"
- The exchange, since they have done KYC with you before, and since they need to be sure that it is you who they should credit these funds to, know exactly who you are.
- You have to trust the wallet, and the RPC you are using that they have not collected PII forom you

This short anaysis gives us the following table:

| Party | Sender privacy  | Recipient privacy | Amount privacy  | Currency privacy  | PII privacy |
| - | - | - | - | - | - |
| Public | Pseudonymous | Obfuscated | None | None | Complete |
| Wallet | Trusted | Obfuscated | None | None | Trusted |
| RPC provider | Trusted | Obfuscated | None | None | Trusted |
| Exchange | Pseduonymous | None | None | None | None |

It's a bleak picture but that is the privacy you can expect from a vast majority of blockchain transactions.


## Sending privacy in Curvy

Sending privacy is not bein
