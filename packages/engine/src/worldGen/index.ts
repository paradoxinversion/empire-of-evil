import type { GameState, WorldGenParams, Zone, Nation, Tile } from '../types/index.js';
import type { Config } from '../config/loader.js';
import { resetIdCounter } from '../factories/index.js';
import { seedFrom } from './prng.js';
import { generateTerrain } from './phases/01-terrain.js';
import { formZones, resetZoneCounter } from './phases/02-zones.js';
import { classifyHabitability } from './phases/03-habitability.js';
import { validateWorldGenParams, buildZoneAdjacency } from './phases/04-validation.js';
import { placeNations, resetNationCounter } from './phases/05-nations.js';
import { generateGoverningOrgs } from './phases/06-orgs.js';
import { seedPopulation } from './phases/07-population.js';
import { placeBuildings } from './phases/08-buildings.js';
import { initializeEmpire } from './phases/09-empire.js';

export { WorldGenError } from './error.js';

/**
 * Generate a complete world. Returns a fully-initialized GameState.
 * Throws WorldGenError if parameters are invalid.
 */
export const generateWorld = (params: WorldGenParams, config: Config): GameState => {
  const noiseScale = params.terrainProfile?.noiseScale ?? config.worldgen.terrainProfile?.noiseScale ?? 4.0;
  const uninhabitedWealthFloor = params.terrainProfile?.uninhabitedWealthFloor
    ?? config.worldgen.terrainProfile?.uninhabitedWealthFloor ?? 20;
  const minZoneSize = params.minZoneSize ?? config.worldgen.minZoneSize;
  const maxZoneSize = params.maxZoneSize ?? config.worldgen.maxZoneSize;
  const nationCount = params.nationCount;
  const zonesPerNation = params.zonesPerNation;
  const minNationSpacing = params.minNationSpacing ?? Math.ceil(zonesPerNation / 2);
  const populationDensity = params.populationDensity;
  const maxBuildingsPerZone = params.maxBuildingsPerZone ?? config.worldgen.maxBuildingsPerZone;
  const mapWidth = params.mapWidth;
  const mapHeight = params.mapHeight;

  // Reset all worldgen-specific ID counters so runs with the same seed produce identical IDs
  resetIdCounter(1);
  resetZoneCounter(0);
  resetNationCounter(0);

  // Seeded PRNG — deterministic from seed
  const { seed: worldSeed, prng } = seedFrom(params.seed);

  // Phase 1: Terrain
  const grid = generateTerrain(mapWidth, mapHeight, noiseScale, config.tileTypes, prng);

  // Phase 2: Zones
  const zoneCandidates = formZones(grid, mapWidth, mapHeight, minZoneSize, maxZoneSize, config.tileTypes, prng);

  // Phase 3: Habitability
  const habitableZoneIds = classifyHabitability(zoneCandidates, config.tileTypes, uninhabitedWealthFloor);

  // Phase 4: Validation
  const adjacency = buildZoneAdjacency(zoneCandidates, habitableZoneIds);
  validateWorldGenParams(zoneCandidates, habitableZoneIds, {
    nationCount, zonesPerNation, minZoneSize, maxZoneSize, mapWidth, mapHeight,
  });

  // Phase 5: Nation placement
  const { nationZones: nationZoneMap, empireOriginZoneId } = placeNations(
    zoneCandidates, habitableZoneIds, adjacency, nationCount, zonesPerNation, minNationSpacing, prng,
  );

  // Phase 6: Governing organizations
  const { organizations, nationOrgMap, empireOrgId } = generateGoverningOrgs(nationZoneMap, empireOriginZoneId);

  // Build zone→org lookup for population and building phases
  const zoneOrgLookup: Record<string, string> = {};
  for (const [nationId, orgId] of nationOrgMap) {
    for (const zoneId of nationZoneMap.get(nationId) ?? []) {
      zoneOrgLookup[zoneId] = orgId;
    }
  }
  zoneOrgLookup[empireOriginZoneId] = empireOrgId;

  // Phase 7: Population
  const avgZoneSize = zoneCandidates.length > 0
    ? zoneCandidates.reduce((s, z) => s + z.tileIds.length, 0) / zoneCandidates.length
    : 1;

  const { persons: populationPersons, zonePops } = seedPopulation(
    zoneCandidates, habitableZoneIds, empireOrgId, populationDensity, prng,
  );

  // Phase 8: Buildings
  const { buildings: placedBuildings, zoneBuildingIds } = placeBuildings(
    zoneCandidates, habitableZoneIds, zoneOrgLookup, config.buildings,
    maxBuildingsPerZone, avgZoneSize, prng,
  );

  // Phase 9: Empire initialization
  const defaultResources = params.startingResources ?? { money: 500, science: 0, infrastructure: 100 };
  const empireInit = initializeEmpire(
    empireOriginZoneId, empireOrgId, config.pets, params, defaultResources, worldSeed,
    populationPersons,
  );

  // Assemble tiles record
  const tiles: Record<string, Tile> = {};
  for (const row of grid) {
    for (const cell of row) {
      // Ocean tiles don't belong to a zone
      const zone = zoneCandidates.find(z => z.tileCells.some(c => c.x === cell.x && c.y === cell.y));
      if (!zone) {
        // Ocean tile — add with empty zoneId string (ocean tiles have no zone)
        const id = `ocean-${cell.x}-${cell.y}`;
        tiles[id] = { id, typeId: cell.typeId, zoneId: '', activeEffectIds: [] };
      }
    }
  }
  // Add zone tiles from zone candidates (already have IDs from factory)
  for (const zone of zoneCandidates) {
    for (let i = 0; i < zone.tileIds.length; i++) {
      const tileId = zone.tileIds[i]!;
      const cell = zone.tileCells[i]!;
      tiles[tileId] = { id: tileId, typeId: grid[cell.y]![cell.x]!.typeId, zoneId: zone.id, activeEffectIds: [] };
    }
  }

  // Assemble zones record
  const zones: Record<string, Zone> = {};
  for (const zc of zoneCandidates) {
    const nationId = [...nationZoneMap.entries()].find(([, zids]) => zids.includes(zc.id))?.[0] ?? '';
    zones[zc.id] = {
      id: zc.id,
      name: `Zone ${zc.id}`,
      nationId,
      governingOrganizationId: zoneOrgLookup[zc.id] ?? '',
      tileIds: zc.tileIds,
      buildingIds: zoneBuildingIds.get(zc.id) ?? [],
      generationWealth: zc.generationWealth,
      economicOutput: 0,
      population: zonePops.get(zc.id) ?? 0,
      intelLevel: 0,
      taxRate: 0.1,
      activeEffectIds: [],
    };
  }
  // Add empire origin's buildings (HQ) to its zone
  if (zones[empireOriginZoneId]) {
    zones[empireOriginZoneId]!.buildingIds.push(empireInit.hqBuildingId);
  }

  // Assemble nations record
  const nations: Record<string, Nation> = {};
  for (const [nationId, zoneIds] of nationZoneMap) {
    const orgId = nationOrgMap.get(nationId) ?? '';
    nations[nationId] = { id: nationId, name: `Nation ${nationId}`, size: zoneIds.length, governingOrganizationId: orgId };
  }

  // Merge all persons and buildings
  const allPersons = { ...populationPersons, ...empireInit.persons };
  const allBuildings = { ...placedBuildings, ...empireInit.buildings };

  return {
    tiles,
    zones,
    nations,
    buildings: allBuildings,
    persons: allPersons,
    governingOrganizations: organizations,
    squads: {},
    plots: {},
    activities: {},
    research: {},
    captives: {},
    effectInstances: {},
    morgues: { byCitizen: {}, byAgent: {} },
    empire: {
      id: empireOrgId,
      overlordId: empireInit.overlordId,
      petId: empireInit.petId,
      resources: empireInit.resources,
      evil: { actual: 0, perceived: 0 },
      innerCircleIds: [],
      unlockedPlotIds: [],
      unlockedActivityIds: [],
      unlockedResearchIds: [],
    },
    date: 0,
    worldSeed,
    pendingEvents: [],
    eventLog: [],
  };
};
