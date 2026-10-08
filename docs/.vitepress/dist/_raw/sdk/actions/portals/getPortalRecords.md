# getPortalRecords

Fetch a page of global portal records via keyset pagination. Pass the previous page's `nextCursor`
to continue; iterate until `nextCursor` is null.

## Import

```ts
import { getPortalRecords } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
let cursor: string | undefined;
do {
  const { portals, nextCursor } = await getPortalRecords({ cursor, limit: 200 });
  // ...process portals...
  cursor = nextCursor ?? undefined;
} while (cursor);
```

## Signature

```ts
function getPortalRecords(parameters?: GetPortalRecordsParameters): Promise<GetPortalRecordsReturnType>
```

## Returns

`Promise<GetPortalRecordsReturnType>`

The action resolves or returns the value shown in the signature.

## Parameters

### `cursor`

- **Type:** `string`
- **Required:** no

Opaque keyset cursor from a previous page's `nextCursor`. Omit for the first page.

```ts
const result = await getPortalRecords({
  cursor, // [!code focus]
});
```

### `limit`

- **Type:** `number`
- **Required:** no

Max records to return (server caps at 200).

```ts
const result = await getPortalRecords({
  limit, // [!code focus]
});
```

### `startTime`

- **Type:** `number`
- **Required:** no

Include records created at or after this Unix timestamp.

```ts
const result = await getPortalRecords({
  startTime, // [!code focus]
});
```

### `endTime`

- **Type:** `number`
- **Required:** no

Include records created at or before this Unix timestamp.

```ts
const result = await getPortalRecords({
  endTime, // [!code focus]
});
```

### `direction`

- **Type:** `"older" | "newer"`
- **Required:** no

"older" = newest-first (default); "newer" = ascending from the cursor (incremental scan).

```ts
const result = await getPortalRecords({
  direction: "newer", // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await getPortalRecords({
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Portals and recovery guide](/for-programmers/portals-and-recovery)
- [`generateEntryPortal`](/sdk/actions/portals/generateEntryPortal) — Generate (insert) an entry portal — the on-ramp address that shields funds into Curvy.
- [`generateExitPortal`](/sdk/actions/portals/generateExitPortal) — Generate (insert) an exit portal — the off-ramp that unshields funds out of Curvy to a destination address.
- [`getPortalStatus`](/sdk/actions/portals/getPortalStatus) — Fetch the lifecycle status of a single portal by address.

## Source

[packages/@0xcurvy/sdk/src/actions/portals/getPortalRecords.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/portals/getPortalRecords.ts)
