import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

// INIT Capital Contract ABIs (from their documentation)
const INIT_CORE_ABI = [
  "function createPosition(address asset, uint256 amount) external returns (uint256)",
  "function getPosition(uint256 positionId) external view returns (tuple(address asset, uint256 amount, uint256 debt))",
  // Add other necessary functions from INIT documentation
];

export class InitCapitalService {
  private provider: ethers.providers.Web3Provider;
  private initCore: ethers.Contract;

  constructor() {
    this.provider = getProvider();
    // Using INIT Core contract address from their docs
    this.initCore = new ethers.Contract(
      "0x1234...INIT_CORE_ADDRESS", // Replace with actual address from INIT docs
      INIT_CORE_ABI,
      this.provider
    );
  }

  async createLendingPosition(asset: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const tx = await this.initCore.connect(signer).createPosition(asset, amount);
      return await tx.wait();
    } catch (error) {
      console.error("Error creating lending position:", error);
      throw error;
    }
  }

  async getPosition(positionId: number) {
    try {
      return await this.initCore.getPosition(positionId);
    } catch (error) {
      console.error("Error fetching position:", error);
      throw error;
    }
  }
} 