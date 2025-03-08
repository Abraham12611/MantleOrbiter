import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LendleService } from "@/services/lendle";
import { Loader2 } from "lucide-react";

const lendleService = new LendleService();

const LENDLE_ASSETS = [
  {
    symbol: "USDC",
    address: "0xUSDC_ADDRESS",
    icon: "💵"
  },
  {
    symbol: "MNT",
    address: "0xMNT_ADDRESS",
    icon: "🔷"
  }
];

interface AssetMarketData {
  symbol: string;
  icon: string;
  supplyAPY: string;
  variableBorrowAPY: string;
  stableBorrowAPY: string;
}

export function LendleMarketOverview() {
  const [marketData, setMarketData] = useState<AssetMarketData[]>([]);
  const [loading, setLoading] = useState(true);

  // Interest Rate Monitoring: Fetch market data for all assets
  useEffect(() => {
    const fetchMarketData = async () => {
      setLoading(true);
      try {
        const data: AssetMarketData[] = [];
        
        for (const asset of LENDLE_ASSETS) {
          const rates = await lendleService.getReserveInterestRates(asset.address);
          
          data.push({
            symbol: asset.symbol,
            icon: asset.icon,
            supplyAPY: rates.supplyAPY,
            variableBorrowAPY: rates.variableBorrowAPY,
            stableBorrowAPY: rates.stableBorrowAPY
          });
        }
        
        setMarketData(data);
      } catch (error) {
        console.error("Error fetching Lendle market data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMarketData();
    
    // Refresh market data every 5 minutes
    const interval = setInterval(fetchMarketData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Format percentage for display
  const formatPercent = (value: string) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lendle Market Overview</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <div className="space-y-1">
            <div className="grid grid-cols-4 text-sm text-muted-foreground mb-2 px-3">
              <div>Asset</div>
              <div>Supply APY</div>
              <div>Variable Borrow</div>
              <div>Stable Borrow</div>
            </div>
            
            {marketData.map((asset) => (
              <div 
                key={asset.symbol} 
                className="grid grid-cols-4 items-center p-3 border rounded-md hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-center gap-2">
                  <span>{asset.icon}</span>
                  <span className="font-medium">{asset.symbol}</span>
                </div>
                <div className="text-green-600">{formatPercent(asset.supplyAPY)}</div>
                <div className="text-red-600">{formatPercent(asset.variableBorrowAPY)}</div>
                <div className="text-red-600">{formatPercent(asset.stableBorrowAPY)}</div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
} 