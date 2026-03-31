"use client";

import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import type { ChurnAnalysisResult, ChurnClient, ChurnRiskLevel } from "@/types";
import { getChurnSession, saveChurnSession, clearChurnSession } from "@/lib/churn-store";

// ── CSV Parser ─────────────────────────────────────────────────────────────

function parseCSV(raw: string): { headers: string[]; rows: Record<string, string>[] } {
  const lines = raw.trim().split(/\r?\n/).filter(Boolean);
  if (lines.length < 2) return { headers: [], rows: [] };

  function splitRow(line: string): string[] {
    const out: string[] = [];
    let cur = "";
    let inQ = false;
    for (const ch of line) {
      if (ch === '"') { inQ = !inQ; }
      else if (ch === "," && !inQ) { out.push(cur.trim()); cur = ""; }
      else { cur += ch; }
    }
    out.push(cur.trim());
    return out;
  }

  const headers = splitRow(lines[0]);
  const rows = lines.slice(1, 101).map((line) => {
    const vals = splitRow(line);
    return headers.reduce<Record<string, string>>((acc, h, i) => {
      acc[h] = vals[i] ?? "";
      return acc;
    }, {});
  });
  return { headers, rows };
}

function autoDetect(headers: string[], keywords: string[]): string {
  return (
    headers.find((h) => keywords.some((kw) => h.toLowerCase().includes(kw))) ??
    headers[0] ??
    ""
  );
}

function toNum(val: string | undefined): number {
  return parseFloat(String(val ?? "").replace(/[^0-9.-]/g, "")) || 0;
}

function previewCounts(
  rows: Record<string, string>[],
  aCol: string,
  cCol: string,
  aThresh: number,
  cThresh: number
) {
  let high = 0, low = 0, well = 0;
  for (const row of rows) {
    const a = toNum(row[aCol]);
    const c = toNum(row[cCol]);
    if (a < aThresh && c < cThresh) high++;
    else if (a < aThresh || c < cThresh) low++;
    else well++;
  }
  return { high, low, well };
}

// ── Risk styling ──────────────────────────────────────────────────────────

const RISK = {
  HIGH: {
    label: "HIGH RISK",
    short: "HIGH",
    color: "text-red-400",
    bg: "bg-red-500/10",
    border: "border-red-500/20",
    rowBg: "bg-red-500/[0.04]",
    bar: "bg-red-400",
  },
  LOW: {
    label: "LOW RISK",
    short: "LOW",
    color: "text-amber-400",
    bg: "bg-amber-500/10",
    border: "border-amber-500/20",
    rowBg: "bg-amber-500/[0.04]",
    bar: "bg-amber-400",
  },
  WELL_PERFORMING: {
    label: "HEALTHY",
    short: "WELL",
    color: "text-emerald-400",
    bg: "bg-emerald-500/10",
    border: "border-emerald-500/20",
    rowBg: "",
    bar: "bg-emerald-400",
  },
} as const;

// ── Component ─────────────────────────────────────────────────────────────

type Phase = "idle" | "configured" | "analyzing" | "results";
type FilterKey = "all" | ChurnRiskLevel;

