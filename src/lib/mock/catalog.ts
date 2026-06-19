/**
 * Hand-curated catalog of sneaker models. This is the only "hand-typed"
 * mock data — everything else (prices, sellers, ratings, review counts,
 * which marketplaces stock which model) is deterministically generated
 * from this catalog by `lib/mock/listings.ts`.
 */

export interface SneakerModel {
  modelId: string;
  brand: string;
  model: string;
  colorway: string;
  /** Reference price in KZT for a mid-range size, used as the generator's baseline. */
  basePrice: number;
  sizes: number[];
  /** 0..1 — drives marketplace coverage and review-count baselines. */
  popularity: number;
  segment: "lifestyle" | "running" | "basketball" | "outdoor";
  /** Extra search synonyms (Russian/transliteration) to make text search forgiving. */
  keywords: string[];
}

export const SNEAKER_CATALOG: SneakerModel[] = [
  {
    modelId: "nike-af1-white",
    brand: "Nike",
    model: "Air Force 1 '07",
    colorway: "Белый",
    basePrice: 42000,
    sizes: [40, 41, 42, 43, 44, 45],
    popularity: 0.95,
    segment: "lifestyle",
    keywords: ["af1", "форсы", "эйрфорс", "white", "белые"],
  },
  {
    modelId: "nike-af1-black",
    brand: "Nike",
    model: "Air Force 1 '07",
    colorway: "Чёрный",
    basePrice: 43500,
    sizes: [39, 40, 41, 42, 43, 44],
    popularity: 0.9,
    segment: "lifestyle",
    keywords: ["af1", "форсы", "эйрфорс", "black", "чёрные", "черные"],
  },
  {
    modelId: "nike-air-max-270",
    brand: "Nike",
    model: "Air Max 270",
    colorway: "Чёрный/Белый",
    basePrice: 58000,
    sizes: [40, 41, 42, 43, 44, 45],
    popularity: 0.75,
    segment: "running",
    keywords: ["airmax", "аирмакс", "эйрмакс", "270"],
  },
  {
    modelId: "nike-dunk-low-panda",
    brand: "Nike",
    model: "Dunk Low",
    colorway: "Panda (чёрно-белые)",
    basePrice: 65000,
    sizes: [39, 40, 41, 42, 43, 44, 45],
    popularity: 0.85,
    segment: "lifestyle",
    keywords: ["dunk", "данк", "панда", "panda"],
  },
  {
    modelId: "nike-aj1-chicago",
    brand: "Nike",
    model: "Air Jordan 1 Retro High OG",
    colorway: "Chicago",
    basePrice: 95000,
    sizes: [40, 41, 42, 43, 44],
    popularity: 0.7,
    segment: "basketball",
    keywords: ["jordan", "джордан", "аж1", "aj1", "чикаго"],
  },
  {
    modelId: "adidas-samba-og-black",
    brand: "Adidas",
    model: "Samba OG",
    colorway: "Чёрный",
    basePrice: 38000,
    sizes: [40, 41, 42, 43, 44, 45],
    popularity: 0.9,
    segment: "lifestyle",
    keywords: ["самба", "samba"],
  },
  {
    modelId: "adidas-ultraboost-22",
    brand: "Adidas",
    model: "Ultraboost 22",
    colorway: "Core Black",
    basePrice: 72000,
    sizes: [40, 41, 42, 43, 44, 45],
    popularity: 0.6,
    segment: "running",
    keywords: ["ультрабуст", "ultraboost", "буст", "boost"],
  },
  {
    modelId: "adidas-forum-low",
    brand: "Adidas",
    model: "Forum Low",
    colorway: "White/Blue",
    basePrice: 47000,
    sizes: [40, 41, 42, 43, 44],
    popularity: 0.55,
    segment: "lifestyle",
    keywords: ["форум", "forum"],
  },
  {
    modelId: "nb-530-white-silver",
    brand: "New Balance",
    model: "530",
    colorway: "White/Silver",
    basePrice: 44000,
    sizes: [40, 41, 42, 43, 44, 45],
    popularity: 0.65,
    segment: "lifestyle",
    keywords: ["нью бэланс", "нб530", "nb530"],
  },
  {
    modelId: "nb-9060-grey",
    brand: "New Balance",
    model: "9060",
    colorway: "Grey/Silver",
    basePrice: 78000,
    sizes: [40, 41, 42, 43, 44],
    popularity: 0.45,
    segment: "lifestyle",
    keywords: ["9060", "нью бэланс"],
  },
  {
    modelId: "puma-suede-red",
    brand: "Puma",
    model: "Suede Classic",
    colorway: "Красный",
    basePrice: 32000,
    sizes: [39, 40, 41, 42, 43, 44],
    popularity: 0.4,
    segment: "lifestyle",
    keywords: ["суед", "suede", "пума"],
  },
  {
    modelId: "reebok-classic-leather",
    brand: "Reebok",
    model: "Classic Leather",
    colorway: "Белый",
    basePrice: 29000,
    sizes: [39, 40, 41, 42, 43, 44, 45],
    popularity: 0.5,
    segment: "lifestyle",
    keywords: ["рибок", "classic", "классик"],
  },
  {
    modelId: "converse-chuck70-black",
    brand: "Converse",
    model: "Chuck 70",
    colorway: "Чёрный",
    basePrice: 36000,
    sizes: [39, 40, 41, 42, 43, 44],
    popularity: 0.55,
    segment: "lifestyle",
    keywords: ["конверс", "чак", "chuck"],
  },
  {
    modelId: "vans-old-skool",
    brand: "Vans",
    model: "Old Skool",
    colorway: "Чёрный/Белый",
    basePrice: 33000,
    sizes: [39, 40, 41, 42, 43, 44, 45],
    popularity: 0.6,
    segment: "lifestyle",
    keywords: ["вэнсы", "vans", "олд скул"],
  },
  {
    modelId: "salomon-xt6-black",
    brand: "Salomon",
    model: "XT-6",
    colorway: "Чёрный",
    basePrice: 89000,
    sizes: [40, 41, 42, 43, 44],
    popularity: 0.3,
    segment: "outdoor",
    keywords: ["саломон", "salomon", "xt6"],
  },
];
