/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        navy: {
          950: "#080D18",
          900: "#0B1120",
          800: "#111A2E",
          700: "#161F38",
          600: "#1C2745",
          500: "#263352",
        },
        ink: {
          100: "#EEF1F8",
          300: "#C4CBDC",
          500: "#8B96AC",
          700: "#5A6478",
        },
        signal: {
          blue: "#4C7DFF",
          blueDim: "#1C2A52",
          green: "#34D399",
          greenDim: "#12261F",
          amber: "#FBBF24",
          amberDim: "#2E2711",
          red: "#F87171",
          redDim: "#2E1A1B",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.6)",
      },
      keyframes: {
        fadeUp: {
          "0%": { opacity: "0", transform: "translateY(6px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        pulseDot: {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.35" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.35s ease-out both",
        pulseDot: "pulseDot 1.1s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};
