import type { Config } from 'tailwindcss';

const config: Config = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  darkMode: ['class'], // we will toggle a class on <html>
  theme: {
    extend: {
      colors: {
        // use CSS vars for live theme swap
        bg: "var(--bg)",
        surface: "var(--surface)",
        text: "var(--text)",
        textMute: "var(--text-mute)",
        border: "var(--border)",
        // accents
        primary: "var(--primary)",
        secondary: "var(--secondary)",
        highlight: "var(--highlight)",
      },
      boxShadow: {
        glow: "0 0 24px rgba(0, 245, 212, 0.25)",
        inkg: "0 0 28px rgba(123, 63, 228, 0.22)",
      },
      fontFamily: {
        sans: ["Outfit", "Inter", "ui-sans-serif", "system-ui"],
        mono: ["JetBrains Mono", "ui-monospace", "SFMono-Regular"],
      },
      keyframes: {
        drift: {
          "0%": { backgroundPosition: "0% 0%" },
          "50%": { backgroundPosition: "100% 100%" },
          "100%": { backgroundPosition: "0% 0%" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
      },
      animation: {
        drift: "drift 20s ease-in-out infinite",
        shimmer: "shimmer 1.5s linear infinite",
      },
    },
  },
  plugins: [],
};
export default config;
