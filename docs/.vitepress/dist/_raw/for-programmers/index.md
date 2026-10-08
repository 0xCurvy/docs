# Developer guides

Use Curvy’s TypeScript packages to add private balances **or** accept private payments.

## Wallet SDK (end-user privacy)

1. [Install and configure the SDK](./installing-the-sdk.md).
2. [Authenticate an account](./authentication.md).
3. [Read shielded balances](./querying-balances.md).
4. [Estimate and execute an intent](./interacting-with-assets.md).

## Payments SDK (merchants)

1. [Install the Payments SDK](/sdk/payments/getting-started).
2. [Integrate human checkout](/sdk/payments/human-checkout).
3. [Confirm payments on-chain](/sdk/payments/confirming-payments).

## Guides and reference

The guides explain complete integration flows. The [wallet SDK reference](/sdk/) is organized around individual actions. The [Payments SDK](/sdk/payments/) documents merchant checkout and evidence helpers.

| Guide | What it covers |
| --- | --- |
| [Installation](./installing-the-sdk.md) | Wallet config creation, storage, service URLs, and lifecycle |
| [Authentication](./authentication.md) | Passkey and private-key login and registration |
| [Querying balances](./querying-balances.md) | Cached reads, note synchronization, and refresh state |
| [Interacting with assets](./interacting-with-assets.md) | Transfers, swaps, send-to-anyone, estimation, and execution |
| [Portals and recovery](./portals-and-recovery.md) | Entry and exit portals and recovery paths |
| [Listening to events](./listening-to-events.md) | Subscribing to SDK lifecycle events |
| [Payments SDK](/sdk/payments/) | Merchant checkout intents and payment confirmation |
