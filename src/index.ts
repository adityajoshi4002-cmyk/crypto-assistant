import { runCryptoAssistant } from "./agent";

async function main() {
  const prompt = process.argv.slice(2).join(" ").trim();

  if (!prompt) {
    console.error(
      "Usage: npm start -- \"<your question>\"\n" +
        "Example: npm start -- \"What is the current price of Bitcoin and Ethereum?\"",
    );
    process.exit(1);
  }

  try {
    const { text, steps, toolCalls } = await runCryptoAssistant(prompt);

    if (toolCalls.length > 0) {
      console.log(`\nTools called (${steps} step(s)): ${toolCalls.join(", ")}`);
    }
    console.log("\n" + text + "\n");
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`\nError: ${message}\n`);
    process.exit(1);
  }
}

main();