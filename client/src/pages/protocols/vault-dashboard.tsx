import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { InitVaultSection } from "@/components/protocols/init/InitVaultSection";
import { CircuitVaultSection } from "@/components/protocols/circuit/CircuitVaultSection";
import { AgniPoolSection } from "@/components/protocols/agni/AgniPoolSection";
import { LendleSection } from "@/components/protocols/lendle/LendleSection";
import { KTCVaultSection } from "@/components/protocols/circuit/KTCVaultSection";

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
            <KTCVaultSection />
          </div>
        </TabsContent>

        <TabsContent value="lending">
          <div className="grid gap-6">
            <InitVaultSection />
            <LendleSection />
          </div>
        </TabsContent>

        <TabsContent value="pools">
          <div className="grid gap-6">
            <AgniPoolSection />
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 