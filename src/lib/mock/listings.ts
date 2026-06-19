import { MARKETPLACES, type MarketplaceId, type Product } from "@/types/marketplace";
import { CATALOG, type CatalogModel } from "./catalog";
import { clamp, createRng, roundTo } from "./random";

const SELLER_NAMES: Record<MarketplaceId, string[]> = {
  kaspi: ["Kaspi Магазин", "Almaty Trade Shop", "Kaspi Магазин Товаров", "GoodsPoint.kz", "Brand Outlet Almaty"],
  technodom: ["Technodom Marketplace", "TD Marketplace Seller", "Trade Lab KZ"],
  mechta: ["Mechta Store", "Mechta Marketplace Seller", "City Goods"],
  wildberries_kz: ["WB Seller Almaty", "Global Trade KZ", "ИП Сапаров Е.", "Wholesale Market KZ", "СкладТоваров.kz"],
  ozon_kz: ["Ozon Fulfillment", "Market Lab Ozon", "ИП Жумабекова А.", "Astana Trade"],
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

function buildListing(model: CatalogModel, marketplaceId: MarketplaceId): Product {
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

  const size = model.sizes.length > 0 ? rng.pick(model.sizes) : undefined;
  const sellerName = isOfficialStore
    ? `${meta.label} Official Store`
    : rng.pick(SELLER_NAMES[marketplaceId]);

  // Drawn last so it doesn't shift the sequence of earlier draws above.
  const sku = String(rng.int(100000000, 999999999));

  return {
    id: `${model.modelId}__${marketplaceId}`,
    sku,
    groupId: model.modelId,
    title: `${model.brand} ${model.model} «${model.variant}»`,
    brand: model.brand,
    model: model.model,
    variant: model.variant,
    size,
    category: model.category,
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
    // No real listing exists behind this mock product, so we link to the
    // marketplace's real homepage instead of a fabricated product path —
    // a fake deep link would just 404 on the real site.
    url: `https://${meta.domain}`,
    isOfficialStore,
    inStock: rng.bool(0.93),
    deliveryDays: isOfficialStore ? rng.int(1, 3) : rng.int(2, 9),
    updatedAt: new Date(2026, 5, rng.int(10, 18)).toISOString(),
  };
}

function generateAllListings(): Product[] {
  const listings: Product[] = [];

  for (const model of CATALOG) {
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

export function getModelById(modelId: string): CatalogModel | undefined {
  return CATALOG.find((m) => m.modelId === modelId);
}

export function buildSearchHaystack(model: CatalogModel, product: Product): string {
  return [model.brand, model.model, model.variant, product.size, product.marketplace, ...model.keywords]
    .filter((part): part is string => Boolean(part))
    .join(" ")
    .toLowerCase();
}
