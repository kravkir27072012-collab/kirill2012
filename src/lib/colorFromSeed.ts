/** Deterministically derives a two-tone gradient from a string seed, used for generated product art. */
export function colorFromSeed(seed: string): { from: string; to: string } {
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = (hash * 31 + seed.charCodeAt(i)) >>> 0;
  }

  const hue1 = hash % 360;
  const hue2 = (hue1 + 40 + ((hash >> 8) % 50)) % 360;

  return {
    from: `hsl(${hue1} 75% 68%)`,
    to: `hsl(${hue2} 70% 42%)`,
  };
}
