import type { ScoredProduct, SearchFilters, SortOption } from "@/types/marketplace";

/**
 * Scores/authenticity/badges are computed once per search (see `rankProducts`,
 * called against the full result set). Filters and sorting here only ever
 * narrow and reorder that already-ranked list — they never recompute scores,
 * so "best choice" stays stable while the user plays with filters and the
 * UI can re-derive this synchronously on every keystroke/slider tick.
 */
export function applyFilters(products: ScoredProduct[], filters: SearchFilters): ScoredProduct[] {
  const filtered = products.filter((product) => {
    if (product.price < filters.priceMin || product.price > filters.priceMax) return false;
    if (filters.originalsOnly && product.authenticity.level === "high_risk") return false;
    if (product.rating < filters.minRating) return false;
    if (product.reviewCount < filters.minReviews) return false;
    if (!filters.marketplaces.includes(product.marketplace)) return false;
    return true;
  });

  return sortProducts(filtered, filters.sortBy);
}

export function sortProducts(products: ScoredProduct[], sortBy: SortOption): ScoredProduct[] {
  const copy = [...products];

  switch (sortBy) {
    case "price_asc":
      return copy.sort((a, b) => a.price - b.price);
    case "price_desc":
      return copy.sort((a, b) => b.price - a.price);
    case "rating":
      return copy.sort((a, b) => b.rating - a.rating || b.reviewCount - a.reviewCount);
    case "reviews":
      return copy.sort((a, b) => b.reviewCount - a.reviewCount);
    case "score":
    default:
      return copy.sort((a, b) => b.score - a.score);
  }
}
