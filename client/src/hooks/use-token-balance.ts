import { useQuery } from "@tanstack/react-query";
import { ethers } from "ethers";

const ERC20_ABI = [
  "function balanceOf(address owner) view returns (uint256)",
  "function decimals() view returns (uint8)",
  "function symbol() view returns (string)"
];

export function useTokenBalance(tokenAddress: string, userAddress: string | undefined) {
  return useQuery({
    queryKey: ['/api/balances', tokenAddress, userAddress],
    queryFn: async () => {
      if (!tokenAddress || !userAddress) return null;

      try {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const tokenContract = new ethers.Contract(tokenAddress, ERC20_ABI, provider);
        
        const [balance, decimals] = await Promise.all([
          tokenContract.balanceOf(userAddress),
          tokenContract.decimals()
        ]);

        const formattedBalance = ethers.utils.formatUnits(balance, decimals);
        return {
          balance: formattedBalance,
          formatted: `${Number(formattedBalance).toFixed(4)}`
        };
      } catch (error) {
        console.error('Error fetching token balance:', error);
        return null;
      }
    },
    enabled: Boolean(tokenAddress && userAddress),
    refetchInterval: 10000 // Refresh every 10 seconds
  });
}
