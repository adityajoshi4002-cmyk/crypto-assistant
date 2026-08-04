import dotenv from "dotenv";

dotenv.config();

function required(name: string): string {
  const value = process.env[name];
  if (!value || value.trim() === "") {
    throw new Error(
      `Missing required environment variable "${name}". ` +
        `Copy .env.example to .env and fill it in.`,
    );
  }
  return value.trim();
}

export interface AppConfig {
  apiKey: string;
  model: string;
  currency: string;
}

let cached: AppConfig | null = null;

/** Lazily loads and validates config from the environment. */
export function getConfig(): AppConfig {
  if (cached) return cached;
  cached = {
    apiKey: required("GEMINI_API_KEY"),
    model: (process.env.GEMINI_MODEL || "gemini-2.5-flash").trim(),
    currency: (process.env.CRYPTO_CURRENCY || "usd").trim().toLowerCase(),
  };
  return cached;
}