"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { GTM_NODES, GTM_EDGES, LAYER_LABELS } from "@/lib/gtm-nodes";
import type { GTMNode } from "@/types";

const NODE_W = 110;
const NODE_H = 38;

// BFS: compute full upstream + downstream chain for a clicked node
function getNodeChain(nodeId: string) {
  const chainEdges = new Set<string>();
  const chainNodes = new Set<string>([nodeId]);

  const downQueue = [nodeId];
  while (downQueue.length) {
    const id = downQueue.shift()!;
    GTM_EDGES.filter((e) => e.from === id).forEach((e) => {
      if (!chainNodes.has(e.to)) {
        chainNodes.add(e.to);
        chainEdges.add(e.id);
        downQueue.push(e.to);
      }
    });
  }

  const upQueue = [nodeId];
  while (upQueue.length) {
    const id = upQueue.shift()!;
    GTM_EDGES.filter((e) => e.to === id).forEach((e) => {
      if (!chainNodes.has(e.from)) {
        chainNodes.add(e.from);
        chainEdges.add(e.id);
        upQueue.push(e.from);
      }
    });
  }

  return { chainEdges, chainNodes };
}

interface ArchitectureDiagramProps {
  selectedNode: GTMNode | null;
  onNodeClick: (node: GTMNode) => void;
}

