# Installation

```bash
pnpm install @0xcurvy/curvy-sdk
```

Create a config before calling actions:

```ts
import { createCurvyConfig, destroyConfig } from "@0xcurvy/curvy-sdk";

const config = await createCurvyConfig({
  environment: "mainnet",
  apiBaseUrl: "https://api.curvy.box",
});

// Pass `config` explicitly in server or multi-config contexts.
await destroyConfig({ config });
```

For browser apps, prefer the convenience helper:

```ts
import { createBrowserCurvyConfig } from "@0xcurvy/curvy-sdk/config/browser";

const config = await createBrowserCurvyConfig({ apiBaseUrl });
```
