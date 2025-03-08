import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/ai";
import { isAuthenticated } from "./middleware/auth";

const MOCK_PROTOCOLS = [
  {
    id: 1,
    name: "MantleSwap",
    category: "DeFi",
    description: "Decentralized exchange built for the Mantle network",
    tvl: 1500000,
    metadata: {
      website: "https://mantleswap.xyz",
      docs: "https://docs.mantleswap.xyz",
      twitter: "https://twitter.com/MantleSwap",
    },
  },
  {
    id: 2,
    name: "MantleNFT",
    category: "NFT",
    description: "NFT marketplace optimized for Mantle L2",
    tvl: 500000,
    metadata: {
      website: "https://mantlenft.xyz",
      github: "https://github.com/MantleNFT",
    },
  },
  {
    id: 3,
    name: "MantleVault",
    category: "Infrastructure",
    description: "Secure asset management protocol for Mantle",
    tvl: 2000000,
    metadata: {
      website: "https://mantlevault.xyz",
      docs: "https://docs.mantlevault.xyz",
    },
  },
];

export async function registerRoutes(app: Express): Promise<Server> {
  // Authentication routes
  app.post("/api/auth/login", async (req, res) => {
    const { address } = req.body;

    try {
      // Find or create user with this address
      let user = Array.from(storage.users.values()).find(u => u.address === address);

      if (!user) {
        user = await storage.createUser({ address });
      }

      // Set session
      req.session.userId = user.id;

      res.json({ user });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Error during login" });
    }
  });

  app.post("/api/auth/logout", (req, res) => {
    req.session.destroy((err) => {
      if (err) {
        return res.status(500).json({ message: "Error during logout" });
      }
      res.json({ message: "Logged out successfully" });
    });
  });

  // Protected route example
  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const user = storage.users.get(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  });

  // Existing routes
  app.get("/api/protocols", (_req, res) => {
    res.json(MOCK_PROTOCOLS);
  });

  app.get("/api/protocols/:id", (req, res) => {
    const protocol = MOCK_PROTOCOLS.find(p => p.id === parseInt(req.params.id));
    if (protocol) {
      res.json(protocol);
    } else {
      res.status(404).json({ message: "Protocol not found" });
    }
  });

  // Enhanced interaction routes
  app.get("/api/user/interactions", isAuthenticated, (req, res) => {
    const userId = req.session.userId!;
    // For now, return mock interaction data
    const monthlyData = [
      { date: '2024-01', count: 5 },
      { date: '2024-02', count: 8 },
      { date: '2024-03', count: 12 },
    ];

    const recentActivity = MOCK_PROTOCOLS.slice(0, 3).map(protocol => ({
      protocol,
      lastInteraction: new Date().toISOString(),
      interactionCount: Math.floor(Math.random() * 10) + 1
    }));

    res.json({
      monthlyData,
      recentActivity
    });
  });

  app.post("/api/interactions", isAuthenticated, (req, res) => {
    const { protocolId } = req.body;
    const userId = req.session.userId!;

    // For now, just acknowledge the interaction
    res.json({ success: true });
  });

  // Chat completion endpoint
  app.post("/api/chat", async (req, res) => {
    const { message } = req.body;

    try {
      const response = await generateChatResponse(message);
      res.json({ response });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: "Error processing chat request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}