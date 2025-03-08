import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useWallet } from "@/hooks/use-wallet";
import { InitCapitalService } from "@/services/init-capital";
import { useToast } from "@/hooks/use-toast";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

const initService = new InitCapitalService();

const SUPPORTED_ASSETS = [
  { symbol: "USDC", address: "0x00A55649E597d463fD212fBE48a3B40f0E227d06" },
  { symbol: "WMNT", address: "0x44949636f778fAD2b139E665aee11a2dc84A2976" },
  { symbol: "WETH", address: "0x51AB74f8B03F0305d8dcE936B473AB587911AEC4" },
  { symbol: "USDT", address: "0xadA66a8722B5cdfe3bC504007A5d793e7100ad09" }
];

export function InitVaultSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [selectedAsset, setSelectedAsset] = useState(SUPPORTED_ASSETS[0]);
  const [amount, setAmount] = useState("");
  const [positionId, setPositionId] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCreatePosition = async () => {
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
      const tx = await initService.createLendingPosition(
        selectedAsset.address,
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

  const handleAddCollateral = async () => {
    if (!positionId || !amount) return;
    setLoading(true);
    try {
      await initService.addCollateral(Number(positionId), amount);
      toast({
        title: "Success",
        description: "Collateral added successfully",
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
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Create Position</TabsTrigger>
            <TabsTrigger value="manage">Manage Position</TabsTrigger>
          </TabsList>

          <TabsContent value="create" className="space-y-4">
            <Select
              value={selectedAsset.symbol}
              onValueChange={(value) => 
                setSelectedAsset(SUPPORTED_ASSETS.find(a => a.symbol === value)!)
              }
            >
              <SelectTrigger>
                <SelectValue placeholder="Select asset" />
              </SelectTrigger>
              <SelectContent>
                {SUPPORTED_ASSETS.map((asset) => (
                  <SelectItem key={asset.address} value={asset.symbol}>
                    {asset.symbol}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Input
              type="number"
              placeholder="Amount to deposit"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            
            <Button
              onClick={handleCreatePosition}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Creating Position..." : "Create Lending Position"}
            </Button>
          </TabsContent>

          <TabsContent value="manage" className="space-y-4">
            <Input
              type="number"
              placeholder="Position ID"
              value={positionId}
              onChange={(e) => setPositionId(e.target.value)}
            />
            <Input
              type="number"
              placeholder="Amount"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleAddCollateral}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Adding Collateral..." : "Add Collateral"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 