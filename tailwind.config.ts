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
        primary: {
          DEFAULT: "#00288e",
          container: "#1e40af",
          fixed: "#dde1ff",
          "fixed-dim": "#b8c4ff",
        },
        "on-primary": {
          DEFAULT: "#ffffff",
          container: "#a8b8ff",
          fixed: "#001453",
          "fixed-variant": "#173bab",
        },
        "inverse-primary": "#b8c4ff",
        secondary: {
          DEFAULT: "#505f76",
          container: "#d0e1fb",
          fixed: "#d3e4fe",
          "fixed-dim": "#b7c8e1",
        },
        "on-secondary": {
          DEFAULT: "#ffffff",
          container: "#54647a",
          fixed: "#0b1c30",
          "fixed-variant": "#38485d",
        },
        tertiary: {
          DEFAULT: "#611e00",
          container: "#872d00",
          fixed: "#ffdbce",
          "fixed-dim": "#ffb59a",
        },
        "on-tertiary": {
          DEFAULT: "#ffffff",
          container: "#ffa583",
          fixed: "#380d00",
          "fixed-variant": "#802a00",
        },
        background: "#f9f9ff",
        "on-background": "#111c2d",
        surface: {
          DEFAULT: "#f9f9ff",
          dim: "#cfdaf2",
          bright: "#f9f9ff",
          variant: "#d8e3fb",
          container: {
            lowest: "#ffffff",
            low: "#f0f3ff",
            DEFAULT: "#e7eeff",
            high: "#dee8ff",
            highest: "#d8e3fb",
          },
        },
        "on-surface": {
          DEFAULT: "#111c2d",
          variant: "#444653",
        },
        "inverse-surface": "#263143",
        "inverse-on-surface": "#ecf1ff",
        outline: {
          DEFAULT: "#757684",
          variant: "#c4c5d5",
        },
        "surface-tint": "#3755c3",
        error: {
          DEFAULT: "#ba1a1a",
          container: "#ffdad6",
        },
        "on-error": {
          DEFAULT: "#ffffff",
          container: "#93000a",
        },
      },
      fontFamily: {
        sans: ["var(--font-inter)", "Inter", "sans-serif"],
      },
      boxShadow: {
        "level-1": "0px 4px 20px rgba(30, 41, 59, 0.05)",
        "level-2": "0px 10px 25px rgba(30, 41, 59, 0.10)",
        glass: "0 8px 32px 0 rgba(0, 40, 142, 0.05)",
      },
      borderRadius: {
        card: "0.75rem", // 12px
      },
    },
  },
  plugins: [],
};

export default config;
