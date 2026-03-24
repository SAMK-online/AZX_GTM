"use client";

import { useState, useEffect, useCallback } from "react";
import { CompanySignalCard } from "./CompanySignalCard";
import { ComparisonChart } from "./SignalChart";
import { parseSignals } from "@/lib/signal-parser";
import {
  getAllTrackedCompanies,
  addTrackedCompany,
  getCachedSignals,
} from "@/lib/signals-store";
import type { ParsedSignal } from "@/types";

export function AccountSignalsTab() {
  const [companies, setCompanies] = useState<string[]>([]);
  const [addInput, setAddInput] = useState("");
  const [addError, setAddError] = useState("");
  const [chartData, setChartData] = useState<{ name: string; signals: ParsedSignal[] }[]>([]);

  const refresh = useCallback(() => {
    const all = getAllTrackedCompanies();
    setCompanies(all);
    setChartData(
      all.map((name) => ({
        name,
        signals: parseSignals(getCachedSignals(name)?.content ?? ""),
      }))
    );
  }, []);

  useEffect(() => {
    refresh();
  }, [refresh]);

  const handleAdd = useCallback(() => {
    const name = addInput.trim();
    if (!name) return;
    if (name.length < 2) { setAddError("Company name too short"); return; }
    addTrackedCompany(name);
    setAddInput("");
    setAddError("");
    refresh();
  }, [addInput, refresh]);

  const handleRemove = useCallback(() => {
    refresh();
  }, [refresh]);

  // Refresh chart data when any card updates (poll localStorage lightly)
  useEffect(() => {
    const id = setInterval(() => {
      setChartData(
        getAllTrackedCompanies().map((name) => ({
          name,
          signals: parseSignals(getCachedSignals(name)?.content ?? ""),
        }))
      );
    }, 3000);
    return () => clearInterval(id);
  }, []);

  const hasAnySignals = chartData.some((d) => d.signals.length > 0);

  return (
    <div className="space-y-5">
      {/* Cross-company comparison chart */}
      {hasAnySignals && (
        <ComparisonChart data={chartData} />
      )}

      {/* Add company row */}
      <div className="flex items-center gap-2">
        <input
          type="text"
          value={addInput}
          onChange={(e) => { setAddInput(e.target.value); setAddError(""); }}
          onKeyDown={(e) => e.key === "Enter" && handleAdd()}
          placeholder="Track another company..."
          className="flex-1 px-3 py-2 rounded-lg border border-azx-border bg-azx-dark
                     font-mono text-sm text-white placeholder:text-azx-muted
                     focus:outline-none focus:border-white/30 transition-colors"
        />
        <button
          onClick={handleAdd}
          className="px-4 py-2 rounded-lg border border-azx-border font-mono text-sm
                     text-azx-muted hover:text-white hover:border-white/20 transition-colors whitespace-nowrap"
        >
          + Track
        </button>
      </div>
      {addError && <p className="font-mono text-[10px] text-red-400">{addError}</p>}

      {/* Account count */}
      <div className="font-mono text-[10px] text-white/25 tracking-widest">
        {companies.length} ACCOUNT{companies.length !== 1 ? "S" : ""} MONITORED
        {!hasAnySignals && " · CLICK FETCH ON EACH TO LOAD SIGNALS"}
      </div>

      {/* Company cards — 2-column grid on desktop */}
      <div className="grid md:grid-cols-2 gap-4">
        {companies.map((company) => (
          <CompanySignalCard
            key={company}
            companyName={company}
            onRemove={handleRemove}
          />
        ))}
      </div>
    </div>
  );
}
