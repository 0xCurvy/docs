# Send assets privately

Open **Send** in the Curvy App. At the top of the form you pick the recipient type, depending on whether the recipient:

- already has a registered Curvy ID: [Curvy ID](#send-to-curvy-id)
- wants to receive funds to a regular blockchain account (EOA address): [External wallet](#send-to-external-wallet)
- doesn't have a crypto wallet or address but wants to onboard to Curvy: [Gift link](#send-a-gift-link)

In all three cases you choose the asset and amount, then **Review transfer** shows the full details, including fees, before you confirm.
After confirming you can follow the transfer as it is prepared, submitted, and settled, and find it again later under **Activity**.

## Send to Curvy ID

When the recipient already has a registered Curvy ID, select **Curvy ID** and type their name, for example `mihailo.curvy.name`.
They don't have to be a saved contact, although you can save them as one for next time.

This is a fully private transfer: nothing about the sender, the recipient, or the amount is visible on-chain.

## Send to external wallet

When the recipient only has a blockchain address they can share with you, select **External wallet**. You'll need to select
both the network where they will receive the funds and the exact address, for example `0xd8d...` on Polygon or a Solana address.

> [!WARNING]
> This is a withdrawal from your private balance. The amount, destination address, and timing are visible on the destination network.

## Send a gift link

The third option, **Gift link**, allows you to generate a single-use link that
anyone can use to register or log in to a Curvy account and claim the funds you've sent them.

This is useful in situations where:

- You have a secure messaging channel with the recipient but don't know their address or Curvy name
- The user doesn't have Curvy or any other crypto wallet
- You want to give someone a crypto "giftcard"

> [!WARNING]
> A couple of important things about the **Gift link** feature:
> <br>
>
> 1. Curvy links don't expire! The only way for you to get back the funds that were unclaimed is to claim the funds using the link yourself.
> <br>
> 2. Make sure that you always back up the link before sending!
> <br>
> 3. Keep the links safe, as anyone who gains access to them will also gain access to the funds they are sending!
> <br>

After you enter the amount and asset, **Review gift** repeats these warnings and shows the fees. Once you confirm, wait for the private transfer to finish.

The transfer view then shows the gift link, with a copy button and a QR code. Save it somewhere safe before you share it:
you can reopen it from the transfer view during this session, but not from another device.

Your recipient opens a link of the form

```
https://app.curvy.box/claim/<gift-id>
```

logs in to, or registers, any Curvy ID, reviews the gift and chooses **Claim gift**.
A small claim fee is deducted from the gift amount, and the link stops working once claimed.
