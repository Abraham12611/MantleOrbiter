import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { mantleService } from "@/services/mantle";
import { ArrowDownUp, Loader2, AlertCircle } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useTokenPrice } from "@/hooks/use-token-price";
import SwapConfirmationDialog from "./SwapConfirmationDialog";
import { useTokenBalance } from "@/hooks/use-token-balance";

// Update COMMON_TOKENS to include SepoliaMNT
const COMMON_TOKENS = [
  {
    symbol: "SepoliaMNT",
    name: "Mantle Token (Sepolia)",
    address: "0x65e37B558F64E2Be5768DB46DF22F93d85741A9E",
  },
  {
    symbol: "WETH",
    name: "Wrapped Ether",
    address: "0x7D1AfA7B718fb893dB30A3aBc0Cfc608AaCfeBB0",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    address: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
  },
  {
    symbol: "DAI",
    name: "Dai Stablecoin",
    address: "0x6B175474E89094C44Da98b954EedeAC495271d0F",
  },
];

export default function SwapInterface() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [formData, setFormData] = useState({
    tokenIn: "",
    tokenOut: "",
    amount: "",
    slippage: 0.5, // Default slippage of 0.5%
  });

  const tokenInPrice = useTokenPrice(formData.tokenIn);
  const tokenOutPrice = useTokenPrice(formData.tokenOut);
  const tokenInBalance = useTokenBalance(formData.tokenIn, address);
  const tokenOutBalance = useTokenBalance(formData.tokenOut, address);

  const selectedTokenIn = COMMON_TOKENS.find(token => token.address === formData.tokenIn);
  const selectedTokenOut = COMMON_TOKENS.find(token => token.address === formData.tokenOut);

  const isMetaMaskInstalled = mantleService.isMetaMaskInstalled();

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

    // Show confirmation dialog instead of executing swap immediately
    setShowConfirmation(true);
  };

  const executeSwap = async () => {
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
      setShowConfirmation(false);
    }
  };

  const estimatedOutput = () => {
    if (!formData.amount || !tokenInPrice.data?.price || !tokenOutPrice.data?.price) {
      return "0.00";
    }
    const inputValue = parseFloat(formData.amount) * tokenInPrice.data.price;
    return (inputValue / tokenOutPrice.data.price).toFixed(6);
  };

  if (!isMetaMaskInstalled) {
    return (
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>MetaMask Required</CardTitle>
        </CardHeader>
        <CardContent>
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>
              Please install MetaMask to use the swap feature.{" "}
              <a
                href="https://metamask.io/download/"
                target="_blank"
                rel="noopener noreferrer"
                className="underline"
              >
                Download MetaMask
              </a>
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card className="w-full max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Swap Tokens on Mantle Network</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <select
                className="w-full h-10 px-3 rounded-md border border-input bg-background"
                value={formData.tokenIn}
                onChange={(e) => setFormData({ ...formData, tokenIn: e.target.value })}
                disabled={loading}
              >
                <option value="">Select token to swap from</option>
                {COMMON_TOKENS.map((token) => (
                  <option key={token.address} value={token.address}>
                    {token.symbol} - {token.name}
                    {tokenInPrice.data ? ` ($${tokenInPrice.data.price.toFixed(2)})` : ''}
                    {tokenInBalance.data ? ` - Balance: ${tokenInBalance.data.formatted}` : ''}
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

            <div className="flex justify-center">
              <ArrowDownUp className="h-6 w-6" />
            </div>

            <select
              className="w-full h-10 px-3 rounded-md border border-input bg-background"
              value={formData.tokenOut}
              onChange={(e) => setFormData({ ...formData, tokenOut: e.target.value })}
              disabled={loading}
            >
              <option value="">Select token to swap to</option>
              {COMMON_TOKENS.map((token) => (
                <option key={token.address} value={token.address}>
                  {token.symbol} - {token.name}
                  {tokenOutPrice.data ? ` ($${tokenOutPrice.data.price.toFixed(2)})` : ''}
                  {tokenOutBalance.data ? ` - Balance: ${tokenOutBalance.data.formatted}` : ''}
                </option>
              ))}
            </select>

            {formData.tokenIn && formData.tokenOut && formData.amount && (
              <div className="p-3 bg-muted rounded-md">
                <div className="text-sm text-muted-foreground">
                  Estimated output:
                  <span className="float-right font-medium">
                    {estimatedOutput()} {selectedTokenOut?.symbol}
                  </span>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <label className="text-sm font-medium">
                Slippage Tolerance: {formData.slippage}%
              </label>
              <Slider
                value={[formData.slippage]}
                onValueChange={(value) => setFormData({ ...formData, slippage: value[0] })}
                min={0.1}
                max={5}
                step={0.1}
                disabled={loading}
              />
            </div>

            <div className="pt-4">
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Swapping...
                  </>
                ) : (
                  "Review Swap"
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      <SwapConfirmationDialog
        open={showConfirmation}
        onOpenChange={setShowConfirmation}
        onConfirm={executeSwap}
        isLoading={loading}
        tokenIn={{
          symbol: selectedTokenIn?.symbol || "",
          amount: formData.amount,
        }}
        tokenOut={{
          symbol: selectedTokenOut?.symbol || "",
          amount: estimatedOutput(),
        }}
        slippage={formData.slippage}
      />
    </>
  );
}