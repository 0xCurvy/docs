---
title: getProtocol
description: Returns protocol-wide proving and fee configuration.
---

# getProtocol

Returns the protocol-wide proving parameters and fee-collector configuration loaded during config creation.

## Import

```ts
import { getProtocol } from "@0xcurvy/curvy-sdk/config";
```

## Usage

```ts
const protocol = getProtocol({ config });
```

## Returns

`ProtocolConfig`

## Parameters

### `config` (optional)

- **Type:** `CurvyConfig`

The config to read. When omitted, the ambient config is used.

```ts
const protocol = getProtocol({
  config, // [!code focus]
});
```

## Errors

Throws when no config is available or protocol metadata has not finished loading.

## Related

- [`createCurvyConfig`](/sdk/config/createCurvyConfig)
- [`getActiveNetworks`](/sdk/config/getActiveNetworks)
