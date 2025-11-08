// app/store/register.ts - Risk Register state management

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { RiskItem } from "@/app/types";

interface RegisterState {
  risks: RiskItem[];

  // Actions
  addRisk: (risk: RiskItem) => void;
  updateRisk: (id: string, updates: Partial<RiskItem>) => void;
  deleteRisk: (id: string) => void;
  getRisksByScenario: (scenarioId: string) => RiskItem[];
}

export const useRegisterStore = create<RegisterState>()(
  persist(
    (set, get) => ({
      risks: [],

      addRisk: (risk) =>
        set((state) => ({
          risks: [...state.risks, risk],
        })),

      updateRisk: (id, updates) =>
        set((state) => ({
          risks: state.risks.map((r) =>
            r.id === id ? { ...r, ...updates, updatedAt: Date.now() } : r
          ),
        })),

      deleteRisk: (id) =>
        set((state) => ({
          risks: state.risks.filter((r) => r.id !== id),
        })),

      getRisksByScenario: (scenarioId) => {
        return get().risks.filter(
          (r) => r.linkedScenarioIds && r.linkedScenarioIds.includes(scenarioId)
        );
      },
    }),
    {
      name: "riskcoach_neo_register",
    }
  )
);
