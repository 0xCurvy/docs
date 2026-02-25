# Building blocks

The core building blocks of the Curvy privacy protocol are:

- [Curvy ID](./curvy-id)
  - Stores users' public keys associated with their Curvy ID
  - Executes ENS resolves

- [Portals](./portals)
  - Automates shielding to solve the problem of [time locality](/for-the-curious/privacy-model#time-locality)
  - Delivers the best possible UX to senders, regardless of their wallet choice.

- [Privacy Aggregator](./privacy-aggregator)
  - Shields users funds by offerring complete opaqueness of the sender, receipient, token and currency in private transfers
  - Utilizes ZK proofs and Sparse Merkle Trees

- [Curvy SDK](./curvy-sdk)
  - Open-source client-side TypeScript package that provides the [complete set of Curvy features](/for-users/index)
  - "Glues" all components together by orchestrating and facilitating users' intents
