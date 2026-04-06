import type { TileTypeDefinition } from '../../config/loader.js';
import type { GridCell } from '../types.js';
import type { Prng } from '../prng.js';
import { makeNoiseMap } from '../noise.js';

/**
 * Phase 1: Generate a terrain grid using seeded noise.
 *
 * Returns a [height][width] 2D array of GridCell. Each cell has:
 * - typeId: matched from tileTypes config by highest priority
 * - elevation, moisture: raw noise values in [0, 1]
 *
 * Ocean tiles are contiguity-corrected: isolated inland ocean cells
 * are converted to the best-matching non-ocean type.
 */
export function generateTerrain(
  width: number,
  height: number,
  noiseScale: number,
  tileTypes: Record<string, TileTypeDefinition>,
  prng: Prng,
): GridCell[][] {
  const elevationMap = makeNoiseMap(width, height, noiseScale, prng);
  const moistureMap = makeNoiseMap(width, height, noiseScale, prng);

  // Sort tile types by priority descending for assignment
  const sortedTypes = Object.entries(tileTypes).sort(
    (a, b) => b[1].terrainConditions.priority - a[1].terrainConditions.priority,
  );

  const assignType = (elevation: number, moisture: number, excludeOcean = false): string => {
    for (const [id, def] of sortedTypes) {
      if (excludeOcean && def.isOcean) continue;
      const { elevationMin, elevationMax, moistureMin, moistureMax } = def.terrainConditions;
      if (
        elevation >= elevationMin && elevation <= elevationMax &&
        moisture >= moistureMin && moisture <= moistureMax
      ) {
        return id;
      }
    }
    // Fallback: pick last (lowest priority) non-ocean type
    for (let i = sortedTypes.length - 1; i >= 0; i--) {
      const [id, def] = sortedTypes[i]!;
      if (!excludeOcean || !def.isOcean) return id;
    }
    return sortedTypes[sortedTypes.length - 1]![0];
  };

  // Build initial grid
  const grid: GridCell[][] = [];
  for (let y = 0; y < height; y++) {
    const row: GridCell[] = [];
    for (let x = 0; x < width; x++) {
      const elevation = elevationMap[y]![x]!;
      const moisture = moistureMap[y]![x]!;
      row.push({ x, y, typeId: assignType(elevation, moisture), elevation, moisture });
    }
    grid.push(row);
  }

  // Ocean contiguity: BFS from border to find reachable ocean cells
  const oceanIds = new Set(
    Object.entries(tileTypes).filter(([, def]) => def.isOcean).map(([id]) => id),
  );

  if (oceanIds.size > 0) {
    const isOcean = (x: number, y: number) => oceanIds.has(grid[y]?.[x]?.typeId ?? '');
    const reachable = Array.from({ length: height }, () => new Array(width).fill(false));
    const queue: Array<[number, number]> = [];

    const enqueue = (x: number, y: number) => {
      if (isOcean(x, y) && !reachable[y]![x]) {
        reachable[y]![x] = true;
        queue.push([x, y]);
      }
    };

    for (let x = 0; x < width; x++) { enqueue(x, 0); enqueue(x, height - 1); }
    for (let y = 1; y < height - 1; y++) { enqueue(0, y); enqueue(width - 1, y); }

    while (queue.length > 0) {
      const [cx, cy] = queue.shift()!;
      enqueue(cx - 1, cy); enqueue(cx + 1, cy);
      enqueue(cx, cy - 1); enqueue(cx, cy + 1);
    }

    // Convert unreachable ocean cells to best non-ocean type
    for (let y = 0; y < height; y++) {
      for (let x = 0; x < width; x++) {
        if (isOcean(x, y) && !reachable[y]![x]) {
          grid[y]![x]!.typeId = assignType(grid[y]![x]!.elevation, grid[y]![x]!.moisture, true);
        }
      }
    }
  }

  return grid;
}
