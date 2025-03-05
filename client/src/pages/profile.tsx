import { useAuth } from "@/contexts/auth";
import { useProtocols } from "@/hooks/use-ecosystem";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Copy, ExternalLink } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer } from "recharts";

export default function Profile() {
  const { user } = useAuth();
  const { data: protocols } = useProtocols();
  const { toast } = useToast();

  // Mock interaction data - will be replaced with real data from API
  const interactions = [
    { date: '2024-01', count: 5 },
    { date: '2024-02', count: 8 },
    { date: '2024-03', count: 12 },
  ];

  const copyAddress = () => {
    if (user?.address) {
      navigator.clipboard.writeText(user.address);
      toast({
        title: "Copied!",
        description: "Address copied to clipboard",
      });
    }
  };

  return (
    <div className="p-8 space-y-8">
      <h1 className="text-4xl font-bold">Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Wallet Information */}
        <Card>
          <CardHeader>
            <CardTitle>Wallet</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg bg-muted/30 flex items-center justify-between">
              <code className="text-sm font-mono">
                {user?.address ? (
                  <>
                    {user.address.slice(0, 6)}...{user.address.slice(-4)}
                  </>
                ) : (
                  'No wallet connected'
                )}
              </code>
              {user?.address && (
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={copyAddress}
                    className="h-8 w-8"
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                  <a
                    href={`https://explorer.mantle.xyz/address/${user.address}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <ExternalLink className="h-4 w-4" />
                    </Button>
                  </a>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Protocol Interactions */}
        <Card>
          <CardHeader>
            <CardTitle>Protocol Interactions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[200px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={interactions}>
                  <XAxis dataKey="date" />
                  <YAxis />
                  <Tooltip />
                  <Line
                    type="monotone"
                    dataKey="count"
                    stroke="hsl(var(--primary))"
                    strokeWidth={2}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {protocols?.slice(0, 3).map((protocol) => (
                <div
                  key={protocol.id}
                  className="flex items-center justify-between p-4 rounded-lg bg-muted/30"
                >
                  <div>
                    <h3 className="font-medium">{protocol.name}</h3>
                    <p className="text-sm text-muted-foreground">
                      Last interaction: 2 days ago
                    </p>
                  </div>
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
