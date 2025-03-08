
import { ethers } from "ethers";

// Create a provider compatible with ethers v5
export function getProvider() {
  // Check if window.ethereum is available
  if (typeof window !== "undefined" && window.ethereum) {
    // Use Web3Provider for ethers v5
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  
  // Fallback to a JSON-RPC provider (Mantle Sepolia testnet)
  return new ethers.providers.JsonRpcProvider("https://rpc.sepolia.mantle.xyz");
}

// Get a signer from the provider
export function getSigner() {
  const provider = getProvider();
  return provider.getSigner();
}

// Connect wallet function
export async function connectWallet() {
  if (typeof window !== "undefined" && window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: "eth_requestAccounts" });
      return getProvider();
    } catch (error) {
      console.error("User denied account access", error);
      throw error;
    }
  } else {
    throw new Error("No ethereum wallet found. Please install MetaMask.");
  }
}
