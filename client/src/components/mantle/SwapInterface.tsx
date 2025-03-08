import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mantleService } from "@/services/mantle";
import { ArrowDownUp, Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";

export default function SwapInterface() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    tokenIn: "",
    tokenOut: "",
    amount: "",
    slippage: 0.5, // Default slippage of 0.5%
  });

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
      // First ensure we're on Mantle Network
      await mantleService.switchToMantleNetwork();

      // Execute the swap
      const tx = await mantleService.executeSwap({
        tokenIn: formData.tokenIn,
        tokenOut: formData.tokenOut,
        amountIn: formData.amount,
        slippage: formData.slippage,
      });

      toast({
        title: "Transaction Submitted",
        description: `Transaction Hash: ${tx.hash}`,
      });

      // Wait for transaction confirmation
      const receipt = await tx.wait();

      toast({
        title: "Swap Successful",
        description: "Your token swap has been completed!",
      });
    } catch (error: any) {
      toast({
        title: "Swap Failed",
        description: error.message || "Failed to execute swap",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>Swap Tokens on Mantle Network</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Input
              placeholder="Token Address (From)"
              value={formData.tokenIn}
              onChange={(e) =>
                setFormData({ ...formData, tokenIn: e.target.value })
              }
              disabled={loading}
            />
            <Input
              placeholder="Amount"
              type="number"
              value={formData.amount}
              onChange={(e) =>
                setFormData({ ...formData, amount: e.target.value })
              }
              disabled={loading}
            />
          </div>

          <div className="flex justify-center">
            <ArrowDownUp className="h-6 w-6" />
          </div>

          <Input
            placeholder="Token Address (To)"
            value={formData.tokenOut}
            onChange={(e) =>
              setFormData({ ...formData, tokenOut: e.target.value })
            }
            disabled={loading}
          />

          <Input
            placeholder="Slippage (%)"
            type="number"
            step="0.1"
            min="0.1"
            max="5"
            value={formData.slippage}
            onChange={(e) =>
              setFormData({ ...formData, slippage: parseFloat(e.target.value) })
            }
            disabled={loading}
          />

          <div className="pt-4">
            <Button type="submit" className="w-full" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Swapping...
                </>
              ) : (
                "Swap Tokens"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}