import { MARKETPLACES, type Product, type SearchFilters } from "@/types/marketplace";

/** Builds sensible filter bounds (price range, all marketplaces selected) from a result set. */
export function buildDefaultFilters(products: Product[]): SearchFilters {
  const prices = products.map((p) => p.price);

  return {
    priceMin: prices.length ? Math.min(...prices) : 0,
    priceMax: prices.length ? Math.max(...prices) : 200000,
    originalsOnly: false,
    minRating: 0,
    minReviews: 0,
    marketplaces: MARKETPLACES.map((m) => m.id),
    sortBy: "score",
  };
}
