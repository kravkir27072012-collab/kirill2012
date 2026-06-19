"use client";

import Link from "next/link";
import { Footprints, Heart } from "lucide-react";

import { ThemeToggle } from "./ThemeToggle";
import { CATEGORY_ICONS } from "@/lib/categoryIcons";
import { PRODUCT_CATEGORIES } from "@/types/marketplace";
import { useFavoritesStore } from "@/store/useFavoritesStore";
import { useIsClient } from "@/hooks/useIsClient";
import { cn } from "@/lib/utils";

export function Navbar() {
  const mounted = useIsClient();
  const favoritesCount = useFavoritesStore((state) => state.items.length);

  return (
    <header className="sticky top-0 z-40 w-full">
      <div className="glass border-b border-border/60">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight">
            <span className="flex size-9 items-center justify-center rounded-2xl bg-primary text-primary-foreground">
              <Footprints className="size-4.5" />
            </span>
            <span className="text-lg">KrossKZ</span>
          </Link>

          <nav className="flex items-center gap-1.5">
            <Link
              href="/favorites"
              className="relative flex size-10 items-center justify-center rounded-full transition-colors hover:bg-accent"
              aria-label="Избранное"
            >
              <Heart className="size-4.5" />
              {mounted && favoritesCount > 0 && (
                <span
                  className={cn(
                    "absolute -right-0.5 -top-0.5 flex size-4.5 items-center justify-center rounded-full bg-red-500 text-[10px] font-semibold text-white"
                  )}
                >
                  {favoritesCount > 9 ? "9+" : favoritesCount}
                </span>
              )}
            </Link>
            <ThemeToggle />
          </nav>
        </div>

        <div className="mx-auto flex max-w-7xl items-center gap-1.5 overflow-x-auto px-4 pb-3 sm:px-6 lg:px-8">
          {PRODUCT_CATEGORIES.map((category) => {
            const Icon = CATEGORY_ICONS[category.id];
            return (
              <Link
                key={category.id}
                href={`/results?category=${category.id}`}
                className="flex shrink-0 items-center gap-1.5 rounded-full border border-border/60 bg-background/60 px-3.5 py-1.5 text-sm text-muted-foreground transition-colors hover:border-border hover:text-foreground"
              >
                <Icon className="size-3.5" />
                {category.label}
              </Link>
            );
          })}
        </div>
      </div>
    </header>
  );
}
