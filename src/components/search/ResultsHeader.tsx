import { SortControl } from "./SortControl";
import { MobileFiltersSheet } from "./MobileFiltersSheet";
import { pluralizeRu } from "@/lib/format";

interface ResultsHeaderProps {
  count: number;
  query: string;
}

export function ResultsHeader({ count, query }: ResultsHeaderProps) {
  return (
    <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">
          {query ? `Результаты по запросу «${query}»` : "Все кроссовки"}
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Найдено {count} {pluralizeRu(count, ["товар", "товара", "товаров"])}
        </p>
      </div>
      <div className="flex items-center gap-2">
        <MobileFiltersSheet />
        <SortControl />
      </div>
    </div>
  );
}
