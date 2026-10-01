# directShield

Shield wallet funds directly into the active (or selected) Curvy account.
ERC-20 allowance is checked and, when necessary, an exact approval is sent for
the vault before calling the aggregator. A non-zero insufficient allowance is
reset first for USDT-style tokens. The vault pulls directly from the wallet;
native deposits attach `amount` as `msg.value`.

## Import

```ts
import { directShield } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await directShield({ networkSlug, amount, token, walletClient, config });
```

## Signature

```ts
function directShield(parameters: DirectShieldParameters): Promise<DirectShieldResult>
```

## Returns

`Promise<DirectShieldResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkSlug`

- **Type:** `string`
- **Required:** yes

Network whose aggregator receives the deposit.

```ts
const result = await directShield({
  networkSlug, // [!code focus]
  amount,
  token,
  walletClient,
});
```

### `amount`

- **Type:** `bigint`
- **Required:** yes

Gross amount deposited, in token base units (fees are deducted on-chain).

```ts
const result = await directShield({
  networkSlug,
  amount, // [!code focus]
  token,
  walletClient,
});
```

### `token`

- **Type:** `bigint`
- **Required:** yes

Vault token id on the selected network.

```ts
const result = await directShield({
  networkSlug,
  amount,
  token, // [!code focus]
  walletClient,
});
```

### `walletClient`

- **Type:** `WalletClient`
- **Required:** yes

Viem wallet that owns the funds and pays gas.

```ts
const result = await directShield({
  networkSlug,
  amount,
  token,
  walletClient, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

Curvy account that receives the shielded note; defaults to the active account.

```ts
const result = await directShield({
  networkSlug,
  amount,
  token,
  walletClient,
  accountId, // [!code focus]
});
```

### `contractAddress`

- **Type:** `HexString`
- **Required:** no

Override the target aggregator; defaults to the network metadata.

```ts
const result = await directShield({
  networkSlug,
  amount,
  token,
  walletClient,
  contractAddress, // [!code focus]
});
```

### `vaultContractAddress`

- **Type:** `HexString`
- **Required:** no

Override the vault approved to pull ERC-20s; defaults to the network metadata.

```ts
const result = await directShield({
  networkSlug,
  amount,
  token,
  walletClient,
  vaultContractAddress, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await directShield({
  networkSlug,
  amount,
  token,
  walletClient,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/directShield.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/directShield.ts)
