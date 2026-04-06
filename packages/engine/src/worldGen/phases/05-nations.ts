import type { ZoneCandidate } from '../types.js';
import type { Prng } from '../prng.js';

export interface NationPlacementResult {
  /** nationId → array of zone IDs claimed by that nation */
  nationZones: Map<string, string[]>;
  empireOriginZoneId: string;
}

let _nationCounter = 0;
const nextNationId = () => `nation-${_nationCounter++}`;

/** Reset nation counter — called at the start of each generateWorld run. */
export const resetNationCounter = (v = 0): void => { _nationCounter = v; };

/**
 * Phase 5: Place nations in the world via seeded BFS expansion.
 *
 * Algorithm:
 * 1. Select origin zones using Poisson-disc-style spread (max spacing)
 * 2. Expand nations via interleaved round-robin BFS
 * 3. Choose empire origin from remaining habitable zones (prefers nation adjacency)
 */
export function placeNations(
  zones: ZoneCandidate[],
  habitableZoneIds: Set<string>,
  adjacency: Map<string, Set<string>>,
  nationCount: number,
  zonesPerNation: number,
  minNationSpacing: number,
  prng: Prng,
): NationPlacementResult {
  const habitableZones = zones.filter(z => habitableZoneIds.has(z.id));
  const unclaimed = new Set(habitableZones.map(z => z.id));

  // Step 1: Select origin zones with maximum spacing
  const origins = selectOrigins(habitableZones, adjacency, nationCount, minNationSpacing, prng);

  // Step 2: Round-robin BFS expansion
  const nationIds = origins.map(() => nextNationId());
  const nationZones = new Map<string, string[]>(nationIds.map(id => [id, []]));

  // Claim origin zones and seed BFS queues with their neighbors
  const inQueue = new Set<string>();
  const queues: string[][] = origins.map(() => []);

  for (let i = 0; i < origins.length; i++) {
    const originId = origins[i]!.id;
    unclaimed.delete(originId);
    nationZones.get(nationIds[i]!)!.push(originId);

    // Pre-populate queue with neighbors of the origin
    for (const neighbor of adjacency.get(originId) ?? []) {
      if (unclaimed.has(neighbor) && !inQueue.has(neighbor)) {
        inQueue.add(neighbor);
        queues[i]!.push(neighbor);
      }
    }
  }

  // Expand round-robin until all nations have zonesPerNation zones
  let expanded = true;
  while (expanded) {
    expanded = false;
    for (let i = 0; i < nationCount; i++) {
      const nationId = nationIds[i]!;
      const claimed = nationZones.get(nationId)!;
      if (claimed.length >= zonesPerNation) continue;

      const queue = queues[i]!;
      while (queue.length > 0) {
        const next = queue.shift()!;
        if (!unclaimed.has(next)) continue;

        unclaimed.delete(next);
        claimed.push(next);
        expanded = true;

        for (const neighbor of adjacency.get(next) ?? []) {
          if (unclaimed.has(neighbor) && !inQueue.has(neighbor)) {
            inQueue.add(neighbor);
            queue.push(neighbor);
          }
        }
        break;
      }
    }
    // Stop if all nations are full
    if ([...nationZones.values()].every(c => c.length >= zonesPerNation)) break;
  }

  // Step 3: Choose empire origin — prefer zones adjacent to a nation
  const nationZoneSet = new Set([...nationZones.values()].flat());
  const remaining = [...unclaimed].filter(id => habitableZoneIds.has(id));

  const adjacent = remaining.filter(id =>
    [...(adjacency.get(id) ?? [])].some(nb => nationZoneSet.has(nb)),
  );

  let empireOriginZoneId: string;
  if (adjacent.length > 0) {
    empireOriginZoneId = adjacent[Math.floor(prng() * adjacent.length)]!;
  } else if (remaining.length > 0) {
    empireOriginZoneId = remaining[Math.floor(prng() * remaining.length)]!;
  } else {
    // Fallback: pick from any unclaimed zone (shouldn't happen with valid params)
    empireOriginZoneId = [...unclaimed][0] ?? habitableZones[0]!.id;
  }

  return { nationZones, empireOriginZoneId };
}

/** Select origin zones with maximum spacing using a greedy Poisson-disc approach. */
function selectOrigins(
  habitableZones: ZoneCandidate[],
  adjacency: Map<string, Set<string>>,
  nationCount: number,
  minSpacing: number,
  prng: Prng,
): ZoneCandidate[] {
  const shuffled = shuffleArray(habitableZones.slice(), prng);
  const selected: ZoneCandidate[] = [];

  for (const candidate of shuffled) {
    if (selected.length >= nationCount) break;

    const tooClose = selected.some(existing =>
      bfsDistance(existing.id, candidate.id, adjacency) < minSpacing,
    );

    if (!tooClose) selected.push(candidate);
  }

  // Fallback: if we couldn't meet spacing, pick randomly from remaining
  if (selected.length < nationCount) {
    const selectedIds = new Set(selected.map(z => z.id));
    for (const candidate of shuffled) {
      if (selected.length >= nationCount) break;
      if (!selectedIds.has(candidate.id)) {
        selected.push(candidate);
        selectedIds.add(candidate.id);
      }
    }
  }

  return selected;
}

/** BFS shortest path distance between two zones (in zone-graph hops). Returns Infinity if unreachable. */
function bfsDistance(
  fromId: string,
  toId: string,
  adjacency: Map<string, Set<string>>,
): number {
  if (fromId === toId) return 0;
  const visited = new Set([fromId]);
  const queue: Array<[string, number]> = [[fromId, 0]];
  while (queue.length > 0) {
    const [current, dist] = queue.shift()!;
    for (const neighbor of adjacency.get(current) ?? []) {
      if (neighbor === toId) return dist + 1;
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push([neighbor, dist + 1]);
      }
    }
  }
  return Infinity;
}

function shuffleArray<T>(arr: T[], prng: Prng): T[] {
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(prng() * (i + 1));
    [arr[i], arr[j]] = [arr[j]!, arr[i]!];
  }
  return arr;
}
