import Link from "next/link";

import { SearchBar } from "./SearchBar";

const QUICK_PICKS = [
  "Nike Air Force 1 белые",
  "iPhone 15 Pro",
  "Диван угловой",
  "Холодильник Side-by-Side",
  "Куртка зимняя мужская",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden px-4 pt-20 pb-16 sm:px-6 sm:pt-28 sm:pb-20 lg:px-8">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-[-12rem] -z-10 mx-auto h-[28rem] max-w-3xl rounded-full bg-gradient-to-tr from-blue-400/30 via-fuchsia-400/20 to-amber-300/30 blur-3xl dark:from-blue-500/20 dark:via-fuchsia-500/15 dark:to-amber-400/15"
      />

      <div className="mx-auto max-w-3xl text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
          Найдите что угодно <br className="hidden sm:block" />
          на маркетплейсах Казахстана
        </h1>
        <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground sm:text-lg">
          Кроссовки, электроника, мебель, техника и одежда — сравниваем цену, рейтинг и отзывы
          с Kaspi, Technodom, Mechta, Wildberries и Ozon, и сразу показываем, где выгоднее и надёжнее.
        </p>

        <div className="mx-auto mt-8 max-w-xl">
          <SearchBar size="lg" autoFocus />
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2">
          {QUICK_PICKS.map((pick) => (
            <Link
              key={pick}
              href={`/results?q=${encodeURIComponent(pick)}`}
              className="rounded-full border border-border/60 bg-background/60 px-3.5 py-1.5 text-sm text-muted-foreground backdrop-blur transition-colors hover:border-border hover:text-foreground"
            >
              {pick}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
