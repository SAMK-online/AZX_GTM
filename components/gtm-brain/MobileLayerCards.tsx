"use client";

import { useState } from "react";
import { GTM_NODES, LAYER_LABELS } from "@/lib/gtm-nodes";
import type { GTMNode } from "@/types";

interface MobileLayerCardsProps {
  onNodeSelect: (node: GTMNode) => void;
}

export function MobileLayerCards({ onNodeSelect }: MobileLayerCardsProps) {
  const [expandedLayer, setExpandedLayer] = useState<number | null>(0);

  const layers = Object.entries(LAYER_LABELS).map(([layerStr, meta]) => ({
    layer: parseInt(layerStr),
    ...meta,
    nodes: GTM_NODES.filter((n) => n.layer === parseInt(layerStr)),
  }));

  return (
    <div className="space-y-2">
      {layers.map(({ layer, name, color, nodes }) => (
        <div
          key={layer}
          className="rounded-lg border border-azx-border overflow-hidden"
        >
          <button
            className="w-full flex items-center justify-between px-4 py-3 bg-azx-card text-left"
            onClick={() =>
              setExpandedLayer(expandedLayer === layer ? null : layer)
            }
          >
            <div className="flex items-center gap-3">
              <div
                className="w-2 h-2 rounded-full"
                style={{ backgroundColor: color }}
              />
              <span className="font-mono text-xs uppercase tracking-widest text-white">
                Layer {layer} — {name}
              </span>
            </div>
            <span className="text-azx-muted text-xs">
              {expandedLayer === layer ? "▲" : "▼"}
            </span>
          </button>

          {expandedLayer === layer && (
            <div className="px-4 pb-3 bg-azx-dark space-y-2">
              {nodes.map((node) => (
                <button
                  key={node.id}
                  onClick={() => onNodeSelect(node)}
                  className="w-full text-left px-3 py-2 rounded border border-azx-border
                             hover:border-white/20 transition-colors"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div
                      className="w-1.5 h-1.5 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="text-sm font-medium text-white">
                      {node.label}
                    </span>
                  </div>
                  <p className="text-xs text-azx-muted leading-relaxed">
                    {node.purpose}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
