import { createMockMarketplaceProvider } from "./createMockMarketplaceProvider";

/**
 * TODO(real-integration): Kaspi.kz exposes a Merchant/Catalog API for sellers
 * and an internal search API behind kaspi.kz/yml/offer-view used by the
 * storefront. A real provider would call that endpoint (or an approved
 * partner feed), map `offer` -> `Product`, and respect Kaspi's rate limits.
 * Auth would be an API key/merchant token injected via env vars — never
 * commit real credentials here.
 */
export const kaspiProvider = createMockMarketplaceProvider("kaspi", [180, 420]);
