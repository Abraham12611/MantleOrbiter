
import { ethers } from "hardhat";

async function main() {
  console.log("Starting deployment to Mantle Sepolia...");

  const MantleSwap = await ethers.getContractFactory("MantleSwap");
  console.log("Contract factory created, deploying MantleSwap...");

  const mantleSwap = await MantleSwap.deploy();
  console.log("Deployment transaction sent, waiting for confirmation...");

  await mantleSwap.deployed();

  console.log(`MantleSwap deployed successfully to: ${mantleSwap.address}`);
  console.log("You can now use this address in your frontend configuration");
}

main().catch((error) => {
  console.error("Deployment failed:", error);
  process.exitCode = 1;
});
