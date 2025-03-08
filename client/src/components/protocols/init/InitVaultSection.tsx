import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { InitCapitalService } from "@/services/init-capital";
import { useToast } from "@/hooks/use-toast";

const initService = new InitCapitalService();

export function InitVaultSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);

  const handleDeposit = async () => {
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
      // Using USDC as example asset - replace with actual asset address
      const tx = await initService.createLendingPosition(
        "0xUSDC_ADDRESS",
        amount
      );
      
      toast({
        title: "Success",
        description: "Position created successfully",
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
        <CardTitle>INIT Capital Lending</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Amount to deposit"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={handleDeposit}
            disabled={loading || !address}
            className="w-full"
          >
            {loading ? "Creating Position..." : "Create Lending Position"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 