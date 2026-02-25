# Privacy

Privacy is one of the core principles of the Curvy protocol.

On this page, we will explain:

- how we define different levels of privacy
- how [Sending](#sending-privacy) and [Receiving](#receiving-privacy) privacy differ and how we accomplish them
- how we tackle the problem of [time locality](#time-locality-issue) with [Portals](/for-the-curious/building-blocks/portals)

## Degrees of privacy

To speak about privacy, we need to define two dimensions by which we will describe it.

### Qualitative scoring of privacy

The first dimension is qualitative, answering the question: **What do I know about this transaction?**
As you might guess, details you might know about a blockchain transaction include:

- Sender
- Recipient
- Amount
- Currency
- Personally identifiable information (PII)
  - IP address
  - Geolocation
  - Browser fingerprint
  - KYC

### Quantitative scoring of privacy

Quantitative analysis of privacy is a bit trickier, measuring the difficulty for a party to deduce various transaction qualities (with varying degrees of confidence) using available methods and data.

| Legend | Description                                                                                                                                                                   |
| - |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| 👀 Transparent | Lowest degree of privacy, no analysis needs to be done with data at hand it's just read.                                                                                      |
| ⚠️ Trusted | Privacy is questionable because we need to trust this party that they are not collecting and/or analyzing the data to learn more about the users involved in the transaction. |
| 🛡️ Opaque | Highest degree of privacy, no matter how much analysis is done with data possibly at hand, nothing can be deduced.                                                            |

### Examples

Through a couple of examples, we will show qualitative and quantitative scoring of different archetypal transactions.

#### Example 1: A typical P2P transaction

In the case of a typical P2P blockchain transaction:

| Quality | Score |
| --- | --- |
| Sender privacy | 👀 Transparent |
| Recipient privacy | 👀 Transparent |
| Amount privacy | 👀 Transparent |
| Currency privacy | 👀 Transparent |
| Sender's PII privacy | ⚠️ *Trusted\** |
| Recipient's PII privacy | ⚠️ *Trusted\** |

- Everybody can see the sender, amount, and currency by looking at the transaction on the block explorer.
- Everybody can see the recipient, amount, and currency by looking at the transaction on the block explorer.
- *\*The sender and the recipient need to trust the wallet, and the RPC they are using that they have not collected and analyzed their indirect PII*

It's a bleak picture, but that is the privacy you can expect from a regular blockchain transaction.

#### Example 2: A deposit to an centralized exchange

Let's take for example a centralized exchange to which you are depositing funds through a mainstream non-custodial wallet:

| Quality | Score |
| --- | --- |
| Sender privacy | 👀 Transparent |
| Recipient privacy | ⚠️ *Trusted\** |
| Amount privacy | 👀 Transparent |
| Currency privacy | 👀 Transparent |
| Sender's PII privacy | ⚠️ *Trusted\*\** |
| Recipient's PII privacy | ⚠️ *Trusted\** |

- Everybody can see the sender, amount and currency looking at the transaction on the block explorer.
- *\*The recipient has to trust the exchange, whom you have completed KYC with before, that they will not use their information for purposes they do not agree with*
- *\*\*The sender has to trust the wallet, and the RPC they are using that they have not collected and analyzed indirect PII*

## Privacy in Curvy

| Quality / Scenario | Shielding funds in Curvy | Unshielding funds from Curvy | Sending a private transaction with Curvy |
| --- | --- | --- | --- |
| Sender privacy | 👀 Transparent | 🛡️ Opaque | 🛡️ Opaque |
| Recipient privacy | 🛡️ Opaque\* | 👀 Transparent | 🛡️ Opaque |
| Amount privacy | 🛡️ Opaque | 👀 Transparent | 🛡️ Opaque |
| Currency privacy | 👀 Transparent | 👀 Transparent | 🛡️ Opaque |
| Sender's PII privacy | ⚠️ *Trusted\*\** | 🛡️ Opaque | 🛡️ Opaque |
| Recipient's PII privacy | 🛡️ Opaque | 🛡️ Opaque | 🛡️ Opaque |

### Shielding funds in Curvy

When shielding funds into Curvy, **everyone can see the amount, currency, and sender**, but **no one can see the recipient of the funds**.

- *\*If the sender has used Curvy public page (e.g. <https://travica.curvy.name>) or the SDK for resolving the recipient it's completely opaque. If they used Curvy's offchain resolver, they have to Trust Curvy not to retain the original URL they queried. **We are actively working on a completely on-chain ENS resolver that will achieve complete privacy even when not using Curvy SDK.***
- *\*\*The sender has to trust the wallet, and the RPC they are using that they have not collected and analyzed indirect PII*

### Unshielding funds from Curvy

When unshielding funds from Curvy to a regular EOA address, **the recipient, the currency, and the amount are publicly known**, but **everything about the sender remains completely private**.

### Sending a private transaction with Curvy

When splitting, aggregating, or simply performing a private transfer of funds between two users inside the Curvy Privacy Aggregators, **all qualities of the transaction remain completely private**.

## Time locality

Time locality is an issue that introduces simple analysis methods that can be utilized by anyone to de-anonymize senders and recipients of private transactions, even if they have used a privacy protocol.

The most intuitive way to explain the problem of time locality is through the following example.

Let's say you have a lot of money in your regular crypto wallet, and a once-in-a-lifetime deal from a real estate broker that you really want to finalize.

To maintain privacy, you would use a privacy tool to deposit, obfuscate, and withdraw the funds, **and all of this would need to be done in a short timeframe**.

The short timeframe here allows anyone with block explorer access to track funds entering and exiting the privacy protocol, and to make connections with a high degree of confidence.

>[!IMPORTANT]
> Have you used or seen a privacy protocol that suggests that its users **"Don't withdraw the same amount they previously made private in a short period of time"**?
>
> This is exactly because of time locality, and the way the majority of people transact and use privacy protocols makes them vulnerable to this.

#### Solving time locality with Curvy Portals

Now imagine you have received many paychecks using Curvy, your employer resolving a new Portal address for your Curvy ID each time.

After a while, you want to make a single payment to a real estate broker to buy an apartment.

Luckily, you remain private in this scenario as your funds were shielded immediately upon receipt, even without your interaction. Thus, nobody can analyze the transaction times and deduce anything.
