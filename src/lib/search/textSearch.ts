/**
 * Lightweight text search used by every mock provider. A real integration
 * would delegate this to the marketplace's own search endpoint — this stub
 * just does forgiving substring/token matching over a precomputed haystack
 * so the UI has something realistic to rank and filter.
 */

export function tokenize(query: string): string[] {
  return query
    .toLowerCase()
    .normalize("NFKC")
    .split(/[^a-zа-яё0-9]+/i)
    .filter((token) => token.length >= 2);
}

/** Fraction of query tokens found in the haystack, in [0, 1]. Empty query matches everything. */
export function matchScore(haystack: string, tokens: string[]): number {
  if (tokens.length === 0) return 1;
  let hits = 0;
  for (const token of tokens) {
    if (haystack.includes(token)) hits++;
  }
  return hits / tokens.length;
}
