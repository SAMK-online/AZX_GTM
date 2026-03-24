export const runtime = "edge";

const TICKERS = [
  { symbol: "CBRE", name: "CBRE Group",          sector: "Real Estate", isClient: true,  fallbackMarketCap: 40_200_000_000  },
  { symbol: "NEE",  name: "NextEra Energy",       sector: "Energy",      isClient: false, fallbackMarketCap: 140_800_000_000 },
  { symbol: "GXO",  name: "GXO Logistics",        sector: "Logistics",   isClient: false, fallbackMarketCap: 4_950_000_000   },
  { symbol: "AWK",  name: "American Water Works", sector: "Utilities",   isClient: false, fallbackMarketCap: 25_400_000_000  },
];

async function fetchTicker(symbol: string) {
  const url = `https://query1.finance.yahoo.com/v8/finance/chart/${symbol}?interval=1d&range=1mo&includePrePost=false`;
  const res = await fetch(url, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!res.ok) throw new Error(`Yahoo Finance error for ${symbol}: ${res.status}`);
  return res.json();
}

export async function GET() {
  try {
    const results = await Promise.allSettled(TICKERS.map((t) => fetchTicker(t.symbol)));

    const data = TICKERS.map((ticker, i) => {
      const result = results[i];
      if (result.status === "rejected") {
        return { ...ticker, error: true };
      }

      const chart = result.value?.chart?.result?.[0];
      if (!chart) return { ...ticker, error: true };

      const meta = chart.meta;
      const closes: number[] = (chart.indicators?.quote?.[0]?.close ?? []).filter(
        (v: number | null) => v != null
      );

      const currentPrice: number = meta.regularMarketPrice ?? closes[closes.length - 1] ?? 0;
      const prevClose: number = meta.chartPreviousClose ?? closes[closes.length - 2] ?? currentPrice;
      const change = currentPrice - prevClose;
      const changePercent = prevClose !== 0 ? (change / prevClose) * 100 : 0;

      return {
        symbol: ticker.symbol,
        name: ticker.name,
        sector: ticker.sector,
        isClient: ticker.isClient,
        currentPrice,
        change,
        changePercent,
        marketCap: meta.marketCap || ticker.fallbackMarketCap,
        volume: meta.regularMarketVolume ?? 0,
        high52w: meta.fiftyTwoWeekHigh ?? 0,
        low52w: meta.fiftyTwoWeekLow ?? 0,
        sparkline: closes,
        currency: meta.currency ?? "USD",
        exchange: meta.exchangeName ?? "",
        error: false,
      };
    });

    return Response.json({ data, updatedAt: new Date().toISOString() });
  } catch (err) {
    return Response.json({ error: String(err) }, { status: 500 });
  }
}
