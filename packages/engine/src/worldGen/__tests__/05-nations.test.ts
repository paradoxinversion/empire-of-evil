import { describe, test, expect } from 'vitest';
import { placeNations } from '../phases/05-nations.js';
import { buildZoneAdjacency } from '../phases/04-validation.js';
import { seedFrom } from '../prng.js';
import type { ZoneCandidate } from '../types.js';

// Build a simple N×N grid of zones for testing (each zone has one tile)
function buildGrid(width: number, height: number): ZoneCandidate[] {
  return Array.from({ length: width * height }, (_, i) => {
    const x = i % width, y = Math.floor(i / width);
    return {
      id: `z${i}`,
      tileIds: [`tile-${i}`],
      pluralityTypeId: 'plains',
      generationWealth: 50,
      tileCells: [{ x, y }],
    };
  });
}

describe('placeNations', () => {
  test('each nation claims exactly zonesPerNation zones', () => {
    const zones = buildGrid(6, 6); // 36 zones
    const habitable = new Set(zones.map(z => z.id));
    const adjacency = buildZoneAdjacency(zones, habitable);
    const { prng } = seedFrom(42);
    const result = placeNations(zones, habitable, adjacency, 3, 3, 1, prng);

    expect(result.nationZones.size).toBe(3);
    for (const [, claimed] of result.nationZones) {
      expect(claimed).toHaveLength(3);
    }
  });

  test('no zone is claimed by more than one nation', () => {
    const zones = buildGrid(6, 6);
    const habitable = new Set(zones.map(z => z.id));
    const adjacency = buildZoneAdjacency(zones, habitable);
    const { prng } = seedFrom(10);
    const result = placeNations(zones, habitable, adjacency, 2, 3, 1, prng);

    const allClaimed = [...result.nationZones.values()].flat();
    expect(allClaimed.length).toBe(new Set(allClaimed).size);
  });

  test('empire origin zone is not claimed by any nation', () => {
    const zones = buildGrid(5, 5); // 25 zones
    const habitable = new Set(zones.map(z => z.id));
    const adjacency = buildZoneAdjacency(zones, habitable);
    const { prng } = seedFrom(7);
    const result = placeNations(zones, habitable, adjacency, 2, 3, 1, prng);

    const allNationZones = new Set([...result.nationZones.values()].flat());
    expect(allNationZones.has(result.empireOriginZoneId)).toBe(false);
  });

  test('empire origin zone is a valid habitable zone', () => {
    const zones = buildGrid(5, 5);
    const habitable = new Set(zones.map(z => z.id));
    const adjacency = buildZoneAdjacency(zones, habitable);
    const { prng } = seedFrom(3);
    const result = placeNations(zones, habitable, adjacency, 2, 3, 1, prng);

    expect(habitable.has(result.empireOriginZoneId)).toBe(true);
  });

  test('is deterministic — same seed produces same result', () => {
    const zones = buildGrid(6, 6);
    const habitable = new Set(zones.map(z => z.id));
    const adjacency = buildZoneAdjacency(zones, habitable);

    const { prng: p1 } = seedFrom(99);
    const r1 = placeNations(zones, habitable, adjacency, 2, 3, 1, p1);

    const { prng: p2 } = seedFrom(99);
    const r2 = placeNations(zones, habitable, adjacency, 2, 3, 1, p2);

    expect(r1.empireOriginZoneId).toBe(r2.empireOriginZoneId);
    // Compare zone claims by position (nation IDs differ across runs due to module counter)
    const n1 = [...r1.nationZones.values()];
    const n2 = [...r2.nationZones.values()];
    expect(n1).toEqual(n2);
  });

  test('nation IDs are unique', () => {
    const zones = buildGrid(6, 6);
    const habitable = new Set(zones.map(z => z.id));
    const adjacency = buildZoneAdjacency(zones, habitable);
    const { prng } = seedFrom(55);
    const result = placeNations(zones, habitable, adjacency, 4, 3, 1, prng);

    const nationIds = [...result.nationZones.keys()];
    expect(nationIds.length).toBe(new Set(nationIds).size);
    expect(nationIds.length).toBe(4);
  });
});
