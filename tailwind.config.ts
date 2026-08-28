import type { Config } from "tailwindcss";

const config: Config = {
  
  content: ["./src/**/*.{ts,tsx,js,jsx,mdx}", "./app/**/*.{ts,tsx,js,jsx,mdx}"],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        ink: {
          950: "#05060a",
          900: "#0a0c14",
          800: "#0f1320",
          700: "#161a2c",
          600: "#1d2238",
        },
        neon: {
          cyan: "#00e5ff",
          violet: "#8b5cf6",
          pink: "#ff3df0",
          lime: "#a3ff12",
          amber: "#ffb020",
        },
      },
      fontFamily: {
        sans: ["var(--font-sans)", "system-ui", "sans-serif"],
        display: ["var(--font-display)", "system-ui", "sans-serif"],
        mono: ["var(--font-mono)", "ui-monospace", "monospace"],
      },
      fontSize: {
        "10xl": ["10rem", { lineHeight: "0.9" }],
      },
      backgroundImage: {
        "grid-faint":
          "linear-gradient(to right, rgba(255,255,255,0.04) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.04) 1px, transparent 1px)",
        "radial-fade":
          "radial-gradient(ellipse at center, rgba(139,92,246,0.15), transparent 60%)",
      },
      backgroundSize: {
        "grid-32": "32px 32px",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(20px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "spin-slow": {
          "0%": { transform: "rotate(0deg)" },
          "100%": { transform: "rotate(360deg)" },
        },
        "pulse-glow": {
          "0%, 100%": { opacity: "0.6" },
          "50%": { opacity: "1" },
        },
        "shimmer": {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "gradient-shift": {
          "0%, 100%": { backgroundPosition: "0% 50%" },
          "50%": { backgroundPosition: "100% 50%" },
        },
        "float": {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.8s ease-out forwards",
        "spin-slow": "spin-slow 30s linear infinite",
        "pulse-glow": "pulse-glow 3s ease-in-out infinite",
        "shimmer": "shimmer 3s linear infinite",
        "gradient-shift": "gradient-shift 8s ease infinite",
        "float": "float 6s ease-in-out infinite",
      },
      boxShadow: {
        "neon-cyan": "0 0 20px rgba(0, 229, 255, 0.5), 0 0 40px rgba(0, 229, 255, 0.2)",
        "neon-violet": "0 0 20px rgba(139, 92, 246, 0.5), 0 0 40px rgba(139, 92, 246, 0.2)",
        "glass": "0 8px 32px rgba(0, 0, 0, 0.4), inset 0 1px 0 rgba(255, 255, 255, 0.1)",
      },
      transitionTimingFunction: {
        "out-expo": "cubic-bezier(0.16, 1, 0.3, 1)",
        "in-out-expo": "cubic-bezier(0.87, 0, 0.13, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
