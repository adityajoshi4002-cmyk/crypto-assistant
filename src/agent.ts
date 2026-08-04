import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { generateText, stepCountIs } from "ai";
import { getConfig } from "./config.ts";
import { cryptoTools } from "./tools";

const google = createGoogleGenerativeAI({
  apiKey: getConfig().apiKey,
});

const SYSTEM_PROMPT = [
  "You are CryptoAssistant, a helpful and accurate cryptocurrency assistant.",
  "You can answer general questions about cryptocurrencies from your own knowledge,",
  "but for any CURRENT PRICE or live market data you MUST call the get_crypto_price tool",
  "rather than relying on your training data (prices change constantly).",
  "When the tool returns results, summarize them clearly for the user,",
  "including the price, currency, and 24h change where available.",
  "If a tool call fails, tell the user what went wrong instead of making up numbers.",
].join(" ");

export interface AgentResult {
  text: string;
  steps: number;
  toolCalls: string[];
}

/** Runs one turn of the crypto assistant against the given user prompt. */
export async function runCryptoAssistant(prompt: string): Promise<AgentResult> {
  const { text, steps, toolCalls } = await generateText({
    model: google(getConfig().model),
    system: SYSTEM_PROMPT,
    prompt,
    tools: cryptoTools,
    stopWhen: stepCountIs(5),
  });

  return {
    text,
    steps: steps.length,
    toolCalls: toolCalls.map((c) => c.toolName),
  };
}