import type {
  MarketplaceId,
  Product,
  ProviderSearchFilters,
} from "@/types/marketplace";

/**
 * Abstract contract every marketplace data source must implement.
 *
 * Today every implementation in `lib/providers/mock/*` returns hand-built
 * mock data. Tomorrow, a real integration (official API, partner feed, or
 * a scraper/parser service) can implement this exact same interface and be
 * swapped in via `lib/providers/registry.ts` — nothing in the UI or the
 * scoring/authenticity layers needs to change.
 */
export interface MarketplaceProvider {
  readonly id: MarketplaceId;
  search(query: string, filters?: ProviderSearchFilters): Promise<Product[]>;
}
