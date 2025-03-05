import { useState, useCallback } from 'react';
import { ethers } from 'ethers';
import { useToast } from '@/hooks/use-toast';

// Add type declaration for window.ethereum
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

      // Request account access
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      // Switch to Mantle network
      try {
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: '0x1388' }], // Mantle mainnet
        });
      } catch (error: any) {
        // If the network doesn't exist, add it
        if (error.code === 4902) {
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
          throw error;
        }
      }

      // Set the address only after successful network switch
      setAddress(userAddress);
      return true;

    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message,
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