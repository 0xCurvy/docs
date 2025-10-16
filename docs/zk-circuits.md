# ZK Circuits Overview

## Deposit Circuit

All deposits to the aggregator are made in a form of note submissions. Every note is a structure containing deposited amount, token identifier, and ownership data. All notes are stored internaly in a Sparse Merkle tree (SMT). Instead of storing all notes in the aggregator smart contract, only root hash of the notes tree is stored as a commitment.

Users submit their deposit requests to the aggregator contract, listing data that a future note should contain. All deposit requests are queued and automatic Curvy service process the requests in batches. Each batch contains a number of notes that is less than or equal to the maximum defined threshold. The Deposit circuit testifies that all notes in the batch are correctly inserted in the notes tree and that no note has previously existed in the notes tree. The computed root hash of the notes tree is a commitment to the tree that is, along with ZK proof, submitted to the aggregator smart contract. Submitting the valid ZK proof with new root hash updates the notes tree root value in the aggregator contract and confirms that all deposited notes are now inserted into the notes tree. 

## Aggregation Circuit

Users may have multiple deposited notes sourced from multiple stealth addresses. Aggregation is a process which enables users to privately aggregate or split their notes in the notes tree, destroying the original notes and creating new ones. Users submit their aggregation requests off-chain to the Curvy API, listing all the input notes and desired output notes. Users also provide signatures that confirm their desire to aggregate or split the notes. Each aggregation may include the number of input and output notes up to the thresholds defined in the configuration. To prevent double spending, for each spent note a nullifier is created. Nullifiers have 1-1 relation with the respective notes but the relation is not publicaly visible without secret data kept by the owner. All nullifiers are stored in the nullifiers SMT and the root hash of the nullifiers tree is stored in the aggregator smart contract. 

As with the deposit requests, all aggregation requests are processed in batches. Curvy service collects up to a maximum number of requests per batch and process them. If the real number of input/output notes or aggregation requests is lower than the defined thresholds, dummy values are created. Aggregation Circuit is used to verify the correct batch processing, resulting in a ZK proof. The circuit verifies that:

- all of the input notes exist in the notes tree 
- none of the input notes was previously nullified
- all input notes are owned by the same users that signed the aggregation requests
- all input notes are now correctly nullified and their corresponding nullifiers are inserted into the nullifiers tree.
- sum of the amounts in the output notes is properly computed from the input notes and the fee is correctly subtracted
- all output notes are now inserted to the notes tree
- new notes and nullifier tree roots are correctly computed

The ZK proof and updated tree roots are submitted to the aggregator smart contract, updating the overall notes and nullifiers state.

## Withdrawal Circuit

Users can withdraw their notes from the aggregator back to CIP, transforming the notes into ERC155 balances. As with the aggretation, all withdrawal requests are processed in batches. Each withdrawal request, listing notes and destination address, is signed by the notes owner. Users may withdraw funds from multiple notes, effectively performing implicit aggregation. Curvy service collects up to a maximum number of witdrawal requests per batch and process them. Withdrawal Circuit is used to verify the correct withdraw batch processing, resulting in a ZK proof. The circuit verifies that:
- all of the withdrawn notes exist in the notes 
- none of the withdrawn notes was previously nullified
- all notes are owned by the same users that signed the withdrawal requests
- all input notes are now correctly nullified and their corresponding nullifiers are inserted into the nullifiers tree.
- withdrawn amount is properly computed from the withdrawn notes and the fee is correctly subtracted

After submitting valid ZK proof and updated roots, the amounts are transfered to the destination addresses provided in withdrawn requests.