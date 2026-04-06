import type { TileTypeDefinition } from '../../config/loader.js';
import type { ZoneCandidate } from '../types.js';

/**
 * Phase 3: Classify zones as habitable or uninhabitable.
 *
 * A zone is uninhabitable if:
 * - Its plurality tile type has canBeInhabited: false
 * - Its generationWealth is <= uninhabitedWealthFloor
 *
 * Returns a Set of habitable zone IDs.
 */
export function classifyHabitability(
  zones: ZoneCandidate[],
  tileTypes: Record<string, TileTypeDefinition>,
  uninhabitedWealthFloor: number,
): Set<string> {
  const habitable = new Set<string>();
  for (const zone of zones) {
    const def = tileTypes[zone.pluralityTypeId];
    if (!def) continue;
    if (!def.canBeInhabited) continue;
    if (zone.generationWealth <= uninhabitedWealthFloor) continue;
    habitable.add(zone.id);
  }
  return habitable;
}
