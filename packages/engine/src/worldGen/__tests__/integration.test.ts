import { describe, test, expect } from 'vitest';
import { join } from 'node:path';
import { generateWorld, WorldGenError } from '../index.js';
import { loadConfig } from '../../config/loader.js';

// Load the real default config once for all integration tests
const configDir = join(process.cwd(), '../../config/default');
const config = loadConfig(configDir);

// Small but valid params for fast test runs
const smallParams = {
  seed: 42,
  mapWidth: 30,
  mapHeight: 30,
  minZoneSize: 1,
  maxZoneSize: 6,
  nationCount: 2,
  zonesPerNation: 3,
  populationDensity: 0.01, // tiny population for speed
  maxBuildingsPerZone: 3,
};

describe('generateWorld integration', () => {
  test('returns GameState with date 0', () => {
    const state = generateWorld(smallParams, config);
    expect(state.date).toBe(0);
  });

  test('worldSeed is the provided seed', () => {
    const state = generateWorld(smallParams, config);
    expect(state.worldSeed).toBe(42);
  });

  test('state is JSON.stringify round-trip safe', () => {
    const state = generateWorld(smallParams, config);
    const serialized = JSON.stringify(state);
    const deserialized = JSON.parse(serialized);
    expect(deserialized).toEqual(state);
  });

  test('same seed produces identical JSON output', () => {
    const s1 = JSON.stringify(generateWorld(smallParams, config));
    const s2 = JSON.stringify(generateWorld(smallParams, config));
    expect(s1).toBe(s2);
  });

  test('empire.overlordId and empire.petId exist in persons', () => {
    const state = generateWorld(smallParams, config);
    expect(state.persons[state.empire.overlordId]).toBeDefined();
    expect(state.persons[state.empire.petId]).toBeDefined();
  });

  test('all tile IDs referenced in zones exist in state.tiles', () => {
    const state = generateWorld(smallParams, config);
    for (const zone of Object.values(state.zones)) {
      for (const tileId of zone.tileIds) {
        expect(state.tiles[tileId]).toBeDefined();
      }
    }
  });

  test('all building IDs referenced in zones exist in state.buildings', () => {
    const state = generateWorld(smallParams, config);
    for (const zone of Object.values(state.zones)) {
      for (const buildingId of zone.buildingIds) {
        expect(state.buildings[buildingId]).toBeDefined();
      }
    }
  });

  test('all person zoneIds reference valid zones', () => {
    const state = generateWorld(smallParams, config);
    for (const person of Object.values(state.persons)) {
      expect(state.zones[person.zoneId]).toBeDefined();
    }
  });

  test('all nation governingOrganizationIds exist in state.governingOrganizations', () => {
    const state = generateWorld(smallParams, config);
    for (const nation of Object.values(state.nations)) {
      expect(state.governingOrganizations[nation.governingOrganizationId]).toBeDefined();
    }
  });

  test('throws WorldGenError (not generic Error) for bad params', () => {
    const badParams = { ...smallParams, nationCount: 100 }; // way too many nations for 30×30
    let thrown: unknown;
    try {
      generateWorld(badParams, config);
    } catch (e) {
      thrown = e;
    }
    expect(thrown).toBeInstanceOf(WorldGenError);
    expect((thrown as WorldGenError).code).toBeDefined();
  });

  test('empire zone exists and has a headquarters building', () => {
    const state = generateWorld(smallParams, config);
    const empireZoneId = Object.keys(state.zones).find(zoneId => {
      return state.zones[zoneId]!.buildingIds.some(bid => state.buildings[bid]?.typeId === 'headquarters');
    });
    expect(empireZoneId).toBeDefined();
  });

  test('exactly 1 zone is controlled by the empire at game start', () => {
    const state = generateWorld(smallParams, config);
    const empireControlledZones = Object.values(state.zones).filter(
      z => z.governingOrganizationId === state.empire.id,
    );
    expect(empireControlledZones).toHaveLength(1);
  });
});
