import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        "byzai-purple": "#7B61FF",
        "byzai-blue": "#468BFF",
        "byzai-cyan": "#26C6DA",
        "byzai-bg": "#0F1420",
        "byzai-surface": "#161C27",
        "byzai-card": "#232D40",
        "byzai-card-highlight": "#2A3550",
        "byzai-border": "#324055",
        "byzai-divider": "#2A3445",
        "byzai-text-primary": "#F8FAFF",
        "byzai-text-secondary": "#B3BDD1",
        "byzai-text-tertiary": "#7E8798",
        "byzai-success": "#36D399",
        "byzai-warning": "#F2C04D",
        "byzai-danger": "#FF6B6B",
        "byzai-xp-accent": "#F2C04D",
      },
      fontFamily: {
        display: ["Syne", "sans-serif"],
        body: ["DM Sans", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;