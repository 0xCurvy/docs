# syncNotes

Run one notes-tree sync pass per network: pull the indexer delta, discover
owned notes, reconcile spends, verify the assembled root against a DIRECT
chain read, persist, and apply the account-facing effects (balance entries +
tx history). The synced tree is kept on `config._internal.notesTrees` for
[`getSpendWitnesses`](/sdk/actions/notes/getSpendWitnesses).

`engine` selects either the bounded sharded profile (the default) or a full
in-memory tree. Both verify against direct chain RPC and produce the same
spend-witness contract.

## Import

```ts
import { syncNotes } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const results = await syncNotes({ accountId, config });
```

## Signature

```ts
function syncNotes(parameters?: SyncNotesParameters): Promise<SyncNotesResult[]>
```

## Returns

`Promise<SyncNotesResult[]>`

The action resolves or returns the value shown in the signature.

## Parameters

### `networkSlug`

- **Type:** `string`
- **Required:** no

Network to sync; omit to sync every active network with an aggregator.

```ts
const result = await syncNotes({
  networkSlug, // [!code focus]
});
```

### `accountId`

- **Type:** `string`
- **Required:** no

Account whose ownership/spends are reconciled; defaults to the active account.

```ts
const result = await syncNotes({
  accountId, // [!code focus]
});
```

### `engine`

- **Type:** `NotesSyncEngine`
- **Required:** no

Override the config-level `notesSyncEngine` for this call (default: config's choice).

```ts
const result = await syncNotes({
  engine, // [!code focus]
});
```

### `shardHeight`

- **Type:** `number`
- **Required:** no

Override the sharded notes-tree height for this synchronization pass.

```ts
const result = await syncNotes({
  shardHeight, // [!code focus]
});
```

### `pageSize`

- **Type:** `number`
- **Required:** no

Override the number of indexed leaves requested per page.

```ts
const result = await syncNotes({
  pageSize, // [!code focus]
});
```

### `source`

- **Type:** `LeafSource`
- **Required:** no

Seam overrides (tests / alternative transports). Defaults: indexer API, direct RPC, balance-derived.

```ts
const result = await syncNotes({
  source, // [!code focus]
});
```

### `verifier`

- **Type:** `RootVerifier`
- **Required:** no

Override the component that verifies the assembled notes root against the chain.

```ts
const result = await syncNotes({
  verifier, // [!code focus]
});
```

### `resolveOwnership`

- **Type:** `OwnershipResolver`
- **Required:** no

Override the local note-ownership resolver.

```ts
const result = await syncNotes({
  resolveOwnership, // [!code focus]
});
```

### `signal`

- **Type:** `AbortSignal`
- **Required:** no

Abort the sync — checked between networks and inside the indexer paged loops.

```ts
const result = await syncNotes({
  signal, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await syncNotes({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Querying balances guide](/for-programmers/querying-balances)
- [`getSpendWitnesses`](/sdk/actions/notes/getSpendWitnesses) — Produce inclusion proofs for a spend from the synced notes tree.
- [`resolveNoteWitness`](/sdk/actions/notes/resolveNoteWitness) — Resolve a note by scanning forward from a public lower-bound hint.
- [`refreshBalances`](/sdk/actions/balances/refreshBalances) — Re-sync and persist an account's shielded balances.

## Source

[packages/@0xcurvy/sdk/src/actions/notes/syncNotes.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/notes/syncNotes.ts)
