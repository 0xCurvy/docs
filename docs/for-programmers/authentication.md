## Authentication

Authentication with the Curvy Protocol relies on cryptographic signatures. You can log in an existing user or register a new one.

### Registration

Registering a new handle on the Curvy Protocol network involves providing the desired handle alongside the signature data:

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
  "my-awesome-handle.curvy.name", // Handle to register (it need to end with .curvy.name domain)
  "evm",
  signatureData,
  password,
);
```

### Logging In

If you already have a user's signature, you can use the SDK's `login` method.

```typescript
// Logging in on the Curvy Protocol network uses the same `signatureData` process as registration

await sdk.login("evm", signatureData, password);
```
