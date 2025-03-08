import SwapInterface from "@/components/mantle/SwapInterface";

export default function SwapPage() {
  return (
    <div className="p-8 space-y-8">
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Token Swap</h1>
        <p className="text-muted-foreground">
          Swap tokens securely on the Mantle Network with our decentralized exchange interface.
        </p>
      </div>

      <div className="max-w-2xl mx-auto w-full">
        <SwapInterface />
      </div>
    </div>
  );
}
