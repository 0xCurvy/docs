# Frequently asked questions

::: details Is Curvy a stealth address protocol?
No. Curvy builds on stealth address approach and expands them by combining stealth addresses with ZK-SNARKs and programmable execution flows to enable end-to-end private and compliant transactions.
:::

::: details Does Curvy have custody of my assets?
No. Curvy is non-custodial. You retain full control over your assets at all times. The protocol never takes custody of user funds.
:::

::: details How does Curvy make money?
Curvy generates revenue through protocol-level fees.

The following actions incur protocol fees:
- Shielding into the Privacy Aggregator: 0.1% of the shielded amount
- Aggregation inside the Privacy Aggregator: 0.1% of the aggregated amount
- Unshielding from the Privacy Aggregator: 0.2% of the unshielded amount

:::

::: details How does Curvy protect my privacy?
Curvy combines stealth addresses with ZK-SNARKs to provide strong transactional privacy.

Within the Privacy Aggregator:
- Sender identity is hidden
- Recipient identity is hidden
- Transaction amount is hidden
- Asset type is hidden

The protocol architecture ensures that no party can reconstruct your balance or transaction history without your explicit consent. Users may optionally share a private viewing key to grant read-only visibility to selected third parties, such as auditors or compliance entities.
:::

::: details Is Curvy a wallet?
No, Curvy is a privacy payments protocol.

The ecosystem includes:
- Curvy App – a privacy-focused non-custodial web application
- Curvy SDK – an open-source developer toolkit
- Curvy Smart Contracts – the on-chain infrastructure powering the protocol

:::

::: details What is shielding and unshielding?
Shielding means sending funds into the ZK aggregator to make them private.
Unshielding means moving funds out of the ZK aggregator back to a public blockchain address.
Think of it as entering and exiting a privacy zone.

:::

::: details Can Curvy trace my transactions?
No. By design, Curvy cannot trace or reconstruct private transaction history.

The system architecture prevents any single party from deanonymizing users. However, users may voluntarily share a private viewing key to grant selective, read-only transparency when required.
:::

::: details Where is Curvy incorporated?
Curvy is incorporated in Serbia under the legal entity “Curvy Tech d.o.o. Beograd”.

The company is currently in the process of establishing a holding entity within the European Union.
:::

::: details Does Curvy work with Kohaku?
Kohaku and Curvy address related privacy and compliance challenges in blockchain infrastructure.

We are actively researching ways to integrate Curvy as one of the privacy providers within the Kohaku toolchain.
:::

::: details Is Curvy compliant? 
Yes. Compliance is a core design principle of Curvy.

The protocol incorporates a compliance architecture in which designated Portal Broadcasters perform risk and compliance checks before funds are shielded into the Privacy Aggregator. This enables proactive blocking of sanctioned or malicious actors.

Additionally, Curvy is developing a structured framework for retroactive compliance mechanisms, including taint-based models where legally required.
:::

::: details Is Curvy audited?
Curvy’s smart contracts are currently undergoing an independent security audit.

The audit report is expected to be published in Q2 2026.
:::

::: details How does Curvy differ from Railgun?
Unlike solutions such as Railgun, which primarily operate as ZK privacy pools, Curvy combines:
- Stealth addresses for the best UX when privately receiving funds
- ZK-based aggregation for private execution
- Human-readable usernames
- Programmable transaction routing & flow automation
- Integrated compliance hooks

:::

::: details On which networks is Curvy available?
Curvy is currently available on:
- Arbitrum
- Base
- Ethereum
- Optimism
- Polygon
- Binance Smart Chain
- Linea
- Gnosis

The stealth address flow (without the ZK aggregator component) is currently available on Starknet.
:::
