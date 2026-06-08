import type { Config } from "tailwindcss";
const config: Config = {
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        vy: "#FFFC00", ink: "#111111",
        purple: "#6C63FF", cyan: "#00D4FF",
        pink: "#FF5EA8", mint: "#00FFB3",
      },
    },
  },
  plugins: [],
};
export default config;
