import { describe, test, expect } from 'vitest';
import { seedPopulation } from '../phases/07-population.js';
import { seedFrom } from '../prng.js';
import type { ZoneCandidate } from '../types.js';

function makeZone(id: string, tileCount: number, wealth: number): ZoneCandidate {
  return {
    id,
    tileIds: Array.from({ length: tileCount }, (_, i) => `tile-${id}-${i}`),
    pluralityTypeId: 'plains',
    generationWealth: wealth,
    tileCells: Array.from({ length: tileCount }, (_, i) => ({ x: i, y: 0 })),
  };
}

describe('seedPopulation', () => {
  test('uninhabitable zones get zero persons', () => {
    const zone = makeZone('z1', 4, 50);
    const habitable = new Set<string>(); // z1 not in habitable set
    const { prng } = seedFrom(1);
    const result = seedPopulation([zone], habitable, 'empireOrg', 1.0, prng);

    const personsInZone = Object.values(result.persons).filter(p => p.zoneId === 'z1');
    expect(personsInZone).toHaveLength(0);
    expect(result.zonePops.get('z1')).toBe(0);
  });

  test('habitable zone with zero wealth produces no persons', () => {
    const zone = makeZone('z1', 4, 0);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(2);
    const result = seedPopulation([zone], habitable, 'empireOrg', 1.0, prng);

    expect(result.zonePops.get('z1')).toBe(0);
  });

  test('person count is within ±20% of base formula', () => {
    const zone = makeZone('z1', 4, 50); // base = floor(50 * 1.0 * 4) = 200
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(3);
    const result = seedPopulation([zone], habitable, 'empireOrg', 1.0, prng);

    const count = result.zonePops.get('z1') ?? 0;
    expect(count).toBeGreaterThanOrEqual(Math.floor(50 * 1.0 * 4 * 0.8)); // 160
    expect(count).toBeLessThanOrEqual(Math.floor(50 * 1.0 * 4 * 1.2));    // 240
  });

  test('zone.population matches person count', () => {
    const zone = makeZone('z1', 3, 40);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(4);
    const result = seedPopulation([zone], habitable, 'empireOrg', 1.0, prng);

    const count = Object.values(result.persons).filter(p => p.zoneId === 'z1').length;
    expect(result.zonePops.get('z1')).toBe(count);
  });

  test('persons have zoneId and homeZoneId equal to their zone', () => {
    const zone = makeZone('z1', 2, 60);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(5);
    const result = seedPopulation([zone], habitable, 'empireOrg', 1.0, prng);

    for (const person of Object.values(result.persons)) {
      expect(person.zoneId).toBe('z1');
      expect(person.homeZoneId).toBe('z1');
    }
  });

  test('no person has agentStatus key present', () => {
    const zone = makeZone('z1', 2, 80);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(6);
    const result = seedPopulation([zone], habitable, 'empireOrg', 1.0, prng);

    for (const person of Object.values(result.persons)) {
      expect('agentStatus' in person).toBe(false);
    }
  });

  test('is deterministic — same seed produces same population', () => {
    const zones = [makeZone('z1', 3, 50), makeZone('z2', 2, 40)];
    const habitable = new Set(['z1', 'z2']);

    const { prng: p1 } = seedFrom(99);
    const r1 = seedPopulation(zones, habitable, 'empireOrg', 1.0, p1);

    const { prng: p2 } = seedFrom(99);
    const r2 = seedPopulation(zones, habitable, 'empireOrg', 1.0, p2);

    expect(r1.zonePops).toEqual(r2.zonePops);
    expect(Object.keys(r1.persons).length).toBe(Object.keys(r2.persons).length);
  });
});
