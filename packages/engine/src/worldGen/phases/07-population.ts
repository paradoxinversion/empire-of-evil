import type { Person } from '../../types/index.js';
import type { ZoneCandidate } from '../types.js';
import type { Prng } from '../prng.js';
import { createPerson } from '../../factories/index.js';

export interface PopulationResult {
  persons: Record<string, Person>;
  /** zoneId → population count */
  zonePops: Map<string, number>;
}

const FIRST_NAMES = ['Amal', 'Bex', 'Cael', 'Dorn', 'Eld', 'Fara', 'Gora', 'Hin', 'Isla', 'Jorn'];
const LAST_NAMES = ['Aldric', 'Bran', 'Croth', 'Dune', 'Erek', 'Foss', 'Gale', 'Holt', 'Irk', 'Jarv'];

/**
 * Phase 7: Seed population for all habitable zones.
 *
 * Population count per zone:
 *   floor(generationWealth * populationDensity * tileCount * randomVariation)
 * where randomVariation is in [0.8, 1.2].
 */
export function seedPopulation(
  zones: ZoneCandidate[],
  habitableZoneIds: Set<string>,
  governingOrgId: string,
  populationDensity: number,
  prng: Prng,
): PopulationResult {
  const persons: Record<string, Person> = {};
  const zonePops = new Map<string, number>();

  for (const zone of zones) {
    if (!habitableZoneIds.has(zone.id)) {
      zonePops.set(zone.id, 0);
      continue;
    }

    const tileCount = zone.tileIds.length;
    const baseCount = zone.generationWealth * populationDensity * tileCount;
    const variation = 0.8 + prng() * 0.4; // [0.8, 1.2]
    const count = Math.floor(baseCount * variation);

    zonePops.set(zone.id, count);

    for (let i = 0; i < count; i++) {
      const firstName = FIRST_NAMES[Math.floor(prng() * FIRST_NAMES.length)]!;
      const lastName = LAST_NAMES[Math.floor(prng() * LAST_NAMES.length)]!;
      const person = createPerson({
        name: `${firstName} ${lastName}`,
        zoneId: zone.id,
        homeZoneId: zone.id,
        governingOrganizationId: governingOrgId,
      });
      persons[person.id] = person;
    }
  }

  return { persons, zonePops };
}
