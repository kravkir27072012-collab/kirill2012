import { createMockMarketplaceProvider } from "./createMockMarketplaceProvider";

/**
 * TODO(real-integration): Mechta's marketplace storefront would need either
 * a partner/affiliate data feed or a dedicated parser service, similar to
 * Technodom. Keep the network/auth details inside this file so the rest of
 * the app stays agnostic of where Mechta's data actually comes from.
 */
export const mechtaProvider = createMockMarketplaceProvider("mechta", [200, 480]);
