import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Protocol } from "@shared/schema";
import { motion } from "framer-motion";
import { Link } from "wouter";
import { LineChart, Line, ResponsiveContainer, Tooltip } from "recharts";
import { ExternalLink, TrendingUp, Users, ShieldCheck } from "lucide-react";

interface ProtocolCardProps {
  protocol: Protocol;
}

export default function ProtocolCard({ protocol }: ProtocolCardProps) {
  // Mock TVL trend data - this would come from the API in production
  const tvlTrend = [
    { date: '2024-01', value: protocol.tvl * 0.8 },
    { date: '2024-02', value: protocol.tvl * 0.9 },
    { date: '2024-03', value: protocol.tvl },
  ];

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
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">TVL</span>
                  <span className="text-lg font-medium">${protocol.tvl.toLocaleString()}</span>
                </div>

                <div className="h-[60px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={tvlTrend}>
                      <Line 
                        type="monotone" 
                        dataKey="value"
                        stroke={
                          protocol.category === 'DeFi' ? '#00F0FF' :
                          protocol.category === 'NFT' ? '#BD00FF' :
                          '#00FFA3'
                        }
                        strokeWidth={2}
                        dot={false}
                      />
                      <Tooltip 
                        content={({ payload }) => (
                          payload?.[0] ? (
                            <div className="bg-background/80 backdrop-blur-sm p-2 rounded-lg border border-border">
                              ${payload[0].value.toLocaleString()}
                            </div>
                          ) : null
                        )}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </div>
            )}

            <div className="mt-4 pt-4 border-t border-border">
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">Active Users</span>
                  <span className="text-sm font-medium">2.5k</span>
                </div>
                <div className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4 text-muted-foreground" />
                  <span className="text-sm text-muted-foreground">30d Growth</span>
                  <span className="text-sm font-medium text-green-500">+15%</span>
                </div>
              </div>
            </div>

            {protocol.metadata && (
              <div className="mt-4 flex gap-3">
                {protocol.metadata.website && (
                  <a
                    href={protocol.metadata.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ExternalLink className="w-3 h-3" />
                    Website
                  </a>
                )}
                {protocol.metadata.docs && (
                  <a
                    href={protocol.metadata.docs}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-primary hover:underline flex items-center gap-1"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <ShieldCheck className="w-3 h-3" />
                    Docs
                  </a>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </Link>
    </motion.div>
  );
}