export function ArchitectureDiagram({ selectedNode, onNodeClick }: ArchitectureDiagramProps) {
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);
  const [flowActive, setFlowActive] = useState(false);
  const [activeLayer, setActiveLayer] = useState<number>(-1);
  const flowIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const layerRef = useRef(0);

  // Continuous looping flow — advances layer every 600ms indefinitely
  const triggerFlow = useCallback(() => {
    if (flowActive) {
      if (flowIntervalRef.current) clearInterval(flowIntervalRef.current);
      setFlowActive(false);
      setActiveLayer(-1);
      layerRef.current = 0;
      return;
    }

    setFlowActive(true);
    layerRef.current = 0;
    setActiveLayer(0);

    flowIntervalRef.current = setInterval(() => {
      layerRef.current = (layerRef.current + 1) % 7;
      setActiveLayer(layerRef.current);
    }, 650);
  }, [flowActive]);

  useEffect(() => {
    return () => {
      if (flowIntervalRef.current) clearInterval(flowIntervalRef.current);
    };
  }, []);

  // Chain for selected node
  const { chainEdges: selectedChainEdges, chainNodes: selectedChainNodes } = selectedNode
    ? getNodeChain(selectedNode.id)
    : { chainEdges: new Set<string>(), chainNodes: new Set<string>() };

  const hasSelection = !!selectedNode;

  // Connected edges for hovered node (immediate neighbors only)
  const connectedEdges = hoveredNode
    ? new Set(GTM_EDGES.filter((e) => e.from === hoveredNode || e.to === hoveredNode).map((e) => e.id))
    : new Set<string>();

  const isEdgeInFlowLayer = (edgeId: string) => {
    if (activeLayer < 0) return false;
    const edge = GTM_EDGES.find((e) => e.id === edgeId);
    const fromNode = GTM_NODES.find((n) => n.id === edge?.from);
    return fromNode?.layer === activeLayer;
  };

  return (
    <div className="relative w-full">
      {/* Controls */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          {Object.entries(LAYER_LABELS).map(([layer, { name, color }]) => (
            <div key={layer} className="flex items-center gap-1.5">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: color }} />
              <span className="font-mono text-xs text-azx-muted">{name}</span>
            </div>
          ))}
        </div>

        <button
          onClick={triggerFlow}
          className={`px-3 py-1.5 rounded font-mono text-xs border transition-all duration-200 ${
            flowActive
              ? "border-white/40 text-white bg-white/10"
              : "border-azx-border text-azx-muted hover:border-white/30 hover:text-white"
          }`}
        >
          {flowActive ? "◼ Stop Flow" : "▶ Animate Data Flow"}
        </button>
      </div>

      {/* Contextual hint */}
      {!selectedNode && !flowActive && (
        <p className="font-mono text-[10px] text-azx-muted/60 text-center mb-3 tracking-widest">
          CLICK ANY NODE TO TRACE ITS CHAIN · ▶ TO ANIMATE DATA FLOW
        </p>
      )}
      {selectedNode && (
        <p className="font-mono text-[10px] text-white/30 text-center mb-3 tracking-widest">
          TRACING CHAIN FOR <span className="text-white/60">{selectedNode.label.toUpperCase()}</span> — CLICK AGAIN TO DESELECT
        </p>
      )}

      {/* SVG */}
      <div className="w-full overflow-x-auto rounded-lg border border-azx-border dot-grid">
        <svg
          viewBox="0 0 820 960"
          preserveAspectRatio="xMidYMid meet"
          className="w-full"
          style={{ minWidth: 480 }}
        >
          <defs>
            {/* Glow filter for selected node */}
            <filter id="node-glow" x="-30%" y="-30%" width="160%" height="160%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>

          {/* Layer background bands — pulse when active */}
          {Object.entries(LAYER_LABELS).map(([layerStr, { color }]) => {
            const layer = parseInt(layerStr);
            const layerNodes = GTM_NODES.filter((n) => n.layer === layer);
            if (!layerNodes.length) return null;
            const minY = Math.min(...layerNodes.map((n) => n.y)) - 24;
            const maxY = Math.max(...layerNodes.map((n) => n.y)) + NODE_H + 24;
            const isActive = activeLayer === layer;
            return (
              <rect
                key={layer}
                x={0}
                y={minY}
                width={820}
                height={maxY - minY}
                fill={isActive ? `${color}14` : `${color}05`}
                style={{ transition: "fill 0.3s ease" }}
              />
            );
          })}

          {/* Edges */}
          {GTM_EDGES.map((edge) => {
            const from = GTM_NODES.find((n) => n.id === edge.from);
            const to = GTM_NODES.find((n) => n.id === edge.to);
            if (!from || !to) return null;

            const x1 = from.x + NODE_W / 2;
            const y1 = from.y + NODE_H;
            const x2 = to.x + NODE_W / 2;
            const y2 = to.y;
            const midY = (y1 + y2) / 2;
            const d = `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`;

            const isFlow = isEdgeInFlowLayer(edge.id);
            const isHovered = connectedEdges.has(edge.id);
            const isChained = hasSelection && selectedChainEdges.has(edge.id);
            const isDimmed = hasSelection && !selectedChainEdges.has(edge.id) && !flowActive;

            const strokeColor = isFlow
              ? "#ffffff"
              : isChained
              ? "rgba(255,255,255,0.8)"
              : isHovered
              ? "#777777"
              : "#333333";

            const strokeOpacity = isDimmed
              ? 0.08
              : isFlow || isChained
              ? 1
              : isHovered
              ? 0.7
              : 0.45;

            return (
              <path
                key={edge.id}
                id={`path-${edge.id}`}
                d={d}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isFlow || isChained ? 1.5 : 1}
                strokeOpacity={strokeOpacity}
                strokeDasharray={isFlow || isChained ? "none" : "4 4"}
                style={{
                  filter: isFlow
                    ? "drop-shadow(0 0 4px rgba(255,255,255,0.5))"
                    : isChained
                    ? "drop-shadow(0 0 3px rgba(255,255,255,0.25))"
                    : "none",
                  transition: "stroke 0.25s, stroke-opacity 0.25s, filter 0.25s",
                }}
              />
            );
          })}

          {/* ── Traveling dots — Data Flow mode ── */}
          {flowActive &&
            GTM_EDGES.map((edge) => {
              if (!isEdgeInFlowLayer(edge.id)) return null;
              return (
                <circle key={`flow-dot-${edge.id}`} r={3} fill="#ffffff" opacity={0.9}>
                  <animateMotion dur="0.65s" repeatCount="indefinite" rotate="auto">
                    <mpath href={`#path-${edge.id}`} />
                  </animateMotion>
                </circle>
              );
            })}

          {/* ── Traveling dots — Chain trace mode ── */}
          {hasSelection &&
            !flowActive &&
            Array.from(selectedChainEdges).map((edgeId, i) => (
              <circle key={`chain-dot-${edgeId}`} r={2.5} fill="#ffffff" opacity={0.6}>
                <animateMotion
                  dur={`${0.9 + (i % 4) * 0.15}s`}
                  repeatCount="indefinite"
                >
                  <mpath href={`#path-${edgeId}`} />
                </animateMotion>
              </circle>
            ))}

          {/* Nodes */}
          {GTM_NODES.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            const isHoveredNode = hoveredNode === node.id;
            const isInChain = hasSelection && selectedChainNodes.has(node.id);
            const isDimmedNode = hasSelection && !selectedChainNodes.has(node.id);

            return (
              <g
                key={node.id}
                className="gtm-node"
                transform={`translate(${node.x}, ${node.y})`}
                onClick={() => onNodeClick(node)}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                style={{
                  opacity: isDimmedNode ? 0.15 : 1,
                  transition: "opacity 0.25s",
                  cursor: "pointer",
                }}
              >
                <rect
                  x={0}
                  y={0}
                  width={NODE_W}
                  height={NODE_H}
                  rx={6}
                  fill="#0d0d0d"
                  stroke={
                    isSelected
                      ? "#ffffff"
                      : isInChain
                      ? "rgba(255,255,255,0.45)"
                      : isHoveredNode
                      ? "rgba(255,255,255,0.25)"
                      : "#222222"
                  }
                  strokeWidth={isSelected ? 2 : isInChain ? 1.5 : 1}
                  style={{
                    filter: isSelected ? "url(#node-glow)" : "none",
                    transition: "stroke 0.15s, filter 0.15s",
                  }}
                />

                {/* Layer color bar */}
                <rect
                  x={0}
                  y={0}
                  width={3}
                  height={NODE_H}
                  rx={2}
                  fill={node.color}
                  opacity={isSelected || isInChain ? 1 : 0.5}
                  style={{ transition: "opacity 0.15s" }}
                />

                {/* Label */}
                <text
                  x={NODE_W / 2 + 2}
                  y={NODE_H / 2 + 1}
                  textAnchor="middle"
                  dominantBaseline="middle"
                  fill={
                    isSelected
                      ? "#ffffff"
                      : isInChain || isHoveredNode
                      ? "#cccccc"
                      : "#555555"
                  }
                  fontSize={9}
                  fontFamily="JetBrains Mono, monospace"
                  style={{ transition: "fill 0.15s", userSelect: "none" }}
                >
                  {node.label}
                </text>
              </g>
            );
          })}

          {/* Layer labels — light up when active */}
          {Object.entries(LAYER_LABELS).map(([layerStr, { name, color }]) => {
            const layer = parseInt(layerStr);
            const layerNodes = GTM_NODES.filter((n) => n.layer === layer);
            if (!layerNodes.length) return null;
            const midY =
              layerNodes.reduce((sum, n) => sum + n.y + NODE_H / 2, 0) / layerNodes.length;
            return (
              <text
                key={`label-${layer}`}
                x={800}
                y={midY}
                textAnchor="end"
                dominantBaseline="middle"
                fill={activeLayer === layer ? color : "#333333"}
                fontSize={8}
                fontFamily="JetBrains Mono, monospace"
                style={{ transition: "fill 0.3s" }}
              >
                {name.toUpperCase()}
              </text>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
