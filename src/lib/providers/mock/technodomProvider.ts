import { createMockMarketplaceProvider } from "./createMockMarketplaceProvider";

/**
 * TODO(real-integration): Technodom does not publish a public product API.
 * A real provider would either use an official partner data feed if one
 * becomes available, or a compliant server-side parser service that
 * respects technodom.kz's robots.txt/ToS, with caching to avoid hammering
 * the storefront. Swap this file's `search()` body only — callers never
 * need to change.
 */
export const technodomProvider = createMockMarketplaceProvider("technodom", [200, 500]);
