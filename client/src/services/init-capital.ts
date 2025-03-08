import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

// INIT Capital Contract ABIs
const INIT_CORE_ABI = [
  "function createPosition(address asset, uint256 amount) external returns (uint256)",
  "function getPosition(uint256 positionId) external view returns (tuple(address asset, uint256 amount, uint256 debt))",
  "function addCollateral(uint256 positionId, uint256 amount) external",
  "function removeCollateral(uint256 positionId, uint256 amount) external",
  "function borrow(uint256 positionId, uint256 amount) external",
  "function repay(uint256 positionId, uint256 amount) external",
  "function changeMode(uint256 positionId, uint8 mode) external",
  "function liquidatePosition(uint256 positionId, uint256 repayAmount) external"
];

const LENDING_POOL_ABI = [
  "function deposit(uint256 amount) external",
  "function withdraw(uint256 amount) external",
  "function getAPY() external view returns (uint256)"
];

// Contract addresses from INIT documentation
const INIT_ADDRESSES = {
  CORE: "0x972BcB0284cca0152527c4f70f8F689852bCAFc5",
  LENDING_POOLS: {
    USDC: "0x00A55649E597d463fD212fBE48a3B40f0E227d06",
    WMNT: "0x44949636f778fAD2b139E665aee11a2dc84A2976",
    WETH: "0x51AB74f8B03F0305d8dcE936B473AB587911AEC4",
    USDT: "0xadA66a8722B5cdfe3bC504007A5d793e7100ad09"
  }
};

export class InitCapitalService {
  private provider: ethers.providers.Web3Provider;
  private initCore: ethers.Contract;
  private lendingPools: Map<string, ethers.Contract>;

  constructor() {
    this.provider = getProvider();
    this.initCore = new ethers.Contract(
      INIT_ADDRESSES.CORE,
      INIT_CORE_ABI,
      this.provider
    );
    
    // Initialize lending pool contracts
    this.lendingPools = new Map();
    Object.entries(INIT_ADDRESSES.LENDING_POOLS).forEach(([token, address]) => {
      this.lendingPools.set(
        token,
        new ethers.Contract(address, LENDING_POOL_ABI, this.provider)
      );
    });
  }

  async createLendingPosition(asset: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      const tx = await this.initCore.connect(signer).createPosition(asset, amountWei);
      return await tx.wait();
    } catch (error) {
      console.error("Error creating lending position:", error);
      throw error;
    }
  }

  async getPosition(positionId: number) {
    try {
      const position = await this.initCore.getPosition(positionId);
      return {
        asset: position.asset,
        amount: ethers.utils.formatUnits(position.amount, 18),
        debt: ethers.utils.formatUnits(position.debt, 18)
      };
    } catch (error) {
      console.error("Error fetching position:", error);
      throw error;
    }
  }

  async addCollateral(positionId: number, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      const tx = await this.initCore.connect(signer).addCollateral(positionId, amountWei);
      return await tx.wait();
    } catch (error) {
      console.error("Error adding collateral:", error);
      throw error;
    }
  }

  async borrow(positionId: number, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      const tx = await this.initCore.connect(signer).borrow(positionId, amountWei);
      return await tx.wait();
    } catch (error) {
      console.error("Error borrowing:", error);
      throw error;
    }
  }

  async repay(positionId: number, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      const tx = await this.initCore.connect(signer).repay(positionId, amountWei);
      return await tx.wait();
    } catch (error) {
      console.error("Error repaying:", error);
      throw error;
    }
  }

  async getPoolAPY(token: string): Promise<number> {
    try {
      const pool = this.lendingPools.get(token);
      if (!pool) throw new Error("Pool not found");
      const apy = await pool.getAPY();
      return Number(ethers.utils.formatUnits(apy, 18));
    } catch (error) {
      console.error("Error getting pool APY:", error);
      throw error;
    }
  }
} 