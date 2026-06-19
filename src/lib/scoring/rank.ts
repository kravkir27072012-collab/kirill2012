import type { Product, ScoredProduct } from "@/types/marketplace";
import { assessAuthenticity } from "./authenticity";
import { computeScore, computeScoreBounds } from "./score";

/**
 * The single entry point the UI calls to turn raw `Product[]` (from the
 * aggregator) into fully ranked `ScoredProduct[]`: computes each item's
 * authenticity assessment and 0-100 score, then flags the best-choice,
 * best-price and best-rating items within the given set.
 *
 * Bounds/medians are computed from the array passed in, so calling this
 * again after filters narrow the list re-contextualizes "best choice" to
 * what's actually visible.
 */
export function rankProducts(products: Product[]): ScoredProduct[] {
  if (products.length === 0) return [];

  const bounds = computeScoreBounds(products);

  const scored: ScoredProduct[] = products.map((product) => {
    const authenticity = assessAuthenticity(product, products);
    const score = computeScore(product, bounds, authenticity.level);

    return {
      ...product,
      score,
      authenticity,
      isBestChoice: false,
      isBestPrice: false,
      isBestRating: false,
    };
  });

  const bestScoreId = scored.reduce((best, p) => (p.score > best.score ? p : best)).id;
  const bestPriceId = scored.reduce((best, p) => (p.price < best.price ? p : best)).id;
  const bestRatingId = scored.reduce((best, p) =>
    p.rating > best.rating || (p.rating === best.rating && p.reviewCount > best.reviewCount)
      ? p
      : best
  ).id;

  for (const product of scored) {
    product.isBestChoice = product.id === bestScoreId;
    product.isBestPrice = product.id === bestPriceId;
    product.isBestRating = product.id === bestRatingId;
  }

  return scored;
}
