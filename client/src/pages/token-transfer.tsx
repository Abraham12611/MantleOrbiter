import TokenTransferInterface from "@/components/mantle/TokenTransferInterface";

export default function TokenTransferPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Token Transfer</h1>
        <p className="text-muted-foreground">
          Transfer tokens securely on the Mantle Network.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <TokenTransferInterface />
      </div>
    </div>
  );
} 