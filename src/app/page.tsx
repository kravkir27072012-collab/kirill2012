import { Hero } from "@/components/search/Hero";
import { ProductGrid } from "@/components/product/ProductGrid";
import { getRecommendedProducts } from "@/lib/services/recommendations";

export default async function Home() {
  const recommended = await getRecommendedProducts(8);

  return (
    <>
      <Hero />
      <section className="mx-auto max-w-7xl px-4 pb-20 sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold tracking-tight">Рекомендуем</h2>
        <ProductGrid products={recommended} />
      </section>
    </>
  );
}
