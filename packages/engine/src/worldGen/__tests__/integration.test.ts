import { describe, test, expect } from "vitest";
import { join } from "node:path";
import { generateWorld, WorldGenError } from "../index.js";
import { loadConfig } from "../../config/loader.js";
import { getPersonsInZone } from "../../state/queries.js";

// Load the real default config once for all integration tests
const configDir = join(process.cwd(), "../../config/default");
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

describe("generateWorld integration", () => {
    test("non-overlord and non-pet persons get linked startup effects with valid targets", () => {
        const state = generateWorld(
            {
                ...smallParams,
                seed: 123,
                populationDensity: 0.05,
            },
            config,
        );

        const personEffectIds = (
            config.effects as Array<{ id: string; category?: string }>
        )
            .filter((effect) => effect.category === "person")
            .map((effect) => effect.id);

        const excludedIds = new Set([
            state.empire.overlordId,
            state.empire.petId,
        ]);

        expect(
            state.persons[state.empire.overlordId]!.activeEffectIds,
        ).toHaveLength(0);
        expect(state.persons[state.empire.petId]!.activeEffectIds).toHaveLength(
            0,
        );

        let totalAssigned = 0;

        for (const person of Object.values(state.persons)) {
            if (excludedIds.has(person.id)) {
                continue;
            }

            expect(person.activeEffectIds.length).toBeLessThanOrEqual(2);
            expect(new Set(person.activeEffectIds).size).toBe(
                person.activeEffectIds.length,
            );

            totalAssigned += person.activeEffectIds.length;

            for (const effectInstanceId of person.activeEffectIds) {
                const instance = state.effectInstances[effectInstanceId];
                expect(instance).toBeDefined();
                expect(instance!.targetId).toBe(person.id);
                expect(instance!.targetType).toBe("person");
                expect(personEffectIds).toContain(instance!.effectId);
            }
        }

        expect(Object.keys(state.effectInstances).length).toBe(totalAssigned);
        expect(totalAssigned).toBeGreaterThan(0);
    });

    test("returns GameState with date 0", () => {
        const state = generateWorld(smallParams, config);
        expect(state.date).toBe(0);
    });

    test("worldSeed is the provided seed", () => {
        const state = generateWorld(smallParams, config);
        expect(state.worldSeed).toBe(42);
    });

    test("state is JSON.stringify round-trip safe", () => {
        const state = generateWorld(smallParams, config);
        const serialized = JSON.stringify(state);
        const deserialized = JSON.parse(serialized);
        expect(deserialized).toEqual(state);
    });

    test("same seed produces identical JSON output", () => {
        const s1 = JSON.stringify(generateWorld(smallParams, config));
        const s2 = JSON.stringify(generateWorld(smallParams, config));
        expect(s1).toBe(s2);
    });

    test("empire.overlordId and empire.petId exist in persons", () => {
        const state = generateWorld(smallParams, config);
        expect(state.persons[state.empire.overlordId]).toBeDefined();
        expect(state.persons[state.empire.petId]).toBeDefined();
    });

    test("all tile IDs referenced in zones exist in state.tiles", () => {
        const state = generateWorld(smallParams, config);
        for (const zone of Object.values(state.zones)) {
            for (const tileId of zone.tileIds) {
                expect(state.tiles[tileId]).toBeDefined();
            }
        }
    });

    test("all building IDs referenced in zones exist in state.buildings", () => {
        const state = generateWorld(smallParams, config);
        for (const zone of Object.values(state.zones)) {
            for (const buildingId of zone.buildingIds) {
                expect(state.buildings[buildingId]).toBeDefined();
            }
        }
    });

    test("all person zoneIds reference valid zones", () => {
        const state = generateWorld(smallParams, config);
        for (const person of Object.values(state.persons)) {
            expect(state.zones[person.zoneId]).toBeDefined();
        }
    });

    test("all nation governingOrganizationIds exist in state.governingOrganizations", () => {
        const state = generateWorld(smallParams, config);
        for (const nation of Object.values(state.nations)) {
            expect(
                state.governingOrganizations[nation.governingOrganizationId],
            ).toBeDefined();
        }
    });

    test("throws WorldGenError (not generic Error) for bad params", () => {
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

    test("empire zone exists and has a headquarters building", () => {
        const state = generateWorld(smallParams, config);
        const empireZoneId = Object.keys(state.zones).find((zoneId) => {
            return state.zones[zoneId]!.buildingIds.some(
                (bid) => state.buildings[bid]?.typeId === "headquarters",
            );
        });
        expect(empireZoneId).toBeDefined();
    });

    test("exactly 1 zone is controlled by the empire at game start", () => {
        const state = generateWorld(smallParams, config);
        const empireControlledZones = Object.values(state.zones).filter(
            (z) => z.governingOrganizationId === state.empire.id,
        );
        expect(empireControlledZones).toHaveLength(1);
    });

    test("empire.unlockedPlotIds contains all plots with no research prerequisites at game start", () => {
        const state = generateWorld(smallParams, config);
        const starterPlots = (
            config.plots as Array<{
                id: string;
                requirements?: { researchIds?: string[] };
            }>
        )
            .filter(
                (p) =>
                    !p.requirements?.researchIds ||
                    p.requirements.researchIds.length === 0,
            )
            .map((p) => p.id);
        expect(starterPlots.length).toBeGreaterThan(0);
        for (const id of starterPlots) {
            expect(state.empire.unlockedPlotIds).toContain(id);
        }
    });

    test("research-gated plots are not unlocked at game start", () => {
        const state = generateWorld(smallParams, config);
        const gatedPlots = (
            config.plots as Array<{
                id: string;
                requirements?: { researchIds?: string[] };
            }>
        )
            .filter(
                (p) =>
                    p.requirements?.researchIds &&
                    p.requirements.researchIds.length > 0,
            )
            .map((p) => p.id);
        expect(gatedPlots.length).toBeGreaterThan(0);
        for (const id of gatedPlots) {
            expect(state.empire.unlockedPlotIds).not.toContain(id);
        }
    });

    test("empire.unlockedActivityIds contains all activity IDs at game start", () => {
        const state = generateWorld(smallParams, config);
        const allActivityIds = (config.activities as Array<{ id: string }>).map(
            (a) => a.id,
        );
        expect(allActivityIds.length).toBeGreaterThan(0);
        for (const id of allActivityIds) {
            expect(state.empire.unlockedActivityIds).toContain(id);
        }
    });

    test("exactly one tile resolves to Empire control at game start", () => {
        const state = generateWorld({ ...smallParams, seed: 1 }, config);

        const empireTiles = Object.values(state.tiles).filter((tile) => {
            if (!tile.zoneId) return false;
            const zone = state.zones[tile.zoneId];
            return zone?.governingOrganizationId === state.empire.id;
        });

        expect(empireTiles).toHaveLength(1);
    });

    test("every zoned tile appears in its zone tileIds list", () => {
        const state = generateWorld({ ...smallParams, seed: 1 }, config);

        for (const tile of Object.values(state.tiles)) {
            if (!tile.zoneId) continue;
            const zone = state.zones[tile.zoneId];
            expect(zone).toBeDefined();
            expect(zone?.tileIds).toContain(tile.id);
        }
    });

    test("empire starting zone contains the overlord and pet", () => {
        const state = generateWorld(smallParams, config);
        const empireZone = Object.values(state.zones).find(
            (z) => z.governingOrganizationId === state.empire.id,
        );
        expect(empireZone).toBeDefined();
        const persons = getPersonsInZone(state, empireZone!.id);
        const personIds = persons.map((p) => p.id);
        expect(personIds).toContain(state.empire.overlordId);
        expect(personIds).toContain(state.empire.petId);
    });

    test("empire has at least one bank owned by the empire", () => {
        const state = generateWorld(smallParams, config);
        const empireBuildings = Object.values(state.buildings).filter(
            (b) => b.governingOrganizationId === state.empire.id,
        );
        expect(empireBuildings.some((b) => b.typeId === "bank")).toBe(true);
    });

    test("empire has at least one hospital owned by the empire", () => {
        const state = generateWorld(smallParams, config);
        const empireBuildings = Object.values(state.buildings).filter(
            (b) => b.governingOrganizationId === state.empire.id,
        );
        expect(empireBuildings.some((b) => b.typeId === "hospital")).toBe(true);
    });

    test("empire has at least one research-lab owned by the empire", () => {
        const state = generateWorld(smallParams, config);
        const empireBuildings = Object.values(state.buildings).filter(
            (b) => b.governingOrganizationId === state.empire.id,
        );
        expect(empireBuildings.some((b) => b.typeId === "research-lab")).toBe(
            true,
        );
    });

    test("guaranteed empire buildings are listed in the empire zone's buildingIds", () => {
        const state = generateWorld(smallParams, config);
        const empireZone = Object.values(state.zones).find(
            (z) => z.governingOrganizationId === state.empire.id,
        )!;
        const zoneBuildingTypeIds = empireZone.buildingIds.map(
            (id) => state.buildings[id]!.typeId,
        );
        expect(zoneBuildingTypeIds).toContain("bank");
        expect(zoneBuildingTypeIds).toContain("hospital");
        expect(zoneBuildingTypeIds).toContain("research-lab");
    });
});
