## Authentication

Authentication with the Curvy Protocol relies on cryptographic signatures. You can log in an existing user or register a new one.

### Registration

Registering a new handle on the Curvy Protocol network involves providing the desired handle alongside the signature data:

```typescript
const signatureData = {
  signatureResult: "0x...",
  signatureParams: {
    /* EIP-712 domain, message types, etc. */
  },
  signingAddress: "0x...",
};

await sdk.register(
  "my-awesome-handle.curvy.name", // Handle to register (it need to end with .curvy.name domain)
  "evm",
  signatureData,
  "optional-password",
);
```

### Logging In

If you already have a user's signature, you can use the SDK's `login` method.

```typescript
// Example: Adding an existing wallet using a signature (e.g. from an EVM wallet)
const signatureData = {
  signatureResult: "0x...",
  signatureParams: {
    /* EIP-712 domain, message types, etc. */
  },
  signingAddress: "0x...",
};

await sdk.login("evm", signatureData, "optional-password");
```
