import type { Config } from "tailwindcss";

const config: Config = {
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
        primary: {
          DEFAULT: "#FD3E04",
          glow: "rgba(253, 62, 4, 0.5)",
        },
        secondary: {
          DEFAULT: "#13162F",
          light: "#1E234B",
        },
      },
    },
  },
  plugins: [],
};
export default config;
