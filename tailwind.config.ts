import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        ink: "#0A0A0A",
        paper: "#F5F3EE",
        gray: {
          950: "#111111",
          900: "#181818",
          800: "#262626",
          700: "#3A3A3A",
          600: "#525252",
          500: "#6B6B6B",
          400: "#8A8A8A",
          300: "#ADADAD",
          200: "#CFCFCC",
          100: "#E4E2DC",
        },
      },
      fontFamily: {
        display: ["\"Helvetica Neue\"", "Helvetica", "Arial", "sans-serif"],
        body: ["\"Helvetica Neue\"", "Helvetica", "Arial", "sans-serif"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
      maxWidth: {
        content: "1120px",
      },
    },
  },
  plugins: [],
};

export default config;
