import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: {
      center: true,
      padding: "2rem",
      screens: { "2xl": "1400px" },
    },
    extend: {
      colors: {
        background: "#09090B",
        surface: "#111113",
        card: {
          DEFAULT: "#18181B",
          foreground: "#F4F4F5",
        },
        border: "#27272A",
        input: "#27272A",
        ring: "#8257E5",
        primary: {
          DEFAULT: "#8257E5",
          foreground: "#FFFFFF",
          muted: "#6943c0",
        },
        secondary: {
          DEFAULT: "#04D361",
          foreground: "#04261a",
        },
        muted: {
          DEFAULT: "#1c1c1f",
          foreground: "#A1A1AA",
        },
        danger: "#EF4444",
        warning: "#F59E0B",
        success: "#22C55E",
        foreground: "#F4F4F5",
        "text-secondary": "#A1A1AA",
      },
      borderRadius: {
        lg: "0.75rem",
        md: "0.5rem",
        sm: "0.375rem",
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        shimmer: {
          "100%": { transform: "translateX(100%)" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
      backgroundImage: {
        "grid-pattern":
          "linear-gradient(to right, #27272A 1px, transparent 1px), linear-gradient(to bottom, #27272A 1px, transparent 1px)",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
