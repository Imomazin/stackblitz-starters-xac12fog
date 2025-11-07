"use client";
import { create } from "zustand";
import dayjs from "dayjs";

export type SavedPlan = {
  id: string;
  input: string;
  plan: any | null;
  reply: string | null;
  createdAt: string;
  rating?: string;
};

type S = {
  items: SavedPlan[];
  add: (p: SavedPlan) => void;
  remove: (id: string) => void;
  clear: () => void;
  setItems: (items: SavedPlan[]) => void;
};

const KEY = "rc_history_v1";

export const useCoach = create<S>((set, get) => ({
  items: [],
  add: (p) => {
    const items = [p, ...get().items].slice(0, 50);
    set({ items });
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  },
  remove: (id) => {
    const items = get().items.filter(x => x.id !== id);
    set({ items });
    if (typeof window !== "undefined") localStorage.setItem(KEY, JSON.stringify(items));
  },
  clear: () => {
    set({ items: [] });
    if (typeof window !== "undefined") localStorage.removeItem(KEY);
  },
  setItems: (items) => set({ items }),
}));

export function loadHistory() {
  if (typeof window === "undefined") return;
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) useCoach.getState().setItems(JSON.parse(raw));
  } catch {}
}

export function makeSaved(input: string, result: any) {
  return {
    id: crypto.randomUUID(),
    input,
    plan: result?.plan ?? null,
    reply: result?.reply ?? null,
    createdAt: dayjs().toISOString(),
    rating: result?.plan?.rating ?? undefined,
  } as SavedPlan;
}
