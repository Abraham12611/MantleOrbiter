
import { ethers } from "ethers";

// Ethers v5 provider setup
export const getProvider = () => {
  if (window.ethereum) {
    return new ethers.providers.Web3Provider(window.ethereum);
  }
  return null;
};

export const getSigner = () => {
  const provider = getProvider();
  return provider ? provider.getSigner() : null;
};

export const connectWallet = async () => {
  try {
    const provider = getProvider();
    if (provider) {
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      return { success: true, address };
    } else {
      return { 
        success: false, 
        error: "No Ethereum provider found. Please install MetaMask or another wallet."
      };
    }
  } catch (error) {
    console.error("Error connecting wallet:", error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : "Unknown error connecting wallet" 
    };
  }
};

// Helper for contract interactions
export const getContract = (address, abi) => {
  const signer = getSigner();
  if (!signer) return null;
  
  return new ethers.Contract(address, abi, signer);
};
