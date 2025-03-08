import BridgeInterface from "@/components/mantle/BridgeInterface";

export default function BridgePage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Cross-Chain Bridge</h1>
        <p className="text-muted-foreground">
          Bridge tokens between Ethereum (L1) and Mantle Network (L2) securely.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <BridgeInterface />
      </div>
    </div>
  );
} 