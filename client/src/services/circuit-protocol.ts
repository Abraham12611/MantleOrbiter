import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

// Circuit Protocol Vault ABI (from their documentation)
const CIRCUIT_VAULT_ABI = [
  "function deposit(uint256 _amount) external",
  "function withdraw(uint256 _shares) external",
  "function getPricePerFullShare() external view returns (uint256)",
  "function balanceOf(address account) external view returns (uint256)",
  // Additional functions from Circuit docs
];

export class CircuitProtocolService {
  private provider: ethers.providers.Web3Provider;
  
  constructor() {
    this.provider = getProvider();
  }

  async getVault(vaultAddress: string) {
    return new ethers.Contract(
      vaultAddress,
      CIRCUIT_VAULT_ABI,
      this.provider
    );
  }

  async depositToVault(vaultAddress: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const vault = await this.getVault(vaultAddress);
      const tx = await vault.connect(signer).deposit(amount);
      return await tx.wait();
    } catch (error) {
      console.error("Error depositing to vault:", error);
      throw error;
    }
  }

  async withdrawFromVault(vaultAddress: string, shares: string) {
    try {
      const signer = this.provider.getSigner();
      const vault = await this.getVault(vaultAddress);
      const tx = await vault.connect(signer).withdraw(shares);
      return await tx.wait();
    } catch (error) {
      console.error("Error withdrawing from vault:", error);
      throw error;
    }
  }
} 