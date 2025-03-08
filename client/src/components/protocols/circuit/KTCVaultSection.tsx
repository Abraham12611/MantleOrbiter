import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { CircuitKTCService } from "@/services/circuit-ktc";
import { useToast } from "@/hooks/use-toast";
import { ethers } from "ethers";

const ktcService = new CircuitKTCService();

export function KTCVaultSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [rewards, setRewards] = useState<string>("0");

  useEffect(() => {
    if (address) {
      fetchRewards();
    }
  }, [address]);

  const fetchRewards = async () => {
    try {
      const rewardsAmount = await ktcService.getKTCRewards();
      setRewards(ethers.utils.formatEther(rewardsAmount));
    } catch (error) {
      console.error("Error fetching rewards:", error);
    }
  };

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
      await ktcService.depositKTC(amount);
      toast({
        title: "Success",
        description: "Successfully deposited to KTC vault",
      });
      fetchRewards();
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
        <CardTitle>Circuit KTC Vault</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="p-4 bg-muted rounded-lg">
          <p className="text-sm text-muted-foreground">Available Rewards</p>
          <p className="text-lg font-bold">{rewards} KTC</p>
        </div>
        
        <div className="space-y-2">
          <Input
            type="number"
            placeholder="Amount of KTC"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={handleDeposit}
            disabled={loading || !address}
            className="w-full"
          >
            {loading ? "Depositing..." : "Deposit KTC"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}