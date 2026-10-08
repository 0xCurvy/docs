# Make Your Existing Assets Private

To use Curvy for private payments, you first need to get some assets into your Curvy App.

This process is commonly referred to as "shielding", as Curvy shields your funds from prying eyes.

## From the Curvy app

The easiest way to shield funds is to deposit them from a wallet you already own:

1. Open **Receive** in the Curvy App and find the **Add from your wallet** section.
2. Choose **Connect wallet** and pick an Ethereum / EVM wallet or a Solana wallet.
3. Curvy lists the balances in that wallet that it can deposit. Pick one and enter the amount.
4. Choose **Review deposit**, check the details, and confirm in your wallet.

You can follow the deposit as it settles. The funds show up in your private balance once they are confirmed.

## From an ENS compatible wallet

If you are using a wallet that supports Ethereum Name Service, such as MetaMask or Rabby,
you can just enter your Curvy ID (for example `your-curvy-id.curvy.name`) as the recipient for a new transaction.
The wallet resolves it to a fresh private address for you.

## Receiving from other wallets

To receive funds from other wallets, you can simply instruct the sender to open your receiving page:

```
https://your-curvy-id.curvy.name
```

The page lets them choose EVM or Solana and then **Get payment address**, which creates a one-time private receiving address to which they can send the funds on any [supported network](/for-users/#supported-networks-and-tokens) of that kind.
Each address should be used once: only the first transfer to it is forwarded automatically.

You can copy or show a QR code of this link from the **Receive** page of the Curvy App.
