"use client";

import { useEffect, useState, useCallback } from "react";
import { motion } from "framer-motion";
import { TrendingUp, RefreshCw } from "lucide-react";
import { StockCard } from "@/components/performance/StockCard";

interface StockData {
  symbol: string;
  name: string;
  sector: string;
  isClient: boolean;
  currentPrice: number;
  change: number;
  changePercent: number;
  marketCap: number;
  volume: number;
  high52w: number;
  low52w: number;
  sparkline: number[];
  error?: boolean;
}

const MOCK_DATA: StockData[] = [
  {
    symbol: "CBRE", name: "CBRE Group", sector: "Real Estate", isClient: true,
    currentPrice: 132.45, change: 1.82, changePercent: 1.39, marketCap: 40_200_000_000,
    volume: 1_250_000, high52w: 146.80, low52w: 88.20,
    sparkline: [118,119,121,120,122,124,123,125,126,124,127,128,126,129,130,128,131,130,132,131,133,132,134,133,132,134,133,135,132,133],
    error: false,
  },
  {
    symbol: "NEE", name: "NextEra Energy", sector: "Energy", isClient: false,
    currentPrice: 68.92, change: -0.43, changePercent: -0.62, marketCap: 140_800_000_000,
    volume: 5_800_000, high52w: 82.30, low52w: 54.60,
    sparkline: [72,71,70,71,69,70,68,69,70,69,68,70,69,68,70,71,70,69,68,69,70,69,68,69,70,69,68,69,68,69],
    error: false,
  },
  {
    symbol: "GXO", name: "GXO Logistics", sector: "Logistics", isClient: false,
    currentPrice: 41.20, change: 0.65, changePercent: 1.60, marketCap: 4_950_000_000,
    volume: 920_000, high52w: 52.10, low52w: 31.40,
    sparkline: [36,37,36,38,37,39,38,39,40,39,41,40,42,41,40,41,40,41,42,41,40,42,41,40,41,42,41,40,41,42],
    error: false,
  },
  {
    symbol: "AWK", name: "American Water Works", sector: "Utilities", isClient: false,
    currentPrice: 131.80, change: 0.95, changePercent: 0.73, marketCap: 25_400_000_000,
    volume: 680_000, high52w: 148.90, low52w: 108.20,
    sparkline: [124,125,124,126,125,127,126,127,128,127,129,128,127,129,130,129,130,129,131,130,131,130,132,131,130,132,131,132,131,132],
    error: false,
  },
];

export default function PerformancePage() {
  const [stocks, setStocks] = useState<StockData[]>(MOCK_DATA);
  const [loading, setLoading] = useState(true);
  const [lastUpdate, setLastUpdate] = useState<string>("");
  const [usingLive, setUsingLive] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStocks = useCallback(async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    try {
      const res = await fetch("/api/stocks");
      if (res.ok) {
        const json = await res.json();
        if (json.data && Array.isArray(json.data)) {
          const anyLive = json.data.some((d: StockData) => !d.error && d.currentPrice > 0);
          if (anyLive) {
            setStocks(json.data);
            setUsingLive(true);
          }
          setLastUpdate(new Date(json.updatedAt).toLocaleTimeString());
        }
      }
    } catch {
      // keep mock data
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchStocks();
    const interval = setInterval(() => fetchStocks(), 60_000);
    return () => clearInterval(interval);
  }, [fetchStocks]);

  const totalMarketCap = stocks.reduce((s, d) => s + (d.marketCap ?? 0), 0);
  const gainers = stocks.filter((d) => (d.change ?? 0) >= 0).length;

  return (
    <main className="min-h-screen px-6 py-12 max-w-7xl mx-auto">

      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-10"
      >
        <div className="flex items-start justify-between flex-wrap gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <TrendingUp size={14} className="text-white/40" />
              <span className="font-mono text-[10px] text-white/40 tracking-widest uppercase">
                Market Performance
              </span>
              {usingLive ? (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-white/20 text-white/50 tracking-widest">
                  LIVE
                </span>
              ) : (
                <span className="font-mono text-[9px] px-2 py-0.5 rounded-full border border-azx-border text-azx-muted tracking-widest">
                  DEMO DATA
                </span>
              )}
            </div>
            <h1 className="font-mono text-3xl md:text-4xl font-bold text-white leading-tight">
              Client Sector<br />
              <span className="text-white/40">Performance</span>
            </h1>
            <p className="text-slate-400 text-sm mt-3 max-w-xl leading-relaxed">
              Public market performance across tracked client sectors —
              Real Estate (CBRE), Energy, Logistics, and Utilities.
              Charts update every 60 seconds.
            </p>
          </div>

          <div className="flex flex-col items-end gap-3">
            <button
              onClick={() => fetchStocks(true)}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 rounded-lg border border-azx-border bg-azx-card
                         font-mono text-xs text-azx-muted hover:text-white hover:border-white/20 transition-colors
                         disabled:opacity-40"
            >
              <RefreshCw size={12} className={refreshing ? "animate-spin" : ""} />
              Refresh
            </button>
            {lastUpdate && (
              <span className="font-mono text-[10px] text-azx-muted">Updated {lastUpdate}</span>
            )}
          </div>
        </div>

        {/* Summary strip */}
        <div className="mt-8 grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { label: "Tracked Companies", value: stocks.length.toString() },
            { label: "Confirmed Clients", value: stocks.filter((s) => s.isClient).length.toString() },
            { label: "Gainers Today", value: `${gainers} / ${stocks.length}` },
            {
              label: "Combined Market Cap",
              value: totalMarketCap >= 1e12
                ? `$${(totalMarketCap / 1e12).toFixed(2)}T`
                : `$${(totalMarketCap / 1e9).toFixed(0)}B`,
            },
          ].map(({ label, value }) => (
            <div key={label} className="rounded-lg border border-azx-border bg-azx-card px-4 py-3">
              <div className="font-mono text-[9px] text-azx-muted tracking-widest uppercase mb-1">{label}</div>
              <div className="font-mono text-lg font-bold text-white">{value}</div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Stock cards grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="rounded-xl border border-azx-border bg-azx-card h-80 animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 xl:grid-cols-4 gap-6">
          {stocks.map((stock, i) => (
            <StockCard key={stock.symbol} stock={stock} delay={i * 0.08} />
          ))}
        </div>
      )}

      {/* Disclaimer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8 }}
        className="mt-10 font-mono text-[9px] text-azx-muted tracking-widest text-center"
      >
        MARKET DATA VIA YAHOO FINANCE · 15-MIN DELAY · FOR STRATEGIC CONTEXT ONLY · NOT FINANCIAL ADVICE
      </motion.div>
    </main>
  );
}
