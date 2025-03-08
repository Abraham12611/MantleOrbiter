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
  wait: () => Promise<ethers.providers.TransactionReceipt>;
}

/**
 * Service for handling Mantle Network transactions
 */
export class MantleService {
  private provider: ethers.providers.Web3Provider | null = null;
  private initialized = false;

  constructor() {
    this.initializeProvider();
  }

  private initializeProvider(): void {
    if (typeof window !== 'undefined' && window.ethereum) {
      this.provider = new ethers.providers.Web3Provider(window.ethereum);
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
    const signer = this.provider!.getSigner();

    // Example DEX contract address on Mantle Testnet
    const DEX_CONTRACT_ADDRESS = "0x..."; // Add actual DEX contract address
    const dexContract = new ethers.Contract(
      DEX_CONTRACT_ADDRESS,
      [
        "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256)",
      ],
      signer
    );

    // Calculate minimum amount out based on slippage
    const minAmountOut = ethers.utils.parseUnits(params.amountIn, 18)
      .mul(100 - params.slippage)
      .div(100);

    const tx = await dexContract.swap(
      params.tokenIn,
      params.tokenOut,
      ethers.utils.parseUnits(params.amountIn, 18),
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
    return ethers.utils.formatUnits(balance, 18);
  }

  /**
   * Estimate gas for a swap
   */
  async estimateSwapGas(params: SwapParams): Promise<string> {
    this.ensureProvider();
    await this.switchToMantleNetwork();
    const signer = this.provider!.getSigner();

    // Example DEX contract
    const DEX_CONTRACT_ADDRESS = "0x..."; // Add actual DEX contract address
    const dexContract = new ethers.Contract(
      DEX_CONTRACT_ADDRESS,
      [
        "function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256)",
      ],
      signer
    );

    const minAmountOut = ethers.utils.parseUnits(params.amountIn, 18)
      .mul(100 - params.slippage)
      .div(100);

    const gasEstimate = await dexContract.estimateGas.swap(
      params.tokenIn,
      params.tokenOut,
      ethers.utils.parseUnits(params.amountIn, 18),
      minAmountOut
    );

    return ethers.utils.formatUnits(gasEstimate, 'gwei');
  }
}

// Export singleton instance
export const mantleService = new MantleService();