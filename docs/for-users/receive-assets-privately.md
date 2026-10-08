# Receive assets privately

One of the most unique things about Curvy is how easy it is to share payment instructions with senders.

People sending you assets never need to know what Curvy is, how it works, or to open the Curvy App.
They just need to copy and paste your public URL or ENS address (which is also ideally very easy to remember).

> [!TIP]
> You can receive assets on any network listed in the [supported networks](/for-users/#supported-networks-and-tokens). Curvy will automatically bridge your funds using LiFi and shield them on Arbitrum.

Below are three ways you can share payment instructions with senders so that you can receive assets automatically shielded in Curvy.

Everything you need to share is on the **Receive** page of the Curvy App: your Curvy name, the link to your receiving page, and a QR code of it.

## By sharing your ENS

The easiest way for someone to send you assets is by using your Curvy ID in an ENS-compatible wallet such as Rabby or MetaMask.

The sender can simply enter your Curvy ID, for example `your-curvy-id.curvy.name`, as the recipient for a new transaction.
Their wallet resolves it to a fresh private address, so nothing about you appears on-chain.

## By sharing your public URL

If the sender's wallet doesn't support ENS, they can always open your public URL

```
https://your-curvy-id.curvy.name
```

choose EVM or Solana, then **Get payment address**, and copy the generated address to the wallet of their choice.
The same address works on any [supported network](/for-users/#supported-networks-and-tokens) of that kind.
The address is single-use: only the first transfer to it is forwarded automatically.

## By generating a private address

If you are, for example, withdrawing funds from an exchange, you will not be able to enter the ENS as the withdrawal address or send a URL through a message, as it's an automated process.

In this case, open the **Receive** page in the Curvy App, choose **Create one-time address** (EVM or Solana, depending on where the exchange will send from),
and copy the newly generated private address to the withdrawal form.
