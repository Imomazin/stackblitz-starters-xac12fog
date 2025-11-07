"use client";
import { createContext, useContext, useEffect, useState } from "react";

type T = { theme: "light" | "dark"; toggle: () => void };
const ThemeCtx = createContext<T>({ theme: "dark", toggle: () => {} });

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  useEffect(() => {
    const saved = window.localStorage.getItem("rc_theme");
    const sysDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    const t = saved === "light" || saved === "dark" ? saved : sysDark ? "dark" : "light";
    setTheme(t);
  }, []);

  useEffect(() => {
    if (theme === "dark") document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");
    window.localStorage.setItem("rc_theme", theme);
  }, [theme]);

  return (
    <ThemeCtx.Provider value={{ theme, toggle: () => setTheme((p) => (p === "dark" ? "light" : "dark")) }}>
      {children}
    </ThemeCtx.Provider>
  );
}

export const useThemeRC = () => useContext(ThemeCtx);
