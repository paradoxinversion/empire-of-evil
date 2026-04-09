import { test, expect } from "vitest";
import { settleResources } from "../day.js";

test("settleResources applies building income/upkeep only for buildings on empire-controlled tiles", () => {
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
                name: "Z1",
                nationId: "n1",
                governingOrganizationId: "other",
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
                name: "Z2",
                nationId: "n1",
                governingOrganizationId: "empire-org",
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
            // Placed on tile t2 (in empire-controlled zone z2)
            b1: {
                id: "b1",
                name: "B1",
                typeId: "bt1",
                zoneId: "z1",
                tileId: "t2",
                intelLevel: 0,
                governingOrganizationId: "empire-org",
                activeEffectIds: [],
            },
            // Placed on tile t1 (in non-empire zone z1)
            b2: {
                id: "b2",
                name: "B2",
                typeId: "bt2",
                zoneId: "z1",
                tileId: "t1",
                intelLevel: 0,
                governingOrganizationId: "other",
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
            id: "empire-org",
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
                id: "bt1",
                name: "BT1",
                description: "",
                baseCost: {},
                infrastructureLoad: 1,
                preferredSkills: [],
                resourceOutput: { money: 10 },
                upkeepPerDay: 2,
            },
            {
                id: "bt2",
                name: "BT2",
                description: "",
                baseCost: {},
                infrastructureLoad: 1,
                preferredSkills: [],
                resourceOutput: { money: 7 },
                upkeepPerDay: 1,
            },
        ],
    };

    // Precondition: empire money is zero
    expect(state.empire.resources.money).toBe(0);

    settleResources(state, config);

    // Only b1 is on empire-controlled tile (t2 -> z2), so net change should be bt1.money - bt1.upkeep
    expect(state.empire.resources.money).toBe(10 - 2);
});

test("settleResources collects citizen taxes from empire-controlled zones using employment status", () => {
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
                name: "Empire Zone",
                nationId: "n1",
                governingOrganizationId: "empire-org",
                tileIds: ["t1"],
                buildingIds: ["b1"],
                generationWealth: 0,
                economicOutput: 0,
                population: 3,
                intelLevel: 0,
                taxRate: 0.1,
                activeEffectIds: [],
            },
            z2: {
                id: "z2",
                name: "Foreign Zone",
                nationId: "n1",
                governingOrganizationId: "other-org",
                tileIds: ["t2"],
                buildingIds: ["b2"],
                generationWealth: 0,
                economicOutput: 0,
                population: 2,
                intelLevel: 0,
                taxRate: 0.3,
                activeEffectIds: [],
            },
        },
        buildings: {
            b1: {
                id: "b1",
                name: "Factory",
                typeId: "bt1",
                zoneId: "z1",
                tileId: "t1",
                intelLevel: 0,
                governingOrganizationId: "empire-org",
                activeEffectIds: [],
            },
            b2: {
                id: "b2",
                name: "Foreign Factory",
                typeId: "bt1",
                zoneId: "z2",
                tileId: "t2",
                intelLevel: 0,
                governingOrganizationId: "other-org",
                activeEffectIds: [],
            },
        },
        persons: {
            c1: {
                id: "c1",
                name: "Citizen One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire-org",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                employedBuildingId: "b1",
            },
            c2: {
                id: "c2",
                name: "Citizen Two",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire-org",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
            },
            c3: {
                id: "c3",
                name: "Citizen Three",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire-org",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
            },
            c4: {
                id: "c4",
                name: "Foreign Citizen",
                zoneId: "z2",
                homeZoneId: "z2",
                governingOrganizationId: "other-org",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                employedBuildingId: "b2",
            },
        },
        governingOrganizations: {},
        squads: {},
        plots: {},
        activities: {},
        research: {},
        captives: {},
        effectInstances: {},
        morgues: { byCitizen: {}, byAgent: {} },
        empire: {
            id: "empire-org",
            overlordId: "",
            petId: "",
            resources: { money: 0, science: 0, infrastructure: 0 },
            evil: { actual: 0, perceived: 0 },
            innerCircleIds: [],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
            unlockedResearchIds: [],
        },
        date: 0,
        worldSeed: 0,
        pendingEvents: [],
        eventLog: [],
    };

    const config: any = {
        buildings: [
            {
                id: "bt1",
                name: "Factory",
                description: "",
                baseCost: {},
                infrastructureLoad: 1,
                preferredSkills: [],
                resourceOutput: { money: 0 },
                upkeepPerDay: 0,
            },
        ],
    };

    settleResources(state, config);

    // Expected tax basis in z1:
    // employed citizen (1 * 10) + unemployed citizens (2 * 5) = 20 economic output
    // tax = 20 * 0.1 = 2
    expect(state.empire.resources.money).toBe(2);
});
