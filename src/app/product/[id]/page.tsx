import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpRight } from "lucide-react";

import { searchAllMarketplaces } from "@/lib/services/aggregator";
import { rankProducts } from "@/lib/scoring/rank";
import { ProductImage } from "@/components/shared/ProductImage";
import { AuthenticityBadge } from "@/components/shared/AuthenticityBadge";
import { ComparisonRow } from "@/components/product/ComparisonRow";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { formatPrice, pluralizeRu } from "@/lib/format";

interface ProductPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { id } = await params;
  const allProducts = await searchAllMarketplaces("");
  const group = allProducts.filter((product) => product.groupId === id);

  if (group.length === 0) notFound();

  const ranked = rankProducts(group).sort((a, b) => b.score - a.score);
  const best = ranked[0];
  const marketplaceCount = new Set(ranked.map((p) => p.marketplace)).size;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      <Link
        href="/results"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="size-4" />
        Назад к результатам
      </Link>

      <div className="mt-4 grid gap-8 sm:grid-cols-[20rem_1fr]">
        <ProductImage seed={best.imageSeed} brand={best.brand} className="aspect-square w-full rounded-2xl" />

        <div className="flex flex-col">
          <h1 className="text-3xl font-bold tracking-tight">
            {best.brand} {best.model}
          </h1>
          <p className="mt-1 text-muted-foreground">{best.colorway}</p>

          <div className="mt-3">
            <AuthenticityBadge assessment={best.authenticity} />
          </div>

          <p className="mt-4 text-sm text-muted-foreground">
            Сравниваем {ranked.length}{" "}
            {pluralizeRu(ranked.length, ["предложение", "предложения", "предложений"])} на{" "}
            {marketplaceCount} {pluralizeRu(marketplaceCount, ["маркетплейсе", "маркетплейсах", "маркетплейсах"])}.
            Лучший вариант отмечен значком «Лучший выбор» ниже.
          </p>

          <Button asChild size="lg" className="mt-6 w-fit">
            <a href={best.url} target="_blank" rel="noopener noreferrer">
              Лучшее предложение — {formatPrice(best.price)}
              <ArrowUpRight />
            </a>
          </Button>
        </div>
      </div>

      <Separator className="my-8" />

      <h2 className="mb-4 text-xl font-semibold">Сравнение по маркетплейсам</h2>

      <div className="flex flex-col gap-3">
        {ranked.map((product) => (
          <ComparisonRow key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}
