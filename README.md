# NFTGate Smart Contract

## Features

- NFT staking and unstaking
- Email registration for users
- Delegation system for account management
- Eligibility checks based on NFT ownership and staking duration

## Contract Overview

The NFTGate contract includes the following main functionalities:

1. **Staking**: Users can stake their NFTs to gain access to gated features.
2. **Unstaking**: Users can retrieve their staked NFTs after a minimum staking period.
3. **Email Registration**: Users or their delegates can register an email address associated with their account.
4. **Delegation**: Users can add or remove delegates who can perform certain actions on their behalf.
5. **Eligibility Checks**: The contract provides functions to check if a user is eligible based on their staked NFT status.

## Key Functions

- `stakeNFT(uint256 tokenId)`: Stake an NFT by its token ID.
- `unstakeNFT(uint256 tokenId)`: Unstake a previously staked NFT.
- `registerEmail(string calldata email, address account)`: Register an email for a user account.
- `addDelegate(address delegate)`: Add a delegate for the caller's account.
- `removeDelegate(address delegate)`: Remove a delegate from the caller's account.
- `isEligible(address user)`: Check if a user is eligible (has a staked NFT).
- `isAllowed(address user)`: Check if a user is allowed (has staked for the minimum duration).

## Setup and Deployment

To deploy and interact with the NFTGate contract:

1. Install dependencies:
   ```
   npm install
   ```

2. Compile the contract:
   ```
   npx hardhat compile
   ```

3. Deploy the contract using Hardhat Ignition:
   ```
   npx hardhat ignition deploy ./ignition/modules/NFTGate.ts
   ```

4. Run tests:
   ```
   npx hardhat test
   ```

## Development and Testing

The project uses Hardhat for development and testing. Key files:

- `contracts/NFTGate.sol`: Main contract implementation
- `test/NFTGate.ts`: Test suite for the NFTGate contract
- `ignition/modules/NFTGate.ts`: Deployment module for Hardhat Ignition

## License

This project is licensed under the UNLICENSED license.
