import type { AuthenticityLevel, Product } from "@/types/marketplace";
import { clamp } from "./stats";

const WEIGHTS = {
  price: 0.35,
  rating: 0.25,
  reviews: 0.15,
  trust: 0.25,
};

const AUTHENTICITY_PENALTY: Record<AuthenticityLevel, number> = {
  likely_original: 0,
  uncertain: 0.12,
  high_risk: 0.35,
};

interface ScoreBounds {
  minPrice: number;
  maxPrice: number;
  maxReviews: number;
}

export function computeScoreBounds(products: Product[]): ScoreBounds {
  if (products.length === 0) return { minPrice: 0, maxPrice: 0, maxReviews: 0 };
  return {
    minPrice: Math.min(...products.map((p) => p.price)),
    maxPrice: Math.max(...products.map((p) => p.price)),
    maxReviews: Math.max(...products.map((p) => p.reviewCount)),
  };
}

function priceScore(price: number, bounds: ScoreBounds): number {
  if (bounds.maxPrice <= bounds.minPrice) return 1;
  return 1 - (price - bounds.minPrice) / (bounds.maxPrice - bounds.minPrice);
}

function reviewsScore(reviewCount: number, bounds: ScoreBounds): number {
  if (bounds.maxReviews <= 0) return 0;
  return Math.log1p(reviewCount) / Math.log1p(bounds.maxReviews);
}

function trustScore(product: Product): number {
  const sellerComponent = product.sellerRating / 5;
  const officialBonus = product.isOfficialStore ? 0.15 : 0;
  return clamp(sellerComponent + officialBonus, 0, 1);
}

/**
 * Smart-scoring used to rank "best value" — a weighted blend of normalized
 * price (cheaper is better), rating, review volume (log-scaled so a few
 * outlier listings with thousands of reviews don't drown everything else
 * out), and seller trust. An authenticity penalty is then applied so a
 * suspiciously-cheap, low-trust listing can never win "best choice" purely
 * on price. Returns a 0-100 score.
 */
export function computeScore(
  product: Product,
  bounds: ScoreBounds,
  authenticityLevel: AuthenticityLevel
): number {
  const raw =
    WEIGHTS.price * priceScore(product.price, bounds) +
    WEIGHTS.rating * (product.rating / 5) +
    WEIGHTS.reviews * reviewsScore(product.reviewCount, bounds) +
    WEIGHTS.trust * trustScore(product);

  const penalized = raw * (1 - AUTHENTICITY_PENALTY[authenticityLevel]);

  return Math.round(clamp(penalized, 0, 1) * 100);
}
