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
      if (!address) {
        return res.status(400).json({ message: "Wallet address is required" });
      }

      // Find or create user with this address
      let user = Array.from(storage.users.values()).find(u => u.address === address);

      if (!user) {
        // Create user with randomly generated username and password since we're using wallet auth
        const randomId = Math.random().toString(36).substring(7);
        user = await storage.createUser({
          username: `user_${randomId}`,
          password: `pass_${randomId}`,
          address: address
        });
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

  app.get("/api/auth/me", isAuthenticated, (req, res) => {
    const user = storage.users.get(req.session.userId!);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json({ user });
  });

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

  app.get("/api/interactions/:address", isAuthenticated, (req, res) => {
    res.json([
      { protocolId: 1, count: 5 },
      { protocolId: 2, count: 2 },
    ]);
  });

  app.post("/api/interactions", isAuthenticated, (req, res) => {
    const { protocolId, address } = req.body;
    res.json({ success: true });
  });

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