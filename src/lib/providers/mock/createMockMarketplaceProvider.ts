import type { MarketplaceId, Product, ProviderSearchFilters } from "@/types/marketplace";
import type { MarketplaceProvider } from "../MarketplaceProvider";
import { ALL_LISTINGS, buildSearchHaystack, getModelById } from "@/lib/mock/listings";
import { matchScore, tokenize } from "@/lib/search/textSearch";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Shared engine behind every per-marketplace mock provider. Each marketplace
 * file (`kaspiProvider.ts`, `wildberriesKzProvider.ts`, ...) just supplies an
 * id and a simulated-latency range, so the duplicated boilerplate of "filter
 * by marketplace, run text search, fake network delay" lives in one place.
 *
 * TODO(real-integration): a production provider would replace the body of
 * `search()` entirely with an HTTP call to the marketplace's API/parser
 * service, then map its raw response into `Product[]` — the rest of the app
 * (scoring, filters, UI) would not need to change at all.
 */
export function createMockMarketplaceProvider(
  id: MarketplaceId,
  latencyRangeMs: [number, number] = [150, 450]
): MarketplaceProvider {
  return {
    id,
    async search(query: string, filters?: ProviderSearchFilters): Promise<Product[]> {
      const [min, max] = latencyRangeMs;
      await delay(min + Math.random() * (max - min));

      const tokens = tokenize(query);

      return ALL_LISTINGS.filter((product) => {
        if (product.marketplace !== id) return false;

        const model = getModelById(product.groupId);
        if (!model) return false;

        if (matchScore(buildSearchHaystack(model, product), tokens) <= 0) return false;

        if (filters?.priceMin !== undefined && product.price < filters.priceMin) return false;
        if (filters?.priceMax !== undefined && product.price > filters.priceMax) return false;

        return true;
      });
    },
  };
}
