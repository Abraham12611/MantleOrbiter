import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { LendleService } from "@/services/lendle";
import { useToast } from "@/hooks/use-toast";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const lendleService = new LendleService();

// Available assets on Lendle (from their docs)
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

export function LendleSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedAsset, setSelectedAsset] = useState(LENDLE_ASSETS[0]);
  const [interestMode, setInterestMode] = useState("variable");

  // Asset Supply: Deposit assets to earn yield
  const handleSupply = async () => {
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
      await lendleService.supply(selectedAsset.address, amount);
      toast({
        title: "Success",
        description: `Supplied ${amount} ${selectedAsset.symbol} to Lendle`,
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

  // Asset Borrowing: Borrow assets using deposits as collateral
  const handleBorrow = async () => {
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
      const interestRateMode = interestMode === "stable" ? 1 : 2;
      await lendleService.borrow(selectedAsset.address, amount, interestRateMode);
      toast({
        title: "Success",
        description: `Borrowed ${amount} ${selectedAsset.symbol} from Lendle`,
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

  // Withdraw supplied assets
  const handleWithdraw = async () => {
    if (!address) return;

    setLoading(true);
    try {
      await lendleService.withdraw(selectedAsset.address, amount);
      toast({
        title: "Success",
        description: `Withdrew ${amount} ${selectedAsset.symbol} from Lendle`,
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

  // Repay borrowed assets
  const handleRepay = async () => {
    if (!address) return;

    setLoading(true);
    try {
      const interestRateMode = interestMode === "stable" ? 1 : 2;
      await lendleService.repay(selectedAsset.address, amount, interestRateMode);
      toast({
        title: "Success",
        description: `Repaid ${amount} ${selectedAsset.symbol} to Lendle`,
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
        <CardTitle>Lendle Finance</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="supply">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="supply">Supply</TabsTrigger>
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw</TabsTrigger>
            <TabsTrigger value="repay">Repay</TabsTrigger>
          </TabsList>

          <div className="mt-4 mb-4">
            <Select
              value={selectedAsset.symbol}
              onValueChange={(value) => {
                setSelectedAsset(LENDLE_ASSETS.find(asset => asset.symbol === value) || LENDLE_ASSETS[0]);
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select an asset" />
              </SelectTrigger>
              <SelectContent>
                {LENDLE_ASSETS.map((asset) => (
                  <SelectItem key={asset.address} value={asset.symbol}>
                    {asset.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <Input
            className="mt-2"
            type="number"
            placeholder="Amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />

          <TabsContent value="borrow" className="mt-2">
            <Select
              value={interestMode}
              onValueChange={setInterestMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Interest rate mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variable">Variable Rate</SelectItem>
                <SelectItem value="stable">Stable Rate</SelectItem>
              </SelectContent>
            </Select>
          </TabsContent>

          <TabsContent value="repay" className="mt-2">
            <Select
              value={interestMode}
              onValueChange={setInterestMode}
            >
              <SelectTrigger>
                <SelectValue placeholder="Interest rate mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="variable">Variable Rate</SelectItem>
                <SelectItem value="stable">Stable Rate</SelectItem>
              </SelectContent>
            </Select>
          </TabsContent>

          <TabsContent value="supply" className="mt-4">
            <Button 
              onClick={handleSupply} 
              disabled={loading || !address} 
              className="w-full"
            >
              {loading ? "Processing..." : "Supply"}
            </Button>
          </TabsContent>

          <TabsContent value="borrow" className="mt-4">
            <Button 
              onClick={handleBorrow} 
              disabled={loading || !address} 
              className="w-full"
            >
              {loading ? "Processing..." : "Borrow"}
            </Button>
          </TabsContent>

          <TabsContent value="withdraw" className="mt-4">
            <Button 
              onClick={handleWithdraw} 
              disabled={loading || !address} 
              className="w-full"
            >
              {loading ? "Processing..." : "Withdraw"}
            </Button>
          </TabsContent>

          <TabsContent value="repay" className="mt-4">
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