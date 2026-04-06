import type { TileTypeDefinition } from '../../config/loader.js';
import type { GridCell, ZoneCandidate } from '../types.js';
import type { Prng } from '../prng.js';
import { makeNoiseMap } from '../noise.js';

let _zoneCounter = 0;
const nextZoneId = () => `wgzone-${_zoneCounter++}`;

/** Reset zone counter — called at the start of each generateWorld run. */
export const resetZoneCounter = (v = 0): void => { _zoneCounter = v; };

/**
 * Phase 2: Group non-ocean tiles into zones via greedy flood-fill.
 *
 * Returns ZoneCandidate[] — internal zone descriptors including
 * the Tile entity IDs (created via factory) and cell coordinates.
 */
export function formZones(
  grid: GridCell[][],
  width: number,
  height: number,
  minZoneSize: number,
  maxZoneSize: number,
  tileTypes: Record<string, TileTypeDefinition>,
  prng: Prng,
): ZoneCandidate[] {
  // Generate a wealth noise map for per-zone variation (+20% economic noise)
  const wealthNoise = makeNoiseMap(width, height, 8.0, prng);

  const oceanIds = new Set(
    Object.entries(tileTypes).filter(([, def]) => def.isOcean).map(([id]) => id),
  );

  // Build list of non-ocean cells in random order
  const unassigned = new Set<number>(); // flat index = y * width + x
  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const cell = grid[y]![x]!;
      if (!oceanIds.has(cell.typeId)) {
        unassigned.add(y * width + x);
      }
    }
  }

  // Shuffle unassigned into a random seed order
  const seedOrder = shuffled(Array.from(unassigned), prng);

  const zones: ZoneCandidate[] = [];

  for (const seed of seedOrder) {
    if (!unassigned.has(seed)) continue;

    const seedX = seed % width;
    const seedY = Math.floor(seed / width);
    const targetSize = minZoneSize + Math.floor(prng() * (maxZoneSize - minZoneSize + 1));

    // BFS flood-fill from seed, stopping at targetSize
    const cells: Array<{ x: number; y: number }> = [];
    const queue: Array<[number, number]> = [[seedX, seedY]];
    const inQueue = new Set<number>();
    inQueue.add(seed);

    while (queue.length > 0 && cells.length < targetSize) {
      const [cx, cy] = queue.shift()!;
      const idx = cy * width + cx;
      if (!unassigned.has(idx)) continue;

      unassigned.delete(idx);
      cells.push({ x: cx, y: cy });

      for (const [nx, ny] of neighbors(cx, cy, width, height)) {
        const nIdx = ny * width + nx;
        if (unassigned.has(nIdx) && !inQueue.has(nIdx) && !oceanIds.has(grid[ny]![nx]!.typeId)) {
          inQueue.add(nIdx);
          queue.push([nx, ny]);
        }
      }
    }

    if (cells.length === 0) continue;

    zones.push(buildZone(cells, grid, wealthNoise, width, tileTypes));
  }

  // Absorb any remaining cells into the nearest existing zone
  if (unassigned.size > 0 && zones.length > 0) {
    const remainingCells: Array<{ x: number; y: number }> = [];
    for (const idx of unassigned) {
      remainingCells.push({ x: idx % width, y: Math.floor(idx / width) });
    }
    // Append them to the last zone
    const lastZone = zones[zones.length - 1]!;
    for (const cell of remainingCells) {
      lastZone.tileIds.push(`tile-${cell.x}-${cell.y}`);
      lastZone.tileCells.push(cell);
    }
    // Recalculate wealth for last zone after absorption
    const newWealth = computeWealth(lastZone.tileCells, grid, wealthNoise, width, tileTypes);
    lastZone.generationWealth = newWealth;
    lastZone.pluralityTypeId = computePluralityType(lastZone.tileCells, grid);
  }

  return zones;
}

function buildZone(
  cells: Array<{ x: number; y: number }>,
  grid: GridCell[][],
  wealthNoise: number[][],
  width: number,
  tileTypes: Record<string, TileTypeDefinition>,
): ZoneCandidate {
  const id = nextZoneId();
  // Use coordinate-based IDs for tiles: deterministic across generateWorld runs
  const tileIds = cells.map(c => `tile-${c.x}-${c.y}`);
  const pluralityTypeId = computePluralityType(cells, grid);
  const generationWealth = computeWealth(cells, grid, wealthNoise, width, tileTypes);
  return { id, tileIds, pluralityTypeId, generationWealth, tileCells: cells };
}

function computePluralityType(
  cells: Array<{ x: number; y: number }>,
  grid: GridCell[][],
): string {
  const counts = new Map<string, number>();
  for (const { x, y } of cells) {
    const typeId = grid[y]![x]!.typeId;
    counts.set(typeId, (counts.get(typeId) ?? 0) + 1);
  }
  let best = '';
  let bestCount = -1;
  for (const [id, count] of counts) {
    if (count > bestCount) { best = id; bestCount = count; }
  }
  return best;
}

function computeWealth(
  cells: Array<{ x: number; y: number }>,
  grid: GridCell[][],
  wealthNoise: number[][],
  _width: number,
  tileTypes: Record<string, TileTypeDefinition>,
): number {
  const avgContrib = cells.reduce((sum, { x, y }) => {
    return sum + (tileTypes[grid[y]![x]!.typeId]?.wealthContribution ?? 0);
  }, 0) / cells.length;

  // Use center cell's noise for zone variation
  const center = cells[Math.floor(cells.length / 2)]!;
  const noiseVal = wealthNoise[center.y]![center.x]!;

  return Math.max(0, Math.min(100, avgContrib * 0.8 + noiseVal * 20));
}

function neighbors(x: number, y: number, w: number, h: number): Array<[number, number]> {
  const result: Array<[number, number]> = [];
  if (x > 0) result.push([x - 1, y]);
  if (x < w - 1) result.push([x + 1, y]);
  if (y > 0) result.push([x, y - 1]);
  if (y < h - 1) result.push([x, y + 1]);
  return result;
}

function shuffled<T>(arr: T[], prng: Prng): T[] {
  const a = arr.slice();
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [a[i], a[j]] = [a[j]!, a[i]!];
  }
  return a;
}
