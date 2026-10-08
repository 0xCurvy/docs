# off

Unsubscribe a previously-registered listener. Delegates to `config.emitter.off`.

Emittery's `off` is IDENTITY-based — it removes by the same `listener`
reference passed to [`on`](/sdk/actions/events/on), so the caller must hold and re-pass the original
function (or use the unsubscribe handle returned by [`on`](/sdk/actions/events/on)).

`config` is the last, optional positional argument (the exception to the
single-options-bag rule, like the `watch*` actions).

## Import

```ts
import { off } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
off(CURVY_EVENT_TYPES.BALANCE_REFRESH_COMPLETE, listener);
```

## Signature

```ts
function off<Name extends keyof CURVY_EVENTS>(eventName: Name, listener: (eventData: CURVY_EVENTS[Name]) => void | Promise<void>, config?: CurvyConfig): void
```

## Returns

`void`

The action resolves or returns the value shown in the signature.

## Parameters

### `eventName`

- **Type:** `Name`
- **Required:** yes

The Curvy event from which to remove the listener.

```ts
off(
  eventName, // [!code focus]
  listener,
);
```

### `listener`

- **Type:** `(eventData: CURVY_EVENTS[Name]) => void | Promise<void>`
- **Required:** yes

The listener previously passed to [`on`](/sdk/actions/events/on).

```ts
off(
  eventName,
  listener, // [!code focus]
);
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
off(
  eventName,
  listener,
  config, // [!code focus]
);
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Listening to events guide](/for-programmers/listening-to-events)
- [`on`](/sdk/actions/events/on) — Subscribe to a Curvy event.

## Source

[packages/@0xcurvy/sdk/src/actions/events/off.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/events/off.ts)
