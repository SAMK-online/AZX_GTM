import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        "azx-dark": "#000000",
        "azx-card": "#0d0d0d",
        "azx-border": "#222222",
        "azx-cyan": "#ffffff",
        "azx-amber": "#aaaaaa",
        "azx-green": "#777777",
        "azx-muted": "#555555",
      },
      animation: {
        "cursor-blink": "blink 1s step-end infinite",
        "fade-in-up": "fadeInUp 0.4s ease-out forwards",
        "glow-pulse": "glowPulse 2s ease-in-out infinite",
        "skeleton-pulse": "skeletonPulse 1.5s ease-in-out infinite",
        "radar-ping": "radarPing 3s ease-out infinite",
      },
      keyframes: {
        blink: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0" },
        },
        fadeInUp: {
          "0%": { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        glowPulse: {
          "0%, 100%": { boxShadow: "0 0 8px rgba(255,255,255,0.1)" },
          "50%": { boxShadow: "0 0 24px rgba(255,255,255,0.2), 0 0 48px rgba(255,255,255,0.08)" },
        },
        skeletonPulse: {
          "0%, 100%": { opacity: "0.3" },
          "50%": { opacity: "0.6" },
        },
        radarPing: {
          "0%": { transform: "scale(0.5)", opacity: "0.8" },
          "100%": { transform: "scale(2.5)", opacity: "0" },
        },
      },
      fontFamily: {
        sans: ["'Roboto'", "system-ui", "sans-serif"],
        mono: ["'JetBrains Mono'", "Menlo", "Monaco", "Consolas", "monospace"],
      },
    },
  },
  plugins: [],
};

export default config;
