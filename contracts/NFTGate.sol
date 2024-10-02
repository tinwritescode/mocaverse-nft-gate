// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.27;

import {INFTGate} from "./interfaces/INFTGate.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/proxy/utils/Initializable.sol";

contract NFTGate is INFTGate, Initializable, OwnableUpgradeable {
    IERC721Upgradeable private _nftContract;
    mapping(address => StakedNFT) private _stakedNFTs;
    mapping(address => string) private _registeredEmails;
    mapping(address => mapping(address => bool)) private _delegates;
    uint256 private _minimumStakeDuration;

    error InvalidNFTAddress();
    error NFTContractNotSet();
    error NotNFTOwner();
    error NFTNotStaked();
    error NotAuthorized();
    error InvalidDelegateAddress();
    error NotDelegate();
    error EmailAlreadyRegistered();

    /// @custom:oz-upgrades-unsafe-allow constructor
    constructor() {
        _disableInitializers();
    }

    function initialize(
        uint256 minimumStakeDuration,
        address nftAddress
    ) public initializer {
        __Ownable_init();
        _minimumStakeDuration = minimumStakeDuration;

        if (nftAddress == address(0)) revert InvalidNFTAddress();
        _nftContract = IERC721Upgradeable(nftAddress);
    }

    function stakeNFT(uint256 tokenId) external override {
        if (address(_nftContract) == address(0)) revert NFTContractNotSet();
        if (_nftContract.ownerOf(tokenId) != msg.sender) revert NotNFTOwner();

        _nftContract.transferFrom(msg.sender, address(this), tokenId);
        _stakedNFTs[msg.sender] = StakedNFT(tokenId, block.timestamp);

        emit NFTStaked(msg.sender, tokenId, block.timestamp);
    }

    function unstakeNFT(uint256 tokenId) external override {
        if (_stakedNFTs[msg.sender].tokenId != tokenId) revert NFTNotStaked();

        delete _stakedNFTs[msg.sender];
        _nftContract.transferFrom(address(this), msg.sender, tokenId);

        emit NFTUnstaked(msg.sender, tokenId);
    }

    function registerEmail(string calldata email, address account) external {
        if (msg.sender != account && !_delegates[account][msg.sender])
            revert NotAuthorized();

        if (bytes(_registeredEmails[account]).length != 0)
            revert EmailAlreadyRegistered();

        _registeredEmails[account] = email;
        emit EmailRegistered(account, email);
    }

    function addDelegate(address delegate) external override {
        if (delegate == address(0)) revert InvalidDelegateAddress();
        _delegates[msg.sender][delegate] = true;
        emit DelegateAdded(msg.sender, delegate);
    }

    function removeDelegate(address delegate) external override {
        if (!_delegates[msg.sender][delegate]) revert NotDelegate();
        _delegates[msg.sender][delegate] = false;
        emit DelegateRemoved(msg.sender, delegate);
    }

    function isEligible(address user) external view override returns (bool) {
        return _stakedNFTs[user].tokenId != 0;
    }

    function getStakedNFT(
        address user
    ) external view override returns (StakedNFT memory) {
        return _stakedNFTs[user];
    }

    function isDelegateOf(
        address owner,
        address delegate
    ) external view override returns (bool) {
        return _delegates[owner][delegate];
    }

    function getRegisteredEmail(
        address user
    ) external view override returns (string memory) {
        return _registeredEmails[user];
    }

    function isAllowed(address user) external view override returns (bool) {
        StakedNFT memory stakedNFT = _stakedNFTs[user];
        return
            stakedNFT.tokenId != 0 &&
            block.timestamp >= stakedNFT.stakedAt + _minimumStakeDuration;
    }

    function getMinimumStakeDuration() external view returns (uint256) {
        return _minimumStakeDuration;
    }

    function getNFTContractAddress() external view returns (address) {
        return address(_nftContract);
    }

    function setMinimumStakeDuration(uint256 duration) external onlyOwner {
        _minimumStakeDuration = duration;
    }
}
