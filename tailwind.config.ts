import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}"
  ],
  theme: {
    extend: {
      colors: {
        brand: {
          50: "#f5f8ff",
          100: "#e6eeff",
          200: "#c2d3ff",
          300: "#99b5ff",
          400: "#6c90ff",
          500: "#3f68ff",
          600: "#2247db",
          700: "#1636ac",
          800: "#122e86",
          900: "#10286a"
        }
      }
    }
  },
  plugins: []
};

export default config;
