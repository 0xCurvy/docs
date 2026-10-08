# submitToChain

Submit a built aggregator proof on-chain with the caller's wallet client.
The wallet account is the transaction sender and pays the native network gas.

## Import

```ts
import { submitToChain } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await submitToChain({ request, walletClient, config });
```

## Signature

```ts
function submitToChain(parameters: SubmitToChainParameters): Promise<ChainSubmitResult>
```

## Returns

`Promise<ChainSubmitResult>`

The action resolves or returns the value shown in the signature.

## Parameters

### `request`

- **Type:** `AggregatorSubmission`
- **Required:** yes

A built submission from one of the `build*Request` actions.

```ts
const result = await submitToChain({
  request, // [!code focus]
  walletClient,
});
```

### `walletClient`

- **Type:** `WalletClient`
- **Required:** yes

The user's viem wallet client — its account is the tx sender and pays gas.

```ts
const result = await submitToChain({
  request,
  walletClient, // [!code focus]
});
```

### `contractAddress`

- **Type:** `HexString`
- **Required:** no

Override the target aggregator contract; defaults to the Network record's address.

```ts
const result = await submitToChain({
  request,
  walletClient,
  contractAddress, // [!code focus]
});
```

### `onSubmitted`

- **Type:** `(transactionHash: HexString) => void | Promise<void>`
- **Required:** no

Awaited immediately after broadcast, before waiting for inclusion. Persist the hash here.

```ts
const result = await submitToChain({
  request,
  walletClient,
  onSubmitted, // [!code focus]
});
```

### `assertScope`

- **Type:** `() => void`
- **Required:** no

Revalidate execution scope immediately before broadcasting.

```ts
const result = await submitToChain({
  request,
  walletClient,
  assertScope, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Stop receipt observation without changing the submitted transaction.

```ts
const result = await submitToChain({
  request,
  walletClient,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await submitToChain({
  request,
  walletClient,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)
- [`buildAggregateRequest`](/sdk/actions/aggregator/buildAggregateRequest) — Build a submit-ready aggregation proof from committed notes.
- [`proveAggregation`](/sdk/actions/proving/proveAggregation) — Prove an aggregation: resolve the network's aggregation circuit artifacts (from its CircuitConfig), flatten the supplied witness, and run it through the config's prover (default Rust/arkworks).
- [`relaySubmission`](/sdk/actions/aggregator/relaySubmission) — Relay a built proof via the SDK's relay service — no EVM wallet, no gas.
- [`waitForRelay`](/sdk/actions/aggregator/waitForRelay) — Poll a relayed submission to the requested lifecycle milestone.
- [`buildWithdrawRequest`](/sdk/actions/aggregator/buildWithdrawRequest) — Build a submit-ready withdrawal proof from committed notes.

## Source

[packages/@0xcurvy/sdk/src/actions/aggregator/submitToChain.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/aggregator/submitToChain.ts)
