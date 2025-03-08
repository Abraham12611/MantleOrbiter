import { Button } from "@/components/ui/button";
import { Link, useLocation } from "wouter";
import { LayoutDashboard, Box, MessageSquare, Settings, User } from "lucide-react";
import WalletConnect from "@/components/wallet/WalletConnect";

export default function Navigation() {
  const [location] = useLocation();

  return (
    <nav className="w-64 h-screen p-4 border-r border-primary/20 backdrop-blur-xl bg-sidebar/30">
      <div className="flex flex-col h-full">
        <div className="flex items-center gap-2 mb-8">
          <div className="w-8 h-8 rounded-full bg-primary/20 animate-pulse" />
          <h1 className="text-xl font-bold">ChainOrbiter</h1>
        </div>

        <div className="flex flex-col gap-2">
          <Link href="/">
            <Button
              variant={location === "/" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Dashboard
            </Button>
          </Link>

          <Link href="/protocols">
            <Button
              variant={location === "/protocols" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Box className="mr-2 h-4 w-4" />
              Protocols
            </Button>
          </Link>

          <Link href="/chat">
            <Button
              variant={location === "/chat" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <MessageSquare className="mr-2 h-4 w-4" />
              AI Chat
            </Button>
          </Link>

          <Link href="/profile">
            <Button
              variant={location === "/profile" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <User className="mr-2 h-4 w-4" />
              Profile
            </Button>
          </Link>

          <Link href="/settings">
            <Button
              variant={location === "/settings" ? "secondary" : "ghost"}
              className="w-full justify-start"
            >
              <Settings className="mr-2 h-4 w-4" />
              Settings
            </Button>
          </Link>
        </div>

        <div className="mt-auto">
          <WalletConnect />
        </div>
      </div>
    </nav>
  );
}