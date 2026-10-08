# changeCurvyHandle

Rename the active account's Curvy handle.

The metadata service authenticates the rename with the bearer token, whose
subject is the current handle, so only the active (registered) account can be
renamed. On success the new handle is published to `state.accounts` (so
`watch*` fire), written to durable storage (so [`restoreSession`](/sdk/actions/auth/restoreSession) sees it), and
the bearer token is replaced with the one issued for the new handle. Keys are
untouched; the account id does not change.

## Import

```ts
import { changeCurvyHandle } from "@0xcurvy/curvy-sdk/actions";
```

## Usage

```ts
const handle = await changeCurvyHandle({ handle: "alice-two.curvy.name" });
```

## Signature

```ts
function changeCurvyHandle(parameters: ChangeCurvyHandleParameters): Promise<CurvyId>
```

## Returns

`Promise<\`${string}.staging-curvy.name\` | \`${string}.curvy.name\` | \`${string}.local-curvy.name\`>`

The action resolves or returns the value shown in the signature.

## Parameters

### `handle`

- **Type:** `string`
- **Required:** yes

The new Curvy handle for the active account, such as `alice-two.curvy.name`.

```ts
const result = await changeCurvyHandle({
  handle, // [!code focus]
});
```

### `config`

- **Type:** `CurvyConfig`
- **Required:** no

Curvy config to use. Defaults to the ambient config.

```ts
const result = await changeCurvyHandle({
  handle,
  config, // [!code focus]
});
```

## Errors

Errors from config resolution and the underlying SDK operation are propagated to the caller.

## Related

- [Authentication guide](/for-programmers/authentication)

## Source

[packages/@0xcurvy/sdk/src/actions/account/changeCurvyHandle.ts](https://github.com/0xCurvy/curvy-monorepo/blob/main/packages/@0xcurvy/sdk/src/actions/account/changeCurvyHandle.ts)
