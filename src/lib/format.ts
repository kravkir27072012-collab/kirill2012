/** Manual (locale-independent) formatters so server and client always render identical strings. */

export function formatPrice(value: number): string {
  return `${groupThousands(Math.round(value))} ₸`;
}

export function formatNumber(value: number): string {
  return groupThousands(Math.round(value));
}

function groupThousands(value: number): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

export function pluralizeRu(n: number, forms: [string, string, string]): string {
  const mod10 = n % 10;
  const mod100 = n % 100;
  if (mod10 === 1 && mod100 !== 11) return forms[0];
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return forms[1];
  return forms[2];
}

export function formatReviewCount(count: number): string {
  return `${formatNumber(count)} ${pluralizeRu(count, ["отзыв", "отзыва", "отзывов"])}`;
}
