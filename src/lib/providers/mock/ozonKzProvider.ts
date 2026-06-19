import { createMockMarketplaceProvider } from "./createMockMarketplaceProvider";

/**
 * TODO(real-integration): Ozon has a public Seller/Performance API plus a
 * storefront search API used internally. A real provider would call the
 * appropriate endpoint for the `ozon.kz` region, map `item` -> `Product`
 * (price, rating, `comments_amount`, seller info), and handle Ozon's
 * pagination/cursor model.
 */
export const ozonKzProvider = createMockMarketplaceProvider("ozon_kz", [160, 400]);
