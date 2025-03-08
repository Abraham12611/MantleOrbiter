import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { LendleService } from "@/services/lendle";
import { useWallet } from "@/hooks/use-wallet";
import { Loader2 } from "lucide-react";

const lendleService = new LendleService();

// Available assets on Lendle
const LENDLE_ASSETS = [
  {
    symbol: "USDC",
    address: "0xUSDC_ADDRESS",
  },
  {
    symbol: "MNT",
    address: "0xMNT_ADDRESS",
  }
];

interface UserAccountData {
  totalCollateralETH: string;
  totalDebtETH: string;
  availableBorrowsETH: string;
  healthFactor: string;
}

interface InterestRates {
  [key: string]: {
    supplyAPY: string;
    variableBorrowAPY: string;
    stableBorrowAPY: string;
  };
}

export function LendlePositionDashboard() {
  const { address } = useWallet();
  const [accountData, setAccountData] = useState<UserAccountData | null>(null);
  const [interestRates, setInterestRates] = useState<InterestRates>({});
  const [loading, setLoading] = useState(true);

  // Position Tracking: Load user account data and interest rates
  useEffect(() => {
    const fetchData = async () => {
      if (!address) return;
      
      setLoading(true);
      try {
        // Fetch user position data
        const data = await lendleService.getUserAccountData(address);
        setAccountData(data);
        
        // Fetch interest rates for all supported assets
        const rates: InterestRates = {};
        for (const asset of LENDLE_ASSETS) {
          const assetRates = await lendleService.getReserveInterestRates(asset.address);
          rates[asset.symbol] = assetRates;
        }
        setInterestRates(rates);
      } catch (error) {
        console.error("Error fetching Lendle data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
    
    // Set up a refresh interval (every 5 minutes)
    const interval = setInterval(fetchData, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, [address]);

  // Format percentage for display
  const formatPercent = (value: string) => {
    return `${(parseFloat(value) * 100).toFixed(2)}%`;
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lendle Position Dashboard</CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center py-6">
            <Loader2 className="h-8 w-8 animate-spin" />
          </div>
        ) : (
          <>
            {/* Position Tracking: User's lending position */}
            {accountData && (
              <div className="mb-6 space-y-1">
                <h3 className="font-medium">Your Position</h3>
                <div className="grid grid-cols-2 gap-2">
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">Total Collateral</div>
                    <div className="font-medium">{parseFloat(accountData.totalCollateralETH).toFixed(4)} ETH</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">Total Debt</div>
                    <div className="font-medium">{parseFloat(accountData.totalDebtETH).toFixed(4)} ETH</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">Available to Borrow</div>
                    <div className="font-medium">{parseFloat(accountData.availableBorrowsETH).toFixed(4)} ETH</div>
                  </div>
                  <div className="p-3 border rounded-md">
                    <div className="text-sm text-muted-foreground">Health Factor</div>
                    <div className="font-medium">{parseFloat(accountData.healthFactor).toFixed(2)}</div>
                  </div>
                </div>
              </div>
            )}

            {/* Interest Rate Monitoring: Current interest rates for all assets */}
            <div>
              <h3 className="font-medium mb-2">Interest Rates</h3>
              <div className="space-y-3">
                {Object.entries(interestRates).map(([symbol, rates]) => (
                  <div key={symbol} className="p-3 border rounded-md">
                    <div className="font-medium mb-1">{symbol}</div>
                    <div className="grid grid-cols-3 gap-2 text-sm">
                      <div>
                        <div className="text-muted-foreground">Supply APY</div>
                        <div>{formatPercent(rates.supplyAPY)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Variable Borrow</div>
                        <div>{formatPercent(rates.variableBorrowAPY)}</div>
                      </div>
                      <div>
                        <div className="text-muted-foreground">Stable Borrow</div>
                        <div>{formatPercent(rates.stableBorrowAPY)}</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
} 