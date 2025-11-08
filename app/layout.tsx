"use client";

import "./globals.css";
import { useEffect } from "react";
import { useUiStore } from "./store/ui";
import { TrendingUp, Moon, Sun } from "lucide-react";
import type { TabName } from "./types";

const TABS: { id: TabName; label: string }[] = [
  { id: "dashboard", label: "Dashboard" },
  { id: "monte-carlo", label: "Monte Carlo" },
  { id: "scenario-studio", label: "Scenario Studio" },
  { id: "register", label: "Risk Register" },
];

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const theme = useUiStore((s) => s.theme);
  const setTheme = useUiStore((s) => s.setTheme);
  const activeTab = useUiStore((s) => s.activeTab);
  const setActiveTab = useUiStore((s) => s.setActiveTab);

  useEffect(() => {
    document.documentElement.classList.toggle("light", theme === "light");
  }, [theme]);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <title>RiskCoachNeo - Simulation-Grade Risk Workstation</title>
        <meta
          name="description"
          content="Professional Monte Carlo simulation platform for SME risk management"
        />
      </head>
      <body>
        {/* Header */}
        <header className="border-b border-border bg-surface/80 backdrop-blur-sm sticky top-0 z-50">
          <div className="max-w-[1800px] mx-auto px-6 py-4">
            <div className="flex items-center justify-between mb-4">
              {/* Logo */}
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-gradient-neo flex items-center justify-center shadow-glow">
                  <TrendingUp className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gradient">
                    RiskCoach<sub className="text-xs">Neo</sub>
                  </h1>
                  <p className="text-xs text-textMute">Simulation-Grade Risk Workstation</p>
                </div>
              </div>

              {/* Theme Toggle */}
              <button
                onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                className="btn-ghost p-2"
                aria-label="Toggle theme"
              >
                {theme === "dark" ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </button>
            </div>

            {/* Tab Navigation */}
            <nav className="flex gap-1">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-gradient-neo text-white shadow-glow"
                      : "text-textMute hover:text-text hover:bg-surface"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="min-h-[calc(100vh-180px)]">{children}</main>

        {/* Footer */}
        <footer className="border-t border-border bg-surface/60 py-4 mt-12">
          <div className="max-w-[1800px] mx-auto px-6 text-center text-sm text-textMute">
            Powered by <strong className="text-text">Ambidexters Inc.</strong>, a subsidiary of{" "}
            <em className="text-text">Viva La Vida</em>.
          </div>
        </footer>
      </body>
    </html>
  );
}
