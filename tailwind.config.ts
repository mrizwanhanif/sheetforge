import type { Config } from "tailwindcss";

export default {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
      fontFamily: {
        display: ["var(--font-display)", "Syne", "sans-serif"],
        body: ["var(--font-body)", "Source Sans 3", "sans-serif"],
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(12px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "grain-shift": {
          "0%": { backgroundPosition: "0 0" },
          "100%": { backgroundPosition: "120px 80px" },
        },
        "soft-pulse": {
          "0%, 100%": { opacity: "0.45" },
          "50%": { opacity: "0.75" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.7s ease-out both",
        "fade-up-delay": "fade-up 0.7s ease-out 0.15s both",
        "fade-up-late": "fade-up 0.7s ease-out 0.3s both",
        "grain-shift": "grain-shift 28s linear infinite",
        "soft-pulse": "soft-pulse 5s ease-in-out infinite",
      },
    },
  },
  plugins: [],
} satisfies Config;
