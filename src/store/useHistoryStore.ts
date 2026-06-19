"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

interface HistoryState {
  queries: string[];
  addQuery: (query: string) => void;
  removeQuery: (query: string) => void;
  clear: () => void;
}

const MAX_HISTORY = 8;

export const useHistoryStore = create<HistoryState>()(
  persist(
    (set) => ({
      queries: [],

      addQuery: (query) => {
        const trimmed = query.trim();
        if (!trimmed) return;

        set((state) => {
          const withoutDupe = state.queries.filter(
            (q) => q.toLowerCase() !== trimmed.toLowerCase()
          );
          return { queries: [trimmed, ...withoutDupe].slice(0, MAX_HISTORY) };
        });
      },

      removeQuery: (query) =>
        set((state) => ({ queries: state.queries.filter((q) => q !== query) })),

      clear: () => set({ queries: [] }),
    }),
    { name: "kz-sneakers-history" }
  )
);
