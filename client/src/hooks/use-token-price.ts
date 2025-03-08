import { useQuery } from "@tanstack/react-query";

interface PriceResponse {
  price: number;
  change24h: number;
}

const PRICE_API_BASE = "https://api.mantle.xyz/v1/prices"; // Example API endpoint

export function useTokenPrice(tokenAddress: string) {
  return useQuery({
    queryKey: ['/api/prices', tokenAddress],
    queryFn: async () => {
      try {
        const response = await fetch(`${PRICE_API_BASE}/${tokenAddress}`);
        if (!response.ok) {
          throw new Error('Failed to fetch token price');
        }
        const data: PriceResponse = await response.json();
        return data;
      } catch (error) {
        console.error('Error fetching token price:', error);
        return null;
      }
    },
    enabled: Boolean(tokenAddress),
    refetchInterval: 30000, // Refresh every 30 seconds
  });
}
