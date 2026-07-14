# Authentication

Authentication with Curvy relies on EIP-712 signatures. Register new users with `register`, and log in existing users with `login`. Both are action functions that take the `config` you created during [installation](./installing-the-sdk).

## Registration

Build the signature data from a connected wallet, then register the desired Curvy ID:

```ts
import { getAuthenticationSignatureParams, register } from "@0xcurvy/curvy-sdk";
import { useAccount, useSignTypedData } from "wagmi";

const { address } = useAccount();
if (!address) throw new Error("Connect a wallet first");

const signatureParams = await getAuthenticationSignatureParams(address, "optional-password");

const { signTypedDataAsync } = useSignTypedData();
const signatureResult = await signTypedDataAsync(signatureParams);

const signature = {
  signingAddress: address,
  signatureParams,
  signatureResult,
};

const account = await register({
  config,
  handle: "my-awesome-id.curvy.name", // Curvy ID to register (must end with .curvy.name)
  signature,
});
```

## Logging In

If you already have a user's signature, log them in with the same `signature` shape used for registration:

```ts
import { login } from "@0xcurvy/curvy-sdk/actions/auth";

const account = await login({
  config,
  signature,
});
```

## Passkey authentication

Curvy also supports FIDO2 passkeys (WebAuthn PRF) as a deterministic key source. Once you've run the WebAuthn ceremony and obtained the PRF output, use the passkey-specific actions:

```ts
import { registerWithPasskey, loginWithPasskey } from "@0xcurvy/curvy-sdk/actions/auth";

const account = await registerWithPasskey({ config, handle, prfValue, credId });
// ...or, for an existing user:
const existing = await loginWithPasskey({ config, prfValue, credId });
```

> [!TIP]
> The passkey key-derivation flow is explained conceptually in [Curvy ID](/for-the-curious/building-blocks/curvy-id#passkey-authentication).
