import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        plasma: "#1FA9D9",
        carbon: "#0A0A0A",
        "card-dark": "#1A1A1A",
        "gray-mid": "#7A7A7A",
        "off-white": "#ffffff",
      },
      fontFamily: {
        sans: ["var(--font-inter)", '"PP Neue Montreal"', "Inter", "sans-serif"],
        mono: ["var(--font-jetbrains)", '"JetBrains Mono"', "monospace"],
      },
      letterSpacing: {
        tightest: "-0.04em",
      },
    },
  },
  plugins: [],
};

export default config;
