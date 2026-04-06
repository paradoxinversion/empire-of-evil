import { createNoise2D } from 'simplex-noise';
import type { Prng } from './prng.js';

/**
 * Generate a 2D noise map of dimensions width × height.
 * Values are in [0, 1]. Uses a seeded PRNG to initialize simplex-noise,
 * ensuring deterministic output for the same PRNG state.
 *
 * @param width  Number of columns
 * @param height Number of rows
 * @param scale  Noise frequency — larger = smoother (e.g. 4.0)
 * @param prng   Seeded PRNG (consumed: advances state on each call)
 */
export function makeNoiseMap(
  width: number,
  height: number,
  scale: number,
  prng: Prng,
): number[][] {
  const noise2D = createNoise2D(prng);
  const map: number[][] = [];
  for (let y = 0; y < height; y++) {
    const row: number[] = [];
    for (let x = 0; x < width; x++) {
      // simplex-noise returns [-1, 1]; remap to [0, 1]
      const raw = noise2D(x / scale, y / scale);
      row.push((raw + 1) / 2);
    }
    map.push(row);
  }
  return map;
}
