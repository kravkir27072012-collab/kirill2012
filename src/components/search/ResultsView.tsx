"use client";

import { useEffect, useMemo } from "react";

import type { Product } from "@/types/marketplace";
import { rankProducts } from "@/lib/scoring/rank";
import { applyFilters } from "@/lib/scoring/applyFilters";
import { useFiltersStore } from "@/store/useFiltersStore";
import { ResultsHeader } from "./ResultsHeader";
import { FiltersPanel } from "./FiltersPanel";
import { ProductGrid } from "@/components/product/ProductGrid";

interface ResultsViewProps {
  query: string;
  initialProducts: Product[];
}

export function ResultsView({ query, initialProducts }: ResultsViewProps) {
  const filters = useFiltersStore((state) => state.filters);
  const initialize = useFiltersStore((state) => state.initialize);

  useEffect(() => {
    initialize(initialProducts);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [initialProducts]);

  const ranked = useMemo(() => rankProducts(initialProducts), [initialProducts]);
  const visible = useMemo(() => applyFilters(ranked, filters), [ranked, filters]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <ResultsHeader count={visible.length} query={query} />

      <div className="flex gap-8">
        <aside className="hidden w-72 shrink-0 lg:block">
          <div className="sticky top-24 rounded-2xl border border-border/60 p-5">
            <FiltersPanel />
          </div>
        </aside>

        <div className="flex-1">
          <ProductGrid products={visible} />
        </div>
      </div>
    </div>
  );
}
