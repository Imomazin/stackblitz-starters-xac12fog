"use client";

import "./globals.css";
import { useEffect } from "react";
import { useUiStore } from "./store/ui";
import { TrendingUp, Moon, Sun } from "lucide-react";
import type { TabName } from "./types";

// Enterprise-grade navigation with categories
const TAB_GROUPS: { title: string; tabs: { id: TabName; label: string; icon?: string }[] }[] = [
  {
    title: "Start",
    tabs: [
      { id: "home", label: "Home" },
    ],
  },
  {
    title: "Core",
    tabs: [
      { id: "dashboard", label: "Dashboard" },
      { id: "monte-carlo", label: "Monte Carlo" },
      { id: "scenario-studio", label: "Scenarios" },
      { id: "register", label: "Risk Register" },
    ],
  },
  {
    title: "Advanced Analytics",
    tabs: [
      { id: "cognitive-twin", label: "Digital Twin" },
      { id: "portfolio", label: "Portfolio" },
      { id: "network", label: "Network" },
      { id: "bayesian", label: "Bayesian" },
      { id: "forecasting", label: "Forecasting" },
    ],
  },
  {
    title: "Risk Methods",
    tabs: [
      { id: "bow-tie", label: "Bow-tie" },
      { id: "fmea", label: "FMEA" },
      { id: "kri", label: "KRI" },
      { id: "risk-appetite", label: "Appetite" },
    ],
  },
  {
    title: "Domain Risks",
    tabs: [
      { id: "cyber-risk", label: "Cyber" },
      { id: "climate-risk", label: "Climate" },
      { id: "supply-chain", label: "Supply Chain" },
      { id: "esg", label: "ESG" },
      { id: "third-party", label: "Vendors" },
    ],
  },
  {
    title: "Modeling",
    tabs: [
      { id: "agent-based", label: "Agent-Based" },
      { id: "system-dynamics", label: "System Dynamics" },
      { id: "what-if", label: "What-If" },
      { id: "stress-lab", label: "Stress Lab" },
    ],
  },
  {
    title: "Management",
    tabs: [
      { id: "risk-transfer", label: "Insurance" },
      { id: "compliance", label: "Compliance" },
      { id: "playbooks", label: "Playbooks" },
      { id: "templates", label: "Templates" },
      { id: "history", label: "History" },
      { id: "reports", label: "Reports" },
      { id: "settings", label: "Settings" },
    ],
  },
];

// Flatten for quick access
const ALL_TABS = TAB_GROUPS.flatMap((g) => g.tabs);

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
        <title>Lumina Risk - AI-Powered Enterprise Risk Intelligence Platform</title>
        <meta
          name="description"
          content="World-class risk management platform with AI insights, Monte Carlo simulations, Digital Twins, and 29 enterprise modules"
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
                    LUMINA RISK
                  </h1>
                  <p className="text-xs text-textMute">AI-Powered Enterprise Intelligence</p>
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

            {/* Tab Navigation - Grouped & Scrollable */}
            <nav className="overflow-x-auto">
              <div className="flex gap-6 min-w-max pb-2">
                {TAB_GROUPS.map((group) => (
                  <div key={group.title} className="flex flex-col gap-1">
                    <div className="text-xs font-semibold text-textMute/60 uppercase tracking-wider px-2 mb-1">
                      {group.title}
                    </div>
                    <div className="flex gap-1">
                      {group.tabs.map((tab) => (
                        <button
                          key={tab.id}
                          onClick={() => setActiveTab(tab.id)}
                          className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all whitespace-nowrap ${
                            activeTab === tab.id
                              ? "bg-gradient-neo text-white shadow-glow"
                              : "text-textMute hover:text-text hover:bg-surface/50"
                          }`}
                        >
                          {tab.label}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
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
