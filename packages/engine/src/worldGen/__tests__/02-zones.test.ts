import { describe, test, expect } from 'vitest';
import { formZones } from '../phases/02-zones.js';
import { generateTerrain } from '../phases/01-terrain.js';
import { seedFrom } from '../prng.js';
import type { TileTypeDefinition } from '../../config/loader.js';

const minimalTileTypes: Record<string, TileTypeDefinition> = {
  ocean: {
    name: 'Ocean', description: '', buildingRestrictions: [], effects: [],
    terrainConditions: { elevationMin: 0, elevationMax: 0.38, moistureMin: 0, moistureMax: 1, priority: 100 },
    canBeInhabited: false, wealthContribution: 0, isOcean: true,
  },
  plains: {
    name: 'Plains', description: '', buildingRestrictions: [], effects: [],
    terrainConditions: { elevationMin: 0, elevationMax: 1, moistureMin: 0, moistureMax: 1, priority: 1 },
    canBeInhabited: true, wealthContribution: 45,
  },
};

// All-plains tile types (no ocean to simplify assertions)
const allPlainsTileTypes: Record<string, TileTypeDefinition> = {
  plains: {
    name: 'Plains', description: '', buildingRestrictions: [], effects: [],
    terrainConditions: { elevationMin: 0, elevationMax: 1, moistureMin: 0, moistureMax: 1, priority: 1 },
    canBeInhabited: true, wealthContribution: 45,
  },
};

describe('formZones', () => {
  test('all non-ocean tiles belong to exactly one zone', () => {
    const { prng } = seedFrom(42);
    const W = 20, H = 20;
    const grid = generateTerrain(W, H, 4.0, minimalTileTypes, prng);
    const { prng: prng2 } = seedFrom(42);
    const grid2 = generateTerrain(W, H, 4.0, minimalTileTypes, prng2);
    const zones = formZones(grid2, W, H, 2, 6, minimalTileTypes, prng);

    // Collect all tile IDs across all zones
    const allTileIds = new Set(zones.flatMap(z => z.tileIds));

    // Every non-ocean cell must appear in exactly one zone
    for (const row of grid) {
      for (const cell of row) {
        if (!minimalTileTypes[cell.typeId]?.isOcean) {
          expect(allTileIds.has(
            zones.find(z => z.tileCells.some(c => c.x === cell.x && c.y === cell.y))?.tileIds[0] ?? '',
          ));
        }
      }
    }

    // No tile ID appears in more than one zone
    const allIds: string[] = zones.flatMap(z => z.tileIds);
    expect(allIds.length).toBe(new Set(allIds).size);
  });

  test('zone generationWealth is in [0, 100]', () => {
    const { prng } = seedFrom(5);
    const W = 15, H = 15;
    const grid = generateTerrain(W, H, 4.0, minimalTileTypes, prng);
    const { prng: prng2 } = seedFrom(99);
    const zones = formZones(grid, W, H, 2, 6, minimalTileTypes, prng2);
    for (const zone of zones) {
      expect(zone.generationWealth).toBeGreaterThanOrEqual(0);
      expect(zone.generationWealth).toBeLessThanOrEqual(100);
    }
  });

  test('zone and tile IDs use the correct format', () => {
    const { prng } = seedFrom(7);
    const W = 10, H = 10;
    const grid = generateTerrain(W, H, 4.0, allPlainsTileTypes, prng);
    const { prng: prng2 } = seedFrom(7);
    const zones = formZones(grid, W, H, 2, 6, allPlainsTileTypes, prng2);
    for (const zone of zones) {
      expect(zone.id).toMatch(/^wgzone-\d+$/);
      for (const tileId of zone.tileIds) {
        // Coordinate-based tile IDs: tile-x-y
        expect(tileId).toMatch(/^tile-\d+-\d+$/);
      }
    }
  });

  test('all 9 tiles of a 3×3 all-plains grid are covered across zones', () => {
    const { prng } = seedFrom(1);
    const W = 3, H = 3;
    const grid = generateTerrain(W, H, 4.0, allPlainsTileTypes, prng);
    const { prng: prng2 } = seedFrom(99);
    const zones = formZones(grid, W, H, 1, 9, allPlainsTileTypes, prng2);
    const totalTiles = zones.reduce((sum, z) => sum + z.tileIds.length, 0);
    expect(totalTiles).toBe(W * H);
  });

  test('is deterministic — same inputs produce same zone layout', () => {
    const W = 20, H = 20;
    const { prng: terrainPrng1 } = seedFrom(11);
    const grid1 = generateTerrain(W, H, 4.0, minimalTileTypes, terrainPrng1);
    const { prng: zonePrng1 } = seedFrom(22);
    const zones1 = formZones(grid1, W, H, 2, 6, minimalTileTypes, zonePrng1);

    const { prng: terrainPrng2 } = seedFrom(11);
    const grid2 = generateTerrain(W, H, 4.0, minimalTileTypes, terrainPrng2);
    const { prng: zonePrng2 } = seedFrom(22);
    const zones2 = formZones(grid2, W, H, 2, 6, minimalTileTypes, zonePrng2);

    expect(zones1.length).toBe(zones2.length);
    for (let i = 0; i < zones1.length; i++) {
      expect(zones1[i]!.tileCells.length).toBe(zones2[i]!.tileCells.length);
      expect(zones1[i]!.pluralityTypeId).toBe(zones2[i]!.pluralityTypeId);
    }
  });

  test('ocean tiles are never included in any zone', () => {
    const { prng } = seedFrom(42);
    const W = 25, H = 25;
    const grid = generateTerrain(W, H, 4.0, minimalTileTypes, prng);
    const { prng: prng2 } = seedFrom(9);
    const zones = formZones(grid, W, H, 2, 6, minimalTileTypes, prng2);

    const oceanCells = new Set<string>();
    for (const row of grid) {
      for (const cell of row) {
        if (minimalTileTypes[cell.typeId]?.isOcean) {
          oceanCells.add(`${cell.x},${cell.y}`);
        }
      }
    }

    for (const zone of zones) {
      for (const coord of zone.tileCells) {
        expect(oceanCells.has(`${coord.x},${coord.y}`)).toBe(false);
      }
    }
  });
});