export function ChurnAnalysisTab() {
  const [phase, setPhase] = useState<Phase>("idle");
  const [fileName, setFileName] = useState("");
  const [headers, setHeaders] = useState<string[]>([]);
  const [rows, setRows] = useState<Record<string, string>[]>([]);
  const [nameCol, setNameCol] = useState("");
  const [adoptionCol, setAdoptionCol] = useState("");
  const [conversionCol, setConversionCol] = useState("");
  const [adoptionThresh, setAdoptionThresh] = useState(40);
  const [conversionThresh, setConversionThresh] = useState(30);
  const [result, setResult] = useState<ChurnAnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<FilterKey>("all");
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── File handling ──────────────────────────────────────────────────────

  const processFile = useCallback((file: File) => {
    if (!file.name.toLowerCase().endsWith(".csv")) {
      setError("Please upload a .csv file");
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const parsed = parseCSV(text);
      if (!parsed.headers.length || !parsed.rows.length) {
        setError("Could not parse CSV — check file format (needs header row + data)");
        return;
      }
      setHeaders(parsed.headers);
      setRows(parsed.rows);
      setFileName(file.name);
      setNameCol(autoDetect(parsed.headers, ["name", "client", "account", "company", "customer"]));
      setAdoptionCol(autoDetect(parsed.headers, ["adoption", "adopted", "usage", "utilization", "active"]));
      setConversionCol(autoDetect(parsed.headers, ["conversion", "convert", "close", "win", "rate", "cvr"]));
      setError(null);
      setResult(null);
      setPhase("configured");
    };
    reader.readAsText(file);
  }, []);

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = "";
  };

  // ── Analysis ───────────────────────────────────────────────────────────

  const analyze = async () => {
    setPhase("analyzing");
    setError(null);
    try {
      const res = await fetch("/api/churn", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rows,
          nameColumn: nameCol,
          adoptionColumn: adoptionCol,
          conversionColumn: conversionCol,
          adoptionThreshold: adoptionThresh,
          conversionThreshold: conversionThresh,
        }),
      });
      if (!res.ok) {
        const { error: msg } = (await res.json()) as { error: string };
        throw new Error(msg || "Analysis failed");
      }
      const data = (await res.json()) as ChurnAnalysisResult;
      setResult(data);
      setFilter("all");
      setPhase("results");
      saveChurnSession({
        result: data,
        fileName,
        nameCol,
        adoptionCol,
        conversionCol,
        adoptionThresh,
        conversionThresh,
        analyzedAt: new Date().toISOString(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Analysis failed");
      setPhase("configured");
    }
  };

  const reset = () => {
    clearChurnSession();
    setPhase("idle");
    setFileName("");
    setHeaders([]);
    setRows([]);
    setResult(null);
    setError(null);
    setFilter("all");
  };

  const downloadReport = () => {
    if (!result) return;
    const cols = [nameCol, adoptionCol, conversionCol, "Risk Level", "Risk Score", "Reasoning"];
    const dataRows = result.analyzed.map((c) => [
      String(c[nameCol] ?? ""),
      String(c[adoptionCol] ?? ""),
      String(c[conversionCol] ?? ""),
      c.riskLevel,
      String(c.riskScore),
      `"${c.reasoning.replace(/"/g, "'")}"`,
    ]);
    const csv = [cols.join(","), ...dataRows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `churn-analysis-${new Date().toISOString().split("T")[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // ── Derived state ──────────────────────────────────────────────────────

  const preview =
    phase === "configured"
      ? previewCounts(rows, adoptionCol, conversionCol, adoptionThresh, conversionThresh)
      : null;

  const filteredClients = (result?.analyzed ?? [])
    .filter((c) => filter === "all" || c.riskLevel === filter)
    .sort((a, b) => b.riskScore - a.riskScore);

  // ── Restore last session on mount ─────────────────────────────────────

  useEffect(() => {
    const session = getChurnSession();
    if (!session) return;
    setResult(session.result);
    setFileName(session.fileName);
    setNameCol(session.nameCol);
    setAdoptionCol(session.adoptionCol);
    setConversionCol(session.conversionCol);
    setAdoptionThresh(session.adoptionThresh);
    setConversionThresh(session.conversionThresh);
    setPhase("results");
  }, []);

  // ── Derived ─────────────────────────────────────────────────────────────

  const columnFields = [
    { label: "Client Name Column", value: nameCol, onChange: setNameCol },
    { label: "Adoption Rate Column", value: adoptionCol, onChange: setAdoptionCol },
    { label: "Conversion Rate Column", value: conversionCol, onChange: setConversionCol },
  ];

  const thresholdFields = [
    { label: "Adoption Rate below", value: adoptionThresh, onChange: setAdoptionThresh },
    { label: "Conversion Rate below", value: conversionThresh, onChange: setConversionThresh },
  ];

  // ── Render ─────────────────────────────────────────────────────────────

  return (
    <div className="space-y-5">
      {error && (
        <div className="p-3 rounded-lg border border-red-500/20 bg-red-500/5 font-mono text-xs text-red-400">
          {error}
        </div>
      )}

      {/* ── IDLE: Upload zone ── */}
      {phase === "idle" && (
        <div
          onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
          onDragLeave={() => setIsDragging(false)}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
          className={cn(
            "relative flex flex-col items-center justify-center gap-4 p-12 rounded-xl border-2 border-dashed cursor-pointer transition-all duration-200",
            isDragging
              ? "border-white/40 bg-white/[0.03]"
              : "border-azx-border bg-azx-card/50 hover:border-white/20 hover:bg-white/[0.02]"
          )}
        >
          <div className="w-14 h-14 rounded-full border border-azx-border bg-azx-card flex items-center justify-center text-2xl text-azx-muted">
            ↑
          </div>
          <div className="text-center space-y-1">
            <div className="font-mono text-sm font-bold text-white">Upload Client CSV</div>
            <div className="text-xs text-azx-muted">Drop your file here, or click to browse</div>
          </div>
          <div className="flex items-center gap-6 mt-1">
            <div className="text-center">
              <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-1">Expected Columns</div>
              <div className="text-[11px] text-slate-500">Name · Adoption % · Conversion %</div>
            </div>
            <div className="w-px h-8 bg-azx-border" />
            <div className="text-center">
              <div className="font-mono text-[10px] text-white/25 tracking-widest uppercase mb-1">Limit</div>
              <div className="text-[11px] text-slate-500">Up to 100 rows per analysis</div>
            </div>
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept=".csv"
            onChange={handleFileChange}
            className="absolute inset-0 opacity-0 cursor-pointer"
          />
        </div>
      )}

      {/* ── CONFIGURED: Config panel ── */}
      {phase === "configured" && (
        <div className="space-y-4">
          {/* File badge */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-white" />
              <span className="font-mono text-xs text-white">{fileName}</span>
              <span className="font-mono text-[10px] text-azx-muted">
                {rows.length} rows · {headers.length} columns
              </span>
            </div>
            <button
              onClick={reset}
              className="font-mono text-[10px] text-azx-muted hover:text-white transition-colors"
            >
              ✕ Change file
            </button>
          </div>

          {/* Column mapping */}
          <div className="rounded-xl border border-azx-border bg-azx-card p-4 space-y-3">
            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
              Column Mapping
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {columnFields.map(({ label, value, onChange }) => (
                <div key={label} className="space-y-1.5">
                  <label className="font-mono text-[10px] text-azx-muted">{label}</label>
                  <select
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-azx-border bg-azx-dark
                               font-mono text-xs text-white focus:outline-none focus:border-white/30
                               transition-colors"
                  >
                    {headers.map((h) => (
                      <option key={h} value={h} className="bg-[#0d0d0d]">
                        {h}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
            </div>
          </div>

          {/* Thresholds */}
          <div className="rounded-xl border border-azx-border bg-azx-card p-4 space-y-4">
            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
              Risk Thresholds
            </div>
            {thresholdFields.map(({ label, value, onChange }) => (
              <div key={label} className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-white">{label}</span>
                  <span className="font-mono text-sm font-bold text-white">{value}%</span>
                </div>
                <input
                  type="range"
                  min="5"
                  max="95"
                  step="5"
                  value={value}
                  onChange={(e) => onChange(Number(e.target.value))}
                  className="w-full h-1 accent-white cursor-pointer"
                />
              </div>
            ))}
          </div>

          {/* Threshold preview */}
          {preview && (
            <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-azx-border bg-azx-card/50">
              <span className="font-mono text-[10px] text-white/30 tracking-widest uppercase">
                Estimate
              </span>
              <span className="font-mono text-xs text-red-400 font-bold">{preview.high} HIGH</span>
              <span className="text-azx-border">·</span>
              <span className="font-mono text-xs text-amber-400 font-bold">{preview.low} LOW</span>
              <span className="text-azx-border">·</span>
              <span className="font-mono text-xs text-emerald-400 font-bold">{preview.well} WELL</span>
              <span className="font-mono text-[10px] text-azx-muted ml-1">
                — Claude will refine with deeper analysis
              </span>
            </div>
          )}

          <button
            onClick={analyze}
            className="w-full py-3 rounded-lg bg-white text-black font-mono text-sm font-bold
                       hover:bg-white/90 transition-colors"
          >
            Analyze with Claude →
          </button>
        </div>
      )}

      {/* ── ANALYZING ── */}
      {phase === "analyzing" && (
        <div className="flex flex-col items-center justify-center gap-5 py-20 rounded-xl border border-azx-border bg-azx-card">
          <div className="flex gap-1.5">
            {[0, 1, 2].map((i) => (
              <div
                key={i}
                className="w-2 h-2 rounded-full bg-white animate-pulse"
                style={{ animationDelay: `${i * 180}ms` }}
              />
            ))}
          </div>
          <div className="text-center space-y-1">
            <div className="font-mono text-sm font-bold text-white">
              Claude is analyzing {rows.length} clients
            </div>
            <div className="font-mono text-xs text-azx-muted">
              Scanning adoption and conversion data for churn indicators
            </div>
          </div>
        </div>
      )}

      {/* ── RESULTS ── */}
      {phase === "results" && result && (
        <div className="space-y-5">
          {/* Summary stat cards */}
          <div className="grid grid-cols-3 gap-3">
            {(["HIGH", "LOW", "WELL_PERFORMING"] as ChurnRiskLevel[]).map((key) => {
              const r = RISK[key];
              const count =
                key === "HIGH"
                  ? result.summary.highRisk
                  : key === "LOW"
                  ? result.summary.lowRisk
                  : result.summary.wellPerforming;
              const pct = result.analyzed.length
                ? Math.round((count / result.analyzed.length) * 100)
                : 0;
              return (
                <div key={key} className={cn("p-4 rounded-xl border", r.border, r.bg)}>
                  <div className={cn("font-mono text-3xl font-bold", r.color)}>{count}</div>
                  <div className={cn("font-mono text-[10px] tracking-widest mt-1", r.color)}>
                    {r.label}
                  </div>
                  <div className="font-mono text-xs text-azx-muted mt-0.5">{pct}% of clients</div>
                </div>
              );
            })}
          </div>

          {/* Filter + download */}
          <div className="flex items-center justify-between flex-wrap gap-3">
            <div className="flex gap-1 p-1 rounded-lg border border-azx-border bg-azx-card">
              {(
                [
                  { key: "all" as FilterKey, label: `All ${result.analyzed.length}` },
                  { key: "HIGH" as FilterKey, label: `High Risk ${result.summary.highRisk}` },
                  { key: "LOW" as FilterKey, label: `Low Risk ${result.summary.lowRisk}` },
                  { key: "WELL_PERFORMING" as FilterKey, label: `Healthy ${result.summary.wellPerforming}` },
                ]
              ).map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setFilter(key)}
                  className={cn(
                    "px-3 py-1.5 rounded-md font-mono text-xs transition-colors whitespace-nowrap",
                    filter === key
                      ? "bg-white text-black font-bold"
                      : "text-azx-muted hover:text-white"
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
            <button
              onClick={downloadReport}
              className="font-mono text-[10px] text-azx-muted hover:text-white transition-colors flex items-center gap-1"
            >
              ↓ Download Report
            </button>
          </div>

          {/* Client table */}
          <div className="rounded-xl border border-azx-border overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead>
                  <tr className="border-b border-azx-border bg-azx-card">
                    {["CLIENT", "ADOPTION", "CONVERSION", "RISK", "SCORE", "REASONING"].map((h) => (
                      <th
                        key={h}
                        className="px-4 py-3 font-mono text-[10px] text-white/30 tracking-widest whitespace-nowrap"
                      >
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredClients.map((client, i) => {
                    const r = RISK[client.riskLevel];
                    return (
                      <tr
                        key={i}
                        className={cn(
                          "border-b border-azx-border/40 transition-colors hover:bg-white/[0.02]",
                          r.rowBg
                        )}
                      >
                        <td className="px-4 py-3 font-mono text-xs text-white whitespace-nowrap">
                          {String(client[nameCol] ?? `—`)}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-azx-muted whitespace-nowrap">
                          {String(client[adoptionCol] ?? "—")}
                        </td>
                        <td className="px-4 py-3 font-mono text-xs text-azx-muted whitespace-nowrap">
                          {String(client[conversionCol] ?? "—")}
                        </td>
                        <td className="px-4 py-3">
                          <span
                            className={cn(
                              "px-2 py-0.5 rounded font-mono text-[10px] border whitespace-nowrap",
                              r.color, r.bg, r.border
                            )}
                          >
                            {r.short}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <div className="w-14 h-1 rounded-full bg-white/10 shrink-0">
                              <div
                                className={cn("h-full rounded-full", r.bar)}
                                style={{ width: `${client.riskScore}%` }}
                              />
                            </div>
                            <span className="font-mono text-[10px] text-azx-muted">
                              {client.riskScore}
                            </span>
                          </div>
                        </td>
                        <td className="px-4 py-3 text-xs text-slate-500 max-w-xs">
                          {client.reasoning}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              {filteredClients.length === 0 && (
                <div className="py-10 text-center font-mono text-xs text-azx-muted">
                  No clients in this category
                </div>
              )}
            </div>
          </div>

          {/* Dashboard cards */}
          <div>
            <div className="font-mono text-[10px] text-white/30 tracking-widest uppercase mb-3">
              Client Breakdown
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(["HIGH", "LOW", "WELL_PERFORMING"] as ChurnRiskLevel[]).map((key) => {
                const r = RISK[key];
                const clients = result.analyzed
                  .filter((c) => c.riskLevel === key)
                  .sort((a, b) => b.riskScore - a.riskScore);
                const visible = clients.slice(0, 5);
                const extra = clients.length - visible.length;
                return (
                  <div
                    key={key}
                    className={cn("p-4 rounded-xl border bg-azx-card space-y-3", r.border)}
                  >
                    <div className="flex items-center gap-2">
                      <div className={cn("w-1.5 h-1.5 rounded-full", r.bar)} />
                      <span className={cn("font-mono text-[10px] tracking-widest", r.color)}>
                        {r.label}
                      </span>
                    </div>
                    <div className="space-y-2">
                      {visible.map((c, i) => (
                        <div key={i} className="flex items-center justify-between gap-2">
                          <span className="font-mono text-xs text-white truncate">
                            {String(c[nameCol] ?? `Client ${i + 1}`)}
                          </span>
                          <span className="font-mono text-[10px] text-azx-muted shrink-0">
                            {c.riskScore}
                          </span>
                        </div>
                      ))}
                      {extra > 0 && (
                        <div className="font-mono text-[10px] text-azx-muted border-t border-azx-border/50 pt-2">
                          +{extra} more
                        </div>
                      )}
                      {clients.length === 0 && (
                        <div className="font-mono text-[10px] text-azx-muted">None</div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Footer row */}
          <div className="flex items-center justify-between pt-1">
            <button
              onClick={reset}
              className="font-mono text-xs text-azx-muted hover:text-white transition-colors"
            >
              ← New Analysis
            </button>
            <div className="font-mono text-[10px] text-azx-muted">
              {result.analyzed.length} clients · {fileName && `${fileName} · `}
              {(() => { const s = getChurnSession(); return s ? new Date(s.analyzedAt).toLocaleString() : new Date().toLocaleString(); })()}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
