# resolveNoteWitness

Resolve a note by scanning forward from a public lower-bound hint.

Only completed shard roots before the hint's shard are fetched; individual
leaves begin at that shard boundary. A caller can select an exact commitment
by note ID, or discover owned notes locally and provide its own selection
predicate. Finalized leaves are checked first, followed by the checkpoint-pinned
hot suffix. After a match, scanning finishes that commit transaction and proves
against its historical root, which the V2 aggregator records in validNotesRoot.

## Import

```ts
import { resolveNoteWitness } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const witness = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  noteId,
  config,
});
```

## Signature

```ts
function resolveNoteWitness(parameters: ResolveNoteWitnessParameters): Promise<ResolvedNoteWitness | null>
```

## Returns

`Promise<ResolvedNoteWitness | null>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkSlug`

- **Type:** `string`
- **Required:** yes

The network whose notes tree contains the commitment.

```ts
const result = await resolveNoteWitness({
  networkSlug, // [!code focus]
  scanFrom,
});
```

### `scanFrom`

- **Type:** `number`
- **Required:** yes

Public lower-bound hint. Discovery never considers leaves below it.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom, // [!code focus]
});
```

### `timeoutMs`

- **Type:** `number`
- **Required:** no

Overall wait for a not-yet-committed note. Defaults to four minutes.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  timeoutMs, // [!code focus]
});
```

### `pollIntervalMs`

- **Type:** `number`
- **Required:** no

Delay between commitment polls after reaching the current finalized and hot heads.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  pollIntervalMs, // [!code focus]
});
```

### `pageSize`

- **Type:** `number`
- **Required:** no

Fixed page size used for sequential leaf and shard-root requests.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  pageSize, // [!code focus]
});
```

### `verifier`

- **Type:** `RootVerifier`
- **Required:** no

Direct-chain current-root trust anchor override.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  verifier, // [!code focus]
});
```

### `validRootVerifier`

- **Type:** `ValidNotesRootVerifier`
- **Required:** no

Direct-chain historical-root trust anchor override.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  validRootVerifier, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

An abort signal used to cancel note synchronization while resolving the witness.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  signal, // [!code focus]
});
```

### `spendingKey`

- **Type:** `string | undefined`
- **Required:** no

Note spending and viewing keys; used only for local discovery.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  spendingKey, // [!code focus]
});
```

### `viewingKey`

- **Type:** `string | undefined`
- **Required:** no

The viewing private key used for local note ownership discovery.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  viewingKey, // [!code focus]
});
```

### `matchOwnedNote`

- **Type:** `((note: OwnedNote) => boolean) | undefined`
- **Required:** no

Application-owned selection policy for locally discovered notes.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  matchOwnedNote, // [!code focus]
});
```

### `noteId`

- **Type:** `string | bigint | undefined`
- **Required:** no

Exact commitment reconstructed by the caller.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  noteId, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await resolveNoteWitness({
  networkSlug,
  scanFrom,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`syncNotes`](/sdk/actions/notes/syncNotes) — Run one notes-tree sync pass per network: pull the indexer delta, discover owned notes, reconcile spends, verify the assembled root against a DIRECT chain read, persist, and apply the account-facing effects (balance entries + tx history).
- [`getSpendWitnesses`](/sdk/actions/notes/getSpendWitnesses) — Produce inclusion proofs for a spend from the synced notes tree.
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.

## Source

[packages/@0xcurvy/sdk/src/actions/notes/resolveNoteWitness.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/notes/resolveNoteWitness.ts)
