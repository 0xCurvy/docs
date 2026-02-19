# Send assets privately

There are three ways to send assets from your Curvy wallet, depending on whether the recipient:

- already has a registered Curvy ID → [Send to another Curvy user](#send-to-another-curvy-user)
- wants to receive funds to a regular Ethereum account (EOA address) → [Send to external wallet](#send-to-external-wallet)
- doesn't have a crypto wallet or address but wants to onboard to Curvy → [Send as a link](#send-as-a-link)

## Send to Curvy ID

When the receiving user already has a registered Curvy ID, you can select the first option *Send to Curvy ID*.

In the screenshot below, you can see an example of sending to *mihailo.curvy.name*:

![Send to Curvy ID](send-to-curvy-id.png)

## Send to external wallet

When the receiving side only has a blockchain address they can share with you, you'll need to select 
both the network where they will receive the funds and the exact address.

In the example below, we are sending the funds to `0xd8d...` on the Polygon network.

![Send to external wallet](send-to-external-wallet.png)

## Send as a link

The third option in the send dialog, **Send as a link*, gives you an option to generate a single-use link that
anyone can use to register or log in to a Curvy account and claim the funds you've sent them.

This is useful in situations where:

- You have a secure messaging channel with the recipient, but don't know their address or Curvy name
- The user doesn't have Curvy nor do they have any other crypto wallet
- You want to give someone a crypto "giftcard"

> [!WARNING]
> A couple of important things about **Send as a link** feature:
> <br>
> 1. Curvy links don't expire! The only way for you to get back the funds that were unclaimed is to claim the funds using the link yourself.
> <br>
> 2. Make sure that you always back up the link before sending!
> <br>
> 2. Keep the links safe, as anyone who gets access to them will get access to the funds they are sending!
> <br>

Upon entering the amount and currency, you will be presented with a warning like the one above:

![Send as a link warning](send-as-a-link-warning.png)

After confirming the action, you will need for the private transfer process to finish:

![Send as a link ](send-as-a-link.png)

After that, your recipient can simply open up a link that looks similar to the one below:

```
https://app.curvy.box#737461&5&91227993...883431253847704268123135462&5000000000000000&1
```

and any Curvy ID they log in to or register, will automatically claim these funds upon opening the app, making the link no longer usable.
