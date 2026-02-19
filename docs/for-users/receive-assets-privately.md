# Receive assets privately

One of the most unique things about Curvy is how easy it is to share payment instructions to senders.

The people sending you assets never need to know what Curvy is, how it works, nor to open up the Curvy app. 
They just need to copy & paste your public URL or ENS address that's ideally very easy to remember.

> [!TIP]
> You can receive assets on any network listed in the [supported networks](../introduction). Curvy will automatically bridge using LiFi and shield your funds on Arbitrum.

Below are three ways you can share payment instructions to senders so that you can receive assets automatically shielded in Curvy.

## By sharing your ENS

The easiest way for someone to  send you assets is using Curvy ID in an ENS compatible wallet such as Rabby or Metamask.

The sender can just enter your Curvy ID as the recipient for a new transaction:

![Using Curvy name in Metamask](ens-metamask.png)

## By sharing your public URL

If the sender's wallet doesn't support ENS, they can always open your public URL:
```
https://your-curvy-id.curvy.name
```
and copying the generated address to the wallet of their choice.

An example with [https://travica.curvy.name](https://travica.curvy.name):

![Public page](public-page.png)


## By generating a private address

If you are, for example, withdrawing funds from an exchange - you will not be able to enter the ENS as the withdrawal address,
nor send a URL through a message as it's an automated process.

In this case you'd simply follow the steps explained in above in ["By sharing your public URL"](#by-sharing-your-public-url)
and copy the newly generated private address to the withdrawal form.
