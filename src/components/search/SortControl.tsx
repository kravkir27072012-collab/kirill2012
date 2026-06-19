"use client";

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useFiltersStore } from "@/store/useFiltersStore";
import type { SortOption } from "@/types/marketplace";

const SORT_LABELS: Record<SortOption, string> = {
  score: "По умному скорингу",
  price_asc: "Сначала дешевле",
  price_desc: "Сначала дороже",
  rating: "По рейтингу",
  reviews: "По числу отзывов",
};

export function SortControl() {
  const sortBy = useFiltersStore((state) => state.filters.sortBy);
  const setSortBy = useFiltersStore((state) => state.setSortBy);

  return (
    <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
      <SelectTrigger className="w-fit min-w-[180px]">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {Object.entries(SORT_LABELS).map(([value, label]) => (
          <SelectItem key={value} value={value}>
            {label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
