import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { InitCapitalService } from "@/services/init-capital";

const initService = new InitCapitalService();

const LENDING_TOKENS = [
  { symbol: "USDC", tokenId: "USDC" },
  { symbol: "WMNT", tokenId: "WMNT" },
  { symbol: "WETH", tokenId: "WETH" },
  { symbol: "USDT", tokenId: "USDT" }
];

export function InitAPYDashboard() {
  const [apyRates, setApyRates] = useState<{[key: string]: number}>({});
  const [loading, setLoading] = useState(true);

  // APY Tracking: Fetch current APY rates for all supported pools
  useEffect(() => {
    const fetchAPYRates = async () => {
      setLoading(true);
      try {
        const rates: {[key: string]: number} = {};
        for (const token of LENDING_TOKENS) {
          const apy = await initService.getPoolAPY(token.tokenId);
          rates[token.symbol] = apy;
        }
        setApyRates(rates);
      } catch (error) {
        console.error("Error fetching APY rates:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAPYRates();
    
    // Set up a refresh interval (every 5 minutes)
    const interval = setInterval(fetchAPYRates, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>INIT Capital APY Rates</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <p>Loading APY rates...</p>
        ) : (
          <div className="space-y-2">
            {LENDING_TOKENS.map((token) => (
              <div
                key={token.symbol}
                className="p-3 border rounded-md flex justify-between"
              >
                <span>{token.symbol}</span>
                <span className="font-medium">
                  {apyRates[token.symbol] !== undefined
                    ? `${(apyRates[token.symbol] * 100).toFixed(2)}%`
                    : "N/A"}
                </span>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 