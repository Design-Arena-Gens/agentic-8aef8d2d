import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
    "./lib/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-inter)", "system-ui", "sans-serif"]
      },
      colors: {
        background: "#0f1115",
        surface: "#181b21",
        accent: "#6c5ce7",
        accentMuted: "#a29bfe",
        positive: "#81ecec",
        critical: "#ff7675"
      },
      boxShadow: {
        glow: "0 10px 40px -20px rgba(108, 92, 231, 0.8)"
      }
    }
  },
  plugins: []
};

export default config;
