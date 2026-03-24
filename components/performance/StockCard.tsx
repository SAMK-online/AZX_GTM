"use client";

import { motion } from "framer-motion";
import { StockChart } from "./StockChart";

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

function fmt(n: number) {
  if (n >= 1e12) return `$${(n / 1e12).toFixed(2)}T`;
  if (n >= 1e9) return `$${(n / 1e9).toFixed(2)}B`;
  if (n >= 1e6) return `$${(n / 1e6).toFixed(2)}M`;
  return `$${n.toLocaleString()}`;
}

interface StockCardProps {
  stock: StockData;
  delay?: number;
}

export function StockCard({ stock, delay = 0 }: StockCardProps) {
  const positive = stock.change >= 0;
  const rangePos = stock.high52w > stock.low52w
    ? ((stock.currentPrice - stock.low52w) / (stock.high52w - stock.low52w)) * 100
    : 50;

  if (stock.error) {
    return (
      <div className="rounded-xl border border-azx-border bg-azx-card p-6 flex items-center justify-center h-72">
        <div className="text-center">
          <div className="font-mono text-2xl font-bold text-white mb-1">{stock.symbol}</div>
          <div className="font-mono text-xs text-azx-muted">Data unavailable</div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay, type: "spring", stiffness: 280, damping: 28 }}
      className="rounded-xl border border-azx-border bg-azx-card overflow-hidden hover:border-white/15 transition-colors duration-300"
    >
      {/* Header */}
      <div className="px-5 pt-5 pb-3">
        <div className="flex items-start justify-between mb-3">
          <div>
            <div className="flex items-center gap-2 mb-0.5">
              <span className="font-mono text-xl font-bold text-white">{stock.symbol}</span>
              {stock.isClient && (
                <span className="font-mono text-[9px] px-1.5 py-0.5 rounded tracking-widest bg-white text-black font-bold">
                  CLIENT
                </span>
              )}
            </div>
            <div className="font-mono text-xs text-white/50 truncate max-w-[160px]">{stock.name}</div>
            <div className="font-mono text-[9px] text-azx-muted tracking-widest mt-0.5 uppercase">{stock.sector}</div>
          </div>

          <div className="text-right">
            <div className="font-mono text-xl font-bold text-white">
              ${stock.currentPrice.toFixed(2)}
            </div>
            <div className={`font-mono text-xs font-semibold mt-0.5 ${positive ? "text-white" : "text-white/40"}`}>
              {positive ? "+" : ""}{stock.change.toFixed(2)} ({positive ? "+" : ""}{stock.changePercent.toFixed(2)}%)
            </div>
          </div>
        </div>

        {/* Change bar */}
        <div className={`h-px mb-3 ${positive ? "bg-white/40" : "bg-white/10"}`} />
      </div>

      {/* Chart */}
      <div className="px-2">
        <StockChart data={stock.sparkline} positive={positive} height={150} />
      </div>

      {/* Stats grid */}
      <div className="px-5 pb-5 pt-2">
        <div className="grid grid-cols-2 gap-x-6 gap-y-3 mb-4">
          {[
            { label: "Market Cap", value: fmt(stock.marketCap) },
            { label: "Volume",     value: fmt(stock.volume) },
            { label: "52W High",   value: `$${stock.high52w.toFixed(2)}` },
            { label: "52W Low",    value: `$${stock.low52w.toFixed(2)}` },
          ].map(({ label, value }) => (
            <div key={label}>
              <div className="font-mono text-[9px] text-azx-muted tracking-widest uppercase mb-0.5">{label}</div>
              <div className="font-mono text-xs text-white/80">{value}</div>
            </div>
          ))}
        </div>

        {/* 52W range bar */}
        <div>
          <div className="flex items-center justify-between mb-1.5">
            <span className="font-mono text-[9px] text-azx-muted tracking-widest uppercase">52W Range</span>
            <span className="font-mono text-[9px] text-white/40">{rangePos.toFixed(0)}%</span>
          </div>
          <div className="h-1 rounded-full bg-azx-border overflow-hidden">
            <motion.div
              className="h-full bg-white rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${Math.max(2, Math.min(100, rangePos))}%` }}
              transition={{ duration: 1, delay: delay + 0.3, ease: "easeOut" }}
            />
          </div>
          <div className="flex justify-between mt-1">
            <span className="font-mono text-[8px] text-azx-muted">${stock.low52w.toFixed(0)}</span>
            <span className="font-mono text-[8px] text-azx-muted">${stock.high52w.toFixed(0)}</span>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
