"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";
import type { Product } from "@/types/marketplace";

interface FavoritesState {
  items: Product[];
  toggleFavorite: (product: Product) => void;
  isFavorite: (id: string) => boolean;
  removeFavorite: (id: string) => void;
  clear: () => void;
}

export const useFavoritesStore = create<FavoritesState>()(
  persist(
    (set, get) => ({
      items: [],

      toggleFavorite: (product) =>
        set((state) => {
          const exists = state.items.some((p) => p.id === product.id);
          return {
            items: exists
              ? state.items.filter((p) => p.id !== product.id)
              : [product, ...state.items],
          };
        }),

      isFavorite: (id) => get().items.some((p) => p.id === id),

      removeFavorite: (id) =>
        set((state) => ({ items: state.items.filter((p) => p.id !== id) })),

      clear: () => set({ items: [] }),
    }),
    { name: "kz-sneakers-favorites" }
  )
);
