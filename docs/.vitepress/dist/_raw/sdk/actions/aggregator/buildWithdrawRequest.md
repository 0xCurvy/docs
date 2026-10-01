# buildWithdrawRequest

Build a submit-ready withdrawal proof from committed notes. Proving runs
locally; the result can be submitted by wallet or relay.

## Import

```ts
import { buildWithdrawRequest } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const w = await buildWithdrawRequest({ notes, ownerBjjPrivateKeyHex, destinationAddress, tokenId: 1n });
await w.submit({ walletClient });
```

## Signature

```ts
function buildWithdrawRequest(parameters: BuildWithdrawRequestParameters): Promise<SubmittableSubmission>
```

## Returns

`Promise<SubmittableSubmission>`

The action resolves or returns the value shown in the signature.

## Parameters

### `notes`

- **Type:** `Note[]`
- **Required:** yes

One to `maxInputs` committed notes with the same token and owner.

```ts
const result = await buildWithdrawRequest({
  notes, // [!code focus]
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
});
```

### `ownerBjjPrivateKeyHex`

- **Type:** `string`
- **Required:** yes

BabyJubjub private key (hex) that owns the notes and signs the withdrawal.

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex, // [!code focus]
  destinationAddress,
  tokenId,
});
```

### `destinationAddress`

- **Type:** `bigint`
- **Required:** yes

Destination EOA the vault pays out to (as a bigint address).

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress, // [!code focus]
  tokenId,
});
```

### `tokenId`

- **Type:** `bigint`
- **Required:** yes

The token to withdraw (must match every input note).

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId, // [!code focus]
});
```

### `notesTree`

- **Type:** `MerkleTree`
- **Required:** no

The committed notes tree (omit when `supplied` is set).

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  notesTree, // [!code focus]
});
```

### `supplied`

- **Type:** `SuppliedInclusionProofs`
- **Required:** no

Lean-client alternative: pre-built inclusion proofs at one root.

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  supplied, // [!code focus]
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network whose deployed aggregator/circuit to target; defaults to the active network.

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  networkSlug, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel artifact loading and queued proof generation.

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await buildWithdrawRequest({
  notes,
  ownerBjjPrivateKeyHex,
  destinationAddress,
  tokenId,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`proveWithdrawal`](/sdk/actions/proving/proveWithdrawal) — Prove a withdrawal: resolve the network's withdrawal circuit artifacts (from its CircuitConfig), flatten the supplied witness, and run it through the config's prover (default Rust/arkworks).
- [`submitToChain`](/sdk/actions/aggregator/submitToChain) — Submit a built aggregator proof on-chain with the caller's wallet client.
- [`relaySubmission`](/sdk/actions/aggregator/relaySubmission) — Relay a built proof via the SDK's relay service — no EVM wallet, no gas.
- [`waitForRelay`](/sdk/actions/aggregator/waitForRelay) — Poll a relayed submission to the requested lifecycle milestone.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/buildWithdrawRequest.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/buildWithdrawRequest.ts)
