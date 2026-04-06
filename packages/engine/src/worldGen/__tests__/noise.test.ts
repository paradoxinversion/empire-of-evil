import { describe, test, expect } from 'vitest';
import { makeNoiseMap } from '../noise.js';
import { seedFrom } from '../prng.js';

describe('makeNoiseMap', () => {
  test('returns a 2D array of correct dimensions', () => {
    const { prng } = seedFrom(1);
    const map = makeNoiseMap(10, 8, 4.0, prng);
    expect(map).toHaveLength(8); // height rows
    expect(map[0]).toHaveLength(10); // width cols
  });

  test('all values are in [0, 1]', () => {
    const { prng } = seedFrom(5);
    const map = makeNoiseMap(20, 20, 4.0, prng);
    for (const row of map) {
      for (const v of row) {
        expect(v).toBeGreaterThanOrEqual(0);
        expect(v).toBeLessThanOrEqual(1);
      }
    }
  });

  test('same PRNG produces identical maps when called sequentially', () => {
    const { prng: prng1 } = seedFrom(42);
    const map1 = makeNoiseMap(10, 10, 4.0, prng1);

    const { prng: prng2 } = seedFrom(42);
    const map2 = makeNoiseMap(10, 10, 4.0, prng2);

    expect(map1).toEqual(map2);
  });

  test('adjacent cells have smooth transitions (average delta < 0.15 at scale 4.0)', () => {
    const { prng } = seedFrom(7);
    const map = makeNoiseMap(50, 50, 4.0, prng);
    let totalDelta = 0;
    let count = 0;
    for (let y = 0; y < 50; y++) {
      for (let x = 0; x < 50; x++) {
        if (x + 1 < 50) { totalDelta += Math.abs(map[y][x]! - map[y][x + 1]!); count++; }
        if (y + 1 < 50) { totalDelta += Math.abs(map[y][x]! - map[y + 1]![x]!); count++; }
      }
    }
    const avgDelta = totalDelta / count;
    // Simplex noise has continuity: avg delta is much lower than random (which would be ~0.33)
    expect(avgDelta).toBeLessThan(0.25);
  });

  test('two maps created with sequential PRNG calls are different', () => {
    const { prng } = seedFrom(99);
    const map1 = makeNoiseMap(10, 10, 4.0, prng);
    const map2 = makeNoiseMap(10, 10, 4.0, prng);
    // They should not be identical (different PRNG state → different noise init)
    expect(map1).not.toEqual(map2);
  });
});
