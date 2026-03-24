"use client";

import { useState } from "react";
import { AccountSignalsTab } from "./AccountSignalsTab";
import { NewsletterTab } from "./NewsletterTab";

type Tab = "signals" | "newsletter";

const TABS: { id: Tab; label: string; sub: string }[] = [
  { id: "signals", label: "Account Signals", sub: "News monitoring for tracked accounts" },
  { id: "newsletter", label: "Newsletter Intelligence", sub: "Parse any newsletter or article" },
];

export function MonitoringModule() {
  const [activeTab, setActiveTab] = useState<Tab>("signals");

  return (
    <div className="space-y-6">
      {/* Tab bar */}
      <div className="flex gap-1 p-1 rounded-xl border border-azx-border bg-azx-card w-fit">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-5 py-2.5 rounded-lg font-mono text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? "bg-white text-black font-bold"
                : "text-azx-muted hover:text-white"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab subtitle */}
      <p className="font-mono text-xs text-azx-muted">
        {TABS.find((t) => t.id === activeTab)?.sub}
      </p>

      {/* Tab content */}
      {activeTab === "signals" && <AccountSignalsTab />}
      {activeTab === "newsletter" && <NewsletterTab />}
    </div>
  );
}
