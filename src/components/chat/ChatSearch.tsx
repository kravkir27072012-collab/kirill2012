"use client";

import { useState, type FormEvent } from "react";
import { useRouter } from "next/navigation";
import { MessageCircle, Sparkles, Loader2, ArrowUp } from "lucide-react";

import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface ChatMessage {
  role: "user" | "assistant";
  text: string;
}

interface ChatSearchResult {
  query: string;
  category: string | null;
  priceMax: number | null;
  priceMin: number | null;
  originalsOnly: boolean;
  minRating: number | null;
  sortBy: "score" | "price_asc" | "price_desc" | "rating" | "reviews";
  reply: string;
}

const EXAMPLES = [
  "Хочу кроссовки для бега до 40000 тенге",
  "Найди диван подешевле",
  "Холодильник с рейтингом от 4.5",
];

export function ChatSearch() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  async function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isLoading) return;

    setMessages((prev) => [...prev, { role: "user", text: trimmed }]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat-search", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: trimmed }),
      });

      if (!response.ok) {
        const { error } = await response.json().catch(() => ({ error: "Не удалось получить ответ" }));
        setMessages((prev) => [...prev, { role: "assistant", text: error ?? "Что-то пошло не так." }]);
        return;
      }

      const result: ChatSearchResult = await response.json();
      setMessages((prev) => [...prev, { role: "assistant", text: result.reply }]);

      const params = new URLSearchParams({ q: result.query });
      if (result.category) params.set("category", result.category);
      if (result.priceMax != null) params.set("priceMax", String(result.priceMax));
      if (result.priceMin != null) params.set("priceMin", String(result.priceMin));
      if (result.originalsOnly) params.set("originalsOnly", "true");
      if (result.minRating != null) params.set("minRating", String(result.minRating));
      if (result.sortBy) params.set("sortBy", result.sortBy);

      router.push(`/results?${params.toString()}`);
      setOpen(false);
    } catch {
      setMessages((prev) => [...prev, { role: "assistant", text: "Не получилось связаться с сервером." }]);
    } finally {
      setIsLoading(false);
    }
  }

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    send(input);
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="ИИ-поиск товаров"
        className="fixed bottom-6 right-6 z-40 flex size-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-6" />
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="right" className="w-full sm:max-w-md">
          <SheetHeader>
            <SheetTitle className="flex items-center gap-2">
              <Sparkles className="size-4.5 text-primary" />
              Умный поиск
            </SheetTitle>
            <SheetDescription>
              Опиши, что ищешь, своими словами — подберём фильтры и покажем подходящие товары.
            </SheetDescription>
          </SheetHeader>

          <div className="flex-1 overflow-y-auto px-6">
            {messages.length === 0 ? (
              <div className="flex flex-col gap-2">
                <p className="text-sm text-muted-foreground">Например:</p>
                {EXAMPLES.map((example) => (
                  <button
                    key={example}
                    type="button"
                    onClick={() => send(example)}
                    className="rounded-2xl border border-border/60 px-4 py-2.5 text-left text-sm hover:bg-accent"
                  >
                    {example}
                  </button>
                ))}
              </div>
            ) : (
              <div className="flex flex-col gap-3">
                {messages.map((message, index) => (
                  <div
                    key={index}
                    className={cn(
                      "max-w-[85%] rounded-2xl px-4 py-2.5 text-sm",
                      message.role === "user"
                        ? "self-end bg-primary text-primary-foreground"
                        : "self-start bg-muted"
                    )}
                  >
                    {message.text}
                  </div>
                ))}
                {isLoading && (
                  <div className="flex items-center gap-2 self-start rounded-2xl bg-muted px-4 py-2.5 text-sm text-muted-foreground">
                    <Loader2 className="size-3.5 animate-spin" />
                    Думаю...
                  </div>
                )}
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="flex items-center gap-2 px-6 pb-6">
            <Input
              value={input}
              onChange={(event) => setInput(event.target.value)}
              placeholder="Например: диван подешевле или iPhone 15"
              disabled={isLoading}
              autoFocus
            />
            <Button type="submit" size="icon" disabled={isLoading || !input.trim()}>
              <ArrowUp className="size-4.5" />
            </Button>
          </form>
        </SheetContent>
      </Sheet>
    </>
  );
}
