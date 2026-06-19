"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Sparkles, ArrowUpRight, Tag, Award } from "lucide-react";

import type { ScoredProduct } from "@/types/marketplace";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StarRating } from "@/components/shared/StarRating";
import { MarketplaceBadge } from "@/components/shared/MarketplaceBadge";
import { AuthenticityBadge } from "@/components/shared/AuthenticityBadge";
import { ProductImage } from "@/components/shared/ProductImage";
import { formatPrice, formatReviewCount } from "@/lib/format";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: ScoredProduct;
}

export function ProductCard({ product }: ProductCardProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      whileHover={{ y: -4 }}
      className="h-full"
    >
      <Card className="group relative h-full overflow-hidden py-0 gap-0">
        <div className="relative">
          <Link href={`/product/${product.groupId}`} className="block">
            <ProductImage
              seed={product.imageSeed}
              brand={product.brand}
              category={product.category}
              className="aspect-square w-full"
            />
          </Link>

          {product.isBestChoice && (
            <Badge className="absolute left-3 top-3 border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white shadow-md">
              <Sparkles className="size-3" />
              Лучший выбор
            </Badge>
          )}

          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            className="absolute right-3 top-3 flex size-9 items-center justify-center rounded-full bg-background/80 shadow-sm ring-1 ring-border/60 backdrop-blur transition-transform active:scale-90"
          >
            <Heart
              className={cn(
                "size-4.5 transition-colors",
                isFavorite ? "fill-red-500 text-red-500" : "text-foreground/60"
              )}
            />
          </button>

          <div className="absolute bottom-3 left-3">
            <MarketplaceBadge marketplace={product.marketplace} />
          </div>
        </div>

        <div className="flex flex-1 flex-col gap-3 p-4">
          <div>
            <Link href={`/product/${product.groupId}`} className="line-clamp-2 font-semibold leading-snug hover:underline">
              {product.title}
            </Link>
            <p className="mt-0.5 text-xs text-muted-foreground">
              {[product.size, `Артикул ${product.sku}`].filter(Boolean).join(" · ")}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-1.5">
            <AuthenticityBadge assessment={product.authenticity} />
            {product.isBestPrice && (
              <Badge variant="outline" className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800">
                <Tag className="size-3" />
                Лучшая цена
              </Badge>
            )}
            {product.isBestRating && (
              <Badge variant="outline" className="text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800">
                <Award className="size-3" />
                Лучший рейтинг
              </Badge>
            )}
          </div>

          <div className="flex items-center gap-2">
            <StarRating rating={product.rating} />
            <span className="text-sm font-medium">{product.rating.toFixed(1)}</span>
            <span className="text-xs text-muted-foreground">· {formatReviewCount(product.reviewCount)}</span>
          </div>

          <div className="mt-auto flex items-end justify-between gap-3 pt-1">
            <div>
              <p className="text-2xl font-bold tracking-tight">{formatPrice(product.price)}</p>
              {product.oldPrice && (
                <p className="text-sm text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
              )}
            </div>

            <Button asChild size="sm" className="shrink-0">
              <a href={product.url} target="_blank" rel="noopener noreferrer">
                Перейти
                <ArrowUpRight />
              </a>
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  );
}
