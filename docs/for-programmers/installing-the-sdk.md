# Installation

Curvy SDK can be installed with a Node package manager:

```bash
pnpm install @0xcurvy/curvy-sdk
```

The v3 SDK is built around a **config object** and a set of **action functions** you import from focused subpaths, rather than a single class instance. Create a config before calling any action:

```ts
import { createCurvyConfig, destroyConfig } from "@0xcurvy/curvy-sdk";

const config = await createCurvyConfig({
  environment: "mainnet",
  apiBaseUrl: "https://api.curvy.box",
});

// Pass `config` explicitly in server or multi-config contexts.
await destroyConfig({ config });
```

For browser apps, prefer the convenience helper. It defaults to persistent IndexedDB storage plus session-scoped key rehydration:

```ts
import { createBrowserCurvyConfig } from "@0xcurvy/curvy-sdk/config";

const config = await createBrowserCurvyConfig({ apiBaseUrl });
```

Curvy's backend is a set of independent [microservices](/for-the-curious/building-blocks/privacy-aggregator#off-chain-services). Everything routes through `apiBaseUrl` by default, but you can point any individual service at its own host:

```ts
const config = await createCurvyConfig({
  environment: "mainnet",
  apiBaseUrl: "https://api.curvy.box",
  metadataBaseUrl: "https://<your-metadata-host>", // networks, currencies, Curvy ID, auth
  indexerBaseUrl: "https://<your-indexer-host>",   // note + nullifier sync
  relayerBaseUrl: "https://<your-relayer-host>",   // proof submission + status
});
```

> [!TIP]
> `createCurvyConfig` registers itself as the ambient/global config by default, so browser actions can resolve it without you threading `config` through every call. In multi-tenant (server) contexts, pass `setAsActive: false` and pass `config` explicitly to avoid cross-tenant bleed.
