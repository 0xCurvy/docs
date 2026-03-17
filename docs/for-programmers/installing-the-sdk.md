# Installation

Curvy SDK can be installed with a Node package manager:

```
pnpm install @0xcurvy/curvy-sdk
```

Before using the SDK, you must initialize the `CurvySDK` instance.

```typescript
import { CurvySDK } from "@0xcurvy/curvy-sdk";

// Initialize the SDK
const sdk = await CurvySDK.init();
```
