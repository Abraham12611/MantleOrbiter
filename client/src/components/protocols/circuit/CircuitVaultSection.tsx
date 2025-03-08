import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useWallet } from "@/hooks/use-wallet";
import { CircuitProtocolService } from "@/services/circuit-protocol";
import { useToast } from "@/hooks/use-toast";

// Verified vault addresses from Circuit documentation
const CIRCUIT_VAULTS = [
  {
    name: "Cleopatra USDC Vault",
    address: "0xVAULT_ADDRESS_FROM_DOCS", // Replace with actual address
    token: "USDC"
  }
];

const circuitService = new CircuitProtocolService();

export function CircuitVaultSection() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedVault, setSelectedVault] = useState(CIRCUIT_VAULTS[0]);

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
      const tx = await circuitService.depositToVault(
        selectedVault.address,
        amount
      );
      
      toast({
        title: "Success",
        description: `Deposited ${amount} ${selectedVault.token} to vault`,
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
        <CardTitle>Circuit Protocol Vaults</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Input
            type="number"
            placeholder={`Amount in ${selectedVault.token}`}
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <Button
            onClick={handleDeposit}
            disabled={loading || !address}
            className="w-full"
          >
            {loading ? "Depositing..." : "Deposit to Vault"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
} 