# Querying Balances

The Curvy SDK handles asset balances across multiple networks. You can refresh balances on-demand, which updates the SDK's internal storage.

## Refreshing Balances

Depending on what you want to scan, you can refresh note balances, address balances, or both.

```typescript
// Scan for balances
await sdk.refreshBalances();
```

## Retrieving Balances from Storage

Once refreshed, you can query balances directly from the SDK.

```typescript
// Fetch all balances for the active wallet
const balances = await sdk.getBalances();

// Pass false to force a refresh before returning, same as calling `sdk.refreshBalances()` prior to this
const freshBalances = await sdk.getBalances(false);

console.log(`Found ${balances.length} balance(s).`);

// Get aggregated totals per currency
const totals = await sdk.getTotals();
```
