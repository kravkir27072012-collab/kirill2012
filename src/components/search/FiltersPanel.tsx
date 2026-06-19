"use client";

import { MARKETPLACES } from "@/types/marketplace";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useFiltersStore } from "@/store/useFiltersStore";
import { formatPrice } from "@/lib/format";
import { cn } from "@/lib/utils";

const RATING_OPTIONS = [0, 3.5, 4, 4.5];
const REVIEW_OPTIONS = [0, 10, 50, 200];

function Chip({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "rounded-full border px-3 py-1.5 text-sm transition-colors",
        active
          ? "border-primary bg-primary text-primary-foreground"
          : "border-border bg-background text-muted-foreground hover:text-foreground"
      )}
    >
      {children}
    </button>
  );
}

export function FiltersPanel() {
  const filters = useFiltersStore((state) => state.filters);
  const priceBounds = useFiltersStore((state) => state.priceBounds);
  const setPriceRange = useFiltersStore((state) => state.setPriceRange);
  const setOriginalsOnly = useFiltersStore((state) => state.setOriginalsOnly);
  const setMinRating = useFiltersStore((state) => state.setMinRating);
  const setMinReviews = useFiltersStore((state) => state.setMinReviews);
  const toggleMarketplace = useFiltersStore((state) => state.toggleMarketplace);
  const resetFilters = useFiltersStore((state) => state.resetFilters);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <div className="mb-3 flex items-center justify-between">
          <Label>Цена, ₸</Label>
          <span className="text-xs text-muted-foreground">
            {formatPrice(filters.priceMin)} – {formatPrice(filters.priceMax)}
          </span>
        </div>
        <Slider
          min={priceBounds.min}
          max={priceBounds.max}
          step={500}
          value={[filters.priceMin, filters.priceMax]}
          onValueChange={(value) => setPriceRange([value[0], value[1]])}
        />
      </div>

      <Separator />

      <div className="flex items-center justify-between gap-3">
        <div>
          <Label htmlFor="originals-only">Только оригиналы</Label>
          <p className="mt-0.5 text-xs text-muted-foreground">Скрыть товары с высоким риском подделки</p>
        </div>
        <Switch
          id="originals-only"
          checked={filters.originalsOnly}
          onCheckedChange={setOriginalsOnly}
        />
      </div>

      <Separator />

      <div>
        <Label className="mb-3">Минимальный рейтинг</Label>
        <div className="flex flex-wrap gap-2">
          {RATING_OPTIONS.map((rating) => (
            <Chip key={rating} active={filters.minRating === rating} onClick={() => setMinRating(rating)}>
              {rating === 0 ? "Любой" : `${rating}+`}
            </Chip>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3">Минимум отзывов</Label>
        <div className="flex flex-wrap gap-2">
          {REVIEW_OPTIONS.map((count) => (
            <Chip key={count} active={filters.minReviews === count} onClick={() => setMinReviews(count)}>
              {count === 0 ? "Любое" : `${count}+`}
            </Chip>
          ))}
        </div>
      </div>

      <Separator />

      <div>
        <Label className="mb-3">Маркетплейсы</Label>
        <div className="flex flex-col gap-3">
          {MARKETPLACES.map((marketplace) => (
            <div key={marketplace.id} className="flex items-center gap-2.5">
              <Checkbox
                id={`marketplace-${marketplace.id}`}
                checked={filters.marketplaces.includes(marketplace.id)}
                onCheckedChange={() => toggleMarketplace(marketplace.id)}
              />
              <Label htmlFor={`marketplace-${marketplace.id}`} className="flex-1 cursor-pointer font-normal">
                <span className="mr-2 inline-block size-2 rounded-full" style={{ backgroundColor: marketplace.color }} />
                {marketplace.label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      <Button variant="outline" onClick={resetFilters} className="mt-1">
        Сбросить фильтры
      </Button>
    </div>
  );
}
