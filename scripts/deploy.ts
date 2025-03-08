import { ethers } from "hardhat";

async function main() {
  const MantleSwap = await ethers.getContractFactory("MantleSwap");
  const mantleSwap = await MantleSwap.deploy();
  await mantleSwap.waitForDeployment();

  console.log(`MantleSwap deployed to ${await mantleSwap.getAddress()}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
