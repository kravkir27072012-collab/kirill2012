"use client";

import { create } from "zustand";
import type { MarketplaceId, Product, SearchFilters, SortOption } from "@/types/marketplace";
import { buildDefaultFilters } from "@/lib/scoring/defaultFilters";

interface PriceBounds {
  min: number;
  max: number;
}

interface FiltersState {
  filters: SearchFilters;
  priceBounds: PriceBounds;
  defaults: SearchFilters;
  /** Re-baselines filters (price slider bounds, all marketplaces on) for a freshly loaded search. */
  initialize: (products: Product[], overrides?: Partial<SearchFilters>) => void;
  setPriceRange: (range: [number, number]) => void;
  setOriginalsOnly: (value: boolean) => void;
  setMinRating: (value: number) => void;
  setMinReviews: (value: number) => void;
  toggleMarketplace: (id: MarketplaceId) => void;
  setSortBy: (value: SortOption) => void;
  resetFilters: () => void;
}

const INITIAL_DEFAULTS = buildDefaultFilters([]);

export const useFiltersStore = create<FiltersState>((set) => ({
  filters: INITIAL_DEFAULTS,
  priceBounds: { min: INITIAL_DEFAULTS.priceMin, max: INITIAL_DEFAULTS.priceMax },
  defaults: INITIAL_DEFAULTS,

  initialize: (products, overrides) => {
    const defaults = buildDefaultFilters(products);
    set({
      defaults,
      priceBounds: { min: defaults.priceMin, max: defaults.priceMax },
      filters: overrides ? { ...defaults, ...overrides } : defaults,
    });
  },

  setPriceRange: ([priceMin, priceMax]) =>
    set((state) => ({ filters: { ...state.filters, priceMin, priceMax } })),

  setOriginalsOnly: (originalsOnly) =>
    set((state) => ({ filters: { ...state.filters, originalsOnly } })),

  setMinRating: (minRating) => set((state) => ({ filters: { ...state.filters, minRating } })),

  setMinReviews: (minReviews) => set((state) => ({ filters: { ...state.filters, minReviews } })),

  toggleMarketplace: (id) =>
    set((state) => {
      const isSelected = state.filters.marketplaces.includes(id);
      const marketplaces = isSelected
        ? state.filters.marketplaces.filter((m) => m !== id)
        : [...state.filters.marketplaces, id];
      return { filters: { ...state.filters, marketplaces } };
    }),

  setSortBy: (sortBy) => set((state) => ({ filters: { ...state.filters, sortBy } })),

  resetFilters: () => set((state) => ({ filters: state.defaults })),
}));
