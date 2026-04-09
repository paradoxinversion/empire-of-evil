import { test, expect } from "vitest";
import {
    getBuildingIncomeByZone,
    getBuildingZoneId,
    getCurrentBuildingOutput,
} from "../queries.js";

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

test("getCurrentBuildingOutput includes assigned agents and employed citizens with preferred skill scaling", () => {
    const state: any = {
        tiles: {
            t1: {
                id: "t1",
                typeId: "plains",
                zoneId: "z1",
                activeEffectIds: [],
            },
        },
        zones: {
            z1: {
                id: "z1",
                name: "Zone 1",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: ["t1"],
                buildingIds: ["b1"],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 0,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        buildings: {
            b1: {
                id: "b1",
                name: "Market One",
                typeId: "market-stall",
                zoneId: "z1",
                tileId: "t1",
                intelLevel: 0,
                governingOrganizationId: "empire",
                activeEffectIds: [],
                assignedAgentIds: ["a1"],
            },
        },
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: { finance: 40 },
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "operative", salary: 10 },
            },
            c1: {
                id: "c1",
                name: "Citizen One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: { finance: 60 },
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                employedBuildingId: "b1",
            },
        },
    };

    const config: any = {
        buildings: [
            {
                id: "market-stall",
                name: "Market Stall",
                description: "",
                baseCost: {},
                infrastructureLoad: 1,
                preferredSkills: ["finance"],
                resourceOutput: { money: 10, science: 4 },
                upkeepPerDay: 1,
            },
        ],
    };

    const output = getCurrentBuildingOutput(state, config, "b1");
    expect(output).toEqual({
        money: 14,
        science: 6,
        infrastructure: 0,
    });
});

test("getCurrentBuildingOutput excludes workers not currently in the building zone", () => {
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
                governingOrganizationId: "empire",
                tileIds: ["t1"],
                buildingIds: ["b1"],
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
                governingOrganizationId: "empire",
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
            b1: {
                id: "b1",
                name: "Market One",
                typeId: "market-stall",
                zoneId: "z1",
                tileId: "t1",
                intelLevel: 0,
                governingOrganizationId: "empire",
                activeEffectIds: [],
                assignedAgentIds: ["a1"],
            },
        },
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: { finance: 50 },
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "operative", salary: 10 },
            },
            c1: {
                id: "c1",
                name: "Citizen One",
                zoneId: "z2",
                homeZoneId: "z2",
                governingOrganizationId: "empire",
                attributes: {},
                skills: { finance: 100 },
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                employedBuildingId: "b1",
            },
        },
    };

    const config: any = {
        buildings: [
            {
                id: "market-stall",
                name: "Market Stall",
                description: "",
                baseCost: {},
                infrastructureLoad: 1,
                preferredSkills: ["finance"],
                resourceOutput: { money: 10 },
                upkeepPerDay: 1,
            },
        ],
    };

    const output = getCurrentBuildingOutput(state, config, "b1");

    // Only a1 should count (worker in z1). c1 is in z2 and should not contribute.
    expect(output.money).toBe(12);
});
