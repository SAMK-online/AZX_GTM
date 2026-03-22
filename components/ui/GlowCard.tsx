import { cn } from "@/lib/utils";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
  glowColor?: string;
  intensity?: "low" | "mid" | "high";
  onClick?: () => void;
}

export function GlowCard({
  children,
  className,
  glowColor = "#00D4FF",
  intensity = "low",
  onClick,
}: GlowCardProps) {
  const glowMap = {
    low: `0 0 8px ${glowColor}30`,
    mid: `0 0 16px ${glowColor}50`,
    high: `0 0 32px ${glowColor}70, 0 0 64px ${glowColor}30`,
  };

  return (
    <div
      className={cn(
        "rounded-lg border border-azx-border bg-azx-card",
        "transition-all duration-300",
        onClick && "cursor-pointer hover:border-white/20",
        className
      )}
      style={{ boxShadow: glowMap[intensity] }}
      onClick={onClick}
    >
      {children}
    </div>
  );
}
