import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface SwapConfirmationDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  isLoading: boolean;
  tokenIn: {
    symbol: string;
    amount: string;
  };
  tokenOut: {
    symbol: string;
    amount: string;
  };
  slippage: number;
}

export default function SwapConfirmationDialog({
  open,
  onOpenChange,
  onConfirm,
  isLoading,
  tokenIn,
  tokenOut,
  slippage,
}: SwapConfirmationDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Confirm Swap</DialogTitle>
          <DialogDescription>
            Please review your transaction details before confirming.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">You Pay</span>
            <span className="font-medium">
              {tokenIn.amount} {tokenIn.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">You Receive</span>
            <span className="font-medium">
              {tokenOut.amount} {tokenOut.symbol}
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-muted-foreground">Slippage Tolerance</span>
            <span className="font-medium">{slippage}%</span>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={onConfirm} disabled={isLoading}>
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Confirming...
              </>
            ) : (
              "Confirm Swap"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
