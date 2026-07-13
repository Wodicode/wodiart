import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        offwhite: "#F6F5F1",
        charcoal: "#0F0E0C",
        cobalt: "#1B2E6B",
        amber: "#B45309",
        green: "#1A6B3C",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
