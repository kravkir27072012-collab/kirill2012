"use client";

import { useRef, useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { Search, Clock, X } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useHistoryStore } from "@/store/useHistoryStore";
import { cn } from "@/lib/utils";

interface SearchBarProps {
  defaultValue?: string;
  size?: "default" | "lg";
  autoFocus?: boolean;
  className?: string;
}

export function SearchBar({ defaultValue = "", size = "default", autoFocus, className }: SearchBarProps) {
  const router = useRouter();
  const [value, setValue] = useState(defaultValue);
  const [showHistory, setShowHistory] = useState(false);
  const blurTimeout = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const queries = useHistoryStore((state) => state.queries);
  const addQuery = useHistoryStore((state) => state.addQuery);
  const removeQuery = useHistoryStore((state) => state.removeQuery);

  function submit(query: string) {
    const trimmed = query.trim();
    if (!trimmed) return;
    addQuery(trimmed);
    setShowHistory(false);
    router.push(`/results?q=${encodeURIComponent(trimmed)}`);
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    submit(value);
  }

  return (
    <div className={cn("relative w-full", className)}>
      <form onSubmit={handleSubmit} className="relative flex items-center gap-2">
        <div className="relative flex-1">
          <Search className="pointer-events-none absolute left-4 top-1/2 size-4.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onFocus={() => setShowHistory(true)}
            onBlur={() => {
              blurTimeout.current = setTimeout(() => setShowHistory(false), 120);
            }}
            autoFocus={autoFocus}
            placeholder="Например: Nike Air Force 1, iPhone 15 или диван угловой"
            className={cn("pl-11", size === "lg" && "h-14 rounded-3xl text-base shadow-lg")}
          />
        </div>
        <Button type="submit" size={size === "lg" ? "lg" : "default"} className="shrink-0">
          Найти
        </Button>
      </form>

      {showHistory && queries.length > 0 && (
        <div
          onMouseDown={() => blurTimeout.current && clearTimeout(blurTimeout.current)}
          className="absolute left-0 right-0 top-full z-20 mt-2 overflow-hidden rounded-2xl border border-border/60 bg-popover shadow-lg"
        >
          <p className="px-4 pt-3 pb-1 text-xs font-medium text-muted-foreground">Недавние запросы</p>
          <ul className="pb-2">
            {queries.map((query) => (
              <li key={query} className="flex items-center gap-1 px-2">
                <button
                  type="button"
                  onClick={() => submit(query)}
                  className="flex flex-1 items-center gap-2 rounded-xl px-2.5 py-2 text-left text-sm hover:bg-accent"
                >
                  <Clock className="size-3.5 text-muted-foreground" />
                  {query}
                </button>
                <button
                  type="button"
                  onClick={() => removeQuery(query)}
                  aria-label="Удалить из истории"
                  className="rounded-full p-1.5 text-muted-foreground hover:bg-accent hover:text-foreground"
                >
                  <X className="size-3.5" />
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
