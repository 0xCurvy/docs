# Querying Balances

The SDK refreshes shielded balances on demand with [`refreshBalances`](/sdk/actions/balances/refreshBalances) and stores the result in the configured storage adapter (IndexedDB in the browser, in-memory on the server).

## Refreshing Balances

```ts
import { refreshBalances } from "@0xcurvy/curvy-sdk/actions";

await refreshBalances({ config });
```

Pass `accountId` to target a specific account, or omit it to use the active account.

## Reading Balances

```ts
import { getBalances } from "@0xcurvy/curvy-sdk/actions";

const cachedBalances = await getBalances({ config });
const freshBalances = await getBalances({ config, cached: false });

console.log(`Found ${cachedBalances.length} balance(s).`);
```

[`getBalances`](/sdk/actions/balances/getBalances) returns cached balances by default. Pass `cached: false` to refresh from chain first (equivalent to calling [`refreshBalances`](/sdk/actions/balances/refreshBalances) beforehand).

Aggregated totals per currency are available from the storage surface:

```ts
const activeAccountId = config.state.activeAccountId;
if (!activeAccountId) throw new Error("No active account");

const totals = await config.storage.getTotals(activeAccountId, config.state.environment);
```
