import { getMarketplaceMeta, type MarketplaceId } from "@/types/marketplace";
import { cn } from "@/lib/utils";

interface MarketplaceBadgeProps {
  marketplace: MarketplaceId;
  className?: string;
}

export function MarketplaceBadge({ marketplace, className }: MarketplaceBadgeProps) {
  const meta = getMarketplaceMeta(marketplace);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full bg-background/90 px-2.5 py-1 text-xs font-medium shadow-sm ring-1 ring-border/60 backdrop-blur",
        className
      )}
    >
      <span className="size-1.5 rounded-full" style={{ backgroundColor: meta.color }} aria-hidden />
      {meta.label}
    </span>
  );
}
