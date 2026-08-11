# Sending funds to anyone (send as a link)

Bob wants to send his nephew Charlie some crypto for his birthday. Charlie doesn't have a Curvy ID — in fact, he doesn't have a crypto wallet at all.

Bob uses Curvy's **Send as a link** feature to generate a single-use link and shares it with Charlie over a secure messaging channel.

## How it works under the hood

**1.** Bob's **Curvy SDK** generates a fresh, single-use Curvy key pair. Nobody owns this key pair yet — it exists only on Bob's device.

**2.** The SDK executes a regular [private transfer](./sending-funds-privately.md), but instead of resolving a recipient's Curvy ID, it addresses the new note to the single-use public keys. To any observer (and to the Curvy backend), this is indistinguishable from any other private transfer.

**3.** Curvy App constructs a versioned claim link containing `[deploymentId, scanFrom, s, v, noteTag]`. The deployment identifies the exact Privacy Aggregator instance, `scanFrom` is a starting hint for finding the commitment, `s` and `v` are the single-use private keys, and `noteTag` selects the intended note if the scan finds more than one note owned by those keys. These values are placed in the **URL fragment** (the part after `#`), which browsers do not include in HTTP requests — the claim secret remains inside the link.

**4.** Charlie opens the link, and Curvy App prompts him to register a new Curvy ID (or log in, if he has one). Once he is signed in, the app scans commitments from the hint, derives candidate notes locally with `s` and `v`, selects the note matching `noteTag`, and spends it into his account — another ordinary private transfer.

> [!IMPORTANT]
> A claim link is a **bearer instrument**: whoever holds the link can claim the funds, so share it only over a channel you trust. Losing the only copy of the link can also make an unclaimed gift unrecoverable.
