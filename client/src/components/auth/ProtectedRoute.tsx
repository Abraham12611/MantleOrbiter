import { useEffect } from "react";
import { useLocation } from "wouter";
import { useAuth } from "@/contexts/auth";
import { useToast } from "@/hooks/use-toast";
import { useWallet } from "@/hooks/use-wallet";

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, isLoading: authLoading } = useAuth();
  const { address, connecting } = useWallet();
  const [_, navigate] = useLocation();
  const { toast } = useToast();

  useEffect(() => {
    // Only show auth message when both wallet and auth state are loaded and we're not authenticated
    if (!connecting && !authLoading && !user && !address) {
      toast({
        title: "Authentication Required",
        description: "Please connect your wallet to access this page",
        variant: "destructive",
      });
      navigate("/");
    }
  }, [user, authLoading, connecting, address, navigate]);

  // Show loading state while either auth or wallet is being checked
  if (authLoading || connecting) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // Only render children when we have both wallet connection and authentication
  if (!user || !address) {
    return null;
  }

  return <>{children}</>;
}