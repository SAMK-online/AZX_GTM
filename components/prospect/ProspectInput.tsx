"use client";

import { useState } from "react";
import type { Industry } from "@/types";

const INDUSTRIES: Industry[] = [
  "Energy & Utilities",
  "Industrial",
  "Finance",
  "Healthcare",
  "General",
];

interface ProspectInputProps {
  onSubmit: (company: string, industry: Industry) => void;
  isDisabled: boolean;
}

export function ProspectInput({ onSubmit, isDisabled }: ProspectInputProps) {
  const [company, setCompany] = useState("");
  const [industry, setIndustry] = useState<Industry>("Energy & Utilities");

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (company.trim().length >= 2) {
      onSubmit(company.trim(), industry);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Company input */}
        <div className="flex-1 relative">
          <input
            type="text"
            value={company}
            onChange={(e) => setCompany(e.target.value)}
            placeholder="Enter a company name (e.g. Schneider Electric)"
            disabled={isDisabled}
            className="w-full bg-azx-card border border-azx-border rounded-lg px-4 py-3
                       font-mono text-sm text-white placeholder-azx-muted
                       focus:outline-none focus:border-white/30
                       disabled:opacity-50 disabled:cursor-not-allowed
                       transition-all duration-200"
          />
        </div>

        {/* Industry selector */}
        <select
          value={industry}
          onChange={(e) => setIndustry(e.target.value as Industry)}
          disabled={isDisabled}
          className="bg-azx-card border border-azx-border rounded-lg px-4 py-3
                     font-mono text-sm text-white
                     focus:outline-none focus:border-white/30
                     disabled:opacity-50 disabled:cursor-not-allowed
                     transition-all duration-200 cursor-pointer"
        >
          {INDUSTRIES.map((ind) => (
            <option key={ind} value={ind} className="bg-azx-card">
              {ind}
            </option>
          ))}
        </select>

        {/* Submit */}
        <button
          type="submit"
          disabled={isDisabled || company.trim().length < 2}
          className="px-6 py-3 rounded-lg bg-white text-black font-mono text-sm font-bold
                     hover:bg-white/90 transition-colors duration-200
                     disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-white
                     whitespace-nowrap"
        >
          Generate Brief
        </button>
      </div>
    </form>
  );
}
