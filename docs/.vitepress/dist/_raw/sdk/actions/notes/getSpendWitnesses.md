# getSpendWitnesses

Produce inclusion proofs for a spend from the synced notes tree. All returned
proofs share the same authenticated root.

Under the sharded engine, cold notes (no witness tracked — e.g. restored
wallet) are recovered transparently: one shard fetch from the dumb leaf feed,
verified against the already-chain-anchored shard root, then persisted. The
global engine holds every leaf, so it never needs recovery.

## Import

```ts
import { getSpendWitnesses } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const supplied = await getSpendWitnesses({
  networkSlug,
  noteIds,
  config,
});
```

## Signature

```ts
function getSpendWitnesses(parameters: GetSpendWitnessesParameters): Promise<SuppliedInclusionProofs>
```

## Returns

`Promise<SuppliedInclusionProofs>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkSlug`

- **Type:** `string`
- **Required:** yes

The network whose notes tree should supply the spend witnesses.

```ts
const result = await getSpendWitnesses({
  networkSlug, // [!code focus]
  noteIds,
});
```

### `noteIds`

- **Type:** `Array<bigint | string>`
- **Required:** yes

Note ids to witness, in spend order (decimal strings or bigints).

```ts
const result = await getSpendWitnesses({
  networkSlug,
  noteIds, // [!code focus]
});
```

### `leafIndices`

- **Type:** `Array<number | undefined>`
- **Required:** no

Supplied leaf positions corresponding to `noteIds`. This lets a bearer-note
flow (for example a gift link) recover a sharded witness without first
writing the note into an unrelated account's balance storage. Positions
come from the chain-scoped indexer status route and are still verified
against the locally assembled, RPC-anchored tree root.

```ts
const result = await getSpendWitnesses({
  networkSlug,
  noteIds,
  leafIndices, // [!code focus]
});
```

### `persistRecoveredWitnesses`

- **Type:** `boolean`
- **Required:** no

Persist witnesses recovered by this call. Disable for bearer notes that do
not belong to the active account: their witness is needed only long enough
to build this proof and must not enter the finalized wallet snapshot.
Defaults to true for ordinary account-owned cold-note recovery.

```ts
const result = await getSpendWitnesses({
  networkSlug,
  noteIds,
  persistRecoveredWitnesses, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

Account whose balance entries supply leaf indices for cold notes; defaults to active.

```ts
const result = await getSpendWitnesses({
  networkSlug,
  noteIds,
  accountId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getSpendWitnesses({
  networkSlug,
  noteIds,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`syncNotes`](/sdk/actions/notes/syncNotes) — Run one notes-tree sync pass per network: pull the indexer delta, discover owned notes, reconcile spends, verify the assembled root against a DIRECT chain read, persist, and apply the account-facing effects (balance entries + tx history).
- [`resolveNoteWitness`](/sdk/actions/notes/resolveNoteWitness) — Resolve a note by scanning forward from a public lower-bound hint.
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.

## Source

[packages/@0xcurvy/sdk/src/actions/notes/getSpendWitnesses.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/notes/getSpendWitnesses.ts)
