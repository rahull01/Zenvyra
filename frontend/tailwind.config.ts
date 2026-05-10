// tailwind.config.ts
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: ["class"],
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // Brand Colors - Premium Green Theme
        brand: {
          50: "#f0fdf4",
          100: "#dcfce7",
          200: "#bbf7d0",
          300: "#86efac",
          400: "#4ade80",
          500: "#22c55e",
          600: "#16a34a",
          700: "#15803d",
          800: "#166534",
          900: "#14532d",
          950: "#052e16",
        },

        // Accent
        accent: {
          DEFAULT: "#22c55e",
          cyan: "#06b6d4",
          indigo: "#4f46e5",
          emerald: "#10b981",
        },

        // Surface Colors - White First
        surface: {
          0: "#ffffff",
          50: "#020617",
          100: "#0f172a",
          200: "#334155",
          300: "#475569",
          400: "#64748b",
          500: "#94a3b8",
          600: "#cbd5e1",
          700: "#e2e8f0",
          800: "#f1f5f9",
          900: "#f8fafc",
          950: "#ffffff",
        },

        // shadcn/ui compatible colors
        border: "rgba(15, 23, 42, 0.1)",
        input: "rgba(15, 23, 42, 0.06)",
        ring: "#22c55e",
        background: "#ffffff",
        foreground: "#0f172a",

        // Semantic Colors
        success: "#10b981",
        warning: "#f59e0b",
        error: "#ef4444",
        info: "#22c55e",
      },

      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "system-ui", "sans-serif"],
        display: ["var(--font-outfit)", "Inter", "system-ui", "sans-serif"],
        mono: ["JetBrains Mono", "monospace"],
      },

      fontSize: {
        "display-1": ["4.5rem", { lineHeight: "1.05", letterSpacing: "-0.04em", fontWeight: "800" }],
        "display-2": ["3.75rem", { lineHeight: "1.1", letterSpacing: "-0.03em", fontWeight: "700" }],
        "display-3": ["3rem", { lineHeight: "1.2", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-1": ["2.25rem", { lineHeight: "1.3", letterSpacing: "-0.02em", fontWeight: "700" }],
        "heading-2": ["1.875rem", { lineHeight: "1.4", letterSpacing: "-0.01em", fontWeight: "600" }],
        "heading-3": ["1.5rem", { lineHeight: "1.5", fontWeight: "600" }],
        "body-large": ["1.125rem", { lineHeight: "1.8" }],
        "body": ["1rem", { lineHeight: "1.75" }],
        "body-small": ["0.875rem", { lineHeight: "1.6" }],
        "caption": ["0.75rem", { lineHeight: "1.5", letterSpacing: "0.02em" }],
      },

      spacing: {
        "18": "4.5rem",
        "22": "5.5rem",
        "30": "7.5rem",
      },

      borderRadius: {
        "xl": "1rem",
        "2xl": "1.25rem",
        "3xl": "1.5rem",
        "4xl": "2rem",
      },

      boxShadow: {
        "glow": "0 10px 30px -12px rgba(22, 163, 74, 0.5)",
        "glow-accent": "0 10px 30px -12px rgba(34, 197, 94, 0.45)",
        "premium": "0 24px 48px -24px rgba(15, 23, 42, 0.18)",
        "card": "0 1px 2px rgba(15, 23, 42, 0.05), 0 14px 30px -20px rgba(15, 23, 42, 0.2)",
      },

      backgroundImage: {
        "gradient-radial": "radial-gradient(var(--tw-gradient-stops))",
        "gradient-conic": "conic-gradient(from 180deg at 50% 50%, var(--tw-gradient-stops))",
        "mesh": "radial-gradient(at 0% 0%, rgba(37, 99, 235, 0.12) 0px, transparent 50%), radial-gradient(at 100% 100%, rgba(14, 165, 233, 0.09) 0px, transparent 50%)",
      },

      animation: {
        "gradient-x": "gradient-x 15s ease infinite",
        "float": "float 6s ease-in-out infinite",
        "pulse-slow": "pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        "shimmer": "shimmer 2s linear infinite",
        "reveal": "reveal 0.8s cubic-bezier(0, 0, 0.2, 1) forwards",
      },

      keyframes: {
        "reveal": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-15px)" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
