import { Button } from "@/components/ui/button";
import { useWallet } from "@/hooks/use-wallet";
import { Loader2 } from "lucide-react";
import { motion } from "framer-motion";

export default function WalletConnect() {
  const { address, connecting, connect, disconnect } = useWallet();

  return (
    <div className="w-full p-4 rounded-lg bg-card/30 border border-primary/20">
      {!address ? (
        <Button
          onClick={connect}
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
            onClick={disconnect}
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
