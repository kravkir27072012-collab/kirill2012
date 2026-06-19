"use client";

import { useState } from "react";

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

const CATEGORY_PHOTO_TAGS: Record<ProductCategory, string> = {
  sneakers: "sneakers,shoes",
  electronics: "smartphone,electronics",
  furniture: "sofa,furniture",
  appliances: "kitchen,appliance",
  clothing: "jacket,clothing",
};

function hashSeed(seed: string): number {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }
  return hash;
}

/**
 * No real listing/photo exists behind a mock product, so this hotlinks a
 * real (but category-relevant, not product-accurate) stock photo from
 * LoremFlickr, deterministic per `seed` — same model always shows the same
 * photo. Falls back to the old gradient + icon placeholder on load failure
 * so a flaky third-party host never leaves a broken image on screen.
 */
export function ProductImage({ seed, brand, category, className }: ProductImageProps) {
  const [failed, setFailed] = useState(false);
  const { from, to } = colorFromSeed(seed);
  const Icon = CATEGORY_ICONS[category];
  const photoUrl = `https://loremflickr.com/600/600/${CATEGORY_PHOTO_TAGS[category]}?lock=${hashSeed(seed)}`;

  return (
    <div
      className={cn("relative flex items-center justify-center overflow-hidden", className)}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
    >
      {failed ? (
        <Icon className="size-1/2 text-white/90" strokeWidth={1.25} aria-hidden />
      ) : (
        // eslint-disable-next-line @next/next/no-img-element -- external, unregistered host; next/image would need it allowlisted in next.config
        <img
          src={photoUrl}
          alt={brand}
          onError={() => setFailed(true)}
          className="absolute inset-0 size-full object-cover"
        />
      )}
      <span className="absolute bottom-2.5 right-3 text-[10px] font-semibold tracking-wide text-white/75 uppercase">
        {brand}
      </span>
    </div>
  );
}
