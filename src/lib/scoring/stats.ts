/**
 * Tiny generic math helpers for the scoring layer. Deliberately has zero
 * dependency on `lib/mock/*` — scoring must work the same whether the
 * `Product[]` it receives came from mocks or a real future integration.
 */

export function clamp(value: number, min: number, max: number) {
  return Math.min(max, Math.max(min, value));
}

export function median(values: number[]): number {
  if (values.length === 0) return 0;
  const sorted = [...values].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 === 0 ? (sorted[mid - 1] + sorted[mid]) / 2 : sorted[mid];
}
