import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        void: "#05030b",
        panel: "#0c0718",
        plasma: "#a855f7",
        pulse: "#22d3ee",
        volt: "#b8ff5a",
        danger: "#ff3fa4"
      },
      boxShadow: {
        neon: "0 0 30px rgba(168, 85, 247, 0.35)",
        "neon-cyan": "0 0 26px rgba(34, 211, 238, 0.25)"
      },
      animation: {
        "card-float": "card-float 6s ease-in-out infinite",
        "scan-line": "scan-line 4s linear infinite",
        pulseGlow: "pulse-glow 2.8s ease-in-out infinite"
      },
      keyframes: {
        "card-float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-4px)" }
        },
        "scan-line": {
          "0%": { transform: "translateX(-100%)" },
          "100%": { transform: "translateX(100%)" }
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6", filter: "drop-shadow(0 0 10px rgba(168,85,247,.45))" },
          "50%": { opacity: "1", filter: "drop-shadow(0 0 20px rgba(168,85,247,.85))" }
        }
      }
    }
  },
  plugins: []
};

export default config;
