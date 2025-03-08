import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

const LENDLE_MARKET_ABI = [
  "function supply(address asset, uint256 amount) external returns (bool)",
  "function borrow(address asset, uint256 amount) external returns (bool)",
  "function repayBorrow(address asset, uint256 amount) external returns (bool)",
  "function getAccountSnapshot(address account) external view returns (uint256, uint256, uint256)",
];

export class LendleService {
  private provider: ethers.providers.Web3Provider;
  private lendingPool: ethers.Contract;

  constructor() {
    this.provider = getProvider();
    this.lendingPool = new ethers.Contract(
      "0xLENDLE_POOL_ADDRESS", // Replace with actual address from Lendle docs
      LENDLE_MARKET_ABI,
      this.provider
    );
  }

  async supply(asset: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const tx = await this.lendingPool.connect(signer).supply(asset, amount);
      return await tx.wait();
    } catch (error) {
      console.error("Error supplying to Lendle:", error);
      throw error;
    }
  }

  async borrow(asset: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const tx = await this.lendingPool.connect(signer).borrow(asset, amount);
      return await tx.wait();
    } catch (error) {
      console.error("Error borrowing from Lendle:", error);
      throw error;
    }
  }
} 