# Sending funds to anyone (send as a link)

Bob wants to send his nephew Charlie some crypto for his birthday. Charlie doesn't have a Curvy ID — in fact, he doesn't have a crypto wallet at all.

Bob uses Curvy's **Send as a link** feature to generate a single-use link and shares it with Charlie over a secure messaging channel.

## How it works under the hood

**1.** Bob's **Curvy SDK** generates a fresh, single-use Curvy key pair. Nobody owns this key pair yet — it exists only on Bob's device.

**2.** The SDK executes a regular [private transfer](./sending-funds-privately.md), but instead of resolving a recipient's Curvy ID, it addresses the new note to the single-use public keys. To any observer (and to the Curvy backend), this is indistinguishable from any other private transfer.

**3.** The SDK constructs a claim link that encodes the network, the note's shared secret, the single-use private key, and the amount and token being sent. This data is placed in the **URL fragment** (the part after `#`), which browsers never send to any server — the claim secret exists only inside the link itself.

**4.** Charlie opens the link, and the Curvy App prompts him to register a new Curvy ID (or log in, if he has one). Once he is signed in, his SDK uses the single-use private key from the link to spend the note and fold the funds into his own account — another ordinary private transfer.

> [!IMPORTANT]
> A claim link is a **bearer instrument**: whoever holds the link can claim the funds, so share it only over a channel you trust. Until it is claimed, the note is controlled by the link's key pair — which the sender also still holds, so an unclaimed link can always be swept back by its creator.
