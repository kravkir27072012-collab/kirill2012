import { createMockMarketplaceProvider } from "./createMockMarketplaceProvider";

/**
 * TODO(real-integration): Wildberries exposes a public search/content API
 * (`search.wb.ru`, `card.wb.ru`) that can be queried per-locale/region for
 * the KZ storefront. A real provider would call it server-side, map WB's
 * `product` shape (nm, salePriceU, supplierRating, feedbacks, ...) into our
 * normalized `Product`, and convert prices from kopecks to KZT as needed.
 */
export const wildberriesKzProvider = createMockMarketplaceProvider("wildberries_kz", [150, 380]);
