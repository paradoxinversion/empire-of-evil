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
                governingOrganizationId: "other",
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
