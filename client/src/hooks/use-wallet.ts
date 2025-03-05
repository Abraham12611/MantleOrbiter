import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

declare global {
  interface Window {
    ethereum?: ethers.providers.ExternalProvider & {
      request: (args: { method: string; params?: any[] }) => Promise<any>;
    };
  }
}

export function useWallet() {
  const [address, setAddress] = useState<string | null>(null);
  const [connecting, setConnecting] = useState(false);
  const { toast } = useToast();

  const connect = useCallback(async () => {
    if (!window.ethereum) {
      toast({
        title: "Wallet Error",
        description: "Please install MetaMask or another Web3 wallet",
        variant: "destructive",
      });
      return false;
    }

    try {
      setConnecting(true);
      console.log("Requesting wallet connection...");

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const accounts = await provider.send("eth_requestAccounts", []);

      if (!accounts || accounts.length === 0) {
        throw new Error("No accounts found");
      }

      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();
      console.log("Got wallet address:", userAddress);

      // Switch to Mantle network
      try {
        console.log("Switching to Mantle network...");
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1388' }], // Mantle mainnet
        });
      } catch (error: any) {
        console.log("Network switch error:", error);
        // If the network doesn't exist, add it
        if (error.code === 4902) {
          console.log("Adding Mantle network...");
          await window.ethereum.request({
            method: 'wallet_addEthereumChain',
            params: [{
              chainId: '0x1388',
              chainName: 'Mantle',
              nativeCurrency: { name: 'MNT', symbol: 'MNT', decimals: 18 },
              rpcUrls: ['https://rpc.mantle.xyz'],
              blockExplorerUrls: ['https://explorer.mantle.xyz'],
            }],
          });
        } else {
          throw new Error("Failed to switch to Mantle network");
        }
      }

      // Set the address only after successful network switch
      setAddress(userAddress);
      console.log("Wallet connection successful");
      return true;

    } catch (error: any) {
      console.error("Wallet connection error:", error);
      toast({
        title: "Connection Error",
        description: error.message || "Failed to connect wallet",
        variant: "destructive",
      });
      return false;
    } finally {
      setConnecting(false);
    }
  }, [toast]);

  const disconnect = useCallback(() => {
    setAddress(null);
  }, []);

  return {
    address,
    connecting,
    connect,
    disconnect,
  };
}