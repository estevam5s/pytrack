import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./app/**/*.{ts,tsx}",
    "./components/**/*.{ts,tsx}",
    "./lib/**/*.{ts,tsx}",
  ],
  theme: {
    container: { center: true, padding: "1.5rem", screens: { "2xl": "1280px" } },
    extend: {
      colors: {
        background: "#09090A",
        surface: "#121214",
        "surface-2": "#1A1A1E",
        border: "#1F1F25",
        primary: { DEFAULT: "#8234E9", light: "#9956F6" },
        "text-primary": "#FFFFFF",
        "text-secondary": "#C4C4CC",
        green: "#29E0A9",
        blue: "#5F75F2",
        magenta: "#E254FF",
      },
      fontFamily: {
        sans: ["var(--font-jakarta)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      backgroundImage: {
        brand:
          "linear-gradient(97.57deg, #29E0A9 -12.7%, #5F75F2 32.64%, #9956F6 78.49%, #E254FF 109.78%)",
      },
      keyframes: {
        float: {
          "0%,100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-12px)" },
        },
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
      },
      animation: { float: "float 6s ease-in-out infinite" },
    },
  },
  plugins: [require("tailwindcss-animate")],
};

export default config;
