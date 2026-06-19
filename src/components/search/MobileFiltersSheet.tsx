"use client";

import { useState } from "react";
import { SlidersHorizontal } from "lucide-react";

import { MARKETPLACES, PRODUCT_CATEGORIES } from "@/types/marketplace";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { FiltersPanel } from "./FiltersPanel";
import { useFiltersStore } from "@/store/useFiltersStore";

export function MobileFiltersSheet() {
  const [open, setOpen] = useState(false);
  const filters = useFiltersStore((state) => state.filters);
  const priceBounds = useFiltersStore((state) => state.priceBounds);

  const activeCount =
    (filters.originalsOnly ? 1 : 0) +
    (filters.minRating > 0 ? 1 : 0) +
    (filters.minReviews > 0 ? 1 : 0) +
    (filters.marketplaces.length < MARKETPLACES.length ? 1 : 0) +
    (filters.categories.length < PRODUCT_CATEGORIES.length ? 1 : 0) +
    (filters.priceMin > priceBounds.min || filters.priceMax < priceBounds.max ? 1 : 0);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <Button variant="outline" className="lg:hidden" onClick={() => setOpen(true)}>
        <SlidersHorizontal />
        Фильтры
        {activeCount > 0 && (
          <span className="flex size-5 items-center justify-center rounded-full bg-primary text-xs text-primary-foreground">
            {activeCount}
          </span>
        )}
      </Button>
      <SheetContent side="bottom" className="overflow-y-auto">
        <SheetHeader>
          <SheetTitle>Фильтры</SheetTitle>
          <SheetDescription>Применяются мгновенно</SheetDescription>
        </SheetHeader>
        <div className="overflow-y-auto px-6 pb-6">
          <FiltersPanel />
        </div>
      </SheetContent>
    </Sheet>
  );
}
