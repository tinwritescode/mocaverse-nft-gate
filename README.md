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
- `isDelegateOf(address owner, address delegate)`: Check if a delegate is authorized for a specific owner.
- `getRegisteredEmail(address user)`: Get the registered email for a user.
- `getStakedNFT(address user)`: Get the staked NFT for a user.

See [INFTGate.sol](./contracts/interfaces/INFTGate.sol) for more details.

## Decision made

### NFT must be staked for at least 1 week before it can pass the gating requirements

Using `minimumStakeDuration` to set the minimum staking duration. I use 1 week as the minimum duration. 
You can change the minimum duration by calling `setMinimumStakeDuration` function.

Read more about it in [NFTGate.sol](./contracts/NFTGate.sol)

### Delegated wallets should be supported to prove ownership

User can add and remove delegates to manage their account. 

See [NFTGate.sol](./contracts/NFTGate.sol) for more details at `addDelegate` and `removeDelegate` functions.

### Users should not be able to register multiple emails by simply delegating to different wallets

Options we have:
- Only allow user to register email one time
- We restrict user can only change the email address every a period of time that we will set in the contract constructor.

I choose the first option now, with upgradeable smart contract, we can change the logic later if we want. But let's keep the first option for now.

Read more about it in [NFTGate.sol](./contracts/NFTGate.sol).

## Setup and Development

To set up and develop with the NFTGate contract:

1. Install dependencies:
   ```
   pnpm install
   ```

2. Compile the contract:
   ```
   pnpm hardhat compile
   ```

3. Run tests:
   ```
   pnpm hardhat test
   ```

## Development and Testing

The project uses Hardhat for development and testing. Key files:

- `contracts/NFTGate.sol`: Main contract implementation
- `contracts/interfaces/INFTGate.sol`: Interface for the NFTGate contract
- `test/NFTGate.ts`: Test suite for the NFTGate contract

## Ignition deployment modules

- [NFTGate](./ignition/modules/NFTGate.ts)
- [MockNFT](./ignition/modules/MockNFT.ts)


## Deployment

To deploy the NFTGate contract and its dependencies:

1. Ensure you have set up your environment variables, including your network configurations and private keys.

2. Run the deployment script using Hardhat Ignition:
   ```
   npx hardhat ignition deploy ignition/modules/NFTGate.ts
   ```

   This will deploy the NFTGate contract and its dependencies, and output the addresses of the deployed contracts.

3. After deployment, note the addresses of the deployed contracts for future reference.

## Future Improvements

- Add more test cases
- Add example case for upgrading the contract

## License

This project is licensed under the UNLICENSED license.
