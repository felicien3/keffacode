/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,jsx}"],
  theme: {
    extend: {
      colors: {
        ink: { DEFAULT: "#0B1F2A", soft: "#12303F", line: "#1C4356" },
        paper: "#F5F7F6",
        signal: { DEFAULT: "#F3C54D", deep: "#D29E1C" },
        easy: "#1F8A5B",
        medium: "#B07400",
        hard: "#B23A48",
        gfg: {
          dark: "#0A2E22",
          green: "#0F8A55",
          light: "#EAF8F2",
          gold: "#F2C94C",
          slate: "#12303F",
        },
      },
      fontFamily: {
        display: ["Sora", "system-ui", "sans-serif"],
        sans: ["Inter", "system-ui", "sans-serif"],
        mono: ['"JetBrains Mono"', "ui-monospace", "monospace"],
      },
      boxShadow: {
        panel:
          "0 1px 0 rgba(11,31,42,.06), 0 20px 40px -28px rgba(14,40,33,.5)",
      },
    },
  },
  plugins: [],
};
