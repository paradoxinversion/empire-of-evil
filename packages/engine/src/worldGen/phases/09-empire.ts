import type { Person, Building } from '../../types/index.js';
import type { PetDefinition } from '../../config/loader.js';
import { createPerson, createBuilding } from '../../factories/index.js';
import { seedFrom } from '../prng.js';

interface EmpireInitParams {
  petTypeId?: string;
  startingResources?: { money: number; science: number; infrastructure: number };
}

export interface EmpireInitResult {
  persons: Record<string, Person>;
  buildings: Record<string, Building>;
  overlordId: string;
  petId: string;
  hqBuildingId: string;
  resources: { money: number; science: number; infrastructure: number };
}

/**
 * Phase 9: Initialize the empire starting zone.
 *
 * Places:
 * - Headquarters building
 * - Overlord person (with agentStatus: { job: 'unassigned', salary: 0 })
 * - Pet person (matched by petTypeId or randomly selected)
 *
 * Sets starting resources from params or config defaults.
 */
export function initializeEmpire(
  empireOriginZoneId: string,
  empireOrgId: string,
  pets: PetDefinition[],
  params: EmpireInitParams,
  defaultResources: { money: number; science: number; infrastructure: number },
  worldSeed: number,
): EmpireInitResult {
  const persons: Record<string, Person> = {};
  const buildings: Record<string, Building> = {};

  // Headquarters
  const hq = createBuilding({
    name: 'Headquarters',
    typeId: 'headquarters',
    zoneId: empireOriginZoneId,
    governingOrganizationId: empireOrgId,
  });
  buildings[hq.id] = hq;

  // Overlord
  const overlord = createPerson({
    name: 'The Overlord',
    zoneId: empireOriginZoneId,
    homeZoneId: empireOriginZoneId,
    governingOrganizationId: empireOrgId,
    agentStatus: { job: 'unassigned', salary: 0 },
  });
  persons[overlord.id] = overlord;

  // Pet selection
  let selectedPet: PetDefinition | undefined;
  if (params.petTypeId) {
    selectedPet = pets.find(p => p.id === params.petTypeId);
  }
  if (!selectedPet && pets.length > 0) {
    // Deterministic random selection from worldSeed
    const { prng } = seedFrom(worldSeed ^ 0xdeadbeef);
    selectedPet = pets[Math.floor(prng() * pets.length)];
  }

  const petPerson = createPerson({
    name: selectedPet?.name ?? 'Unnamed Pet',
    zoneId: empireOriginZoneId,
    homeZoneId: empireOriginZoneId,
    governingOrganizationId: empireOrgId,
  });
  persons[petPerson.id] = petPerson;

  const resources = params.startingResources ?? defaultResources;

  return {
    persons,
    buildings,
    overlordId: overlord.id,
    petId: petPerson.id,
    hqBuildingId: hq.id,
    resources,
  };
}
