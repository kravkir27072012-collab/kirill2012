import type { AuthenticityAssessment, Product } from "@/types/marketplace";
import { median } from "./stats";

/**
 * Heuristic-only counterfeit-risk indicator. It looks at three signals
 * relative to the same shoe's listings on *other* marketplaces:
 *  1. price suspiciously below the cross-marketplace median for this exact model,
 *  2. low seller rating,
 *  3. low review count.
 *
 * This is intentionally simple and explicitly surfaced to users as an
 * estimate, never a guarantee (see the tooltip copy in `AuthenticityBadge`).
 */
export function assessAuthenticity(product: Product, allProducts: Product[]): AuthenticityAssessment {
  if (product.isOfficialStore) {
    return {
      level: "likely_original",
      label: "Оригинал вероятен",
      reasons: ["Официальный магазин бренда/маркетплейса"],
    };
  }

  const peers = allProducts.filter((p) => p.groupId === product.groupId);
  const referencePrice = peers.length > 1 ? median(peers.map((p) => p.price)) : product.price;
  const priceRatio = referencePrice > 0 ? product.price / referencePrice : 1;

  let riskPoints = 0;
  const reasons: string[] = [];

  if (priceRatio < 0.55) {
    riskPoints += 2;
    reasons.push(
      `Цена примерно на ${Math.round((1 - priceRatio) * 100)}% ниже медианной для этой модели на других маркетплейсах`
    );
  } else if (priceRatio < 0.75) {
    riskPoints += 1;
    reasons.push("Цена заметно ниже медианной для этой модели");
  }

  if (product.sellerRating < 3.5) {
    riskPoints += 2;
    reasons.push(`Низкий рейтинг продавца (${product.sellerRating.toFixed(1)} из 5)`);
  } else if (product.sellerRating < 4.0) {
    riskPoints += 1;
    reasons.push(`Рейтинг продавца ниже среднего (${product.sellerRating.toFixed(1)} из 5)`);
  }

  if (product.reviewCount < 10) {
    riskPoints += 2;
    reasons.push(`Очень мало отзывов (${product.reviewCount})`);
  } else if (product.reviewCount < 30) {
    riskPoints += 1;
    reasons.push(`Немного отзывов (${product.reviewCount})`);
  }

  if (riskPoints >= 4) {
    return { level: "high_risk", label: "Высокий риск подделки", reasons };
  }

  if (riskPoints >= 2) {
    return { level: "uncertain", label: "Спорно", reasons };
  }

  return {
    level: "likely_original",
    label: "Оригинал вероятен",
    reasons: reasons.length > 0 ? reasons : ["Цена и рейтинг продавца в норме для этой модели"],
  };
}
