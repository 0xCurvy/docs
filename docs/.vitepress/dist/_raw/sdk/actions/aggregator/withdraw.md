# withdraw

One-call WITHDRAW: build the proof from committed notes and send it in one shot,
via the user's wallet or the relay service. Use [`buildWithdrawRequest`](/sdk/actions/aggregator/buildWithdrawRequest) + the
`.submit()`/`.relay()` sugar when you want the proof object first.

## Import

```ts
import { withdraw } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const { receipt } = await withdraw({ notes, ownerBjjPrivateKeyHex,
  destinationAddress, tokenId: 1n, via: { kind: "wallet", walletClient } });
```

## Signature

```ts
function withdraw(parameters: WithdrawParameters): Promise<ChainSubmitResult | RelaySubmitReturnType>
```

## Returns

`Promise<ChainSubmitResult | RelaySubmitReturnType>`

The action resolves or returns the value shown in the signature.

## Parameters

### `notes`

- **Type:** `Note[]`
- **Required:** yes

One to `maxInputs` committed notes with the same token and owner.

```ts
const result = await withdraw({
  notes, // [!code focus]
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  via,
});
```

### `ownerBjjPrivateKeyHex`

- **Type:** `string`
- **Required:** yes

BabyJubjub private key (hex) that owns the notes and signs the withdrawal.

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex, // [!code focus]
  destinationAddress,
  tokenId,
  via,
});
```

### `destinationAddress`

- **Type:** `bigint`
- **Required:** yes

Destination EOA the vault pays out to (as a bigint address).

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress, // [!code focus]
  tokenId,
  via,
});
```

### `tokenId`

- **Type:** `bigint`
- **Required:** yes

The token to withdraw (must match every input note).

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId, // [!code focus]
  via,
});
```

### `notesTree`

- **Type:** `MerkleTree`
- **Required:** no

The committed notes tree (omit when `supplied` is set).

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  notesTree, // [!code focus]
  via,
});
```

### `supplied`

- **Type:** `SuppliedInclusionProofs`
- **Required:** no

Lean-client alternative: pre-built inclusion proofs at one root.

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  supplied, // [!code focus]
  via,
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network whose deployed aggregator/circuit to target; defaults to the active network.

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  networkSlug, // [!code focus]
  via,
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel artifact loading and queued proof generation.

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  signal, // [!code focus]
  via,
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  config, // [!code focus]
  via,
});
```

### `via`

- **Type:** `SubmitVia`
- **Required:** yes

Where to send the built proof: `{ kind: "wallet", walletClient }` or `{ kind: "relay" }`.

```ts
const result = await withdraw({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  via, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`aggregate`](/sdk/actions/aggregator/aggregate) — One-call AGGREGATE: build the proof from committed notes and send it in one shot, either via the user's wallet (via.kind === "wallet") or the relay service (via.kind === "relay").
- [`estimateAggregationCosts`](/sdk/actions/aggregator/estimateAggregationCosts) — Load the inputs needed to allocate an aggregation.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/withdraw.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/withdraw.ts)
