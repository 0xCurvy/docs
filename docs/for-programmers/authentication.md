# Authentication

Authentication with Curvy relies on EIP-712 signatures. Register new users with `register`, and log in existing users with `login`.

## Registration

```ts
import { getAuthenticationSignatureParams, register } from "@0xcurvy/curvy-sdk";
import { useAccount, useSignTypedData } from "wagmi";

const { address } = useAccount();
if (!address) throw new Error("Connect a wallet first");

const signatureParams = await getAuthenticationSignatureParams(address, "optional-password");

const { signTypedDataAsync } = useSignTypedData();
const signatureResult = await signTypedDataAsync(signatureParams);

const signature = {
  signatureParams,
  signatureResult,
  signingAddress: address,
};

const account = await register({
  config,
  handle: "my-awesome-id.curvy.name",
  signature,
});
```

## Logging In

```ts
import { login } from "@0xcurvy/curvy-sdk/actions/auth";

const account = await login({
  config,
  signature,
});
```
