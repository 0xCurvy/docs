---
title: Accepting Curvy payments
description: How shops and APIs take private Curvy payments with the Payments SDK.
---

# Accepting Curvy payments

Curvy lets a shop end up with a **private shielded balance** without putting spending keys on the webshop.

| Product | Who pays | How they pay |
| --- | --- | --- |
| **Checkout** | A person with a wallet (or an exchange withdrawal) | You redirect them to Curvy’s hosted payment page |
| **x402** | An AI agent calling your API | Standard HTTP 402 + EIP-3009 (exact); Curvy facilitator settles |

In both cases payment evidence is the same: a note identity **you** created appears in aggregator `PendingNotes`.

## Payments SDK

Use [`@0xcurvy/payments-sdk`](/sdk/payments/) on your backend:

- Create and sign checkout intents
- Publish signer lists for Curvy’s page to verify
- Confirm shields with `verifyPayment`

You do **not** need the wallet SDK (`@0xcurvy/curvy-sdk`) to accept payments.

## Start here

1. [Install the Payments SDK](/sdk/payments/getting-started)
2. [Integrate human checkout](/sdk/payments/human-checkout)
3. [Confirm payments on-chain](/sdk/payments/confirming-payments)

## What Curvy operates

- Hosted checkout (payment) page for humans
- Portal broadcaster / operator shield for the human rail
- x402 facilitator for agent `exact` settle and exact shield submission

Your shop keeps order state, session cookies, and fulfilment. Curvy does not decide when you mark an order finished.

## Talk to us

For partnership and production onboarding: **<hey@curvy.box>**
