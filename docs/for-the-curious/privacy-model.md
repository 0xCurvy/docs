# Privacy

Privacy is one of the core principles of the Curvy protocol.

We take privacy seriously, our users do to.

On this page we will explain how:

- We define different levels of Privacy
- [Sending](#sending-privacy) and [Receiving](#receiving-privacy) privacy differs and how we accomplish them
- How we tackle the problem of [Time locality](#time-locality-issue) with [Portals](./portals)

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

| Legend | Description                                                                                                                                                                   |
| - |-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------|
| None | Lowest degree of privacy, no analysis needs to be done with data at hand it's just read.                                                                                      |
| Trusted | Privacy is questionable because we need to trust this party that they are not collecting and/or analyzing the data to learn more about the users involved in the transaction. |
| Complete | Highest degree of privacy, no matter how much analysis is done with data possibly at hand, nothing can be deduced.                                                            |

### Example of a typical transaction

Let's take for example a centralized exchange you are depositing funds to through a mainstream non-custodial wallet:

- Everybody can see the sender, amount and currency looking at the transaction on the block explorer.
- Everybody can also deduce (but not see clearly without analysis) that the recipient is most probably this specific exchange, since funds later moved to exchange's well-known "colder wallets"
- The exchange, since they have done KYC with you before, and since they need to be sure that it is you who they should credit these funds to, know exactly who you are.
- You have to trust the wallet, and the RPC you are using that they have not collected PII from you

This short analysis gives us the following table:

| Party | Sender privacy | Recipient privacy | Amount privacy  | Currency privacy  | PII privacy |
| - |----------------| - | - | - | - |
| Public | None           | Obfuscated | None | None | Complete |
| Wallet | Trusted        | Obfuscated | None | None | Trusted |
| RPC provider | Trusted        | Obfuscated | None | None | Trusted |
| Exchange | None           | None | None | None | None |

It's a bleak picture but that is the privacy you can expect from a regular blockchain transaction.

## Privacy in Curvy

### Shielding

When shielding funds into Curvy, **everyone can see the amount, currency and sender** but **no one can see the recipient of the funds**.

### Time locality issue

The most intuitive way to explain the problem of time locality is using the following example.

Let's say you have a lot of money lying on your regular crypto wallet, and a once-in-a-lifetime deal from a real-estate broker that you really want to go through with.

To maintain privacy you would use a privacy tool to deposit the funds, obfuscate and withdraw, **and all of this would need to be done in a short time frame**.

The short time frame here lets anyone with blockexplorer access to see up the funds in / funds out out of the privacy protocol and make the connections with a high degree of confidence.

#### Solving time locality with Curvy Portals

Now imagine you have received many paychecks using Curvy, your employer resolving a new Portal address for your Curvy ID each time.

After a while you want to create a single payment to a real-estate broker to buy an apartment.

Luckily, you remain private in this scenario as your funds were shielded immediately and upon receiving them, even without your interaction - so nobody can analyze the transaction times and deduce a thing.

### Privacy aggregator

When splitting or aggregating or simply doing a private transfer of funds between two users inside the Privacy aggregators, **all the qualities of the transaction remain completely private**.

### Unshielding

When unshielding funds from the Privacy Aggregator to a regular EOA address, **the recipient, the currency and the amount are publicly known** but **everything about the sender remains completely private**.

### Known privacy improvements

#### RPC

As noted above, the RPC provider you are using can see your IP address (and analyze the same for geo data).

> [!IMPORTANT]
> **Although even today you choose an RPC provider of your choice when using Curvy SDK**, we are aware that most users won't do that.

Our plan is to deliver an integration with an anonymizing privacy-focused RPC network that will be the default RPC provider when using the Curvy protocol.

#### Off-chain ENS resolving & announcement registry

Currently the ENS resolutions are done off-chain, meaning that you trust Curvy's off-chain ENS resolver to do so truthfully.

> [!IMPORTANT]
> **Although even today when you resolve a Curvy name using the SDK, you are not trusting the off-chain resolver**, any resolution done using a 3rd party wallet has a trust assumption towards Curvy.

We aim to remove the need for trust here by offering completely on-chain ENS resolver with an on-chain Curvy ID registry.
