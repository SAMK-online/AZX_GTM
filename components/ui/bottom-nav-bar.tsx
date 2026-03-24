"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Zap,
  Network,
  BarChart2,
  Send,
  Radio,
  TrendingUp,
  FileText,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { label: "Home",          icon: Home,        href: "/"             },
  { label: "Intelligence",  icon: Zap,         href: "/intelligence" },
  { label: "Architecture",  icon: Network,     href: "/architecture" },
  { label: "Readiness",     icon: BarChart2,   href: "/readiness"    },
  { label: "Outreach",      icon: Send,        href: "/outreach"     },
  { label: "Signals",       icon: Radio,       href: "/monitoring"   },
  { label: "Performance",   icon: TrendingUp,  href: "/performance"  },
  { label: "Meetings",      icon: FileText,    href: "/transcript"   },
];

const LABEL_WIDTH = 68;

type BottomNavBarProps = {
  className?: string;
};

export function BottomNavBar({ className }: BottomNavBarProps) {
  const pathname = usePathname();

  return (
    <motion.nav
      initial={{ scale: 0.9, opacity: 0, y: -10 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 300, damping: 26 }}
      role="navigation"
      aria-label="Bottom Navigation"
      className={cn(
        "fixed top-3 inset-x-0 mx-auto z-50 w-fit",
        "bg-azx-card border border-white/20 rounded-full backdrop-blur-md",
        "flex items-center p-1.5 shadow-2xl gap-0.5",
        "min-w-[320px] max-w-[95vw] h-[52px]",
        className,
      )}
      style={{ boxShadow: "0 8px 40px rgba(0,0,0,0.6), 0 0 0 1px rgba(255,255,255,0.06)" }}
    >
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname === item.href;

        return (
          <Link key={item.href} href={item.href} passHref legacyBehavior>
            <motion.a
              whileTap={{ scale: 0.95 }}
              className={cn(
                "flex items-center px-3 py-2 rounded-full transition-colors duration-200",
                "h-9 min-w-[40px] cursor-pointer select-none",
                "focus:outline-none focus-visible:ring-1 focus-visible:ring-white/20",
                isActive
                  ? "bg-white/10 text-white"
                  : "text-[#555] hover:bg-white/5 hover:text-white/60",
              )}
              aria-label={item.label}
              aria-current={isActive ? "page" : undefined}
            >
              <Icon
                size={18}
                strokeWidth={isActive ? 2.2 : 1.8}
                aria-hidden
                className="shrink-0 transition-all duration-200"
              />

              <motion.div
                initial={false}
                animate={{
                  width: isActive ? `${LABEL_WIDTH}px` : "0px",
                  opacity: isActive ? 1 : 0,
                  marginLeft: isActive ? "6px" : "0px",
                }}
                transition={{
                  width: { type: "spring", stiffness: 350, damping: 32 },
                  opacity: { duration: 0.18 },
                  marginLeft: { duration: 0.18 },
                }}
                className="overflow-hidden flex items-center"
              >
                <span
                  className={cn(
                    "font-mono text-[10px] tracking-widest uppercase whitespace-nowrap",
                    "select-none overflow-hidden text-ellipsis",
                    isActive ? "text-white" : "opacity-0",
                  )}
                >
                  {item.label}
                </span>
              </motion.div>
            </motion.a>
          </Link>
        );
      })}
    </motion.nav>
  );
}

export default BottomNavBar;
