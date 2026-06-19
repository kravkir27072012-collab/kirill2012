import type { ProductCategory } from "@/types/marketplace";

/**
 * Hand-curated catalog entry shared by every category. This is the only
 * "hand-typed" mock data — everything else (prices, sellers, ratings, review
 * counts, which marketplaces stock which model) is deterministically
 * generated from these entries by `lib/mock/listings.ts`.
 */
export interface CatalogModel {
  modelId: string;
  category: ProductCategory;
  brand: string;
  model: string;
  /** Color/finish/configuration (e.g. shoe colorway, phone storage+color, sofa fabric). */
  variant: string;
  /** Reference price in KZT for a mid-range option, used as the generator's baseline. */
  basePrice: number;
  /** Size/variant options shown per listing. Empty array = no size axis for this product. */
  sizes: string[];
  /** 0..1 — drives marketplace coverage and review-count baselines. */
  popularity: number;
  /** Free-form sub-category, e.g. "running" for sneakers or "smartphones" for electronics. */
  segment: string;
  /** Extra search synonyms (Russian/transliteration) to make text search forgiving. */
  keywords: string[];
}
