# aggregate

One-call AGGREGATE: build the proof from committed notes and send it in one shot,
either via the user's wallet (`via.kind === "wallet"`) or the relay service
(`via.kind === "relay"`). The two-step [`buildAggregateRequest`](/sdk/actions/aggregator/buildAggregateRequest) + `.submit()`/`.relay()`
is available when you want to inspect the proof first.

## Import

```ts
import { aggregate } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const { receipt } = await aggregate({ inputNotes, ownerBjjPrivateKeyHex,
  recipients: [{ amount: 5n, curvyId: "alice.curvy.name" }],
  protocolFeePerThousand: 3n, gasFee: 0n, via: { kind: "wallet", walletClient } });
```

## Signature

```ts
function aggregate(parameters: AggregateParameters): Promise<ChainSubmitResult | RelaySubmitReturnType>
```

## Returns

`Promise<ChainSubmitResult | RelaySubmitReturnType>`

The action resolves or returns the value shown in the signature.

## Parameters

### `inputNotes`

- **Type:** `Note[]`
- **Required:** yes

One to `maxInputs` committed notes with the same token and owner.

```ts
const result = await aggregate({
  inputNotes, // [!code focus]
  ownerBjjPrivateKeyHex,
  recipients,
  via,
});
```

### `ownerBjjPrivateKeyHex`

- **Type:** `string`
- **Required:** yes

BabyJubjub private key (hex) that owns the input notes and signs the aggregation.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex, // [!code focus]
  recipients,
  via,
});
```

### `recipients`

- **Type:** `AggregateRecipientInput[]`
- **Required:** yes

Recipient outputs. The builder adds change and protocol-fee notes.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients, // [!code focus]
  via,
});
```

### `changeRecipient`

- **Type:** `CurvyPublicKeys`
- **Required:** no

Sender keys used to make a non-zero change note discoverable. Required when
the inputs can exceed recipients plus fees.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  changeRecipient, // [!code focus]
  via,
});
```

### `feeRecipient`

- **Type:** `CurvyPublicKeys`
- **Required:** no

Protocol fee-collector keys. Defaults to protocol metadata and must match
the deployed aggregator when the fee is non-zero.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  feeRecipient, // [!code focus]
  via,
});
```

### `operatorRecipient`

- **Type:** `CurvyPublicKeys`
- **Required:** no

Relay operator keys. Together with `operatorFee`, adds a discoverable gas
reimbursement output and consumes one output slot.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  operatorRecipient, // [!code focus]
  via,
});
```

### `operatorFee`

- **Type:** `bigint`
- **Required:** no

The gas-reimbursement amount (token base units) for the `operatorRecipient` note.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  operatorFee, // [!code focus]
  via,
});
```

### `notesTree`

- **Type:** `MerkleTree`
- **Required:** no

The committed notes tree (omit when `supplied` is set).

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  notesTree, // [!code focus]
  via,
});
```

### `supplied`

- **Type:** `SuppliedInclusionProofs`
- **Required:** no

Lean-client alternative: pre-built inclusion proofs at one root.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  supplied, // [!code focus]
  via,
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network whose deployed aggregator/circuit to target; defaults to the active network.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  networkSlug, // [!code focus]
  via,
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel artifact loading and queued proof generation.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  signal, // [!code focus]
  via,
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  config, // [!code focus]
  via,
});
```

### `via`

- **Type:** `SubmitVia`
- **Required:** yes

Where to send the built proof: `{ kind: "wallet", walletClient }` or `{ kind: "relay" }`.

```ts
const result = await aggregate({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  via, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`withdraw`](/sdk/actions/aggregator/withdraw) — One-call WITHDRAW: build the proof from committed notes and send it in one shot, via the user's wallet or the relay service.
- [`estimateAggregationCosts`](/sdk/actions/aggregator/estimateAggregationCosts) — Load the inputs needed to allocate an aggregation.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/aggregate.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/aggregate.ts)
