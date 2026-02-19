# Building blocks

The core building blocks of the Curvy privacy protocol are:

- [Curvy ID](./curvy-id)
  - Stores user's public keys associated with their Curvy ID 
  - Executes ENS resolves

- [Portals](./portals)
  - Automates shielding to solve the problem of [time locality](/for-the-curious/privacy-model/time-locality)
  - Delivers the best possible UX to senders using any wallet

- [Privacy Aggregator](./privacy-aggregator)
  - Shields users funds by offerring complete opaqueness of the sender, receipient, token and currency in private transfers
  - Utilizes ZK proofs and Sparse-Merkle-Tries

- [Curvy SDK](./curvy-sdk)
  - Open-source client-side Typescript package that gives the [complete set of Curvy features](/for-users/index)
  - "Glues" all of the components together by orchestrating and facilitating user's intents
