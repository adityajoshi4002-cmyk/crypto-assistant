import { tool, zodSchema } from "ai";
import { z } from "zod";
import { getPrice } from "./coingecko";
import { getConfig } from "./config";

const priceInputSchema = z.object({
  coins: z
    .array(z.string())
    .min(1)
    .describe(
      'Coins to look up, e.g. ["btc", "ethereum"]. Use symbols or names.',
    ),
  currency: z
    .string()
    .optional()
    .describe(
      'Quote currency, e.g. "usd" or "eur". Defaults to the configured currency.',
    ),
});

type PriceInput = z.infer<typeof priceInputSchema>;

interface PriceEntry {
  coin: string;
  coinId?: string;
  currency?: string;
  price?: number | null;
  marketCap?: number | null;
  change24h?: number | null;
  error?: string;
}

interface PriceOutput {
  currency: string;
  results: PriceEntry[];
}

/**
 * Tool: get_crypto_price
 * Returns the current price (plus market cap and 24h change) for one or more
 * crypto coins, quoted in the configured currency (default USD).
 *
 * The model supplies ticker symbols or names (e.g. "btc", "ethereum"); the
 * tool resolves them to CoinGecko coin ids.
 */
export const getCryptoPriceTool = tool({
  description:
    "Get the current price of one or more cryptocurrencies. " +
    "Accepts ticker symbols (btc, eth, sol) or names (bitcoin, ethereum). " +
    "Returns price, market cap, and 24h change in the target currency.",
  inputSchema: zodSchema(priceInputSchema),
  execute: async ({ coins, currency }: PriceInput): Promise<PriceOutput> => {
    const { currency: defaultCurrency } = getConfig();
    const quote = (currency || defaultCurrency).toLowerCase();
    const results: PriceEntry[] = [];

    for (const coin of coins) {
      try {
        const price = await getPrice(coin, quote);
        results.push({
          coin: coin.toLowerCase(),
          coinId: price.coinId,
          currency: price.currency,
          price: price.price,
          marketCap: price.marketCap,
          change24h: price.change24h,
        });
      } catch (err) {
        const message = err instanceof Error ? err.message : String(err);
        results.push({ coin: coin.toLowerCase(), error: message });
      }
    }

    return { currency: quote, results };
  },
});

export const cryptoTools = {
  get_crypto_price: getCryptoPriceTool,
} as const;