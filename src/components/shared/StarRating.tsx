import { Star } from "lucide-react";

import { cn } from "@/lib/utils";

interface StarRatingProps {
  rating: number;
  className?: string;
  size?: number;
}

export function StarRating({ rating, className, size = 14 }: StarRatingProps) {
  const rounded = Math.round(rating * 2) / 2;

  return (
    <div className={cn("flex items-center gap-0.5", className)} aria-label={`Рейтинг ${rating} из 5`}>
      {Array.from({ length: 5 }, (_, i) => {
        const filled = i + 1 <= rounded;
        const half = !filled && i + 0.5 === rounded;
        return (
          <span key={i} className="relative inline-flex">
            <Star
              width={size}
              height={size}
              className={cn("text-muted-foreground/30", filled && "hidden", half && "hidden")}
            />
            {filled && (
              <Star width={size} height={size} className="fill-amber-400 text-amber-400" />
            )}
            {half && (
              <span className="absolute inset-0 w-1/2 overflow-hidden">
                <Star width={size} height={size} className="fill-amber-400 text-amber-400" />
              </span>
            )}
            {half && (
              <Star width={size} height={size} className="absolute inset-0 text-muted-foreground/30 -z-10" />
            )}
          </span>
        );
      })}
    </div>
  );
}
