/**
 * Core domain types shared by the data layer (providers, scoring, services)
 * and the UI layer. Keeping this isolated from both lets either side change
 * independently — e.g. swapping a mock provider for a real API client only
 * ever touches `lib/providers/*`, never the components.
 */

export type MarketplaceId =
  | "kaspi"
  | "technodom"
  | "mechta"
  | "wildberries_kz"
  | "ozon_kz";

export interface MarketplaceMeta {
  id: MarketplaceId;
  label: string;
  /** Short brand color used for badges/avatars, as a Tailwind-friendly hex. */
  color: string;
  domain: string;
}

export type AuthenticityLevel = "likely_original" | "uncertain" | "high_risk";

export interface AuthenticityAssessment {
  level: AuthenticityLevel;
  label: string;
  /** Human-readable reasons the heuristic landed on this level, for a tooltip. */
  reasons: string[];
}

export type ProductCategory =
  | "sneakers"
  | "electronics"
  | "furniture"
  | "appliances"
  | "clothing";

export interface ProductCategoryMeta {
  id: ProductCategory;
  label: string;
}

export const PRODUCT_CATEGORIES: ProductCategoryMeta[] = [
  { id: "sneakers", label: "Кроссовки" },
  { id: "electronics", label: "Электроника" },
  { id: "furniture", label: "Мебель" },
  { id: "appliances", label: "Бытовая техника" },
  { id: "clothing", label: "Одежда и аксессуары" },
];

export function getCategoryMeta(id: ProductCategory): ProductCategoryMeta {
  const meta = PRODUCT_CATEGORIES.find((c) => c.id === id);
  if (!meta) throw new Error(`Unknown category: ${id}`);
  return meta;
}

/**
 * Normalized product shape used everywhere in the UI. Every `MarketplaceProvider`
 * is responsible for mapping its own raw (mock-or-real) data into this shape.
 */
export interface Product {
  id: string;
  /** Marketplace-issued article/SKU code, as shown on the real listing page. */
  sku: string;
  /** Groups the same model/variant across different marketplaces, powering price comparison. */
  groupId: string;
  title: string;
  brand: string;
  model: string;
  /** Color/finish/configuration label (e.g. shoe colorway, phone storage+color, sofa fabric). */
  variant: string;
  /** Pre-formatted size/variant label for display (e.g. "EU 42", "M", "256 ГБ"). Not every category has one. */
  size?: string;
  category: ProductCategory;
  price: number;
  oldPrice?: number;
  currency: "KZT";
  marketplace: MarketplaceId;
  sellerName: string;
  sellerRating: number;
  sellerReviewCount: number;
  rating: number;
  reviewCount: number;
  /** Deterministic key used to render a generated placeholder image (no external network calls). */
  imageSeed: string;
  url: string;
  isOfficialStore: boolean;
  inStock: boolean;
  deliveryDays: number;
  updatedAt: string;
}

/** A product enriched with computed ranking + trust signals, ready for display. */
export interface ScoredProduct extends Product {
  score: number;
  isBestChoice: boolean;
  isBestPrice: boolean;
  isBestRating: boolean;
  authenticity: AuthenticityAssessment;
}

export type SortOption =
  | "score"
  | "price_asc"
  | "price_desc"
  | "rating"
  | "reviews";

export interface SearchFilters {
  priceMin: number;
  priceMax: number;
  originalsOnly: boolean;
  minRating: number;
  minReviews: number;
  marketplaces: MarketplaceId[];
  categories: ProductCategory[];
  sortBy: SortOption;
}

/** Optional hints a caller can pass into a provider; mocks mostly ignore these. */
export interface ProviderSearchFilters {
  priceMin?: number;
  priceMax?: number;
}

export const MARKETPLACES: MarketplaceMeta[] = [
  { id: "kaspi", label: "Kaspi.kz", color: "#E2231A", domain: "kaspi.kz" },
  { id: "technodom", label: "Technodom", color: "#F8B400", domain: "technodom.kz" },
  { id: "mechta", label: "Mechta", color: "#7B2CBF", domain: "mechta.kz" },
  { id: "wildberries_kz", label: "Wildberries KZ", color: "#7000FF", domain: "wildberries.kz" },
  { id: "ozon_kz", label: "Ozon KZ", color: "#005BFF", domain: "ozon.kz" },
];

export function getMarketplaceMeta(id: MarketplaceId): MarketplaceMeta {
  const meta = MARKETPLACES.find((m) => m.id === id);
  if (!meta) throw new Error(`Unknown marketplace: ${id}`);
  return meta;
}
