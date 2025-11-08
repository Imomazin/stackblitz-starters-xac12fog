// app/store/scenario.ts - Scenario state management with localStorage

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { ScenarioConfig } from "@/app/types";

interface ScenarioState {
  scenarios: ScenarioConfig[];
  activeScenarioId: string | null;

  // Actions
  setActiveScenario: (id: string | null) => void;
  addScenario: (scenario: ScenarioConfig) => void;
  updateScenario: (id: string, updates: Partial<ScenarioConfig>) => void;
  deleteScenario: (id: string) => void;
  getActiveScenario: () => ScenarioConfig | null;
}

export const useScenarioStore = create<ScenarioState>()(
  persist(
    (set, get) => ({
      scenarios: [],
      activeScenarioId: null,

      setActiveScenario: (id) => set({ activeScenarioId: id }),

      addScenario: (scenario) =>
        set((state) => ({
          scenarios: [...state.scenarios, scenario],
          activeScenarioId: scenario.id,
        })),

      updateScenario: (id, updates) =>
        set((state) => ({
          scenarios: state.scenarios.map((s) =>
            s.id === id ? { ...s, ...updates, updatedAt: Date.now() } : s
          ),
        })),

      deleteScenario: (id) =>
        set((state) => ({
          scenarios: state.scenarios.filter((s) => s.id !== id),
          activeScenarioId: state.activeScenarioId === id ? null : state.activeScenarioId,
        })),

      getActiveScenario: () => {
        const state = get();
        return state.scenarios.find((s) => s.id === state.activeScenarioId) ?? null;
      },
    }),
    {
      name: "riskcoach_neo_scenarios",
    }
  )
);
