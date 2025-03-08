import { useProtocols } from "@/hooks/use-ecosystem";
import ProtocolCard from "@/components/ecosystem/ProtocolCard";
import SearchBar from "@/components/ecosystem/SearchBar";
import { useState, useMemo } from "react";
import { useLocation } from "wouter";

export default function Protocols() {
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
        <h1 className="text-4xl font-bold">Mantle Protocols</h1>
        <SearchBar
          onSearch={setSearchQuery}
          onCategoryFilter={setSelectedCategory}
          selectedCategory={selectedCategory}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredProtocols.map((protocol) => (
          <ProtocolCard key={protocol.id} protocol={protocol} />
        ))}
      </div>
    </div>
  );
}
