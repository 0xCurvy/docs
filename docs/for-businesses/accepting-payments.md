---
title: Accepting Curvy payments
description: How shops and APIs take private Curvy payments with the Payments SDK.
---

# Accepting Curvy payments

Curvy lets a shop end up with a **private shielded balance** without putting spending keys on the webshop.

| Product | Who pays | How they pay |
| --- | --- | --- |
| **Checkout** | A person with a wallet (or an exchange withdrawal) | You redirect them to Curvy’s hosted payment page |
| **x402** | An AI agent calling your API | Standard HTTP 402, one payment per request: an EIP-3009 authorization settled by any x402 facilitator (`exact`), or a plain token transfer from the agent's own wallet (`curvy-transfer`). Curvy's portal broadcaster shields it |

In both cases payment evidence is the same: a note identity **you** created appears in aggregator `PendingNotes`.

## Fees and minimums

Protocol fees are deducted from each payment before it reaches your shielded balance. You receive the net amount, and the customer pays the listed price.

| Price per payment | Use |
| --- | --- |
| USD 0.50 or more, paid by a person | Checkout. Smaller checkout payments are refused after the buyer has paid, so the buyer has to reclaim them |
| Per API call, paid by an agent | x402 (`exact` or `curvy-transfer`). The same broadcaster minimum applies, and a refused x402 payment cannot be reclaimed, so price at or above it |

Details: [Fees and minimum amounts](/sdk/payments/fees).

## Payments SDK

Use [`@0xcurvy/payments-sdk`](/sdk/payments/) on your backend:

- Create and sign checkout intents
- Publish signer lists for Curvy’s page to verify
- Confirm shields with `verifyPayment`

You do **not** need the wallet SDK (`@0xcurvy/curvy-sdk`) to accept payments.

## Start here

1. [Install the Payments SDK](/sdk/payments/getting-started)
2. [Integrate human checkout](/sdk/payments/human-checkout)
3. [Accept agent payments over x402](/sdk/payments/x402)
4. [Confirm payments on-chain](/sdk/payments/confirming-payments)

## What Curvy operates

- Hosted checkout (payment) page for humans
- Portal broadcaster: screens, deploys and shields every payment portal, for human checkout and x402 alike

Curvy does not run an x402 facilitator. `exact` payments settle through any x402 v2 facilitator you choose; `curvy-transfer` payments need none.

Your shop keeps order state, session cookies, and fulfilment. Curvy does not decide when you mark an order finished.

## Talk to us

For partnership and production onboarding: **<hey@curvy.box>**
