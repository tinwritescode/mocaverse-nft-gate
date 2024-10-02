import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import { expect } from "chai";
import { ethers, upgrades } from "hardhat";
import { NFTGate } from "../typechain-types";

describe("NFTGate", function () {
  const MINIMUM_STAKE_DURATION = 7 * 24 * 60 * 60; // 1 week in seconds

  const setup = async () => {
    const [owner, addr1, addr2, addr3] = await ethers.getSigners();

    // Deploy a mock NFT contract
    const MockNFT = await ethers.getContractFactory("MockNFT");
    const mockNFT = await MockNFT.deploy("MockNFT", "MNFT");

    // Deploy NFTGate contract
    const NFTGate = await ethers.getContractFactory("NFTGate");
    const nftGate = (await upgrades.deployProxy(NFTGate, [
      MINIMUM_STAKE_DURATION,
      await mockNFT.getAddress(),
    ])) as unknown as NFTGate;

    return { owner, addr1, addr2, addr3, mockNFT, nftGate };
  };

  describe("Initialization", function () {
    it("Should set the correct minimum stake duration", async function () {
      const { nftGate } = await loadFixture(setup);
      expect(await nftGate.getMinimumStakeDuration()).to.equal(
        MINIMUM_STAKE_DURATION
      );
    });

    it("Should set the correct NFT contract address", async function () {
      const { nftGate, mockNFT } = await loadFixture(setup);

      expect(await nftGate.getNFTContractAddress()).to.equal(
        await mockNFT.getAddress()
      );
    });
  });

  describe("Staking", function () {
    it("Should allow staking an NFT", async function () {
      const { nftGate, mockNFT, addr1 } = await loadFixture(setup);

      await mockNFT.mint(addr1.address);
      await mockNFT.connect(addr1).approve(await nftGate.getAddress(), 1);
      await nftGate.connect(addr1).stakeNFT(1);

      const stakedNFT = await nftGate.getStakedNFT(addr1.address);
      expect(stakedNFT.tokenId).to.equal(1);
    });

    it("Should not allow staking an NFT that is not owned", async function () {
      const { nftGate, mockNFT, addr1, addr2 } = await loadFixture(setup);

      await mockNFT.mint(addr1.address);
      await expect(
        nftGate.connect(addr2).stakeNFT(1)
      ).to.be.revertedWithCustomError(nftGate, "NotNFTOwner");
    });
  });

  describe("Unstaking", function () {
    it("Should allow unstaking an NFT after the minimum duration", async function () {
      const { nftGate, mockNFT, addr1 } = await loadFixture(setup);

      await mockNFT.mint(addr1.address);
      await mockNFT.connect(addr1).approve(await nftGate.getAddress(), 1);
      await nftGate.connect(addr1).stakeNFT(1);

      await ethers.provider.send("evm_increaseTime", [MINIMUM_STAKE_DURATION]);
      await ethers.provider.send("evm_mine", []);

      await nftGate.connect(addr1).unstakeNFT(1);
      expect(await mockNFT.ownerOf(1)).to.equal(addr1.address);
    });
  });

  describe("Eligibility", function () {
    it("Should return true for eligible users", async function () {
      const { nftGate, mockNFT, addr1 } = await loadFixture(setup);

      await mockNFT.mint(addr1.address);
      await mockNFT.connect(addr1).approve(await nftGate.getAddress(), 1);
      await nftGate.connect(addr1).stakeNFT(1);

      await ethers.provider.send("evm_increaseTime", [MINIMUM_STAKE_DURATION]);
      await ethers.provider.send("evm_mine", []);

      expect(await nftGate.isEligible(addr1.address)).to.be.true;
    });

    it("Should return false for ineligible users", async function () {
      const { nftGate, addr2 } = await loadFixture(setup);

      expect(await nftGate.isEligible(addr2.address)).to.be.false;
    });

    it("Should not allow updating email if already registered", async function () {
      const { nftGate, addr1, addr2, addr3, mockNFT } = await loadFixture(
        setup
      );

      // mint
      await mockNFT.mint(addr1.address);
      await mockNFT.connect(addr1).approve(await nftGate.getAddress(), 1);
      await nftGate.connect(addr1).stakeNFT(1);

      await ethers.provider.send("evm_increaseTime", [MINIMUM_STAKE_DURATION]);
      await ethers.provider.send("evm_mine", []);

      await nftGate.connect(addr1).addDelegate(addr2.address);
      await nftGate.connect(addr1).addDelegate(addr3.address);

      // register email
      await nftGate
        .connect(addr2)
        .registerEmail("test@example.com", addr1.address);

      // try to register email
      await expect(
        nftGate.connect(addr3).registerEmail("test@example.com", addr1.address)
      ).to.be.revertedWithCustomError(nftGate, "EmailAlreadyRegistered");
    });
  });
});
