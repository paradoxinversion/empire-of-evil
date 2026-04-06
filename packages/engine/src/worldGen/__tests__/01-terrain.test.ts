import { describe, test, expect } from 'vitest';
import { generateTerrain } from '../phases/01-terrain.js';
import { seedFrom } from '../prng.js';
import type { TileTypeDefinition } from '../../config/loader.js';

// Minimal tile type config for tests: ocean + wilderness (covers all elevation/moisture)
const minimalTileTypes: Record<string, TileTypeDefinition> = {
  ocean: {
    icon: '~', name: 'Ocean', description: '', buildingRestrictions: [], effects: [],
    terrainConditions: { elevationMin: 0, elevationMax: 0.38, moistureMin: 0, moistureMax: 1, priority: 100 },
    canBeInhabited: false, wealthContribution: 0, isOcean: true,
  },
  wilderness: {
    icon: '?', name: 'Wilderness', description: '', buildingRestrictions: [], effects: [],
    terrainConditions: { elevationMin: 0, elevationMax: 1, moistureMin: 0, moistureMax: 1, priority: 1 },
    canBeInhabited: true, wealthContribution: 20,
  },
};

describe('generateTerrain', () => {
  test('returns a 2D grid of correct dimensions', () => {
    const { prng } = seedFrom(1);
    const grid = generateTerrain(10, 8, 4.0, minimalTileTypes, prng);
    expect(grid).toHaveLength(8);
    expect(grid[0]).toHaveLength(10);
  });

  test('every cell has a typeId present in the tile types config', () => {
    const { prng } = seedFrom(42);
    const grid = generateTerrain(20, 20, 4.0, minimalTileTypes, prng);
    const validIds = new Set(Object.keys(minimalTileTypes));
    for (const row of grid) {
      for (const cell of row) {
        expect(validIds.has(cell.typeId)).toBe(true);
      }
    }
  });

  test('every cell records its x, y coordinates correctly', () => {
    const { prng } = seedFrom(3);
    const grid = generateTerrain(5, 4, 4.0, minimalTileTypes, prng);
    for (let y = 0; y < 4; y++) {
      for (let x = 0; x < 5; x++) {
        expect(grid[y]![x]!.x).toBe(x);
        expect(grid[y]![x]!.y).toBe(y);
      }
    }
  });

  test('elevation and moisture values are in [0, 1]', () => {
    const { prng } = seedFrom(10);
    const grid = generateTerrain(15, 15, 4.0, minimalTileTypes, prng);
    for (const row of grid) {
      for (const cell of row) {
        expect(cell.elevation).toBeGreaterThanOrEqual(0);
        expect(cell.elevation).toBeLessThanOrEqual(1);
        expect(cell.moisture).toBeGreaterThanOrEqual(0);
        expect(cell.moisture).toBeLessThanOrEqual(1);
      }
    }
  });

  test('is deterministic — same seed produces same grid', () => {
    const { prng: p1 } = seedFrom(77);
    const grid1 = generateTerrain(10, 10, 4.0, minimalTileTypes, p1);
    const { prng: p2 } = seedFrom(77);
    const grid2 = generateTerrain(10, 10, 4.0, minimalTileTypes, p2);
    for (let y = 0; y < 10; y++) {
      for (let x = 0; x < 10; x++) {
        expect(grid1[y]![x]!.typeId).toBe(grid2[y]![x]!.typeId);
      }
    }
  });

  test('no isolated inland ocean cells remain after ocean flood-fill', () => {
    const { prng } = seedFrom(55);
    // Use a larger grid to get varied terrain
    const W = 30, H = 30;
    const grid = generateTerrain(W, H, 4.0, minimalTileTypes, prng);

    // BFS from map border: find all ocean cells reachable from edge
    const isOcean = (x: number, y: number) => grid[y]?.[x]?.typeId === 'ocean';
    const visited = Array.from({ length: H }, () => new Array(W).fill(false));
    const queue: Array<[number, number]> = [];

    for (let x = 0; x < W; x++) {
      if (isOcean(x, 0)) { visited[0]![x] = true; queue.push([x, 0]); }
      if (isOcean(x, H - 1)) { visited[H - 1]![x] = true; queue.push([x, H - 1]); }
    }
    for (let y = 1; y < H - 1; y++) {
      if (isOcean(0, y)) { visited[y]![0] = true; queue.push([0, y]); }
      if (isOcean(W - 1, y)) { visited[y]![W - 1] = true; queue.push([W - 1, y]); }
    }
    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      for (const [nx, ny] of [[cx - 1, cy], [cx + 1, cy], [cx, cy - 1], [cx, cy + 1]] as [number, number][]) {
        if (nx >= 0 && nx < W && ny >= 0 && ny < H && !visited[ny]![nx] && isOcean(nx, ny)) {
          visited[ny]![nx] = true;
          queue.push([nx, ny]);
        }
      }
    }

    // Any ocean cell not reachable from the border is isolated (should not exist)
    for (let y = 1; y < H - 1; y++) {
      for (let x = 1; x < W - 1; x++) {
        if (isOcean(x, y)) {
          expect(visited[y]![x]).toBe(true);
        }
      }
    }
  });
});
