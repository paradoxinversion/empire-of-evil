import type { ZoneCandidate } from '../types.js';
import { WorldGenError } from '../error.js';

interface ValidationParams {
  nationCount: number;
  zonesPerNation: number;
  minZoneSize: number;
  maxZoneSize: number;
  mapWidth: number;
  mapHeight: number;
}

/**
 * Phase 4: Validate world generation parameters against the generated zones.
 * Throws WorldGenError with a descriptive code if validation fails.
 * Runs before any nation/population state is built.
 */
export function validateWorldGenParams(
  zones: ZoneCandidate[],
  habitableZoneIds: Set<string>,
  params: ValidationParams,
): void {
  const { nationCount, zonesPerNation, minZoneSize, maxZoneSize, mapWidth, mapHeight } = params;

  // Zone size sanity
  if (minZoneSize < 1) {
    throw new WorldGenError('ZONE_SIZE_INVALID', 'minZoneSize must be at least 1.');
  }

  const totalCells = mapWidth * mapHeight;
  const requiredZones = nationCount * zonesPerNation + 1;
  const maxAllowedZoneSize = Math.floor(totalCells / requiredZones / 2);
  if (maxZoneSize > maxAllowedZoneSize) {
    throw new WorldGenError(
      'ZONE_SIZE_INVALID',
      `maxZoneSize (${maxZoneSize}) is too large for this map. Maximum allowed: ${maxAllowedZoneSize}.`,
    );
  }

  // Zones per nation minimum
  if (zonesPerNation < 3) {
    throw new WorldGenError(
      'ZONES_PER_NATION_TOO_SMALL',
      `zonesPerNation must be at least 3 (got ${zonesPerNation}).`,
    );
  }

  // Minimum habitable zones
  const habitableCount = habitableZoneIds.size;
  if (habitableCount < requiredZones) {
    throw new WorldGenError(
      'INSUFFICIENT_HABITABLE_ZONES',
      `Not enough habitable zones for ${nationCount} nations with ${zonesPerNation} zones each. ` +
      `Need ${requiredZones}, have ${habitableCount}. ` +
      `Either reduce nation count, reduce zones per nation, or increase map size.`,
    );
  }

  // Contiguity check: need nationCount contiguous habitable groups of size >= zonesPerNation
  const adjacency = buildZoneAdjacency(zones, habitableZoneIds);
  const contiguousGroupCount = countContiguousGroups(adjacency, habitableZoneIds, zonesPerNation);
  if (contiguousGroupCount < nationCount) {
    throw new WorldGenError(
      'INSUFFICIENT_CONTIGUOUS_ZONES',
      `Map topology cannot accommodate ${nationCount} contiguous nations of ${zonesPerNation} zones. ` +
      `Try a larger map, fewer nations, or a different seed.`,
    );
  }
}

/** Build adjacency graph: zones are adjacent if any tile is 4-directionally neighboring another zone's tile. */
export function buildZoneAdjacency(
  zones: ZoneCandidate[],
  habitableZoneIds: Set<string>,
): Map<string, Set<string>> {
  const adj = new Map<string, Set<string>>();
  const cellToZone = new Map<string, string>(); // "x,y" → zoneId

  for (const zone of zones) {
    if (!habitableZoneIds.has(zone.id)) continue;
    adj.set(zone.id, new Set());
    for (const { x, y } of zone.tileCells) {
      cellToZone.set(`${x},${y}`, zone.id);
    }
  }

  for (const zone of zones) {
    if (!habitableZoneIds.has(zone.id)) continue;
    for (const { x, y } of zone.tileCells) {
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]] as [number, number][]) {
        const neighborZoneId = cellToZone.get(`${nx},${ny}`);
        if (neighborZoneId && neighborZoneId !== zone.id) {
          adj.get(zone.id)!.add(neighborZoneId);
          adj.get(neighborZoneId)!.add(zone.id);
        }
      }
    }
  }

  return adj;
}

/**
 * Count how many nations (of size zonesPerNation) can be accommodated across
 * all connected components of habitable zones.
 * Each component of size N can hold floor(N / zonesPerNation) nations.
 */
function countContiguousGroups(
  adjacency: Map<string, Set<string>>,
  habitableZoneIds: Set<string>,
  zonesPerNation: number,
): number {
  const visited = new Set<string>();
  let totalNationCapacity = 0;

  for (const zoneId of habitableZoneIds) {
    if (visited.has(zoneId)) continue;

    // BFS to find component size
    const queue = [zoneId];
    let componentSize = 0;
    visited.add(zoneId);

    while (queue.length > 0) {
      const current = queue.shift()!;
      componentSize++;
      for (const neighbor of adjacency.get(current) ?? []) {
        if (!visited.has(neighbor) && habitableZoneIds.has(neighbor)) {
          visited.add(neighbor);
          queue.push(neighbor);
        }
      }
    }

    totalNationCapacity += Math.floor(componentSize / zonesPerNation);
  }

  return totalNationCapacity;
}
