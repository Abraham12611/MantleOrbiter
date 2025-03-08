import { useTokenBalance } from "@/hooks/use-token-balance";
import { useWallet } from "@/hooks/use-wallet";
import { Card } from "@/components/ui/card";
import { useEffect, useState } from "react";
import { ethers } from "ethers";

// SepoliaMNT token address
const SEPOLIA_MNT_ADDRESS = "0x65e37B558F64E2Be5768DB46DF22F93d85741A9E";

export default function WalletBalance() {
  const { address } = useWallet();
  const { data: balance, isLoading, error } = useTokenBalance(SEPOLIA_MNT_ADDRESS, address);
  const [networkInfo, setNetworkInfo] = useState<{ chainId: number; name: string } | null>(null);

  useEffect(() => {
    async function checkNetwork() {
      if (window.ethereum) {
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        try {
          const network = await provider.getNetwork();
          console.log("Current network info:", network);
          setNetworkInfo(network);
        } catch (error) {
          console.error("Error checking network:", error);
          setNetworkInfo(null);
        }
      }
    }
    checkNetwork();
  }, []);

  if (!address) return null;

  const getNetworkStatus = () => {
    if (!networkInfo) return "Not connected";
    if (networkInfo.chainId !== 5003) return "Please switch to Mantle Sepolia";
    return `Connected to ${networkInfo.name}`;
  };

  return (
    <Card className="p-3 bg-primary/5">
      <div className="text-sm space-y-1">
        <div>
          <span className="text-muted-foreground">Network: </span>
          <span className={networkInfo?.chainId !== 5003 ? "text-destructive" : ""}>
            {getNetworkStatus()}
          </span>
        </div>
        <div>
          <span className="text-muted-foreground">Balance: </span>
          {isLoading ? (
            <span className="animate-pulse">Loading...</span>
          ) : error ? (
            <span className="text-destructive">Error loading balance</span>
          ) : (
            <span className="font-medium">
              {balance?.formatted || "0.00"} SepoliaMNT
            </span>
          )}
        </div>
      </div>
    </Card>
  );
}