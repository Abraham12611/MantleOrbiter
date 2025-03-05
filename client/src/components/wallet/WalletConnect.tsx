import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

export default function WalletConnect() {
  const { address, connecting, connect, disconnect } = useWallet();
  const { toast } = useToast();

  const handleConnect = async () => {
    try {
      await connect();
      // After wallet connection, authenticate with our backend
      const response = await apiRequest("POST", "/api/auth/login", { address });
      const data = await response.json();

      if (data.user) {
        toast({
          title: "Connected",
          description: "Successfully connected and authenticated with wallet",
        });
      }
    } catch (error) {
      console.error('Connection error:', error);
      toast({
        title: "Connection Error",
        description: "Failed to connect wallet. Please try again.",
        variant: "destructive",
      });
    }
  };

  const handleDisconnect = async () => {
    try {
      await apiRequest("POST", "/api/auth/logout");
      disconnect();
      toast({
        title: "Disconnected",
        description: "Successfully disconnected wallet",
      });
    } catch (error) {
      console.error('Disconnect error:', error);
      toast({
        title: "Error",
        description: "Failed to disconnect properly",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="w-full p-4 rounded-lg bg-card/30 border border-primary/20">
      {!address ? (
        <Button
          onClick={handleConnect}
          disabled={connecting}
          className="w-full"
          variant="outline"
        >
          {connecting ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Connecting...
            </>
          ) : (
            "Connect Wallet"
          )}
        </Button>
      ) : (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-2"
        >
          <p className="text-sm text-muted-foreground">Connected Wallet</p>
          <p className="text-sm font-mono">
            {address.slice(0, 6)}...{address.slice(-4)}
          </p>
          <Button
            onClick={handleDisconnect}
            variant="ghost"
            size="sm"
            className="w-full"
          >
            Disconnect
          </Button>
        </motion.div>
      )}
    </div>
  );
}