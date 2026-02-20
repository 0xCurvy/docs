# Frequently asked questions

::: details Is Curvy a stealth address protocol?
No. Curvy expands on stealth address protocols by combining them with ZK-SNARKs to enable private transactions privately addressable to Curvy IDs.
:::

::: details Does Curvy have custody of my assets?
No. Curvy is a self-custody wallet, which means you have full control over your funds.
:::

::: details How does Curvy make money?
Curvy makes money through protocol fees.

The following actions incur protocol fees:

- Shielding to Privacy aggregator: 0.1% of amount shielded
- Aggregation in Privacy aggregator: 0.1% of amount aggregated
- Unshielding from Privacy aggregator: 0.2% of amount unshielded
- 
Every aggregation in the Privacy Aggregator that Curvy does costs 0.1% of the total amount.
The provided documentation does not contain information on how Curvy makes money.
:::

::: details How does Curvy protect my privacy?
Curvy protects user privacy by combining stealth addresses with ZK-SNARKs. This ensures that the sender, recipient, amount, and currency of private transfers are completely hidden. The protocol is designed so that no party can reconstruct your transaction history or balance without your explicit approval, which can be given by sharing a viewing key.
:::

::: details Is Curvy a wallet?
Curvy is a software ecosystem for private payments. This ecosystem includes the **Curvy App**, which is a privacy-focused wallet. The ecosystem also includes the open-source **Curvy SDK** for developers and the **Curvy Smart Contracts** that power the protocol.
:::

::: details What is shielding and unshielding?
"Shielding" is the process of moving funds into Curvy's privacy-preserving system (the Privacy Aggregator). "Unshielding" is the process of moving funds from the system to a regular blockchain address.
:::

::: details Can Curvy trace my transactions?
No. By default, Curvy cannot trace your transactions. The protocol is designed to ensure no party can reconstruct your transaction history without your consent. You have the option to share a "viewing private key" with a third party if you wish to grant them read-only access to your transaction trail.
:::

::: details Where is Curvy incorporated?
Curvy is incorporated in Serbia as Curvy Tech d.o.o. Beograd 
:::

::: details Does Curvy work with Kohaku?
Both Kohaku and Curvy are working on solving a similar set of problems. We are researching ways of incorporating Curvy as one of privacy providers in the Kohaku toolchain.
:::

::: details Is Curvy compliant? 
Yes, compliance is a core principle of Curvy. The protocol includes a compliance model where designated "Portal Broadcasters" conduct compliance checks before shielding funds into the privacy system. This allows for blocking malicious actors proactively.
We also have a plan laid in  place on how to allow for retroactive ("tainting") compliance methods.
:::

::: details Is Curvy audited?
Curvy's smart contracts are currently in the audit process and we expect the auditt report to be published in Q2 2026.
:::

::: details How does Curvy differ from Railgun?
Unlike systems like Railgun which primarily function as a ZK mixer/pool, Curvy's Privacy Aggregator combines ZK technology with stealth addresses. This allows users to directly address notes to different recipients.
:::

::: details On which networks is Curvy available?
Curvy is available on Arbitrum, Base, Ethereum, Optimism, Polygon, Binance Smart Chain, Linea, and Gnosis.
:::
