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
        surface: "#1C1B18",
        surface2: "#242219",
        cobalt: "#1B2E6B",
        cobaltLight: "#5C7CFA",
        amber: "#B45309",
        green: "#1A6B3C",
        greenLight: "#34B369",
      },
      fontFamily: {
        sora: ["var(--font-sora)", "sans-serif"],
      },
    },
  },
  plugins: [],
};

export default config;
