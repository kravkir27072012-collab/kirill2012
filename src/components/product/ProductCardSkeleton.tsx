import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";

export function ProductCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden py-0 gap-0">
      <Skeleton className="aspect-square w-full rounded-none" />
      <div className="flex flex-1 flex-col gap-3 p-4">
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-3 w-1/3" />
        <Skeleton className="h-5 w-2/5" />
        <div className="mt-auto flex items-end justify-between gap-3 pt-1">
          <Skeleton className="h-7 w-24" />
          <Skeleton className="h-9 w-24 rounded-full" />
        </div>
      </div>
    </Card>
  );
}
