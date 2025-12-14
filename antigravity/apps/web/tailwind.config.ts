import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        antigravity: {
          primary: "#17e0ff",
          accent: "#ff2fb9"
        }
      }
    }
  },
  plugins: []
};

export default config;
