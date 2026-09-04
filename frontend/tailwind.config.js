/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
        surface: "var(--surface)",
        "surface-2": "var(--surface-2)",
        card: "var(--card)",
        "card-foreground": "var(--card-foreground)",
        popover: "var(--popover)",
        "popover-foreground": "var(--popover-foreground)",
        primary: {
          DEFAULT: "var(--primary)",
          foreground: "var(--primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--secondary)",
          foreground: "var(--secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--muted)",
          foreground: "var(--muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--accent)",
          foreground: "var(--accent-foreground)",
        },
        cyan: "var(--cyan)",
        success: "var(--success)",
        warning: "var(--warning)",
        destructive: {
          DEFAULT: "var(--destructive)",
          foreground: "var(--destructive-foreground)",
        },
        border: {
          DEFAULT: "var(--border)",
          strong: "var(--border-strong)",
        },
        input: "var(--input)",
        ring: "var(--ring)",
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
          purple: "#A855F7",
          purpleDim: "#2B1B47",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
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
        riseIn: {
          "0%": { opacity: "0", transform: "translateY(18px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        scan: {
          "0%": { transform: "translateY(-10%)", opacity: "0" },
          "35%": { opacity: "0.85" },
          "100%": { transform: "translateY(1100%)", opacity: "0" },
        },
        floatSoft: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%": { transform: "translateY(-10px)" },
        },
        ambientDrift: {
          "0%, 100%": { transform: "translate3d(0, 0, 0) scale(1)", opacity: "0.55" },
          "50%": { transform: "translate3d(3%, -4%, 0) scale(1.08)", opacity: "0.8" },
        },
        slideInRight: {
          "0%": { transform: "translateX(100%)" },
          "100%": { transform: "translateX(0)" },
        },
        fadeIn: {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        fadeUp: "fadeUp 0.35s ease-out both",
        fadeIn: "fadeIn 0.2s ease-out both",
        slideInRight: "slideInRight 0.28s cubic-bezier(0.16, 1, 0.3, 1) both",
        pulseDot: "pulseDot 1.1s ease-in-out infinite",
        rise: "riseIn 0.8s cubic-bezier(0.22, 1, 0.36, 1) both",
        scan: "scan 5.5s linear infinite",
        "float-soft": "floatSoft 7s ease-in-out infinite",
        "pulse-dot": "pulseDot 2.4s ease-in-out infinite",
        ambient: "ambientDrift 18s ease-in-out infinite",
        "flow-line": "flowLine 3.2s linear infinite",
      },
    },
  },
  plugins: [],
};
