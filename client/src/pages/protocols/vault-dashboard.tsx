import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InitVaultSection } from "@/components/protocols/init/InitVaultSection";
import { CircuitVaultSection } from "@/components/protocols/circuit/CircuitVaultSection";

export default function VaultDashboard() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Mantle Protocol Vaults</h1>
        <p className="text-muted-foreground">
          Interact with various DeFi protocols on the Mantle network
        </p>
      </div>

      <Tabs defaultValue="vaults">
        <TabsList>
          <TabsTrigger value="vaults">Yield Vaults</TabsTrigger>
          <TabsTrigger value="lending">Lending</TabsTrigger>
          <TabsTrigger value="pools">Liquidity Pools</TabsTrigger>
        </TabsList>

        <TabsContent value="vaults">
          <div className="grid gap-6">
            <CircuitVaultSection />
          </div>
        </TabsContent>

        <TabsContent value="lending">
          <div className="grid gap-6">
            <InitVaultSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 