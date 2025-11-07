"use client";
import { useThemeRC } from "../context/ThemeContext";
export default function ThemeToggle() {
  const { theme, toggle } = useThemeRC();
  return (
    <button
      onClick={toggle}
      className="px-3 py-1.5 rounded-lg border border-border hover:bg-surface/60 text-sm"
      title="Toggle theme"
    >
      {theme === "dark" ? "Light" : "Dark"}
    </button>
  );
}
