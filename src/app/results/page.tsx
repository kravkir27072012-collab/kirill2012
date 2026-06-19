import type { Metadata } from "next";

import { searchAllMarketplaces } from "@/lib/services/aggregator";
import { ResultsView } from "@/components/search/ResultsView";
import { PRODUCT_CATEGORIES, type ProductCategory, type SearchFilters, type SortOption } from "@/types/marketplace";

interface ResultsPageProps {
  searchParams: Promise<{
    q?: string;
    priceMax?: string;
    priceMin?: string;
    originalsOnly?: string;
    minRating?: string;
    sortBy?: string;
    category?: string;
  }>;
}

export const metadata: Metadata = {
  title: "Результаты поиска — KrossKZ",
};

const SORT_OPTIONS: SortOption[] = ["score", "price_asc", "price_desc", "rating", "reviews"];

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { q, priceMax, priceMin, originalsOnly, minRating, sortBy, category } = await searchParams;
  const query = q?.trim() ?? "";
  const products = await searchAllMarketplaces(query);

  const overrides: Partial<SearchFilters> = {};
  if (priceMax) overrides.priceMax = Number(priceMax);
  if (priceMin) overrides.priceMin = Number(priceMin);
  if (originalsOnly) overrides.originalsOnly = originalsOnly === "true";
  if (minRating) overrides.minRating = Number(minRating);
  if (sortBy && SORT_OPTIONS.includes(sortBy as SortOption)) overrides.sortBy = sortBy as SortOption;
  if (category && PRODUCT_CATEGORIES.some((c) => c.id === category)) {
    overrides.categories = [category as ProductCategory];
  }

  return (
    <ResultsView
      query={query}
      initialProducts={products}
      overrides={Object.keys(overrides).length > 0 ? overrides : undefined}
    />
  );
}
