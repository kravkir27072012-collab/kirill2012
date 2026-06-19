import { MARKETPLACES, type MarketplaceId, type Product } from "@/types/marketplace";
import { SNEAKER_CATALOG, type SneakerModel } from "./catalog";
import { clamp, createRng, roundTo } from "./random";

const SELLER_NAMES: Record<MarketplaceId, string[]> = {
  kaspi: ["SneakerHouse KZ", "Almaty Sport Shop", "Kaspi Магазин Спорта", "ShoesPoint.kz", "Brand Outlet Almaty"],
  technodom: ["Technodom Lifestyle", "TD Marketplace Seller", "Sport Lab KZ"],
  mechta: ["Mechta Fashion Store", "Mechta Marketplace Seller", "City Sneakers"],
  wildberries_kz: ["WB Seller Almaty", "Global Sneaker Trade", "ИП Сапаров Е.", "Fashion Wholesale KZ", "СкладОбувь.kz"],
  ozon_kz: ["Ozon Fulfillment", "Sneaker Lab Ozon", "ИП Жумабекова А.", "Astana Footwear"],
};

const OFFICIAL_STORE_BIAS: Record<MarketplaceId, number> = {
  kaspi: 0.45,
  technodom: 0.5,
  mechta: 0.4,
  wildberries_kz: 0.15,
  ozon_kz: 0.2,
};

/** How many marketplaces should carry a given model, scaled by its popularity. */
function coverageCount(popularity: number) {
  return clamp(1 + Math.round(popularity * 3), 1, 5);
}

function buildListing(model: SneakerModel, marketplaceId: MarketplaceId): Product {
  const rng = createRng(`${model.modelId}__${marketplaceId}`);
  const meta = MARKETPLACES.find((m) => m.id === marketplaceId)!;

  const isOfficialStore = rng.bool(OFFICIAL_STORE_BIAS[marketplaceId]);
  // ~22% of third-party listings are deliberately "suspicious" so the
  // authenticity heuristic has real signal to react to, not just decoration.
  const isSuspicious = !isOfficialStore && rng.bool(0.22);

  let priceMultiplier: number;
  let sellerRating: number;
  let reviewCount: number;

  if (isOfficialStore) {
    priceMultiplier = rng.range(0.97, 1.18);
    sellerRating = rng.range(4.5, 5.0);
    reviewCount = rng.int(150, 3200) * (0.4 + model.popularity);
  } else if (isSuspicious) {
    priceMultiplier = rng.range(0.38, 0.58);
    sellerRating = rng.range(2.8, 3.9);
    reviewCount = rng.int(1, 24);
  } else {
    priceMultiplier = rng.range(0.85, 1.22);
    sellerRating = rng.range(4.0, 4.9);
    reviewCount = rng.int(35, 1800) * (0.4 + model.popularity);
  }

  const price = roundTo(model.basePrice * priceMultiplier, 500);
  const hasDiscount = !isSuspicious && rng.bool(0.32);
  const oldPrice = hasDiscount ? roundTo(price * rng.range(1.08, 1.35), 500) : undefined;

  const rating = isSuspicious
    ? clamp(rng.range(3.0, 4.2), 1, 5)
    : clamp(sellerRating + rng.range(-0.4, 0.3), 2.5, 5);

  const size = rng.pick(model.sizes);
  const sellerName = isOfficialStore
    ? `${meta.label} Official Store`
    : rng.pick(SELLER_NAMES[marketplaceId]);

  return {
    id: `${model.modelId}__${marketplaceId}`,
    groupId: model.modelId,
    title: `${model.brand} ${model.model} «${model.colorway}»`,
    brand: model.brand,
    model: model.model,
    colorway: model.colorway,
    size,
    category: "sneakers",
    price,
    oldPrice,
    currency: "KZT",
    marketplace: marketplaceId,
    sellerName,
    sellerRating: Number(clamp(sellerRating, 1, 5).toFixed(1)),
    sellerReviewCount: Math.round(reviewCount * rng.range(0.6, 1.1)),
    rating: Number(rating.toFixed(1)),
    reviewCount: Math.round(reviewCount),
    imageSeed: model.modelId,
    url: `https://${meta.domain}/product/${model.modelId}-${marketplaceId}`,
    isOfficialStore,
    inStock: rng.bool(0.93),
    deliveryDays: isOfficialStore ? rng.int(1, 3) : rng.int(2, 9),
    updatedAt: new Date(2026, 5, rng.int(10, 18)).toISOString(),
  };
}

function generateAllListings(): Product[] {
  const listings: Product[] = [];

  for (const model of SNEAKER_CATALOG) {
    const count = coverageCount(model.popularity);
    const order = createRng(`coverage__${model.modelId}`).shuffle(MARKETPLACES);
    const chosen = order.slice(0, count);

    for (const marketplace of chosen) {
      listings.push(buildListing(model, marketplace.id));
    }
  }

  return listings;
}

/** The full mock catalog, generated once per process/bundle load (deterministic, SSR-safe). */
export const ALL_LISTINGS: Product[] = generateAllListings();

export function getModelById(modelId: string): SneakerModel | undefined {
  return SNEAKER_CATALOG.find((m) => m.modelId === modelId);
}

export function buildSearchHaystack(model: SneakerModel, product: Product): string {
  return [
    model.brand,
    model.model,
    model.colorway,
    product.size,
    product.marketplace,
    ...model.keywords,
  ]
    .join(" ")
    .toLowerCase();
}
