import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Protocol } from "@shared/schema";
import { motion } from "framer-motion";
import { Link } from "wouter";

interface ProtocolCardProps {
  protocol: Protocol;
}

export default function ProtocolCard({ protocol }: ProtocolCardProps) {
  const categoryColor = 
    protocol.category === 'DeFi' ? 'bg-[#00F0FF]/10 text-[#00F0FF]' :
    protocol.category === 'NFT' ? 'bg-[#BD00FF]/10 text-[#BD00FF]' :
    'bg-[#00FFA3]/10 text-[#00FFA3]';

  return (
    <motion.div
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <Link href={`/protocol/${protocol.id}`}>
        <Card className="cursor-pointer backdrop-blur-lg bg-card/30 border-primary/20">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-xl font-bold">{protocol.name}</CardTitle>
              <Badge className={categoryColor}>
                {protocol.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-muted-foreground mb-4">
              {protocol.description}
            </p>
            {protocol.tvl && (
              <div className="text-sm">
                <span className="text-muted-foreground">TVL: </span>
                <span className="font-medium">${protocol.tvl.toLocaleString()}</span>
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}
