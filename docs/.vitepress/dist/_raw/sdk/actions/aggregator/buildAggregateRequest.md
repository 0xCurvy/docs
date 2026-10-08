# buildAggregateRequest

Build a submit-ready aggregation proof from committed notes. Contract fees and
circuit parameters are read for the selected network; proving runs locally.

## Import

```ts
import { buildAggregateRequest } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const req = await buildAggregateRequest({ inputNotes, ownerBjjPrivateKeyHex,
  recipients: [{ amount: 5n, curvyId: "alice.curvy.name" }] });
await req.submit({ walletClient });   // or: await req.relay();
```

## Signature

```ts
function buildAggregateRequest(parameters: BuildAggregateRequestParameters): Promise<SubmittableSubmission>
```

## Returns

`Promise<SubmittableSubmission>`

The action resolves or returns the value shown in the signature.

## Parameters

### `inputNotes`

- **Type:** `Note[]`
- **Required:** yes

One to `maxInputs` committed notes with the same token and owner.

```ts
const result = await buildAggregateRequest({
  inputNotes, // [!code focus]
  ownerBjjPrivateKeyHex,
  recipients,
});
```

### `ownerBjjPrivateKeyHex`

- **Type:** `string`
- **Required:** yes

BabyJubjub private key (hex) that owns the input notes and signs the aggregation.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex, // [!code focus]
  recipients,
});
```

### `recipients`

- **Type:** `AggregateRecipientInput[]`
- **Required:** yes

Recipient outputs. The builder adds change and protocol-fee notes.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients, // [!code focus]
});
```

### `changeRecipient`

- **Type:** `CurvyPublicKeys`
- **Required:** no

Sender keys used to make a non-zero change note discoverable. Required when
the inputs can exceed recipients plus fees.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  changeRecipient, // [!code focus]
});
```

### `feeRecipient`

- **Type:** `CurvyPublicKeys`
- **Required:** no

Protocol fee-collector keys. Defaults to protocol metadata and must match
the deployed aggregator when the fee is non-zero.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  feeRecipient, // [!code focus]
});
```

### `operatorRecipient`

- **Type:** `CurvyPublicKeys`
- **Required:** no

Relay operator keys. Together with `operatorFee`, adds a discoverable gas
reimbursement output and consumes one output slot.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  operatorRecipient, // [!code focus]
});
```

### `operatorFee`

- **Type:** `bigint`
- **Required:** no

The gas-reimbursement amount (token base units) for the `operatorRecipient` note.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  operatorFee, // [!code focus]
});
```

### `notesTree`

- **Type:** `MerkleTree`
- **Required:** no

The committed notes tree (omit when `supplied` is set).

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  notesTree, // [!code focus]
});
```

### `supplied`

- **Type:** `SuppliedInclusionProofs`
- **Required:** no

Lean-client alternative: pre-built inclusion proofs at one root.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  supplied, // [!code focus]
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network whose deployed aggregator/circuit to target; defaults to the active network.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  networkSlug, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel artifact loading and queued proof generation.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await buildAggregateRequest({
  inputNotes,
  ownerBjjPrivateKeyHex,
  recipients,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`proveAggregation`](/sdk/actions/proving/proveAggregation) — Prove an aggregation: resolve the network's aggregation circuit artifacts (from its CircuitConfig), flatten the supplied witness, and run it through the config's prover (default Rust/arkworks).
- [`submitToChain`](/sdk/actions/aggregator/submitToChain) — Submit a built aggregator proof on-chain with the caller's wallet client.
- [`relaySubmission`](/sdk/actions/aggregator/relaySubmission) — Relay a built proof via the SDK's relay service — no EVM wallet, no gas.
- [`waitForRelay`](/sdk/actions/aggregator/waitForRelay) — Poll a relayed submission to the requested lifecycle milestone.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/buildAggregateRequest.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/buildAggregateRequest.ts)
