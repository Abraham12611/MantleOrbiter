import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

const AGNI_POOL_ABI = [
  "function addLiquidity(address tokenA, address tokenB, uint amountADesired, uint amountBDesired, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB, uint liquidity)",
  "function removeLiquidity(address tokenA, address tokenB, uint liquidity, uint amountAMin, uint amountBMin, address to, uint deadline) external returns (uint amountA, uint amountB)",
  // Core functions from Agni docs
];

export class AgniFinanceService {
  private provider: ethers.providers.Web3Provider;
  private router: ethers.Contract;

  constructor() {
    this.provider = getProvider();
    this.router = new ethers.Contract(
      "0xAGNI_ROUTER_ADDRESS", // Replace with actual address from Agni docs
      AGNI_POOL_ABI,
      this.provider
    );
  }

  async addLiquidity(
    tokenA: string,
    tokenB: string,
    amountA: string,
    amountB: string
  ) {
    try {
      const signer = this.provider.getSigner();
      const deadline = Math.floor(Date.now() / 1000) + 60 * 20; // 20 minutes

      const tx = await this.router.connect(signer).addLiquidity(
        tokenA,
        tokenB,
        amountA,
        amountB,
        0, // amountAMin
        0, // amountBMin
        await signer.getAddress(),
        deadline
      );

      return await tx.wait();
    } catch (error) {
      console.error("Error adding liquidity:", error);
      throw error;
    }
  }
} 