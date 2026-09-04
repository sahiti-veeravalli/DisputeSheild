/** @type {import('tailwindcss').Config} */
export default {
  darkMode: ["class"],
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        background: "rgb(var(--background) / <alpha-value>)",
        foreground: "rgb(var(--foreground) / <alpha-value>)",
        surface: "rgb(var(--surface) / <alpha-value>)",
        "surface-2": "rgb(var(--surface-2) / <alpha-value>)",
        card: "rgb(var(--card) / <alpha-value>)",
        "card-foreground": "rgb(var(--card-foreground) / <alpha-value>)",
        popover: "rgb(var(--popover) / <alpha-value>)",
        "popover-foreground": "rgb(var(--popover-foreground) / <alpha-value>)",
        primary: {
          DEFAULT: "rgb(var(--primary) / <alpha-value>)",
          foreground: "rgb(var(--primary-foreground) / <alpha-value>)",
        },
        secondary: {
          DEFAULT: "rgb(var(--secondary) / <alpha-value>)",
          foreground: "rgb(var(--secondary-foreground) / <alpha-value>)",
        },
        muted: {
          DEFAULT: "rgb(var(--muted) / <alpha-value>)",
          foreground: "rgb(var(--muted-foreground) / <alpha-value>)",
        },
        accent: {
          DEFAULT: "rgb(var(--accent) / <alpha-value>)",
          foreground: "rgb(var(--accent-foreground) / <alpha-value>)",
        },
        cyan: "rgb(var(--cyan) / <alpha-value>)",
        success: "rgb(var(--success) / <alpha-value>)",
        warning: "rgb(var(--warning) / <alpha-value>)",
        destructive: {
          DEFAULT: "rgb(var(--destructive) / <alpha-value>)",
          foreground: "rgb(var(--destructive-foreground) / <alpha-value>)",
        },
        border: {
          DEFAULT: "rgb(var(--border) / <alpha-value>)",
          strong: "rgb(var(--border-strong) / <alpha-value>)",
        },
        input: "rgb(var(--input) / <alpha-value>)",
        ring: "rgb(var(--ring) / <alpha-value>)",
        navy: {
          950: "rgb(var(--navy-950) / <alpha-value>)",
          900: "rgb(var(--navy-900) / <alpha-value>)",
          850: "rgb(var(--navy-850) / <alpha-value>)",
          800: "rgb(var(--navy-800) / <alpha-value>)",
          700: "rgb(var(--navy-700) / <alpha-value>)",
          600: "rgb(var(--navy-600) / <alpha-value>)",
          500: "rgb(var(--navy-500) / <alpha-value>)",
        },
        ink: {
          100: "rgb(var(--ink-100) / <alpha-value>)",
          200: "rgb(var(--ink-200) / <alpha-value>)",
          300: "rgb(var(--ink-300) / <alpha-value>)",
          400: "rgb(var(--ink-400) / <alpha-value>)",
          500: "rgb(var(--ink-500) / <alpha-value>)",
          600: "rgb(var(--ink-600) / <alpha-value>)",
          700: "rgb(var(--ink-700) / <alpha-value>)",
        },
        signal: {
          blue: "rgb(var(--signal-blue) / <alpha-value>)",
          blueDim: "rgb(var(--signal-blueDim) / <alpha-value>)",
          green: "rgb(var(--signal-green) / <alpha-value>)",
          greenDim: "rgb(var(--signal-greenDim) / <alpha-value>)",
          amber: "rgb(var(--signal-amber) / <alpha-value>)",
          amberDim: "rgb(var(--signal-amberDim) / <alpha-value>)",
          red: "rgb(var(--signal-red) / <alpha-value>)",
          redDim: "rgb(var(--signal-redDim) / <alpha-value>)",
          purple: "rgb(var(--signal-purple) / <alpha-value>)",
          purpleDim: "rgb(var(--signal-purpleDim) / <alpha-value>)",
        },
      },
      fontFamily: {
        display: ["'Space Grotesk'", "sans-serif"],
        body: ["'Inter'", "sans-serif"],
        mono: ["'JetBrains Mono'", "monospace"],
        sans: ["'Inter'", "sans-serif"],
      },
      boxShadow: {
        card: "0 1px 0 0 rgba(255,255,255,0.03) inset, 0 8px 24px -12px rgba(0,0,0,0.15)",
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
