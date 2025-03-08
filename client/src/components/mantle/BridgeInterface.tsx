import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mantleService } from "@/services/mantle";
import { Loader2, AlertCircle } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useTokenBalance } from "@/hooks/use-token-balance";

const BRIDGE_TOKENS = [
  {
    symbol: "MNT",
    name: "Mantle",
    l1Address: "0x0000000000000000000000000000000000000000", // ETH on L1
    l2Address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000", // MNT on L2
  },
  {
    symbol: "WMNT",
    name: "Wrapped Mantle",
    l1Address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0", // L1 WMNT
    l2Address: "0x65e37B558F64E2Be5768DB46DF22F93d85741A9E", // L2 WMNT
  }
];

export default function BridgeInterface() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [direction, setDirection] = useState<"deposit" | "withdraw">("deposit");
  const [formData, setFormData] = useState({
    token: "",
    amount: "",
  });

  const selectedToken = BRIDGE_TOKENS.find(token => 
    direction === "deposit" ? token.l1Address === formData.token : token.l2Address === formData.token
  );

  const tokenBalance = useTokenBalance(formData.token, address);

  const handleBridge = async (e: React.FormEvent) => {
    e.preventDefault();
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
      if (direction === "deposit") {
        const tx = await mantleService.bridgeDeposit({
          tokenAddress: formData.token,
          amount: formData.amount,
        });

        toast({
          title: "Deposit Initiated",
          description: `Transaction Hash: ${tx.hash}`,
        });

        await tx.wait();
        
        toast({
          title: "Deposit Submitted",
          description: "Your deposit is being processed. This may take several minutes.",
        });
      } else {
        const tx = await mantleService.bridgeWithdraw({
          tokenAddress: formData.token,
          amount: formData.amount,
        });

        toast({
          title: "Withdrawal Initiated",
          description: `Transaction Hash: ${tx.hash}`,
        });

        await tx.wait();

        toast({
          title: "Withdrawal Submitted",
          description: "Your withdrawal is being processed. This may take several minutes to hours.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Bridge Failed",
        description: error.message || "Failed to execute bridge transaction",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Bridge Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs value={direction} onValueChange={(v) => setDirection(v as "deposit" | "withdraw")}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="deposit">Deposit (L1 → L2)</TabsTrigger>
            <TabsTrigger value="withdraw">Withdraw (L2 → L1)</TabsTrigger>
          </TabsList>

          <form onSubmit={handleBridge} className="space-y-4 mt-4">
            <div className="space-y-2">
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={formData.token}
                onChange={(e) => setFormData({ ...formData, token: e.target.value })}
                disabled={loading}
              >
                <option value="">Select token</option>
                {BRIDGE_TOKENS.map((token) => (
                  <option 
                    key={direction === "deposit" ? token.l1Address : token.l2Address} 
                    value={direction === "deposit" ? token.l1Address : token.l2Address}
                  >
                    {token.symbol} - {token.name}
                    {tokenBalance.data ? ` - Balance: ${tokenBalance.data.formatted}` : ''}
                  </option>
                ))}
              </select>

              <Input
                placeholder="Amount"
                type="number"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                disabled={loading}
              />
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                {direction === "deposit" 
                  ? "Deposits typically take 10-15 minutes to process."
                  : "Withdrawals have a 7-day challenge period on mainnet (shorter on testnet)."}
              </AlertDescription>
            </Alert>

            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : (
                `Bridge to ${direction === "deposit" ? "Mantle" : "Ethereum"}`
              )}
            </Button>
          </form>
        </Tabs>
      </CardContent>
    </Card>
  );
} 