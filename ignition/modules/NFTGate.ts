import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";
import mockNFTModule from "./MockNFT";

const proxyModule = buildModule("NFTGate", (m) => {
  const proxyAdminOwner = m.getAccount(0);
  const nftGate = m.contract("NFTGate", [], {
    after: [],
  });

  const minimumStakeDuration = 100;

  const data = m.encodeFunctionCall(nftGate, "initialize", [
    minimumStakeDuration,
    m.useModule(mockNFTModule).mockNFT,
  ]);

  const proxy = m.contract("TransparentUpgradeableProxy", [
    nftGate,
    proxyAdminOwner,
    data,
  ]);

  const proxyAdminAddress = m.readEventArgument(
    proxy,
    "AdminChanged",
    "newAdmin"
  );

  const proxyAdmin = m.contractAt("ProxyAdmin", proxyAdminAddress);

  // m.call(nftGate, "initialize", [
  //   m.useModule(mockNFTModule).mockNFT,
  //   proxyAdminOwner,
  // ]);

  return { proxyAdmin, proxy, nftGate };
});

export default proxyModule;
