import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const mockNFTModule = buildModule("MockNFT", (m) => {
  const mockNFT = m.contract("MockNFT", ["MockNFT", "MNFT"]);

  return { mockNFT };
});

export default mockNFTModule;
