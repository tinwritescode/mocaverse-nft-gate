// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

interface INFTGate {
    // Events
    event NFTStaked(address indexed user, uint256 tokenId, uint256 stakedAt);
    event NFTUnstaked(address indexed user, uint256 tokenId);
    event EmailRegistered(address indexed user, string email);
    event DelegateAdded(address indexed owner, address indexed delegate);
    event DelegateRemoved(address indexed owner, address indexed delegate);

    // Structs
    struct StakedNFT {
        uint256 tokenId;
        uint256 stakedAt;
    }

    // Functions
    function stakeNFT(uint256 tokenId) external;
    function unstakeNFT(uint256 tokenId) external;
    function registerEmail(string calldata email, address account) external;
    function addDelegate(address delegate) external;
    function removeDelegate(address delegate) external;
    function isEligible(address user) external view returns (bool);
    function getStakedNFT(
        address user
    ) external view returns (StakedNFT memory);
    function isDelegateOf(
        address owner,
        address delegate
    ) external view returns (bool);
    function getRegisteredEmail(
        address user
    ) external view returns (string memory);
    function isAllowed(address user) external view returns (bool);
}
