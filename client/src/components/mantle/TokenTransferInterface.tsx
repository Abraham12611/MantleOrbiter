import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mantleService } from "@/services/mantle";
import { Loader2, AlertCircle } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTokenBalance } from "@/hooks/use-token-balance";
import { ethers } from "ethers";

// Mantle Testnet Tokens
const MANTLE_TESTNET_TOKENS = [
  {
    symbol: "MNT",
    name: "Mantle",
    address: "0xDeadDeAddeAddEAddeadDEaDDEAdDeaDDeAD0000",
  },
  {
    symbol: "WMNT",
    name: "Wrapped Mantle",
    address: "0x65e37B558F64E2Be5768DB46DF22F93d85741A9E",
  }
];

export default function TokenTransferInterface() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    token: "",
    recipient: "",
    amount: "",
  });

  const selectedToken = MANTLE_TESTNET_TOKENS.find(token => token.address === formData.token);
  const tokenBalance = useTokenBalance(formData.token, address);

  const handleSubmit = async (e: React.FormEvent) => {
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
      await mantleService.switchToMantleNetwork();

      const tx = await mantleService.transferToken({
        tokenAddress: formData.token,
        recipient: formData.recipient,
        amount: formData.amount,
      });

      toast({
        title: "Transaction Submitted",
        description: `Transaction Hash: ${tx.hash}`,
      });

      const receipt = await tx.wait();

      toast({
        title: "Transfer Successful",
        description: "Your token transfer has been completed!",
      });
    } catch (error: any) {
      toast({
        title: "Transfer Failed",
        description: error.message || "Failed to execute transfer",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Transfer Tokens</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <select
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={formData.token}
              onChange={(e) => setFormData({ ...formData, token: e.target.value })}
              disabled={loading}
            >
              <option value="">Select token</option>
              {MANTLE_TESTNET_TOKENS.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                  {tokenBalance.data ? ` - Balance: ${tokenBalance.data.formatted}` : ''}
                </option>
              ))}
            </select>

            <Input
              placeholder="Recipient Address"
              value={formData.recipient}
              onChange={(e) => setFormData({ ...formData, recipient: e.target.value })}
              disabled={loading}
            />

            <Input
              placeholder="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
              disabled={loading}
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Transferring...
              </>
            ) : (
              "Transfer"
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
} 