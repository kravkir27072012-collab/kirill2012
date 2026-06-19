import type { Product, ProviderSearchFilters } from "@/types/marketplace";
import { MARKETPLACE_PROVIDERS } from "@/lib/providers/registry";

/**
 * Fans a query out to every registered `MarketplaceProvider` in parallel and
 * merges the results. Uses `allSettled` so one marketplace failing (timeout,
 * API outage, ...) never breaks the whole search — this is the behavior a
 * real multi-source aggregator needs, and the mocks exercise the same path.
 */
export async function searchAllMarketplaces(
  query: string,
  filters?: ProviderSearchFilters
): Promise<Product[]> {
  const results = await Promise.allSettled(
    MARKETPLACE_PROVIDERS.map((provider) => provider.search(query, filters))
  );

  const products: Product[] = [];
  for (const result of results) {
    if (result.status === "fulfilled") {
      products.push(...result.value);
    }
    // TODO(observability): log/report `result.reason` for failed providers
    // once there's somewhere real to send telemetry.
  }

  return products;
}
