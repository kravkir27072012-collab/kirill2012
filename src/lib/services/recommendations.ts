import type { ScoredProduct } from "@/types/marketplace";
import { searchAllMarketplaces } from "./aggregator";
import { rankProducts } from "@/lib/scoring/rank";

/**
 * Home page "recommended" rail. Goes through the same provider/aggregator
 * path as a real search (empty query = match everything) so swapping mocks
 * for real marketplace integrations later requires no change here.
 */
export async function getRecommendedProducts(limit = 8): Promise<ScoredProduct[]> {
  const products = await searchAllMarketplaces("");
  const ranked = rankProducts(products).sort((a, b) => b.score - a.score);
  return ranked.slice(0, limit);
}
