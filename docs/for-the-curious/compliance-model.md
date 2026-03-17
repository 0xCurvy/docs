# Compliance model

Curvy's compliance model is two-sided, offering both pre-emptive compliance checks and retroactive compliance mechanisms.

## Curvy ID with KYC

> [!IMPORTANT]
> KYC for Curvy ID registration is only supported in [custom Curvy deployments for enterprises and institutions](../for-businesses/for-enterprises-and-institutions.md)
>
> **Curvy Web App and the canonical protocol do not feature Curvy ID with KYC.**

KYC checks must pass prior to allowing a Curvy ID registration by the end-user.

This ensures a completely compliant set of users while respecting their privacy.

## Pre-emptive compliance checks

Pre-emptive compliance checks allow trusted analytics vendors (Curvy is currently integrated with [Global Ledger](https://globalledger.io)) to provide a security and compliance score for a given address. This score is used by the Curvy-operated Portal Broadcaster to determine if a Portal can be deployed, allowing assets to be shielded.

*These checks aim to prevent known malicious addresses involved in fraudulent activities from shielding funds with Curvy.*

## Retroactive compliance checks

> [!WARNING]
> Retroactive compliance checks are a WIP and are not yet publicly available for Curvy users.

Retroactive compliance checks give us the ability for a trusted entity, such as a DAO or an analytics vendor, to *taint* (e.g., block access to protocol features) even after a malicious user has deposited and shielded their funds.

This is done through private and anonymized *shielding trail* that aims to preserve the chain of provenance of each Note inside the Privacy aggregator.

**Successful tainting means that the user can only unshield the funds to the exact same address from which they were shielded, which is now tainted.**
