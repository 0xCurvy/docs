# waitForRelay

Poll a relayed submission to the requested lifecycle milestone. A receipt is
not finality; the default returns once the exact inclusion block is canonical.

## Import

```ts
import { waitForRelay } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await waitForRelay({
  requestId,
  waitFor: "finalized",
  config,
});
```

## Signature

```ts
function waitForRelay(parameters: WaitForRelayParameters): Promise<RelaySubmitReturnType>
```

## Returns

`Promise<RelaySubmitReturnType>`

The action resolves or returns the value shown in the signature.

## Parameters

### `requestId`

- **Type:** `string`
- **Required:** yes

The `requestId` returned by [`relaySubmission`](/sdk/actions/aggregator/relaySubmission).

```ts
const result = await waitForRelay({
  requestId, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Stops local observation; submitted funds remain reserved for reconciliation.

```ts
const result = await waitForRelay({
  requestId,
  signal, // [!code focus]
});
```

### `intervalMs`

- **Type:** `number`
- **Required:** no

Poll interval in milliseconds (default 3000).

```ts
const result = await waitForRelay({
  requestId,
  intervalMs, // [!code focus]
});
```

### `attempts`

- **Type:** `number`
- **Required:** no

Maximum poll attempts before giving up (default 120).

```ts
const result = await waitForRelay({
  requestId,
  attempts, // [!code focus]
});
```

### `waitFor`

- **Type:** `"submitted" | "included" | "finalized"`
- **Required:** no

Milestone to wait for; defaults to canonical inclusion.

```ts
const result = await waitForRelay({
  requestId,
  waitFor: "finalized", // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await waitForRelay({
  requestId,
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
- [`relaySubmission`](/sdk/actions/aggregator/relaySubmission) — Relay a built proof via the SDK's relay service — no EVM wallet, no gas.
- [`buildWithdrawRequest`](/sdk/actions/aggregator/buildWithdrawRequest) — Build a submit-ready withdrawal proof from committed notes.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/waitForRelay.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/waitForRelay.ts)
