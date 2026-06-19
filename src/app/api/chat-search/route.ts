import { NextResponse } from "next/server";
import { MARKETPLACES, PRODUCT_CATEGORIES } from "@/types/marketplace";

const MODEL = "gemini-2.5-flash";

const CATEGORY_IDS = PRODUCT_CATEGORIES.map((c) => c.id);

const SYSTEM_PROMPT = `Ты — ассистент поиска товаров на сайте KrossKZ, агрегаторе маркетплейсов Казахстана (${MARKETPLACES.map((m) => m.label).join(", ")}). Каталог покрывает категории: ${PRODUCT_CATEGORIES.map((c) => `${c.label} (${c.id})`).join(", ")}.
Пользователь описывает, что он хочет, на естественном языке. Извлеки из его сообщения:
- query: короткая поисковая строка (бренд, модель, цвет) для текстового поиска по каталогу — используй только слова, которые реально могут быть в названии товара (например "Nike Air Force" или "iPhone 15"). Если пользователь не назвал конкретный бренд или модель — верни пустую строку "", чтобы поиск показал все варианты с учётом остальных фильтров. Не используй общие слова вроде "кроссовки", "телефон", "диван" — это не названия товаров.
- category: одна из категорий [${CATEGORY_IDS.join(", ")}], если из сообщения понятно, что ищут именно её (например "диван" → furniture, "холодильник" или "стиральная машина" → appliances, "куртка" или "джинсы" → clothing, "телефон" или "ноутбук" → electronics, "кроссовки" или "кеды" → sneakers). Если категория не очевидна — null.
- priceMax: максимальная цена в тенге, если упомянута, иначе null.
- priceMin: минимальная цена в тенге, если упомянута, иначе null.
- originalsOnly: true, если пользователь явно просит только оригиналы / без подделок.
- minRating: минимальный рейтинг от 0 до 5, если упомянут, иначе null.
- sortBy: "price_asc" если просят подешевле/дёшево, "price_desc" если подороже/премиум, "rating" если просят с лучшими отзывами, иначе "score".
- reply: одна короткая дружелюбная фраза на русском, подтверждающая, что ты понял запрос (без лишних вопросов).

Отвечай только JSON, без пояснений.`;

interface GeminiParsedResult {
  query: string;
  category: string | null;
  priceMax: number | null;
  priceMin: number | null;
  originalsOnly: boolean;
  minRating: number | null;
  sortBy: "score" | "price_asc" | "price_desc" | "rating" | "reviews";
  reply: string;
}

const RESPONSE_SCHEMA = {
  type: "OBJECT",
  properties: {
    query: { type: "STRING" },
    category: { type: "STRING", nullable: true, enum: CATEGORY_IDS },
    priceMax: { type: "NUMBER", nullable: true },
    priceMin: { type: "NUMBER", nullable: true },
    originalsOnly: { type: "BOOLEAN" },
    minRating: { type: "NUMBER", nullable: true },
    sortBy: { type: "STRING", enum: ["score", "price_asc", "price_desc", "rating", "reviews"] },
    reply: { type: "STRING" },
  },
  required: ["query", "originalsOnly", "sortBy", "reply"],
};

export async function POST(request: Request) {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "GEMINI_API_KEY не настроен на сервере" }, { status: 500 });
  }

  const body = await request.json().catch(() => null);
  const message = typeof body?.message === "string" ? body.message.trim() : "";
  if (!message) {
    return NextResponse.json({ error: "Пустое сообщение" }, { status: 400 });
  }

  const geminiResponse = await fetch(
    `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${apiKey}`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
        systemInstruction: { parts: [{ text: SYSTEM_PROMPT }] },
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: RESPONSE_SCHEMA,
        },
      }),
    }
  ).catch(() => null);

  if (!geminiResponse || !geminiResponse.ok) {
    return NextResponse.json(
      { error: "Gemini API недоступен или превышен лимит запросов" },
      { status: 502 }
    );
  }

  const data = await geminiResponse.json();
  const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (typeof text !== "string") {
    return NextResponse.json({ error: "Не удалось разобрать ответ Gemini" }, { status: 502 });
  }

  let parsed: GeminiParsedResult;
  try {
    parsed = JSON.parse(text);
  } catch {
    return NextResponse.json({ error: "Gemini вернул невалидный JSON" }, { status: 502 });
  }

  return NextResponse.json(parsed);
}
