import { describe, test, expect } from 'vitest';
import { placeBuildings } from '../phases/08-buildings.js';
import { seedFrom } from '../prng.js';
import type { ZoneCandidate } from '../types.js';
import type { BuildingDefinition } from '../../config/loader.js';

function makeZone(id: string, tileCount: number, wealth: number, pluralityTypeId = 'plains'): ZoneCandidate {
  return {
    id, tileIds: Array.from({ length: tileCount }, (_, i) => `tile-${id}-${i}`),
    pluralityTypeId, generationWealth: wealth,
    tileCells: Array.from({ length: tileCount }, (_, i) => ({ x: i, y: 0 })),
  };
}

const buildings: BuildingDefinition[] = [
  { id: 'shack', name: 'Shack', description: '', baseCost: {}, infrastructureLoad: 1, preferredSkills: [], wealthRequirement: 0, wealthWeight: 10 },
  { id: 'bank', name: 'Bank', description: '', baseCost: {}, infrastructureLoad: 5, preferredSkills: [], wealthRequirement: 50, wealthWeight: 5 },
  { id: 'military-base', name: 'Military Base', description: '', baseCost: {}, infrastructureLoad: 10, preferredSkills: [],
    wealthRequirement: 30, wealthWeight: 3, buildableOnTileTypes: ['plains', 'mountain'] },
  { id: 'headquarters', name: 'Headquarters', description: '', baseCost: {}, infrastructureLoad: 0, preferredSkills: [], wealthRequirement: 0, wealthWeight: 5 },
];

describe('placeBuildings', () => {
  test('uninhabitable zones get no buildings', () => {
    const zone = makeZone('z1', 4, 80);
    const habitable = new Set<string>(); // not habitable
    const { prng } = seedFrom(1);
    const result = placeBuildings([zone], habitable, {}, buildings, 5, 4, prng);

    const zoneBuildings = Object.values(result.buildings).filter(b => b.zoneId === 'z1');
    expect(zoneBuildings).toHaveLength(0);
  });

  test('buildings with wealthRequirement above zone wealth are never placed', () => {
    const zone = makeZone('z1', 4, 30); // wealth=30, below bank's 50
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(2);
    const result = placeBuildings([zone], habitable, { z1: 'org-1' }, buildings, 5, 4, prng);

    const zoneBuildings = Object.values(result.buildings).filter(b => b.zoneId === 'z1');
    for (const building of zoneBuildings) {
      expect(building.typeId).not.toBe('bank');
    }
  });

  test('buildings restricted to specific tile types are not placed in incompatible zones', () => {
    const zone = makeZone('z1', 4, 70, 'desert'); // military-base only buildable on plains/mountain
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(3);
    const result = placeBuildings([zone], habitable, { z1: 'org-1' }, buildings, 5, 4, prng);

    const zoneBuildings = Object.values(result.buildings).filter(b => b.zoneId === 'z1');
    for (const building of zoneBuildings) {
      expect(building.typeId).not.toBe('military-base');
    }
  });

  test('headquarters type is never placed by this phase', () => {
    const zone = makeZone('z1', 6, 90);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(4);
    const result = placeBuildings([zone], habitable, { z1: 'org-1' }, buildings, 10, 6, prng);

    const hqBuildings = Object.values(result.buildings).filter(b => b.typeId === 'headquarters');
    expect(hqBuildings).toHaveLength(0);
  });

  test('zone building IDs match buildings whose zoneId matches', () => {
    const zone = makeZone('z1', 4, 70);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(5);
    const result = placeBuildings([zone], habitable, { z1: 'org-1' }, buildings, 5, 4, prng);

    const buildingIds = result.zoneBuildingIds.get('z1') ?? [];
    const buildingsInZone = Object.values(result.buildings).filter(b => b.zoneId === 'z1');
    expect(buildingIds.length).toBe(buildingsInZone.length);
    for (const id of buildingIds) {
      expect(result.buildings[id]).toBeDefined();
    }
  });

  test('building count is reasonable relative to maxBuildingsPerZone', () => {
    const zone = makeZone('z1', 4, 80);
    const habitable = new Set(['z1']);
    const { prng } = seedFrom(6);
    const result = placeBuildings([zone], habitable, { z1: 'org-1' }, buildings, 5, 4, prng);

    const count = (result.zoneBuildingIds.get('z1') ?? []).length;
    // Should not exceed maxBuildingsPerZone * (tileCount / avgZoneSize)
    expect(count).toBeLessThanOrEqual(5);
  });
});
