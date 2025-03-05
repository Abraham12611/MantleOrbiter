import { useParams } from "wouter";
import { useProtocol } from "@/hooks/use-ecosystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ExternalLink, Github, Twitter } from "lucide-react";
import { motion } from "framer-motion";

export default function Protocol() {
  const { id } = useParams<{ id: string }>();
  const { data: protocol, isLoading } = useProtocol(parseInt(id));

  if (isLoading) {
    return (
      <div className="p-8 flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!protocol) {
    return (
      <div className="p-8">
        <h1 className="text-2xl">Protocol not found</h1>
      </div>
    );
  }

  return (
    <div className="p-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <Card className="backdrop-blur-lg bg-card/30 border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-3xl font-bold">{protocol.name}</CardTitle>
              <Badge className={
                protocol.category === 'DeFi' ? 'bg-[#00F0FF]/10 text-[#00F0FF]' :
                protocol.category === 'NFT' ? 'bg-[#BD00FF]/10 text-[#BD00FF]' :
                'bg-[#00FFA3]/10 text-[#00FFA3]'
              }>
                {protocol.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <p className="text-lg text-muted-foreground">
              {protocol.description}
            </p>

            {protocol.tvl && (
              <div className="p-4 rounded-lg bg-primary/5">
                <h3 className="text-sm text-muted-foreground mb-1">Total Value Locked</h3>
                <p className="text-2xl font-bold">${protocol.tvl.toLocaleString()}</p>
              </div>
            )}

            {protocol.metadata && (
              <div className="flex gap-4">
                {protocol.metadata.website && (
                  <a
                    href={protocol.metadata.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <ExternalLink className="w-4 h-4" />
                    Website
                  </a>
                )}
                {protocol.metadata.github && (
                  <a
                    href={protocol.metadata.github}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Github className="w-4 h-4" />
                    GitHub
                  </a>
                )}
                {protocol.metadata.twitter && (
                  <a
                    href={protocol.metadata.twitter}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-sm text-primary hover:underline"
                  >
                    <Twitter className="w-4 h-4" />
                    Twitter
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
