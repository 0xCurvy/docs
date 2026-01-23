# Develop with Curvy SDK

## Getting Started {#getting-started}

> [!IMPORTANT]
> Curvy SDK is currently in closed beta.
>
> To get your own API key for testing, please first submit this [Form](https://form.typeform.com/to/xNPxnHQO)
>
> To receive support, reach out via the [Curvy Telegram chat](https://t.me/CurvyProtocol/8)
> or [GitHub Issues](https://github.com/0xCurvy/sdk/issues/)

> [!NOTE]
> Current limitations of Curvy SDK:
> - New users cannot register their handles using Curvy SDK, only sign in is supported
> - While Curvy SDK is in closed beta, API key is required to use the SDK

Curvy SDK is a Typescript SDK that works in both server and browser environments and
gives you the complete feature set of the Curvy protocol.

- [GitHub repository](https://github.com/0xCurvy/sdk/)
- [NPM](https://www.npmjs.com/package/@0xcurvy/sdk)

## Installation {#installation}

Curvy SDK can be installed with a Node package manager:

```
pnpm install @0xcurvy/curvy-sdk
```

The easiest way to get started is to run the provided `curvy-os` example app:

```
git clone https://github.com/0xCurvy/sdk.git
cd example/curvy-os
pnpm install
pnpm start
```

After opening the plain JS/HTML app in your browser, configure the API key you have received from the team, and
you will have the complete set of features in the Curvy SDK at your disposal through the primitive UI of `curvy-os`.

All code examples provided below are code snippets extracted from the `curvy-os` example, and are written for the plain
JavaScript clientside environment

## Initializing the SDK {#initializing}

### Setting up the API keys

Initializing the Curvy SDK is as simple as providing the API key, and the list of networks you want to support.

```javascript
import { init } from "@0xcurvy/curvy-sdk";

window.curvySDK = await init(
    {
        apiKey: "YOURAPIKEY", // The API key you have received from the team after submitting the form.
    },
    "https://api.curvy.box/",  // The API base url of the Curvy backend
    selectedNetworkFilter // The selector for which networks you want the instance of the Curvy SDK to support.
)
```

The value of the `selectedNetworkFilter` can be:
 - `string`: slug format, e.g. "ethereum-sepolia"
 - `number`: Curvy ID of the network (as returned by https://api.curvy.box/currency/latest)
 - `callback`: Filter callback function that takes the [type Network](https://github.com/0xCurvy/sdk/blob/main/src/types.ts#L28-L40) as argument
 - `boolean`: Indicates whether we should connect to all mainnets (false) or all testnets (true)
 - `undefined`: We want to select all networks

The `selectedNetworkFilter` will influence on which networks you can query balances, create new stealth addresses, and send funds on.

To verify that the SDK is correctly initialized you can check the networks enabled by the SDK:
```javascript
const networks = await window.curvySDK.GetNetworks();
console.log(networks);
```

### Announcement syncing

>[!NOTE]
> Curvy SDK works by first indexing the entire set of announcements available in the Curvy protocol.
>
> Announcements are made whenever a new stealth address transfer is occurring and hold information that can only be 
> used by the recipient, anonymously, to derive the new stealth address. 
> 
> Announcements are essential for the receiving side to be able to detect their new stealth addresses.

After checking that the SDK is initialized, the Curvy SDK will start indexing the announcements in the browser.

As this is an asynchronous process you will have to set up event listeners using the following helper functions:
- `onSyncStarted(...)` - the syncing process has started
- `onSyncProgress(...)` - the syncing process has indexed a single batch of announcements
- `onSyncComplete(...)` - the syncing process is complete
- `onSyncError(...)` - error occurred during syncing

All the helper functions share the same function signature.
To illustrate, if you wanted to notify the user when the announcements have successfully synced, you will do the following:

```javascript
window.curvySDK.onSyncComplete((event) => {
    alert("Announcements synced!");
});
```

> [!TIP]
> Curvy SDK automatically fetches new announcements when they are detected. No polling needs to be done on your side.

Now that you have successfully initialized Curvy, we are ready to let the users sign in with their existing Curvy accounts.

## Signing into Curvy {#signing-in}

Curvy SDK currently supports logging in through:
- `window.ethereum` (e.g. Metamask)
- `window.starknet_argentX` Ready Wallet
- `window.starknet_braavos` Braavos Wallet

The heavy lifting of the sign-in process is done by the SDK itself.

The sign-in flow is:
- User connects the desired wallet account
- User is prompted to enter their password
- User is prompted to sign a secret message
- Announcements that have previously been synced are now scanned to match stealth addresses for this specific user

> [!IMPORTANT]
> The entirety of the sign-in process is done client-side, and no user credentials are ever leaving the browser!
> 
> The sign-in process simply derives the Curvy keypairs ([read more about viewing and spending keys](/technical-documentation))
> from the provided signature and password.

The `GetSignatureParamsForNetworkFlavour(...)`  method will prepare the object that needs to be signed by the user
to properly derive the key pairs:

```javascript
const signingObject = await window.curvySDK.GetSignatureParamsForNetworkFlavour("evm", ownerAddress, password);
```

The `AddWalletWithSignature(...)` method will derive the Curvy key pairs from the signature provided by user's wallet:

```javascript
await window.curvySDK.AddWalletWithSignature(ownerAddress, rawSignature);
```

After the call to `AddWalletWithSignature(...)` is finished, you can check the `GetWallets()` method to see that it
has properly been initialized with Curvy SDK:

```javascript
const wallets = window.curvySDK.GetWallets();
console.log(wallets);

console.log(`${wallets[0].GetCurvyHandle()} has logged in!`) // this will print: `vitalik.curvy.name has logged in!`
```

### Code example with Metamask

```javascript
  if (!window.ethereum) {
    alert("Metamask not installed!");
    return;
  }

  const provider = window.ethereum;

  // Request account access
  const accounts = await provider.request({
    method: "eth_requestAccounts",
  });

  const ownerAddress = accounts[0];
  
  // Prompt the user to enter their password
  const password = await prompt("Please enter password");

  // Prompt eth_signTypedData
  const signingObject = await window.curvySDK.GetSignatureParamsForNetworkFlavour("evm", ownerAddress, password);
  const params = [ownerAddress, signingObject];

  const rawSignature = await window.ethereum.request({
    method: "eth_signTypedData_v4",
    params,
  });

  await window.curvySDK.AddWalletWithSignature(ownerAddress, rawSignature);
```

### Code example with Argent / Braavos

```javascript
let wallet;
if (walletName === "argent") {
    wallet = window.starknet_argentX;
} else if (walletName === "braavos") {
    wallet = window.starknet_braavos;
}

if (wallet === undefined) {
    throw new Error(`Error connecting to Starknet wallet: ${walletName}`);
}

await wallet.enable();

const ownerAddress = wallet.account.address;

const password = await prompt("Please enter password");

const signingObject = await window.curvySDK.GetSignatureParamsForNetworkFlavour("starknet", ownerAddress, password);

const signature = await wallet.account.signMessage(signingObject);

await window.curvySDK.AddWalletWithSignature(ownerAddress, signature);
```

### Scanning the announcements

Now that the wallet is properly is initialized with the SDK and the user is signed in - Curvy SDK will automatically
start scanning the previously synced Announcements with the new user's key pairs to detect any stealth addresses that
may be owned by them. 

The scanning process is completely automatic and is triggered whenever a new batch of Announcements is indexed or 
when a new wallet is added to Curvy SDK.

Just like with the announcements, you might want to inform the user when the scanning process is complete by using
the event listeners, or when a new stealth address is matched:
- `onScanProgress(...)` - the scanning process has progressed through a single batch
- `onScanComplete(...)` - the scanning process is complete
- `onScanMatch(...)` - the scanning process has detected a new stealth address for the wallet
- `onScanError(...)` - error occurred during scanning

The entirety of the matched stealth addresses are also available in the `CurvyWallet` object:
```javascript
const wallets = window.curvySDK.GetWallets();

/*
 This example will print the wallets Curvy handle and the matched stealth addressses:
 
 vitalik.curvy.name:
 - 0xcdef...
 - 0xabab...
 - ...more stealth addresses

 */
for (const wallet of wallets) {
    console.log(`${wallet.GetCurvyHandle()}:`)

    for (const stealthAddress of wallet.stealthAddresses) {
        console.log(`- ${stealthAddress.address}`);
    }
}
```

## Querying balances {#querying-balances}

Now that we have:

- The SDK initialized
- Announcements synced
- User signed in 
- User's stealth addresses scanned from the announcements and their key pairs

We are ready to query the balances for the different networks and currencies that Curvy SDK supports.

> [!NOTE]
> You can always refer to the https://api.curvy.box/currency/latest endpoint to see which currencies and networks are supported.


This is done as simply as:
```javascript
await window.curvySDK.RefreshBalances();
```

The above asynchronous call will query the balances for all the networks matched by the `selectedNetworkFilter` you provided
when initializing the SDK, all supported currencies on those networks and all the wallets you have signed in to with Curvy SDK.


To display the balances, you can access the wallets registered with the SDK in the same manner as before:

```javascript
/*
 This example will print the wallets Curvy handlem, the matched stealth addressses and their balances:
 
 vitalik.curvy.name:
 - 0xcdef...
    - 415 STRK @Starknet
    - 32.1 ETH @Ethereum Sepolia
    - 131 USDC @Ethereum Sepolia
 - ...more stealth addresses and balances...

 */
for (const wallet of wallets) {
    console.log(`${wallet.GetCurvyHandle()}:`)

    for (const stealthAddress of wallet.stealthAddresses) {
        console.log(`- ${stealthAddress.address}`);
        
        for (const balanceIdentifier in stealthAddress.balances) {
            const [network, currency] = window.curvySDK.GetNetworkAndCurrencyFromBalanceIdentifier(balanceIdentifier);
            
            const balance = prettyPrintBalance(stealthAddress.balances[balanceIdentifier], currency.decimals);
            const networkName = network.name;
            const currencySymbol = currency.symbol;
            console.log(`\t- ${balance} ${currencySymbol} @${networkName}`)
        }
    }
}


// Helper function that should be implemented by you that displays the balance in the desired format.
function prettyPrintBalance(amount, decimals, precision = 2) {
    if (typeof amount !== "bigint") {
        throw new TypeError("amount must be a BigInt");
    }

    const divisor = BigInt(10) ** BigInt(decimals);
    const whole = amount / divisor;
    const fraction = amount % divisor;

    // Get fractional part as string with padding
    let fractionStr = ((fraction * BigInt(10 ** precision)) / divisor).toString().padStart(precision, "0");

    // Trim trailing zeros from fractional part
    fractionStr = fractionStr.replace(/0+$/, "");

    return fractionStr.length > 0 ? `${whole.toString()}.${fractionStr}` : whole.toString();
}
```

## Sending funds {#sending-funds}

Sending funds from a stealth address is as simple as invoking a single function.

The below function will send the funds from a specific stealth address and `console.log()` the link to the explorer.

```javascript
const stealthAddress = window.curvySDK.GetStealthAddress("0xcdef...");
const network = "ethereum"
const toAddress = "..."
const amount = "0.13"
const currency = "USDC"

const txHash = await window.curvySDK.Send(
    stealthAddress,
    network,
    toAddress,
    amount,
    currency
);

const { blockExplorerUrl } = await window.curvySDK.GetNetwork(network);
console.log(`${blockExplorerUrl}/tx/${txHash}`, "_blank");
```

> [!TIP]
> To provide better UX to the user, you should always estimate the fees first and inform the user prior to running send.
> Take a look at the provided example in the `curvy-os` to see how we first estimate the fees, and then use the 
> same fees to send the transaction.
