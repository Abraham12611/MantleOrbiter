import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";

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

// Basic context for the AI to understand common protocol-related questions
const PROTOCOL_CONTEXT = `
You are an AI assistant specializing in the Mantle ecosystem. You help users understand:
- Different protocols available on Mantle
- How to interact with these protocols
- Basic concepts of DeFi, NFTs, and blockchain infrastructure
- Technical aspects of the Mantle L2 solution
`;

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
      // For now, return structured mock responses based on keywords
      let response = "I'm currently being upgraded to provide more accurate information about the Mantle ecosystem.";

      const lowercaseMessage = message.toLowerCase();
      if (lowercaseMessage.includes("mantleswap") || lowercaseMessage.includes("swap")) {
        response = "MantleSwap is the primary decentralized exchange (DEX) on Mantle network. It allows you to swap tokens easily with low fees thanks to Mantle's L2 technology.";
      } else if (lowercaseMessage.includes("nft") || lowercaseMessage.includes("mantlenft")) {
        response = "MantleNFT is Mantle's NFT marketplace, allowing you to mint, buy, and sell NFTs with minimal gas fees. The platform supports various NFT standards.";
      } else if (lowercaseMessage.includes("vault") || lowercaseMessage.includes("mantlevault")) {
        response = "MantleVault is a secure asset management protocol that helps users optimize their yield on Mantle. It automatically moves assets between different protocols to maximize returns.";
      } else if (lowercaseMessage.includes("tvl") || lowercaseMessage.includes("value")) {
        response = "The Total Value Locked (TVL) across major Mantle protocols: MantleSwap ($1.5M), MantleNFT ($500K), and MantleVault ($2M). These numbers represent the amount of assets locked in these protocols.";
      }

      res.json({ response });
    } catch (error) {
      console.error('Chat error:', error);
      res.status(500).json({ message: "Error processing chat request" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}