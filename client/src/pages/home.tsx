import { useLocation } from "wouter";
import EcosystemMap from "@/components/ecosystem/EcosystemMap";
import ChatInterface from "@/components/chat/ChatInterface";
import { useProtocols } from "@/hooks/use-ecosystem";
import { Protocol } from "@shared/schema";

export default function Home() {
  const { data: protocols, isLoading } = useProtocols();
  const [_, navigate] = useLocation();

  const handleSelectProtocol = (protocol: Protocol) => {
    navigate(`/protocol/${protocol.id}`);
  };

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-4xl font-bold">Explore Mantle Ecosystem</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <EcosystemMap
            protocols={protocols || []}
            onSelectProtocol={handleSelectProtocol}
          />
        </div>
        <div>
          <ChatInterface />
        </div>
      </div>
    </div>
  );
}