## Querying Balances

The Curvy SDK handles asset balances across multiple networks. You can refresh balances on-demand which updates the SDK's internal storage.

### Refreshing Balances

Depending on what you want to scan, you can refresh note balances, address balances, or both.

```typescript
// Scan for new stealth notes (Zero-Knowledge shielded assets)
await sdk.refreshBalances({ type: "notes" });

// Scan for public address balances
await sdk.refreshBalances({ type: "addresses" });

// Scan everything
await sdk.refreshBalances();
```

### Retrieving Balances from Storage

Once refreshed, you can query the internal storage for the synchronized balances:

```typescript
// 1. Get the current active wallet ID
const activeWalletId = sdk.walletManager.activeWallet.id;

// 2. Fetch the note balances for a specific network (e.g. "localnet", "ethereum", "arbitrum")
const balances = await sdk.storage.getNoteBalances(activeWalletId, "localnet");

console.log(`Found ${balances.length} note(s).`);
```
