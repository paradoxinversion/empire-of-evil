import { describe, test, expect } from 'vitest';
import { validateWorldGenParams } from '../phases/04-validation.js';
import { WorldGenError } from '../error.js';
import type { ZoneCandidate } from '../types.js';

function makeZone(id: string, cells: Array<{ x: number; y: number }>): ZoneCandidate {
  return { id, tileIds: cells.map((_, i) => `tile-${i}`), pluralityTypeId: 'plains', generationWealth: 50, tileCells: cells };
}

// Helper: build a simple 10×10 grid of zones (1 tile per zone for easy adjacency control)
// Zones are adjacent if their single tile is 4-directionally adjacent
function gridZone(id: string, x: number, y: number): ZoneCandidate {
  return makeZone(id, [{ x, y }]);
}

describe('validateWorldGenParams', () => {
  test('does not throw for valid parameters', () => {
    // 7 habitable zones in a contiguous block (2*3 nations + 1 empire), 2 nations × 3 zones
    const zones: ZoneCandidate[] = [
      gridZone('z0', 0, 0), gridZone('z1', 1, 0), gridZone('z2', 2, 0),
      gridZone('z3', 0, 1), gridZone('z4', 1, 1), gridZone('z5', 2, 1),
      gridZone('z6', 0, 2),
    ];
    const habitable = new Set(['z0', 'z1', 'z2', 'z3', 'z4', 'z5', 'z6']);
    expect(() => validateWorldGenParams(zones, habitable, {
      nationCount: 2, zonesPerNation: 3, minZoneSize: 1, maxZoneSize: 6,
      mapWidth: 10, mapHeight: 10,
    })).not.toThrow();
  });

  test('throws INSUFFICIENT_HABITABLE_ZONES when not enough habitable zones', () => {
    // Need 2*3+1=7 habitable zones, but only 5 provided
    const zones: ZoneCandidate[] = Array.from({ length: 5 }, (_, i) => gridZone(`z${i}`, i, 0));
    const habitable = new Set(zones.map(z => z.id));
    expect(() => validateWorldGenParams(zones, habitable, {
      nationCount: 2, zonesPerNation: 3, minZoneSize: 1, maxZoneSize: 6,
      mapWidth: 10, mapHeight: 10,
    })).toThrow(WorldGenError);
    try {
      validateWorldGenParams(zones, habitable, {
        nationCount: 2, zonesPerNation: 3, minZoneSize: 1, maxZoneSize: 6,
        mapWidth: 10, mapHeight: 10,
      });
    } catch (e) {
      expect((e as WorldGenError).code).toBe('INSUFFICIENT_HABITABLE_ZONES');
    }
  });

  test('throws ZONES_PER_NATION_TOO_SMALL when zonesPerNation < 3', () => {
    const zones: ZoneCandidate[] = Array.from({ length: 10 }, (_, i) => gridZone(`z${i}`, i, 0));
    const habitable = new Set(zones.map(z => z.id));
    expect(() => validateWorldGenParams(zones, habitable, {
      nationCount: 2, zonesPerNation: 2, minZoneSize: 1, maxZoneSize: 6,
      mapWidth: 10, mapHeight: 10,
    })).toThrowError(expect.objectContaining({ code: 'ZONES_PER_NATION_TOO_SMALL' }));
  });

  test('throws ZONE_SIZE_INVALID when minZoneSize < 1', () => {
    const zones: ZoneCandidate[] = Array.from({ length: 10 }, (_, i) => gridZone(`z${i}`, i, 0));
    const habitable = new Set(zones.map(z => z.id));
    expect(() => validateWorldGenParams(zones, habitable, {
      nationCount: 1, zonesPerNation: 3, minZoneSize: 0, maxZoneSize: 6,
      mapWidth: 10, mapHeight: 10,
    })).toThrowError(expect.objectContaining({ code: 'ZONE_SIZE_INVALID' }));
  });

  test('throws ZONE_SIZE_INVALID when maxZoneSize is too large relative to map', () => {
    // map=10×10=100 cells, need 4 zones (1*3+1), maxZoneSize must be ≤ 100/4/2=12
    const zones: ZoneCandidate[] = Array.from({ length: 10 }, (_, i) => gridZone(`z${i}`, i, 0));
    const habitable = new Set(zones.map(z => z.id));
    expect(() => validateWorldGenParams(zones, habitable, {
      nationCount: 1, zonesPerNation: 3, minZoneSize: 1, maxZoneSize: 200,
      mapWidth: 10, mapHeight: 10,
    })).toThrowError(expect.objectContaining({ code: 'ZONE_SIZE_INVALID' }));
  });

  test('throws INSUFFICIENT_CONTIGUOUS_ZONES when habitable zones are fragmented', () => {
    // 6 isolated zones (no adjacency), need 2 contiguous groups of 3
    const zones: ZoneCandidate[] = [
      gridZone('z0', 0, 0),
      gridZone('z1', 5, 0),  // gap of 4 — not adjacent to z0
      gridZone('z2', 0, 5),  // isolated
      gridZone('z3', 5, 5),  // isolated
      gridZone('z4', 9, 9),  // isolated
      gridZone('z5', 9, 0),  // isolated
      gridZone('empire', 4, 4),
    ];
    const habitable = new Set(zones.map(z => z.id));
    expect(() => validateWorldGenParams(zones, habitable, {
      nationCount: 2, zonesPerNation: 3, minZoneSize: 1, maxZoneSize: 6,
      mapWidth: 10, mapHeight: 10,
    })).toThrowError(expect.objectContaining({ code: 'INSUFFICIENT_CONTIGUOUS_ZONES' }));
  });
});
