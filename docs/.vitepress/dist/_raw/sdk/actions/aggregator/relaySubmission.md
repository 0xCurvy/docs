# relaySubmission

Relay a built proof via the SDK's relay service — no EVM wallet, no gas. The
proof self-authenticates (the on-chain verifier is the gate), so the relay is
anonymous. Returns IMMEDIATELY with `{ requestId, status: "queued" }`; poll to
finality with [`waitForRelay`](/sdk/actions/aggregator/waitForRelay).

The SDK derives idempotency keys from the proof payload, so callers may retry
an uncertain submission without creating a second spend.

## Import

```ts
import { relaySubmission } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const queued = await relaySubmission({ request, intentId, config });
const final = await waitForRelay({ requestId: queued.requestId, config });
```

## Signature

```ts
function relaySubmission(parameters: RelaySubmissionParameters): Promise<RelaySubmitReturnType>
```

## Returns

`Promise<RelaySubmitReturnType>`

The action resolves or returns the value shown in the signature.

## Parameters

### `request`

- **Type:** `AggregatorSubmission`
- **Required:** yes

A built submission from one of the `build*Request` actions.

```ts
const result = await relaySubmission({
  request, // [!code focus]
});
```

### `intentId`

- **Type:** `string`
- **Required:** no

An optional stable intent identifier used to recover the submission after an uncertain relay response.

```ts
const result = await relaySubmission({
  request,
  intentId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await relaySubmission({
  request,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`buildAggregateRequest`](/sdk/actions/aggregator/buildAggregateRequest) — Build a submit-ready aggregation proof from committed notes.
- [`proveAggregation`](/sdk/actions/proving/proveAggregation) — Prove an aggregation: resolve the network's aggregation circuit artifacts (from its CircuitConfig), flatten the supplied witness, and run it through the config's prover (default Rust/arkworks).
- [`submitToChain`](/sdk/actions/aggregator/submitToChain) — Submit a built aggregator proof on-chain with the caller's wallet client.
- [`waitForRelay`](/sdk/actions/aggregator/waitForRelay) — Poll a relayed submission to the requested lifecycle milestone.
- [`buildWithdrawRequest`](/sdk/actions/aggregator/buildWithdrawRequest) — Build a submit-ready withdrawal proof from committed notes.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/relaySubmission.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/relaySubmission.ts)
