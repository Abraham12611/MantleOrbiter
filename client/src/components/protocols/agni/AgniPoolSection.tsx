import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { AgniFinanceService } from "@/services/agni-finance";
import { useToast } from "@/hooks/use-toast";

const agniService = new AgniFinanceService();

// Common token pairs on Agni (from their docs)
const COMMON_PAIRS = [
  {
    name: "MNT-USDC",
    tokenA: "0xMNT_ADDRESS",
    tokenB: "0xUSDC_ADDRESS",
  }
];

export function AgniPoolSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [amountA, setAmountA] = useState("");
  const [amountB, setAmountB] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedPair] = useState(COMMON_PAIRS[0]);

  const handleAddLiquidity = async () => {
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      await agniService.addLiquidity(
        selectedPair.tokenA,
        selectedPair.tokenB,
        amountA,
        amountB
      );
      
      toast({
        title: "Success",
        description: "Liquidity added successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Agni Finance Pools</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Amount token A"
            value={amountA}
            onChange={(e) => setAmountA(e.target.value)}
          />
          <Input
            type="number"
            placeholder="Amount token B"
            value={amountB}
            onChange={(e) => setAmountB(e.target.value)}
          />
          <Button
            onClick={handleAddLiquidity}
            disabled={loading || !address}
            className="w-full"
          >
            {loading ? "Adding Liquidity..." : "Add Liquidity"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 