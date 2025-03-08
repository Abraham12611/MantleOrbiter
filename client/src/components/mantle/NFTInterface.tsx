import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { mantleService } from "@/services/mantle";
import { Loader2 } from "lucide-react";
import { useWallet } from "@/hooks/use-wallet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function NFTInterface() {
  const { address } = useWallet();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [collectionForm, setCollectionForm] = useState({
    name: "",
    symbol: "",
  });
  const [mintForm, setMintForm] = useState({
    contractAddress: "",
    tokenURI: "",
    price: "0.01",
  });

  const handleCreateCollection = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      toast({
        title: "Error",
        description: "Please connect your wallet first",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      const tx = await mantleService.createNFTCollection({
        name: collectionForm.name,
        symbol: collectionForm.symbol,
      });

      toast({
        title: "Transaction Submitted",
        description: `Collection creation transaction: ${tx.hash}`,
      });

      await tx.wait();

      toast({
        title: "Success",
        description: "NFT Collection created successfully!",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create & Mint NFTs</CardTitle>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="create">
          <TabsList>
            <TabsTrigger value="create">Create Collection</TabsTrigger>
            <TabsTrigger value="mint">Mint NFT</TabsTrigger>
          </TabsList>

          <TabsContent value="create">
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <Input
                placeholder="Collection Name"
                value={collectionForm.name}
                onChange={(e) => setCollectionForm({ ...collectionForm, name: e.target.value })}
              />
              <Input
                placeholder="Symbol"
                value={collectionForm.symbol}
                onChange={(e) => setCollectionForm({ ...collectionForm, symbol: e.target.value })}
              />
              <Button type="submit" disabled={loading}>
                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  "Create Collection"
                )}
              </Button>
            </form>
          </TabsContent>

          {/* Add Mint tab content similarly */}
        </Tabs>
      </CardContent>
    </Card>
  );
} 