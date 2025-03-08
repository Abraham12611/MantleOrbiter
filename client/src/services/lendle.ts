import { ethers } from "ethers";
import { getProvider } from "@/lib/web3";

// Lendle Contract ABIs
const LENDING_POOL_ABI = [
  "function supply(address asset, uint256 amount, address onBehalfOf, uint16 referralCode) external",
  "function withdraw(address asset, uint256 amount, address to) external returns (uint256)",
  "function borrow(address asset, uint256 amount, uint256 interestRateMode, uint16 referralCode, address onBehalfOf) external",
  "function repay(address asset, uint256 amount, uint256 interestRateMode, address onBehalfOf) external returns (uint256)",
  "function getUserAccountData(address user) external view returns (uint256 totalCollateralETH, uint256 totalDebtETH, uint256 availableBorrowsETH, uint256 currentLiquidationThreshold, uint256 ltv, uint256 healthFactor)",
  "function getReserveData(address asset) external view returns (tuple(uint256 availableLiquidity, uint256 totalStableDebt, uint256 totalVariableDebt, uint256 liquidityRate, uint256 variableBorrowRate, uint256 stableBorrowRate, uint256 averageStableBorrowRate, uint256 liquidityIndex, uint256 variableBorrowIndex, uint40 lastUpdateTimestamp))"
];

// Contract addresses from Lendle documentation
const LENDLE_ADDRESSES = {
  LENDING_POOL: "0x37D7C349CE2667BCCE6894839379C908c1942be2",
  TOKENS: {
    USDC: "0xUSDC_ADDRESS",
    MNT: "0xMNT_ADDRESS"
  },
  INTEREST_RATE_MODE: {
    STABLE: 1,
    VARIABLE: 2
  }
};

export class LendleService {
  private provider: ethers.providers.Web3Provider;
  private lendingPool: ethers.Contract;

  constructor() {
    this.provider = getProvider();
    this.lendingPool = new ethers.Contract(
      LENDLE_ADDRESSES.LENDING_POOL,
      LENDING_POOL_ABI,
      this.provider
    );
  }

  // Asset Supply: Deposit assets to earn yield
  async supply(asset: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      
      // First approve the lending pool to spend tokens
      const erc20Abi = ["function approve(address spender, uint256 amount) returns (bool)"];
      const tokenContract = new ethers.Contract(asset, erc20Abi, signer);
      const approveTx = await tokenContract.approve(LENDLE_ADDRESSES.LENDING_POOL, amountWei);
      await approveTx.wait();
      
      // Now supply the assets to the lending pool
      const tx = await this.lendingPool.connect(signer).supply(
        asset,
        amountWei,
        await signer.getAddress(), // onBehalfOf = self
        0 // referralCode = 0
      );
      
      return await tx.wait();
    } catch (error) {
      console.error("Error supplying assets:", error);
      throw error;
    }
  }

  // Asset Borrowing: Borrow assets using deposits as collateral
  async borrow(asset: string, amount: string, interestRateMode: number = LENDLE_ADDRESSES.INTEREST_RATE_MODE.VARIABLE) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      
      const tx = await this.lendingPool.connect(signer).borrow(
        asset,
        amountWei,
        interestRateMode,
        0, // referralCode = 0
        await signer.getAddress() // onBehalfOf = self
      );
      
      return await tx.wait();
    } catch (error) {
      console.error("Error borrowing assets:", error);
      throw error;
    }
  }

  // Repayment: Repay borrowed assets
  async repay(asset: string, amount: string, interestRateMode: number = LENDLE_ADDRESSES.INTEREST_RATE_MODE.VARIABLE) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      
      // First approve the lending pool to spend tokens for repayment
      const erc20Abi = ["function approve(address spender, uint256 amount) returns (bool)"];
      const tokenContract = new ethers.Contract(asset, erc20Abi, signer);
      const approveTx = await tokenContract.approve(LENDLE_ADDRESSES.LENDING_POOL, amountWei);
      await approveTx.wait();
      
      // Now repay the borrowed amount
      const tx = await this.lendingPool.connect(signer).repay(
        asset,
        amountWei,
        interestRateMode,
        await signer.getAddress() // onBehalfOf = self
      );
      
      return await tx.wait();
    } catch (error) {
      console.error("Error repaying loan:", error);
      throw error;
    }
  }

  // Withdraw: Withdraw supplied assets
  async withdraw(asset: string, amount: string) {
    try {
      const signer = this.provider.getSigner();
      const amountWei = ethers.utils.parseUnits(amount, 18);
      
      const tx = await this.lendingPool.connect(signer).withdraw(
        asset,
        amountWei,
        await signer.getAddress() // to = self
      );
      
      return await tx.wait();
    } catch (error) {
      console.error("Error withdrawing assets:", error);
      throw error;
    }
  }

  // Position Tracking: Get user's lending position data
  async getUserAccountData(userAddress: string) {
    try {
      const data = await this.lendingPool.getUserAccountData(userAddress);
      
      return {
        totalCollateralETH: ethers.utils.formatEther(data.totalCollateralETH),
        totalDebtETH: ethers.utils.formatEther(data.totalDebtETH),
        availableBorrowsETH: ethers.utils.formatEther(data.availableBorrowsETH),
        currentLiquidationThreshold: data.currentLiquidationThreshold.toString(),
        ltv: data.ltv.toString(),
        healthFactor: ethers.utils.formatEther(data.healthFactor)
      };
    } catch (error) {
      console.error("Error getting user account data:", error);
      throw error;
    }
  }

  // Interest Rate Monitoring: Get current interest rates for an asset
  async getReserveInterestRates(asset: string) {
    try {
      const data = await this.lendingPool.getReserveData(asset);
      
      return {
        supplyAPY: ethers.utils.formatUnits(data.liquidityRate, 27),
        variableBorrowAPY: ethers.utils.formatUnits(data.variableBorrowRate, 27),
        stableBorrowAPY: ethers.utils.formatUnits(data.stableBorrowRate, 27)
      };
    } catch (error) {
      console.error("Error getting reserve interest rates:", error);
      throw error;
    }
  }
} 