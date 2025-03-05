import { useLocation } from "wouter";
import { useState, useMemo } from "react";
import EcosystemMap from "@/components/ecosystem/EcosystemMap";
import ChatInterface from "@/components/chat/ChatInterface";
import SearchBar from "@/components/ecosystem/SearchBar";
import { useProtocols } from "@/hooks/use-ecosystem";
import { Protocol } from "@shared/schema";

export default function Home() {
  const { data: protocols, isLoading } = useProtocols();
  const [_, navigate] = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const filteredProtocols = useMemo(() => {
    if (!protocols) return [];

    return protocols.filter(protocol => {
      const matchesSearch = searchQuery === "" || 
        protocol.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        protocol.description.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesCategory = !selectedCategory || protocol.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }, [protocols, searchQuery, selectedCategory]);

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
      <div className="flex flex-col gap-6">
        <h1 className="text-4xl font-bold">Explore Mantle Ecosystem</h1>
        <SearchBar
          onSearch={setSearchQuery}
          onCategoryFilter={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <EcosystemMap
            protocols={filteredProtocols}
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