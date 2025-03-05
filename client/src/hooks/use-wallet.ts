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
      return;
    }

    try {
      setConnecting(true);
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      await provider.send("eth_requestAccounts", []);
      const signer = provider.getSigner();
      const address = await signer.getAddress();
      setAddress(address);

      // Switch to Mantle network
      try {
        if (window.ethereum?.request) {
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: '0x1388' }], // Mantle mainnet
          });
        }
      } catch (error: any) {
        if (error.code === 4902 && window.ethereum?.request) {
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
        }
      }
    } catch (error: any) {
      toast({
        title: "Connection Error",
        description: error.message,
        variant: "destructive",
      });
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