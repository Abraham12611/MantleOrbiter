import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";
import { useToast } from "@/hooks/use-toast";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export function useTokenBalance(tokenAddress: string, userAddress: string | undefined) {
  const { toast } = useToast();

  return useQuery({
    queryKey: ['/api/balances', tokenAddress, userAddress],
    queryFn: async () => {
      if (!tokenAddress || !userAddress) return null;

      try {
        // First verify we have access to the provider
        if (!window.ethereum) {
          throw new Error('MetaMask not installed');
        }

        const provider = new ethers.providers.Web3Provider(window.ethereum);

        // Check if we're on Mantle Sepolia
        const network = await provider.getNetwork();
        console.log('Current network:', network);

        if (network.chainId !== 5003) { // Mantle Sepolia chainId
          throw new Error('Please switch to Mantle Sepolia network');
        }

        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);

        const [balance, decimals, symbol] = await Promise.all([
          tokenContract.balanceOf(userAddress),
          tokenContract.decimals(),
          tokenContract.symbol()
        ]).catch(error => {
          console.error('Contract call error:', error);
          throw error;
        });

        const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        console.log('Token details:', {
          address: tokenAddress,
          symbol,
          decimals,
          rawBalance: balance.toString(),
          formattedBalance
        });

        return {
          balance: formattedBalance,
          formatted: `${Number(formattedBalance).toFixed(4)}`,
          symbol
        };
      } catch (error: any) {
        console.error('Error fetching token balance:', error);

        // Show toast for network and connection errors
        if (error.message.includes('network') || 
            error.message.includes('MetaMask') || 
            error.message.includes('contract')) {
          toast({
            title: "Connection Error",
            description: error.message,
            variant: "destructive",
          });
        }

        return null;
      }
    },
    enabled: Boolean(tokenAddress && userAddress),
    refetchInterval: 10000 // Refresh every 10 seconds
  });
}