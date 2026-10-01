# on

Subscribe to a Curvy event. Delegates to `config.emitter.on` and returns
Emittery's identity-based unsubscribe function.

`eventName` and `listener` stay positional (Emittery's natural shape); the
trailing options bag carries `config` and an optional `signal` for
abort-driven auto-cleanup (passed straight through to Emittery).

The generic over the event name narrows `eventData` to that event's payload
(e.g. `BALANCE_REFRESH_PROGRESS` → `{ progress, environment? }`), mirroring the
underlying typed emitter.

## Import

```ts
import { on } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

### Example 1

```ts
const unsubscribe = on(CURVY_EVENT_TYPES.BALANCE_REFRESH_COMPLETE, (e) => {});
// later: unsubscribe();
```

### Example 2

```ts
// Auto-cleanup via AbortSignal — no manual off():
on(CURVY_EVENT_TYPES.BALANCE_REFRESH_COMPLETE, (e) => {}, { signal: controller.signal });
```

## Signature

```ts
function on<Name extends keyof CURVY_EVENTS>(eventName: Name, listener: (eventData: CURVY_EVENTS[Name]) => void | Promise<void>, options?: OnOptions): Unsubscribe
```

## Returns

`UnsubscribeFunction`

The action resolves or returns the value shown in the signature.

## Parameters

### `eventName`

- **Type:** `Name`
- **Required:** yes

The Curvy event to subscribe to.

```ts
const result = on(
  eventName, // [!code focus]
  listener,
);
```

### `listener`

- **Type:** `(eventData: CURVY_EVENTS[Name]) => void | Promise<void>`
- **Required:** yes

The callback invoked when the event is emitted.

```ts
const result = on(
  eventName,
  listener, // [!code focus]
);
```

### `options`

- **Type:** `OnOptions`
- **Required:** no
- **Default:** `{}`

Optional subscription configuration and lifecycle controls.

```ts
const result = on(
  eventName,
  listener,
  { // [!code focus:2]
  },
);
```

### `options.config`

- **Type:** `CurvyConfig`
- **Required:** no

Override the ambient global config.

```ts
const result = on(
  eventName,
  listener,
  {
    config, // [!code focus]
  },
);
```

### `options.signal`

- **Type:** `AbortSignal`
- **Required:** no

Bind the subscription's lifetime to an `AbortSignal`: when it aborts, the
listener is removed automatically — no explicit `off()` needed. Handled
natively by Emittery (it also detaches the abort handler if you unsubscribe
manually first, and no-ops when the signal is already aborted).

```ts
const result = on(
  eventName,
  listener,
  {
    signal, // [!code focus]
  },
);
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Listening to events guide](/for-programmers/listening-to-events)
- [`off`](/sdk/actions/events/off) — Unsubscribe a previously-registered listener.

## Source

[packages/@0xcurvy/sdk/src/actions/events/on.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/events/on.ts)
