// app/store/runs.ts - Simulation runs state management

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { SimulationOutputs } from "@/app/types";

interface RunsState {
  runs: SimulationOutputs[];
  activeRunId: string | null;

  // Actions
  addRun: (run: SimulationOutputs) => void;
  setActiveRun: (id: string | null) => void;
  deleteRun: (id: string) => void;
  getActiveRun: () => SimulationOutputs | null;
  getRunsByScenario: (scenarioId: string) => SimulationOutputs[];
}

export const useRunsStore = create<RunsState>()(
  persist(
    (set, get) => ({
      runs: [],
      activeRunId: null,

      addRun: (run) =>
        set((state) => ({
          runs: [run, ...state.runs].slice(0, 50), // Keep last 50
          activeRunId: run.summary.id,
        })),

      setActiveRun: (id) => set({ activeRunId: id }),

      deleteRun: (id) =>
        set((state) => ({
          runs: state.runs.filter((r) => r.summary.id !== id),
          activeRunId: state.activeRunId === id ? null : state.activeRunId,
        })),

      getActiveRun: () => {
        const state = get();
        return state.runs.find((r) => r.summary.id === state.activeRunId) ?? null;
      },

      getRunsByScenario: (scenarioId) => {
        return get().runs.filter((r) => r.summary.scenarioId === scenarioId);
      },
    }),
    {
      name: "riskcoach_neo_runs",
    }
  )
);
