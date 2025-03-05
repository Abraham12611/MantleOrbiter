import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface SearchBarProps {
  onSearch: (query: string) => void;
  onCategoryFilter: (category: string | null) => void;
  selectedCategory: string | null;
}

export default function SearchBar({ onSearch, onCategoryFilter, selectedCategory }: SearchBarProps) {
  const categories = ["DeFi", "NFT", "Infrastructure"];

  return (
    <div className="space-y-4">
      <Input
        placeholder="Search protocols..."
        onChange={(e) => onSearch(e.target.value)}
        className="bg-background/50"
      />
      <div className="flex gap-2">
        {categories.map((category) => (
          <Button
            key={category}
            variant={selectedCategory === category ? "secondary" : "ghost"}
            onClick={() => onCategoryFilter(selectedCategory === category ? null : category)}
            className={`${
              category === "DeFi" ? "hover:text-[#00F0FF]" :
              category === "NFT" ? "hover:text-[#BD00FF]" :
              "hover:text-[#00FFA3]"
            }`}
          >
            {category}
          </Button>
        ))}
      </div>
    </div>
  );
}
