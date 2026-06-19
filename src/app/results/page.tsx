import type { Metadata } from "next";

import { searchAllMarketplaces } from "@/lib/services/aggregator";
import { ResultsView } from "@/components/search/ResultsView";

interface ResultsPageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata: Metadata = {
  title: "Результаты поиска — KrossKZ",
};

export default async function ResultsPage({ searchParams }: ResultsPageProps) {
  const { q } = await searchParams;
  const query = q?.trim() ?? "";
  const products = await searchAllMarketplaces(query);

  return <ResultsView query={query} initialProducts={products} />;
}
