"use client";

import { Heart, ArrowUpRight, Sparkles, Tag, Award } from "lucide-react";

import type { ScoredProduct } from "@/types/marketplace";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MarketplaceBadge } from "@/components/shared/MarketplaceBadge";
import { AuthenticityBadge } from "@/components/shared/AuthenticityBadge";
import { StarRating } from "@/components/shared/StarRating";
import { formatPrice, formatReviewCount } from "@/lib/format";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { cn } from "@/lib/utils";

interface ComparisonRowProps {
  product: ScoredProduct;
}

export function ComparisonRow({ product }: ComparisonRowProps) {
  const isFavorite = useFavoritesStore((state) => state.isFavorite(product.id));
  const toggleFavorite = useFavoritesStore((state) => state.toggleFavorite);

  return (
    <div
      className={cn(
        "flex flex-col gap-3 rounded-2xl border p-4 sm:flex-row sm:items-center sm:justify-between",
        product.isBestChoice ? "border-primary/50 bg-primary/[0.03]" : "border-border/60"
      )}
    >
      <div className="flex flex-1 flex-col gap-2">
        <div className="flex flex-wrap items-center gap-1.5">
          <MarketplaceBadge marketplace={product.marketplace} />
          {product.isBestChoice && (
            <Badge className="border-transparent bg-gradient-to-r from-amber-400 to-orange-500 text-white">
              <Sparkles className="size-3" />
              Лучший выбор
            </Badge>
          )}
          {product.isBestPrice && (
            <Badge
              variant="outline"
              className="text-emerald-600 dark:text-emerald-400 border-emerald-200 dark:border-emerald-800"
            >
              <Tag className="size-3" />
              Лучшая цена
            </Badge>
          )}
          {product.isBestRating && (
            <Badge
              variant="outline"
              className="text-sky-600 dark:text-sky-400 border-sky-200 dark:border-sky-800"
            >
              <Award className="size-3" />
              Лучший рейтинг
            </Badge>
          )}
          <AuthenticityBadge assessment={product.authenticity} />
        </div>

        <div className="flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <span>{product.sellerName}</span>
          <span className="flex items-center gap-1.5">
            <StarRating rating={product.rating} />
            {product.rating.toFixed(1)} · {formatReviewCount(product.reviewCount)}
          </span>
          <span>Размер EU {product.size}</span>
          <span>Артикул {product.sku}</span>
          <span>{product.inStock ? `Доставка ${product.deliveryDays} дн.` : "Нет в наличии"}</span>
        </div>
      </div>

      <div className="flex items-center gap-3 sm:flex-col sm:items-end sm:gap-2">
        <div className="text-right">
          <p className="text-xl font-bold tracking-tight">{formatPrice(product.price)}</p>
          {product.oldPrice && (
            <p className="text-xs text-muted-foreground line-through">{formatPrice(product.oldPrice)}</p>
          )}
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => toggleFavorite(product)}
            aria-pressed={isFavorite}
            aria-label={isFavorite ? "Убрать из избранного" : "Добавить в избранное"}
            className="flex size-9 items-center justify-center rounded-full ring-1 ring-border/60 transition-transform active:scale-90 hover:bg-accent"
          >
            <Heart className={cn("size-4.5", isFavorite ? "fill-red-500 text-red-500" : "text-foreground/60")} />
          </button>
          <Button asChild size="sm">
            <a href={product.url} target="_blank" rel="noopener noreferrer">
              Перейти
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>
    </div>
  );
}
