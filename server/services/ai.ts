import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

// Initialize context about Mantle ecosystem
const MANTLE_CONTEXT = `
You are an AI assistant specializing in the Mantle ecosystem. Your role is to help users understand:
- Different protocols available on Mantle (like MantleSwap, MantleNFT, MantleVault)
- How to interact with these protocols
- Basic concepts of DeFi, NFTs, and blockchain infrastructure
- Technical aspects of the Mantle L2 solution

Keep responses concise and focused on Mantle-specific information.
`;

export async function generateChatResponse(userMessage: string): Promise<string> {
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: MANTLE_CONTEXT },
        { role: "user", content: userMessage }
      ],
      temperature: 0.7,
      max_tokens: 500
    });

    return response.choices[0].message.content || "I apologize, but I couldn't generate a response at this moment.";
  } catch (error) {
    console.error('OpenAI API Error:', error);
    throw new Error('Failed to generate AI response');
  }
}
