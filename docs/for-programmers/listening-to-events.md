# Listening To Events

The SDK emits typed events for its background work — balance scans, plan execution, session health, and account changes. Subscribe with `on`, which returns an unsubscribe function:

```ts
import { CURVY_EVENT_TYPES, on } from "@0xcurvy/curvy-sdk";

const unsubscribe = on(CURVY_EVENT_TYPES.BALANCE_REFRESH_PROGRESS, (e) => {
  console.log(`Scanning... ${e.progress}%`);
});

// later:
unsubscribe();
```

The listener's `eventData` is automatically narrowed to the payload type of the event you subscribe to.

For abort-driven cleanup — handy in React effects — pass an `AbortSignal` instead of keeping the unsubscribe function around:

```ts
const controller = new AbortController();
on(CURVY_EVENT_TYPES.BALANCE_REFRESH_COMPLETE, onComplete, { signal: controller.signal });

// removes the listener automatically:
controller.abort();
```

## Available events

| Group | Events |
| --- | --- |
| Balance refresh | `BALANCE_REFRESH_STARTED`, `BALANCE_REFRESH_PROGRESS`, `BALANCE_REFRESH_COMPLETE`, `BALANCE_REFRESH_CANCELLED`, `BALANCE_REFRESH_ERROR` |
| Plan execution | `PLAN_EXECUTION_STARTED`, `PLAN_EXECUTION_PROGRESS`, `PLAN_COMMAND_EXECUTION_PROGRESS`, `PLAN_EXECUTION_COMPLETE`, `PLAN_EXECUTION_ERROR` |
| Session | `JWT_REFRESH_SUCCESS`, `JWT_REFRESH_ERROR`, `UNAUTHORIZED` |
| Accounts | `ACCOUNT_ADDED`, `ACCOUNT_REMOVED`, `ACCOUNT_CHANGED` |
