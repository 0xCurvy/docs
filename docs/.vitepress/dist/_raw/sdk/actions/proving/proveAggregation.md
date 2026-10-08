# proveAggregation

Prove an aggregation: resolve the network's aggregation circuit artifacts
(from its `CircuitConfig`), flatten the supplied witness, and run it through
the config's `prover` (default Rust/arkworks). Returns the Groth16 proof + public
signals, ready for the operator's on-chain submit.

## Import

```ts
import { proveAggregation } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const witness = await generateAggregationCircuitInputsFromNotes({ inputNotes, ... });
const { proof, publicSignals } = await proveAggregation({ witness });
```

## Signature

```ts
function proveAggregation(parameters: ProveAggregationParameters): Promise<ProofResult>
```

## Returns

`Promise<ProofResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `witness`

- **Type:** `AggregationCircuitInputs`
- **Required:** yes

The aggregation witness from `generateAggregationCircuitInputsFromNotes`.
Input generation stays separate; this action only flattens + proves.

```ts
const result = await proveAggregation({
  witness, // [!code focus]
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network whose deployed aggregation circuit to prove against; defaults to the active network.

```ts
const result = await proveAggregation({
  witness,
  networkSlug, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel artifact loading and queued proof generation.

```ts
const result = await proveAggregation({
  witness,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await proveAggregation({
  witness,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`buildAggregateRequest`](/sdk/actions/aggregator/buildAggregateRequest) — Build a submit-ready aggregation proof from committed notes.
- [`submitToChain`](/sdk/actions/aggregator/submitToChain) — Submit a built aggregator proof on-chain with the caller's wallet client.
- [`relaySubmission`](/sdk/actions/aggregator/relaySubmission) — Relay a built proof via the SDK's relay service — no EVM wallet, no gas.
- [`waitForRelay`](/sdk/actions/aggregator/waitForRelay) — Poll a relayed submission to the requested lifecycle milestone.

## Source

[packages/@0xcurvy/sdk/src/actions/proving/proveAggregation.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/proving/proveAggregation.ts)
