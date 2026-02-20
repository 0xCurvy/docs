## Installation

Curvy SDK can be installed with a Node package manager:

```
pnpm install @0xcurvy/curvy-sdk
```

Before using the SDK, you must initialize the `CurvySDK` instance with your desired network environment (`"mainnet"` or `"testnet"`) and the API base URL.

```typescript
import { CurvySDK } from "@0xcurvy/curvy-sdk";

// Initialize the SDK connecting to a local backend for testing
const sdk = await CurvySDK.init("testnet", "http://localhost:4000");
```
