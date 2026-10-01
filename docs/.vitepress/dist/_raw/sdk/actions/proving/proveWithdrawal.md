# proveWithdrawal

Prove a withdrawal: resolve the network's withdrawal circuit artifacts (from
its `CircuitConfig`), flatten the supplied witness, and run it through the
config's `prover` (default Rust/arkworks). Returns the Groth16 proof + public
signals, ready for the operator's on-chain submit.

## Import

```ts
import { proveWithdrawal } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const witness = await generateWithdrawalCircuitInputsFromNotes({ notes, ... });
const { proof, publicSignals } = await proveWithdrawal({ witness });
```

## Signature

```ts
function proveWithdrawal(parameters: ProveWithdrawalParameters): Promise<ProofResult>
```

## Returns

`Promise<ProofResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `witness`

- **Type:** `WithdrawCircuitInputs`
- **Required:** yes

The withdrawal witness from `generateWithdrawalCircuitInputsFromNotes`.
Input generation stays separate; this action only flattens + proves.

```ts
const result = await proveWithdrawal({
  witness, // [!code focus]
});
```

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network whose deployed withdrawal circuit to prove against; defaults to the active network.

```ts
const result = await proveWithdrawal({
  witness,
  networkSlug, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Cancel artifact loading and queued proof generation.

```ts
const result = await proveWithdrawal({
  witness,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await proveWithdrawal({
  witness,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`buildWithdrawRequest`](/sdk/actions/aggregator/buildWithdrawRequest) — Build a submit-ready withdrawal proof from committed notes.
- [`submitToChain`](/sdk/actions/aggregator/submitToChain) — Submit a built aggregator proof on-chain with the caller's wallet client.
- [`relaySubmission`](/sdk/actions/aggregator/relaySubmission) — Relay a built proof via the SDK's relay service — no EVM wallet, no gas.
- [`waitForRelay`](/sdk/actions/aggregator/waitForRelay) — Poll a relayed submission to the requested lifecycle milestone.

## Source

[packages/@0xcurvy/sdk/src/actions/proving/proveWithdrawal.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/proving/proveWithdrawal.ts)
