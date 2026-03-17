# Authentication

Authentication with the Curvy Protocol relies on cryptographic signatures. You can log in an existing user or register a new one.

## Registration

Registering a new Curvy ID providing the desired name alongside the signature data:

```typescript
import { getAuthenticationSignatureParams } from "@0xcurvy/curvy-sdk";
import { useSignTypedData, useAccount } from "wagmi";

const { address } = useAccount();

const password = "optional-password";
const signatureParams = await getAuthenticationSignatureParams(
  "evm",
  address,
  password,
);

const { signTypedDataAsync } = useSignTypedData();
const signatureResult = await signTypedDataAsync(signatureParams);

const signatureData = {
  signatureResult,
  signatureParams,
  signingAddress: address,
};

await sdk.register(
  "my-awesome-id.curvy.name", // Curvy ID to register (it needs to end with .curvy.name domain)
  "evm",
  signatureData,
  password,
);
```

## Logging In

If you already have a user's signature, you can use the SDK's `login` method.

```typescript
// Logging in on the Curvy Protocol network uses the same `signatureData` process as registration

await sdk.login("evm", signatureData, password);
```
