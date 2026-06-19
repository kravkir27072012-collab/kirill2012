import { SportShoe, Smartphone, Sofa, Refrigerator, Shirt, type LucideIcon } from "lucide-react";

import type { ProductCategory } from "@/types/marketplace";

/** Single source of truth for "what icon represents this category", shared by product placeholder art and category navigation. */
export const CATEGORY_ICONS: Record<ProductCategory, LucideIcon> = {
  sneakers: SportShoe,
  electronics: Smartphone,
  furniture: Sofa,
  appliances: Refrigerator,
  clothing: Shirt,
};
