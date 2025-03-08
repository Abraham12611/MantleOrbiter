import { ethers } from 'ethers';
import { mantleSDK } from "@mantleio/sdk";

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

interface TransferParams {
  tokenAddress: string;
  recipient: string;
  amount: string;
}

interface BridgeParams {
  tokenAddress: string;
  amount: string;
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
    const signer = await this.provider!.getSigner();

    // MantleSwap contract address from deployment
    const SWAP_CONTRACT_ADDRESS = "0x..."; // Will be updated after deployment
    const amountInWei = ethers.parseUnits(params.amountIn, 18);
    const minAmountOut = amountInWei * BigInt(100 - params.slippage) / BigInt(100);

    // First approve the token spending
    const tokenContract = new ethers.Contract(
      params.tokenIn,
      ["function approve(address spender, uint256 amount) returns (bool)"],
      signer
    );

    // Approve the swap contract to spend tokens
    const approveTx = await tokenContract.approve(SWAP_CONTRACT_ADDRESS, amountInWei);
    await approveTx.wait();

    // Now execute the swap
    const swapContract = new ethers.Contract(
      SWAP_CONTRACT_ADDRESS,
      ["function swap(address tokenIn, address tokenOut, uint256 amountIn, uint256 minAmountOut) external returns (uint256)"],
      signer
    );

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

  async transferToken(params: TransferParams): Promise<TransactionResponse> {
    this.ensureProvider();
    await this.switchToMantleNetwork();
    const signer = await this.provider!.getSigner();

    const amountWei = ethers.utils.parseEther(params.amount);

    if (params.tokenAddress === "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000") {
      // Native MNT transfer
      const tx = await signer.sendTransaction({
        to: params.recipient,
        value: amountWei
      });
      return tx;
    } else {
      // ERC20 transfer
      const tokenContract = new ethers.Contract(
        params.tokenAddress,
        ["function transfer(address to, uint256 amount) returns (bool)"],
        signer
      );

      const tx = await tokenContract.transfer(params.recipient, amountWei);
      return tx;
    }
  }

  async bridgeDeposit(params: BridgeParams): Promise<TransactionResponse> {
    this.ensureProvider();
    const signer = await this.provider!.getSigner();
    
    const crossChainMessenger = new mantleSDK.CrossChainMessenger({
      l1ChainId: 5, // Goerli for testnet
      l2ChainId: 5003, // Mantle testnet
      l1SignerOrProvider: signer,
      l2SignerOrProvider: signer,
    });

    const amountWei = ethers.utils.parseEther(params.amount);

    // First approve the bridge to spend tokens
    const approveTx = await crossChainMessenger.approveERC20(
      params.tokenAddress,
      params.tokenAddress, // Same address for standard tokens
      amountWei
    );
    await approveTx.wait();

    // Execute the deposit
    const tx = await crossChainMessenger.depositERC20(
      params.tokenAddress,
      params.tokenAddress,
      amountWei
    );

    return tx;
  }

  async bridgeWithdraw(params: BridgeParams): Promise<TransactionResponse> {
    this.ensureProvider();
    const signer = await this.provider!.getSigner();
    
    const crossChainMessenger = new mantleSDK.CrossChainMessenger({
      l1ChainId: 5,
      l2ChainId: 5003,
      l1SignerOrProvider: signer,
      l2SignerOrProvider: signer,
    });

    const amountWei = ethers.utils.parseEther(params.amount);

    // Initiate withdrawal
    const tx = await crossChainMessenger.withdrawERC20(
      params.tokenAddress,
      params.tokenAddress,
      amountWei
    );

    return tx;
  }
}

// Export singleton instance
export const mantleService = new MantleService();

import { ethers } from "ethers";

export async function connectToMantle() {
  if (!window.ethereum) {
    throw new Error("MetaMask not installed");
  }

  // Using ethers.js v5 to connect to Mantle through MetaMask
  const provider = new ethers.providers.Web3Provider(window.ethereum);

  // Request account access
  await provider.send("eth_requestAccounts", []);

  // Get the signer
  const signer = provider.getSigner();

  return { provider, signer };
}