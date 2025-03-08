import { ethers } from 'ethers';

// Mantle Network Configuration
const MANTLE_TESTNET_CONFIG = {
  chainId: '0x1389', // Mantle Sepolia Testnet
  chainName: 'Mantle Sepolia',
  nativeCurrency: {
    name: 'MNT',
    symbol: 'MNT',
    decimals: 18
  },
  rpcUrls: ['https://rpc.sepolia.mantle.xyz'],
  blockExplorerUrls: ['https://explorer.sepolia.mantle.xyz']
};

interface SwapParams {
  tokenIn: string;
  tokenOut: string;
  amountIn: string;
  slippage: number;
}

export interface TransactionResponse {
  hash: string;
  wait: () => Promise<ethers.ContractTransactionReceipt>;
}

/**
 * Service for handling Mantle Network transactions
 */
export class MantleService {
  private provider: ethers.BrowserProvider | null = null;
  private initialized = false;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.BrowserProvider(window.ethereum);
      this.initialized = true;
    }
  }

  private ensureProvider(): void {
    if (!this.initialized) {
      this.initializeProvider();
    }
    if (!this.provider) {
      throw new Error("Please install MetaMask to use this feature");
    }
  }

  /**
   * Check if MetaMask is installed
   */
  isMetaMaskInstalled(): boolean {
    return this.initialized && this.provider !== null;
  }

  /**
   * Switch to Mantle Testnet
   */
  async switchToMantleNetwork(): Promise<void> {
    this.ensureProvider();
    try {
      await window.ethereum?.request({
        method: 'wallet_switchEthereumChain',
        params: [{ chainId: MANTLE_TESTNET_CONFIG.chainId }],
      });
    } catch (error: any) {
      if (error.code === 4902) {
        await window.ethereum?.request({
          method: 'wallet_addEthereumChain',
          params: [MANTLE_TESTNET_CONFIG],
        });
      } else {
        throw error;
      }
    }
  }

  /**
   * Execute a token swap on Mantle Network using smart contract
   */
  async executeSwap(params: SwapParams): Promise<TransactionResponse> {
    this.ensureProvider();
    await this.switchToMantleNetwork();
    const signer = await this.provider!.getSigner();

    // MantleSwap contract address from deployment
    const SWAP_CONTRACT_ADDRESS = "0x..."; // Will be updated after deployment
    const swapContract = new ethers.Contract(
      SWAP_CONTRACT_ADDRESS,
      [
        "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256)",
      ],
      signer
    );

    // Calculate minimum amount out based on slippage
    const amountInWei = ethers.parseUnits(params.amountIn, 18);
    const minAmountOut = amountInWei * BigInt(100 - params.slippage) / BigInt(100);

    const tx = await swapContract.swap(
      params.tokenIn,
      params.tokenOut,
      amountInWei,
      minAmountOut
    );

    return tx;
  }

  /**
   * Get token balance
   */
  async getTokenBalance(tokenAddress: string, address: string): Promise<string> {
    this.ensureProvider();
    const tokenContract = new ethers.Contract(
      tokenAddress,
      ["function balanceOf(address) view returns (uint256)"],
      this.provider
    );

    const balance = await tokenContract.balanceOf(address);
    return ethers.formatUnits(balance, 18);
  }

  /**
   * Estimate gas for a swap
   */
  async estimateSwapGas(params: SwapParams): Promise<string> {
    this.ensureProvider();
    await this.switchToMantleNetwork();
    const signer = await this.provider!.getSigner();

    const SWAP_CONTRACT_ADDRESS = "0x..."; // Will be updated after deployment
    const swapContract = new ethers.Contract(
      SWAP_CONTRACT_ADDRESS,
      [
        "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256)",
      ],
      signer
    );

    const amountInWei = ethers.parseUnits(params.amountIn, 18);
    const minAmountOut = amountInWei * BigInt(100 - params.slippage) / BigInt(100);

    const gasEstimate = await swapContract.swap.estimateGas(
      params.tokenIn,
      params.tokenOut,
      amountInWei,
      minAmountOut
    );

    return ethers.formatUnits(gasEstimate, 'gwei');
  }
}

// Export singleton instance
export const mantleService = new MantleService();