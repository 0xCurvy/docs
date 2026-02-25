# Compliance model

The Curvy's compliance model is two-sided, offering both pre-emptive compliance checks and retroactive compliance mechanisms.

## Curvy ID with KYC

> [!IMPORTANT]
> KYC for Curvy ID registration is only supported in [custom Curvy deployments for enterprises and institutions](../for-businesses/for-enterprises-and-institutions.md)
>
> **Curvy Web App and the canonical protocol do not feature Curvy ID with KYC.**

Require KYC checks to pass prior to allowing a Curvy ID registration by the end-user.

This allows for a completely compliant set of users while respecting their privacy.

## Pre-emptive compliance checks

Pre-emptive compliance checks allow for trusted analytics vendors (Curvy is currently integrated with [Global Ledger](https://globalledger.io)) to provide a security and compliance score for a given address in order to let the Curvy operated Portal Broadcaster to deploy a Portal that will allow the assets to be shielded.

*These checks aim to Prevent known malicious addresses involved in fraudulent activities from shielding funds with Curvy.*

## Retroactive compliance checks

> [!WARNING]
> Retroactive compliance checks are a WIP and are not yet publicly available for Curvy users.

A crucial part in Curvy compliance that is missing is the ability for a trusted entity, such as a DAO or a analytics vendor, to choose to *taint*, e.g. to block access to the features of the protocol even after the malicious user has deposited and shielded their funds.

This is done through private and anonymized *Shielding Trail* that aims to preserve the chain of provenance of each Note inside the Privacy aggregator.

**Successful tainting means that the only thing the user can do with the funds is unshield to the exactly same address they shielded from, that is now tainted.**
