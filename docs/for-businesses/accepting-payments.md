---
title: Accepting Curvy payments
description: How shops and APIs take private Curvy payments with the Payments SDK.
---

# Accepting Curvy payments

With Curvy, a shop ends up with a **private shielded balance**, and it never has to put spending keys on the webshop.

| Product | Who pays | How they pay |
| --- | --- | --- |
| **Checkout** | A person with a wallet (or an exchange withdrawal) | You redirect them to Curvy’s hosted payment page |
| **x402** | An AI agent calling your API | Standard HTTP 402, one payment per request: an EIP-3009 authorization settled by any x402 facilitator (`exact`), or a plain token transfer from the agent's own wallet (`curvy-transfer`). Curvy's portal broadcaster shields it |

In both cases the payment evidence is the same: a note that pays the destination **you** created. It must carry the token and amount you asked for, and it appears in the Curvy aggregator’s `PendingNotes`. Your backend checks this itself with `verifyPayment`, against the request it stored.

::: warning Status
Checkout is not yet generally available: the SDK with the API in these docs is a release candidate (`@0xcurvy/payments-sdk@0.2.0-rc.2`, npm tag `next`). Curvy's hosted payment page is the Curvy web app's `/checkout` route, `https://app.curvy.box/checkout`, and the SDK sends buyers there by default. For production onboarding, contact us.
:::

## Payments SDK

In the first release, payments go to the Curvy account you are signed in with. It is already registered and has a handle. Shop income lands next to your personal funds in that account, and anyone who holds its viewing key can see both. Separate business accounts come in a later release. Checkout does not look the handle up: your backend is configured with the account's public keys.

Those keys come as one value, your public key for payments. In the Curvy web app, open **Payments** and follow the setup: step 3 (**Connect your backend**) shows a `.env` block for your developer, and its `CURVY_PAYMENTS_PUBLIC_KEY` line holds this value. It is a single line starting with `01`, the format version. It packs the account's three public receiving keys, and nothing else: no secret. It is public, because packing is not encryption: anyone who sees it can pay you, but cannot spend or see your funds. It ends in a checksum, so a mistyped or cut-off copy is refused instead of sending payments to the wrong keys. Give the `.env` block to whoever runs your shop backend. The same value also works for x402. The block also names the environment: `mainnet` takes real money on Arbitrum One, and `testnet` takes test money on Ethereum Sepolia.

Use [`@0xcurvy/payments-sdk`](/sdk/payments/) on your backend to:

- create and sign checkout requests, and store each attempt in your database as one payment record;
- publish your signer list so Curvy’s checkout page can verify requests (over `https:`, from a publicly reachable host);
- confirm payments with `verifyPayment`, which returns `paid`, `confirming`, `underpaid`, `wrong_token` or `not_found`.

You do **not** need the wallet SDK (`@0xcurvy/curvy-sdk`) to accept payments.

Your Curvy spending and viewing keys never go on the shop. Keep them in your Curvy wallet, offline from the shop. A KMS or HSM can hold only the checkout signing key, not Curvy spending or viewing keys (see [Signing with a KMS or HSM](/sdk/payments/human-checkout#signing-with-a-kms-or-hsm)).

## Fees and minimums

The buyer pays the `amount` you set. Curvy’s fees come out of that amount: a percentage deposit fee plus a fixed per-token gas fee for the note and the portal. Your note holds the rest, the net amount. Set prices with this in mind.

By default, buyers can pay in USDC or USDT. On mainnet they can also pay from another network, such as Base or BNB Chain, and Curvy bridges the same token to Arbitrum One. Like a card fee, the bridge cost comes out of what you receive, never out of the buyer's price, and checkout offers a network only when that cost is under 3%. See [Tokens and other networks](/sdk/payments/human-checkout#payments-from-other-networks).

| Price per payment | Use |
| --- | --- |
| USD 0.50 or more, paid by a person | Checkout. Smaller checkout payments are refused after the buyer has paid, so the buyer has to reclaim them |
| Per API call, paid by an agent | x402 (`exact` or `curvy-transfer`). The same broadcaster minimum applies, and a refused x402 payment cannot be reclaimed, so price at or above it |

Details: [Fees and minimum amounts](/sdk/payments/fees) and [Fees and net amount](/sdk/payments/confirming-payments#fees-and-net-amount).

## Start here

1. [Install the Payments SDK](/sdk/payments/getting-started)
2. [Integrate human checkout](/sdk/payments/human-checkout)
3. [Accept agent payments over x402](/sdk/payments/x402)
4. [Confirm payments on-chain](/sdk/payments/confirming-payments)

## What Curvy operates

- The hosted checkout (payment) page for humans, served by the Curvy web app at `/checkout`
- The portal broadcaster: the operator that screens, deploys and shields every payment portal, for human checkout and x402 alike. If a checkout payment cannot complete, Curvy’s checkout gets the money back to the buyer.
- The x402 facilitator: settles agents' `exact` payments and pays their gas; the Payments SDK uses it by default (any other x402 v2 facilitator can replace it, and `curvy-transfer` payments need none)

Your shop keeps order state, sessions and fulfilment, and a few routes (your signer list, your completion page) that stay up while payments are in progress. Curvy does not decide when you mark an order finished. You decide, based on what `verifyPayment` reports.

## Talk to us

For partnership and production onboarding: **<hey@curvy.box>**
