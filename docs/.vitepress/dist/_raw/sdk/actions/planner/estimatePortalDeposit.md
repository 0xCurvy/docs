# estimatePortalDeposit

Estimate a portal deposit that shields in place. Mirrors Vault.portalShield:
gross - floor(gross * depositFee / 10000) - pendingNoteCommitment - portalDeployment.
Bridge routing/reimbursement is service-owned and must be quoted separately;
this action deliberately does not substitute withdrawal fees or guess a destination.

## Import

```ts
import { estimatePortalDeposit } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const result = await estimatePortalDeposit({ networkSlug, token, amount, config });
```

## Signature

```ts
function estimatePortalDeposit(parameters: EstimatePortalDepositParameters): Promise<PortalDepositEstimate>
```

## Returns

`Promise<PortalDepositEstimate>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkSlug`

- **Type:** `string`
- **Required:** yes

The network whose vault fees should be applied, by slug.

```ts
const result = await estimatePortalDeposit({
  networkSlug, // [!code focus]
  token,
  amount,
});
```

### `token`

- **Type:** `bigint`
- **Required:** yes

The vault token id of the deposited currency.

```ts
const result = await estimatePortalDeposit({
  networkSlug,
  token, // [!code focus]
  amount,
});
```

### `amount`

- **Type:** `bigint`
- **Required:** yes

The gross deposit amount in the vault token's base units.

```ts
const result = await estimatePortalDeposit({
  networkSlug,
  token,
  amount, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Aborts the fee reads.

```ts
const result = await estimatePortalDeposit({
  networkSlug,
  token,
  amount,
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await estimatePortalDeposit({
  networkSlug,
  token,
  amount,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Interacting with assets guide](/for-programmers/interacting-with-assets)

## Source

[packages/@0xcurvy/sdk/src/actions/planner/estimatePortalDeposit.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/planner/estimatePortalDeposit.ts)
