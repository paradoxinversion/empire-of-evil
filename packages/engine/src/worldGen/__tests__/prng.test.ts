import { describe, test, expect } from 'vitest';
import { seedFrom } from '../prng.js';

describe('seedFrom', () => {
  test('returns the provided seed unchanged', () => {
    const { seed } = seedFrom(42);
    expect(seed).toBe(42);
  });

  test('returns a numeric seed when called with undefined', () => {
    const { seed } = seedFrom(undefined);
    expect(typeof seed).toBe('number');
    expect(Number.isFinite(seed)).toBe(true);
  });

  test('returns a callable prng function', () => {
    const { prng } = seedFrom(1);
    expect(typeof prng).toBe('function');
  });
});

describe('PRNG determinism', () => {
  test('same seed produces identical sequence of 1000 values', () => {
    const { prng: prng1 } = seedFrom(99);
    const { prng: prng2 } = seedFrom(99);
    const seq1 = Array.from({ length: 1000 }, () => prng1());
    const seq2 = Array.from({ length: 1000 }, () => prng2());
    expect(seq1).toEqual(seq2);
  });

  test('different seeds produce different first values', () => {
    const { prng: a } = seedFrom(1);
    const { prng: b } = seedFrom(2);
    expect(a()).not.toBe(b());
  });
});

describe('PRNG output range', () => {
  test('all values are in [0, 1)', () => {
    const { prng } = seedFrom(7);
    for (let i = 0; i < 10000; i++) {
      const v = prng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });
});
