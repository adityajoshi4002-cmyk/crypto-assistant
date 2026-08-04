import axios from "axios";

const BASE_URL = "https://api.coingecko.com/api/v3";

/** Maps common ticker symbols and names to CoinGecko coin ids. */
const COIN_ID_MAP: Record<string, string> = {
  btc: "bitcoin",
  bitcoin: "bitcoin",
  eth: "ethereum",
  ethereum: "ethereum",
  sol: "solana",
  solana: "solana",
  ada: "cardano",
  cardano: "cardano",
  xrp: "ripple",
  ripple: "ripple",
  doge: "dogecoin",
  dogecoin: "dogecoin",
  dot: "polkadot",
  polkadot: "polkadot",
  matic: "matic-network",
  avax: "avalanche-2",
  avalanche: "avalanche-2",
  link: "chainlink",
  chainlink: "chainlink",
  ltc: "litecoin",
  litecoin: "litecoin",
  bnb: "binancecoin",
  usdt: "tether",
  usdc: "usd-coin",
};

/** Resolves a user-supplied coin symbol/name to a CoinGecko coin id. */
export function resolveCoinId(coin: string): string {
  const key = coin.trim().toLowerCase();
  if (!key) {
    throw new Error("coin symbol or name is required");
  }
  const mapped = COIN_ID_MAP[key];
  if (mapped) return mapped;
  // If not in the map, assume the caller already passed a CoinGecko id.
  return key;
}

export interface PriceResult {
  coinId: string;
  currency: string;
  price: number | null;
  marketCap: number | null;
  change24h: number | null;
}

/** Fetches the current price (and 24h change / market cap) for a coin. */
export async function getPrice(
  coin: string,
  vsCurrency = "usd",
): Promise<PriceResult> {
  const coinId = resolveCoinId(coin);
  const currency = vsCurrency.toLowerCase();

  const response = await axios.get(`${BASE_URL}/simple/price`, {
    params: {
      ids: coinId,
      vs_currencies: currency,
      include_market_cap: true,
      include_24hr_change: true,
    },
    timeout: 10000,
  });

  const data = response.data?.[coinId];
  if (!data) {
    throw new Error(
      `No price data returned for "${coin}" (resolved id "${coinId}"). ` +
        `The coin id may be invalid or unsupported.`,
    );
  }

  return {
    coinId,
    currency,
    price: typeof data[currency] === "number" ? data[currency] : null,
    marketCap:
      typeof data[`${currency}_market_cap`] === "number"
        ? data[`${currency}_market_cap`]
        : null,
    change24h:
      typeof data[`${currency}_24h_change`] === "number"
        ? data[`${currency}_24h_change`]
        : null,
  };
}