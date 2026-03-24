"use client";

import { useRef, useState, useEffect, useMemo } from "react";
import { motion } from "framer-motion";

function useElementWidth(ref: React.RefObject<HTMLDivElement | null>) {
  const [width, setWidth] = useState(0);
  useEffect(() => {
    const node = ref.current;
    if (!node) return;
    const update = () => setWidth(node.clientWidth);
    update();
    const ro = new ResizeObserver(update);
    ro.observe(node);
    return () => ro.disconnect();
  }, []);
  return width;
}

interface StockChartProps {
  data: number[];
  positive: boolean;
  height?: number;
}

export function StockChart({ data, positive, height = 160 }: StockChartProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const width = useElementWidth(containerRef);
  const [hoverIdx, setHoverIdx] = useState<number | null>(null);

  const pad = { top: 16, right: 12, bottom: 28, left: 52 };
  const innerW = Math.max(0, width - pad.left - pad.right);
  const innerH = Math.max(0, height - pad.top - pad.bottom);

  const validData = data.filter((v) => v != null && !isNaN(v));
  const minV = Math.min(...validData);
  const maxV = Math.max(...validData);
  const range = maxV - minV || 1;

  const xFor = (i: number) =>
    validData.length <= 1 ? 0 : (i / (validData.length - 1)) * innerW;
  const yFor = (v: number) => innerH - ((v - minV) / range) * innerH;

  const points = validData.map((v, i) => [xFor(i), yFor(v)] as const);
  const linePath = useMemo(() => {
    if (!points.length) return "";
    return points.map((p, i) => (i === 0 ? `M ${p[0]} ${p[1]}` : `L ${p[0]} ${p[1]}`)).join(" ");
  }, [points]);

  const areaPath = linePath + ` L ${innerW} ${innerH} L 0 ${innerH} Z`;

  const gridVals = [minV, minV + range * 0.5, maxV];
  const lineColor = positive ? "rgba(255,255,255,0.9)" : "rgba(255,255,255,0.35)";
  const areaId = `area-${positive ? "pos" : "neg"}`;

  const handleMove = (clientX: number) => {
    const rect = containerRef.current?.getBoundingClientRect();
    if (!rect) return;
    const x = clientX - rect.left - pad.left;
    if (x < 0 || x > innerW) { setHoverIdx(null); return; }
    const idx = Math.max(0, Math.min(validData.length - 1, Math.round((x / innerW) * (validData.length - 1))));
    setHoverIdx(idx);
  };

  return (
    <div
      ref={containerRef}
      className="relative w-full select-none"
      style={{ height }}
      onMouseMove={(e) => handleMove(e.clientX)}
      onMouseLeave={() => setHoverIdx(null)}
      onTouchMove={(e) => { if (e.touches[0]) handleMove(e.touches[0].clientX); }}
      onTouchEnd={() => setHoverIdx(null)}
    >
      {width > 0 && (
        <svg width={width} height={height} className="overflow-visible">
          <defs>
            <linearGradient id={areaId} x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={positive ? "#ffffff" : "#666"} stopOpacity="0.12" />
              <stop offset="100%" stopColor={positive ? "#ffffff" : "#666"} stopOpacity="0.01" />
            </linearGradient>
          </defs>

          <g transform={`translate(${pad.left},${pad.top})`}>
            {/* Grid lines */}
            {gridVals.map((v, i) => {
              const y = yFor(v);
              return (
                <g key={i}>
                  <line
                    x1={0} y1={y} x2={innerW} y2={y}
                    stroke="rgba(255,255,255,0.06)" strokeWidth={1} strokeDasharray="3 5"
                  />
                  <text
                    x={-8} y={y} textAnchor="end" dominantBaseline="middle"
                    className="fill-white/30 font-mono"
                    style={{ fontSize: 9 }}
                  >
                    ${v < 100 ? v.toFixed(1) : Math.round(v)}
                  </text>
                </g>
              );
            })}

            {/* X-axis labels (approx weeks) */}
            {[0, Math.floor(validData.length / 3), Math.floor((2 * validData.length) / 3), validData.length - 1].map((idx) => (
              <text
                key={idx}
                x={xFor(idx)} y={innerH + 16} textAnchor="middle"
                className="fill-white/20 font-mono"
                style={{ fontSize: 9 }}
              >
                {idx === 0 ? "30d" : idx === validData.length - 1 ? "today" : ""}
              </text>
            ))}

            {/* Area fill */}
            {points.length > 1 && (
              <path d={areaPath} fill={`url(#${areaId})`} stroke="none" />
            )}

            {/* Line */}
            <path d={linePath} fill="none" stroke={lineColor} strokeWidth={1.5} strokeLinejoin="round" />

            {/* Hover crosshair */}
            {hoverIdx !== null && points[hoverIdx] && (
              <>
                <line
                  x1={points[hoverIdx][0]} y1={0}
                  x2={points[hoverIdx][0]} y2={innerH}
                  stroke="rgba(255,255,255,0.2)" strokeWidth={1} strokeDasharray="3 3"
                />
                <circle
                  cx={points[hoverIdx][0]} cy={points[hoverIdx][1]}
                  r={4} fill="#111" stroke="white" strokeWidth={1.5}
                />
              </>
            )}
          </g>
        </svg>
      )}

      {/* Hover tooltip */}
      {hoverIdx !== null && points[hoverIdx] && width > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="absolute pointer-events-none rounded-lg border border-white/10 bg-azx-card px-3 py-2"
          style={{
            top: Math.max(6, pad.top + points[hoverIdx][1] - 44),
            left: Math.min(
              Math.max(pad.left + points[hoverIdx][0] - 56, 4),
              width - 120
            ),
            minWidth: 110,
          }}
        >
          <div className="font-mono text-[10px] text-white/40 mb-0.5">Day {hoverIdx + 1}</div>
          <div className="font-mono text-sm font-bold text-white">
            ${validData[hoverIdx]?.toFixed(2)}
          </div>
        </motion.div>
      )}
    </div>
  );
}
