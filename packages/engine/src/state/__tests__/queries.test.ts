import { test, expect } from "vitest";
import { getBuildingIncomeByZone, getBuildingZoneId } from "../queries.js";

test("getBuildingIncomeByZone attributes income to tile zone when tileId differs from building.zoneId", () => {
    // Setup state: two zones z1 and z2, two tiles t1 (in z1) and t2 (in z2).
    const state: any = {
        tiles: {
            t1: {
                id: "t1",
                typeId: "plains",
                zoneId: "z1",
                activeEffectIds: [],
            },
            t2: {
                id: "t2",
                typeId: "plains",
                zoneId: "z2",
                activeEffectIds: [],
            },
        },
        zones: {
            z1: {
                id: "z1",
                name: "Zone 1",
                nationId: "n1",
                governingOrganizationId: "",
                tileIds: ["t1"],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 0,
                taxRate: 0.1,
                activeEffectIds: [],
            },
            z2: {
                id: "z2",
                name: "Zone 2",
                nationId: "n1",
                governingOrganizationId: "",
                tileIds: ["t2"],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 0,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        buildings: {
            // Building claims zoneId 'z1' but is placed on tile 't2' which is in 'z2'
            b1: {
                id: "b1",
                name: "B1",
                typeId: "shack",
                zoneId: "z1",
                tileId: "t2",
                intelLevel: 0,
                governingOrganizationId: "empire",
                activeEffectIds: [],
            },
        },
        persons: {},
        governingOrganizations: {},
        squads: {},
        plots: {},
        activities: {},
        research: {},
        captives: {},
        effectInstances: {},
        morgues: { byCitizen: {}, byAgent: {} },
        empire: {
            id: "empire",
            overlordId: "",
            petId: "",
            resources: { money: 0, science: 0, infrastructure: 0 },
            evil: { actual: 0, perceived: 0 },
            innerCircleIds: [],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
        },
        date: 0,
        worldSeed: 0,
        pendingEvents: [],
        eventLog: [],
    };

    const config: any = {
        buildings: [
            {
                id: "shack",
                name: "Shack",
                description: "",
                baseCost: {},
                infrastructureLoad: 1,
                preferredSkills: [],
                resourceOutput: { money: 10 },
            },
        ],
    };

    const incomeByZone = getBuildingIncomeByZone(state, config);

    // Expect income to be attributed to z2 (the tile's zone), not z1 (the building's zoneId)
    expect(incomeByZone["z2"]).toBe(10);
    expect(incomeByZone["z1"] ?? 0).toBe(0);
});

test("getBuildingZoneId resolves zone from tileId when present, otherwise falls back to building.zoneId", () => {
    const state: any = {
        tiles: {
            t1: {
                id: "t1",
                typeId: "plains",
                zoneId: "z1",
                activeEffectIds: [],
            },
            t2: {
                id: "t2",
                typeId: "plains",
                zoneId: "z2",
                activeEffectIds: [],
            },
        },
    };

    const bWithTile = {
        id: "b1",
        typeId: "x",
        zoneId: "z1",
        tileId: "t2",
    } as any;
    const bMissingTile = {
        id: "b2",
        typeId: "x",
        zoneId: "z1",
        tileId: "missing",
    } as any;
    const bNoTile = { id: "b3", typeId: "x", zoneId: "z1" } as any;

    expect(getBuildingZoneId(state as any, bWithTile)).toBe("z2");
    expect(getBuildingZoneId(state as any, bMissingTile)).toBe("z1");
    expect(getBuildingZoneId(state as any, bNoTile)).toBe("z1");
});
