# Register Your Curvy ID

To set up your Curvy Wallet, the first step is to create your account. Every account gets a Curvy ID.

A Curvy ID is like a personal email address or an internet domain that other people can use to privately send funds to you.

::: warning

Curvy App is a self-custody wallet. That means you control your account. If you lose access, nobody, not even Curvy, can recover it.
So please read the following steps carefully and follow them to stay safe.

Curvy never stores your password or private keys.

:::

## Step 1: Create your account

Open [app.curvy.box](https://app.curvy.box) and choose **Create account**. If you already have an account, choose **Log in** instead.

You are then asked how you want to sign in. There are two options:

- **Use a passkey**: your face, fingerprint, or device PIN unlocks the account.
- **Use a wallet**: an existing Ethereum wallet plus a password you create.

Curvy picks an available Curvy ID for you and shows it once the account is ready.
You can change it at any time under **Settings → Profile**; your old name is released when you do.

A good Curvy ID is:

- Easy to pronounce and spell
- Unambiguous
- Your alias

You are free to even set your full name as the Curvy ID, as it will only be used when
addressing payments to you. The underlying privacy protocol ensures that only the sender knows to whom the funds are addressed.

## Step 2a: Register using a Passkey

Choose **Use a passkey** and approve the prompt from your browser or password manager ([more on passkeys](https://www.eff.org/deeplinks/2023/10/what-passkey)).

Curvy derives your keys from the passkey, so the passkey provider has to support the WebAuthn PRF extension.
Major platform passkeys (Google, Apple) and password managers such as 1Password do. If yours does not, the app tells you so during sign-up and you can use a wallet instead.

If your passkey is synced to your platform's cloud, you will also be able to log in on desktops using your mobile device.

> [!TIP]
> Passkeys are a good and secure way to access the Curvy App on both desktop and mobile devices without needing a cryptocurrency wallet.

## Step 2b: Register using an existing wallet

> [!NOTE]
>
> - If you are on **desktop**, ensure you have a compatible wallet browser extension or a WalletConnect supported wallet.
> - If you are on **mobile**, ensure you are opening Curvy through a wallet browser, or using a WalletConnect supported wallet.

To get started:

- Choose **Use a wallet** and pick the wallet you'd like to connect (an Ethereum / EVM wallet such as MetaMask or Rabby, or any wallet through WalletConnect).
  The wallet you connect becomes the key to your Curvy account. Combined with the password you set in the next step, it provides the most secure way to access and manage your Curvy web app.

- Next, create a password (at least 8 characters). Curvy combines your wallet signature with this password to generate your private keys, ensuring your account is secure and fully self-custodial.

> [!TIP]
> Ensure you keep your password safe and back up your Curvy keys right after creating your account. If you lose access to your wallet or forget your password, your backup keys will be the only way to recover your funds.

- Curvy will then ask your wallet to sign a message. This isn't a blockchain transaction; it's a local action that enables your wallet to generate the keys needed to manage your Curvy account and funds. This happens entirely in your browser. Your private keys remain on your device and are never uploaded, shared, or stored anywhere else.

> [!NOTE]
> To learn more about how the authentication process in Curvy works, you can refer to the [Curvy ID](/for-the-curious/building-blocks/curvy-id) in the "Curvy for the curious" section.
