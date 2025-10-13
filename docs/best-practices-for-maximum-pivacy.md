# Best Practices for Maximum Privacy

Curvy is designed to give you strong on-chain privacy, but like with any privacy tool, how you use it matters.

Here are the best practices to help you stay fully private when using Curvy:

## Use a New Stealth Address for Every Deposit

- Each time someone sends you funds, use a fresh stealth address.  
- If you reuse a stealth address, someone could connect multiple transactions back to you which breaks your privacy.

::: info
If you share your Curvy ID (instead of copying and sending stealth addresses manually), Curvy will automatically generate a new stealth address each time it's used so you don’t have to worry about address reuse compromising your privacy.
:::

## Don’t Reuse Recipient Addresses When Sending

When sending crypto:

- Only send from one stealth address at a time.  
- Avoid sending to the same external wallet repeatedly from different stealth addresses.

Why? If an external wallet (e.g. 0xabc...) receives funds from 3 different stealth addresses, a third party might reasonably guess those stealth addresses belong to the same person. That makes it easier to deanonymise you.

## Avoid Aggregating Funds Manually

Let’s say you’ve received funds across 3 stealth addresses and want to move them to a single wallet:

- If you send all the funds to one wallet in a single transaction, you’ve created a visible link between them.  
- Instead, consider spending them separately or wait until Curvy supports [private batching](./best-practices-for-maximum-pivacy#private-batch-transactions) on desired network.

## Private batch transactions

Currently supported on:
- Ethereum Sepolia
  
On networks that are supported, users are not required to choose stealth address from which they want to send assets. Instead, Curvy intelligently finds the most appropriate combination of assets from multiple sources (stealth addresses, ERC1155 addresses or Aggregator notes) and executes the transfer without revealing the underlying links between individual actions. This makes it much harder to trace your activity on-chain, while allowing you to send both to Curvy users and external addresses.

## **Real-World Privacy Isn’t Always Simple**

We understand that in real-world usage, users want more than just private transfers. They want to manage funds efficiently, use DeFi protocols, and interact with apps across chains.

To make this seamless, we’re actively working on advanced privacy features:

- ### Private swaps and bridges  
  Swap tokens or bridge assets between chains while preserving privacy end to end.

- ### Private interactions with dApps and DeFi protocols  
  Use dApps and DeFi protocols like staking, lending, or voting without exposing your address or identity.

These features will unlock a new level of convenience, making it easy to manage your assets while keeping your identity protected, with zero compromises on privacy.
