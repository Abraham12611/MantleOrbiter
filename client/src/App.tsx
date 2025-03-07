import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import { AuthProvider } from "@/contexts/auth";
import Navigation from "@/components/layout/Navigation";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import Home from "@/pages/home";
import Protocols from "@/pages/protocols";
import Protocol from "@/pages/protocol";
import Profile from "@/pages/profile";
import Swap from "@/pages/swap";
import NotFound from "@/pages/not-found";
import TokenTransfer from "@/pages/token-transfer";
import Bridge from "@/pages/bridge";
import VaultDashboard from "@/pages/protocols/vault-dashboard";

function Router() {
  return (
    <div className="flex min-h-screen bg-background">
      <Navigation />
      <main className="flex-1">
        <Switch>
          <Route path="/" component={Home} />
          <Route path="/protocols" component={Protocols} />
          <Route path="/protocol/:id">
            {(params) => (
              <ProtectedRoute>
                <Protocol id={params.id} />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/profile">
            {() => (
              <ProtectedRoute>
                <Profile />
              </ProtectedRoute>
            )}
          </Route>
          <Route path="/protocols/vault-dashboard" component={VaultDashboard} />
          <Route path="/swap" component={Swap} />
          <Route path="/token-transfer" component={TokenTransfer} />
          <Route path="/bridge" component={Bridge} />
          <Route component={NotFound} />
        </Switch>
      </main>
      <Toaster />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <Router />
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;