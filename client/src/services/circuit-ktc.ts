import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

const KTC_VAULT_ABI = [
  "function deposit(uint256 _amount) external",
  "function withdraw(uint256 _shares) external",
  "function getPricePerFullShare() external view returns (uint256)",
  "function calculateHarvestKTCRewards() external view returns (uint256)",
];

export class CircuitKTCService {
  private provider: ethers.providers.Web3Provider;
  private ktcVault: ethers.Contract;

  constructor() {
    this.provider = getProvider();
    // KTC Vault address from Circuit docs
    this.ktcVault = new ethers.Contract(
      "0xKTC_VAULT_ADDRESS", // Replace with actual address from docs
      KTC_VAULT_ABI,
      this.provider
    );
  }

  async depositKTC(amount: string) {
    try {
      const signer = this.provider.getSigner();
      const tx = await this.ktcVault.connect(signer).deposit(amount);
      return await tx.wait();
    } catch (error) {
      console.error("Error depositing to KTC vault:", error);
      throw error;
    }
  }

  async getKTCRewards() {
    try {
      return await this.ktcVault.calculateHarvestKTCRewards();
    } catch (error) {
      console.error("Error getting KTC rewards:", error);
      throw error;
    }
  }
} 