// app/store/ui.ts - UI state and preferences

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { TabName, AppSettings } from "@/app/types";

interface UiState extends AppSettings {
  activeTab: TabName;

  // Actions
  setActiveTab: (tab: TabName) => void;
  setTheme: (theme: "dark" | "light") => void;
  updateSettings: (settings: Partial<AppSettings>) => void;
}

const DEFAULT_SETTINGS: AppSettings = {
  theme: "dark",
  maxRuns: 50000,
  rngType: "mulberry32",
  defaultSeed: 42,
  correlationMode: "none",
  streamingChunkSize: 5000,
  retainSamples: false,
  telemetryEnabled: true,
};

export const useUiStore = create<UiState>()(
  persist(
    (set) => ({
      ...DEFAULT_SETTINGS,
      activeTab: "dashboard",

      setActiveTab: (tab) => set({ activeTab: tab }),

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== "undefined") {
          document.documentElement.classList.toggle("light", theme === "light");
        }
      },

      updateSettings: (settings) => set(settings),
    }),
    {
      name: "riskcoach_neo_ui",
    }
  )
);
