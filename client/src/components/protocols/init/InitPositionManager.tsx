import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { InitCapitalService } from "@/services/init-capital";
import { useToast } from "@/hooks/use-toast";

const initService = new InitCapitalService();

interface Position {
  id: number;
  asset: string;
  amount: string;
  debt: string;
}

export function InitPositionManager() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [positions, setPositions] = useState<Position[]>([]);
  const [positionId, setPositionId] = useState("");
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingPositions, setLoadingPositions] = useState(false);

  // Load user positions
  useEffect(() => {
    if (address) {
      fetchPositions();
    }
  }, [address]);

  const fetchPositions = async () => {
    setLoadingPositions(true);
    try {
      // In a real implementation, this would call a method to get all positions by user
      // For demo purposes, we're using a static list
      const userPositions: Position[] = [
        { id: 1, asset: "USDC", amount: "1000", debt: "500" },
        { id: 2, asset: "WMNT", amount: "5", debt: "1" }
      ];
      setPositions(userPositions);
    } catch (error) {
      console.error("Error fetching positions:", error);
    } finally {
      setLoadingPositions(false);
    }
  };

  // Borrowing & Repayment: Borrow against collateral
  const handleBorrow = async () => {
    if (!positionId || !amount) return;
    setLoading(true);
    try {
      await initService.borrow(Number(positionId), amount);
      toast({
        title: "Success",
        description: "Borrow successful",
      });
      fetchPositions(); // Refresh positions
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

  // Borrowing & Repayment: Repay loans
  const handleRepay = async () => {
    if (!positionId || !amount) return;
    setLoading(true);
    try {
      await initService.repay(Number(positionId), amount);
      toast({
        title: "Success",
        description: "Repayment successful",
      });
      fetchPositions(); // Refresh positions
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
        <CardTitle>Manage INIT Positions</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <h3 className="text-sm font-medium mb-2">Your Positions</h3>
          {loadingPositions ? (
            <p>Loading positions...</p>
          ) : positions.length === 0 ? (
            <p>No positions found</p>
          ) : (
            <div className="space-y-2">
              {positions.map((pos) => (
                <div key={pos.id} className="p-3 border rounded-md">
                  <div className="flex justify-between">
                    <span>Position ID: {pos.id}</span>
                    <span>Asset: {pos.asset}</span>
                  </div>
                  <div className="flex justify-between mt-1">
                    <span>Collateral: {pos.amount}</span>
                    <span>Debt: {pos.debt}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <Tabs defaultValue="borrow">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
            <TabsTrigger value="repay">Repay</TabsTrigger>
          </TabsList>

          <TabsContent value="borrow" className="space-y-4">
            <Input
              type="number"
              placeholder="Position ID"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount to borrow"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleBorrow}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Processing..." : "Borrow"}
            </Button>
          </TabsContent>

          <TabsContent value="repay" className="space-y-4">
            <Input
              type="number"
              placeholder="Position ID"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount to repay"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleRepay}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Processing..." : "Repay"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 