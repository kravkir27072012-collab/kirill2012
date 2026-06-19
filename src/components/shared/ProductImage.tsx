import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { colorFromSeed } from "@/lib/colorFromSeed";
import { cn } from "@/lib/utils";
import type { ProductCategory } from "@/types/marketplace";

interface ProductImageProps {
  seed: string;
  brand: string;
  category: ProductCategory;
  className?: string;
}

/**
 * No real product photography exists for mock listings (and we don't want to
 * hotlink real marketplace/brand images). This renders a deterministic
 * gradient + icon placeholder instead — same model always gets the same
 * "photo" across marketplaces, with zero network dependency.
 */
export function ProductImage({ seed, brand, category, className }: ProductImageProps) {
  const { from, to } = colorFromSeed(seed);
  const Icon = CATEGORY_ICONS[category];

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      <Icon className="size-1/2 text-white/90" strokeWidth={1.25} aria-hidden />
      <span className="absolute bottom-2.5 right-3 text-[10px] font-semibold tracking-wide text-white/75 uppercase">
        {brand}
      </span>
    </div>
  );
}
