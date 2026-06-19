"use client";

import { useMemo } from "react";

import { useFavoritesStore } from "@/store/useFavoritesStore";
import { rankProducts } from "@/lib/scoring/rank";
import { pluralizeRu } from "@/lib/format";
import { ProductGrid } from "@/components/product/ProductGrid";
import { Button } from "@/components/ui/button";
import { EmptyState } from "@/components/shared/EmptyState";
import { useIsClient } from "@/hooks/useIsClient";

export default function FavoritesPage() {
  const mounted = useIsClient();

  const items = useFavoritesStore((state) => state.items);
  const clear = useFavoritesStore((state) => state.clear);

  const ranked = useMemo(() => rankProducts(items), [items]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Избранное</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {mounted && items.length > 0
              ? `${items.length} ${pluralizeRu(items.length, [
                  "сохранённый товар",
                  "сохранённых товара",
                  "сохранённых товаров",
                ])}`
              : "Здесь появятся товары, которые вы отметите сердечком"}
          </p>
        </div>
        {mounted && items.length > 0 && (
          <Button variant="outline" onClick={clear}>
            Очистить избранное
          </Button>
        )}
      </div>

      {!mounted ? (
        <ProductGrid products={[]} isLoading />
      ) : ranked.length > 0 ? (
        <ProductGrid products={ranked} />
      ) : (
        <EmptyState
          title="Пока пусто"
          description="Нажмите на значок сердечка на карточке товара, чтобы добавить его в избранное."
        />
      )}
    </div>
  );
}
