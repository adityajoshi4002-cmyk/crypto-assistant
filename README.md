# 🪙 Crypto Assistant

A CLI-based cryptocurrency assistant powered by **Google Gemini 2.5 Flash** and the **Vercel AI SDK**, featuring live market price retrieval via the **CoinGecko API**.

---

## ✨ Features

- **Live Market Data Integration**: Fetches real-time crypto prices, market capitalization, and 24-hour price changes using CoinGecko's REST API.
- **Autonomous Tool Calling (ReAct Agent)**: Built using Vercel AI SDK (`ai` and `@ai-sdk/google`), enabling the LLM to decide dynamically when to invoke external tools for real-time market data.
- **Symbol Resolution**: Accepts ticker symbols (`btc`, `eth`, `sol`, `xrp`) or full coin names (`bitcoin`, `solana`, `cardano`) and maps them to CoinGecko canonical slugs automatically.
- **Multi-Currency Support**: Supports configurable fiat quote currencies (`usd`, `eur`, `gbp`, `inr`, etc.).
- **Type-Safe Validation**: Built with TypeScript and Zod schema validation for strict tool input/output contracts.

---

## 🏗️ Architecture & Project Structure

```
crypto-assistant/
├── src/
│   ├── index.ts        # CLI Entry point & process argument handler
│   ├── agent.ts        # Gemini LLM engine & ReAct execution loop
│   ├── tools.ts        # Zod tool definitions & schemas for Vercel AI SDK
│   ├── coingecko.ts    # CoinGecko REST client & ticker resolution map
│   └── config.ts       # Environment variable loader & configuration singleton
├── .env.example        # Environment template file
├── package.json        # Dependencies & package scripts
└── tsconfig.json       # TypeScript compiler settings
```

---

## 🚀 Quick Start

### 1. Prerequisites

- **Node.js**: v18.0.0 or higher
- **Gemini API Key**: Obtain a key from [Google AI Studio](https://aistudio.google.com/apikey).

### 2. Installation

Clone the repository and install dependencies:

```bash
git clone https://github.com/adityajoshi4002-cmyk/crypto-assistant.git
cd crypto-assistant
npm install
```

### 3. Environment Setup

Copy `.env.example` to `.env` and fill in your Gemini API key:

```bash
cp .env.example .env
```

Edit `.env`:

```env
GEMINI_API_KEY=your_gemini_api_key_here

# Optional Configurations
GEMINI_MODEL=gemini-2.5-flash
CRYPTO_CURRENCY=usd
```

---

## 💻 Usage

Run queries directly from your terminal using `npm start`:

```bash
# Check current prices for multiple coins
npm start -- "What is the current price of Bitcoin and Ethereum?"

# Perform market comparisons
npm start -- "Which coin performed better in the last 24 hours: Solana or Cardano?"

# Query with specific pricing requests
npm start -- "What is the price and market cap of Solana?"
```

---

## 🛠️ Available Scripts

- `npm start -- "<query>"`: Run the crypto assistant with a natural language query.
- `npm run typecheck`: Run TypeScript type checking without emitting build files.

---

## 🧰 Built With

- [Vercel AI SDK](https://sdk.vercel.ai/docs) — LLM Framework & Autonomous Tool Calling
- [Google Gemini 2.5 Flash](https://deepmind.google/technologies/gemini/) — LLM Provider via `@ai-sdk/google`
- [CoinGecko API](https://www.coingecko.com/en/api) — Cryptocurrency Market Data Provider
- [Zod](https://zod.dev/) — Runtime Schema Validation
- [Axios](https://axios-http.com/) — HTTP Client
- [tsx](https://github.com/privatenumber/tsx) — TypeScript Execution Environment
