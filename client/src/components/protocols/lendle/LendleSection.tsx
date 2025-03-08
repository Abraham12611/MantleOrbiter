import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWallet } from "@/hooks/use-wallet";
import { LendleService } from "@/services/lendle";
import { useToast } from "@/hooks/use-toast";

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
  const [selectedAsset] = useState(LENDLE_ASSETS[0]);

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
      await lendleService.borrow(selectedAsset.address, amount);
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

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lendle Protocol</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="supply">
          <TabsList>
            <TabsTrigger value="supply">Supply</TabsTrigger>
            <TabsTrigger value="borrow">Borrow</TabsTrigger>
          </TabsList>

          <TabsContent value="supply" className="space-y-4">
            <Input
              type="number"
              placeholder={`Amount in ${selectedAsset.symbol}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleSupply}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Supplying..." : "Supply"}
            </Button>
          </TabsContent>

          <TabsContent value="borrow" className="space-y-4">
            <Input
              type="number"
              placeholder={`Amount in ${selectedAsset.symbol}`}
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />
            <Button
              onClick={handleBorrow}
              disabled={loading || !address}
              className="w-full"
            >
              {loading ? "Borrowing..." : "Borrow"}
            </Button>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
} 