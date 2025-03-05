import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { generateChatResponse } from "./services/ai";

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
  // Get all protocols
  app.get("/api/protocols", (_req, res) => {
    res.json(MOCK_PROTOCOLS);
  });

  // Get specific protocol
  app.get("/api/protocols/:id", (req, res) => {
    const protocol = MOCK_PROTOCOLS.find(p => p.id === parseInt(req.params.id));
    if (protocol) {
      res.json(protocol);
    } else {
      res.status(404).json({ message: "Protocol not found" });
    }
  });

  // Get user interactions
  app.get("/api/interactions/:address", (req, res) => {
    // Mock interaction data
    res.json([
      { protocolId: 1, count: 5 },
      { protocolId: 2, count: 2 },
    ]);
  });

  // Update interaction
  app.post("/api/interactions", (req, res) => {
    const { protocolId, address } = req.body;
    // Mock successful interaction update
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