/** Mulberry32 seeded PRNG. Returns floats in [0, 1). */
function mulberry32(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s += 0x6d2b79f5;
    let t = Math.imul(s ^ (s >>> 15), 1 | s);
    t ^= t + Math.imul(t ^ (t >>> 7), 61 | t);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export type Prng = () => number;

export interface SeededPrng {
  seed: number;
  prng: Prng;
}

/** Create a seeded PRNG. If seed is undefined, a random seed is chosen. */
export function seedFrom(seed: number | undefined): SeededPrng {
  const resolvedSeed = seed ?? (Date.now() ^ (Math.random() * 0xffffffff));
  return { seed: resolvedSeed, prng: mulberry32(resolvedSeed) };
}
