import { expect, test } from "vitest";
import { simulateCitizens } from "../citizens.js";

test("simulateCitizens assigns non-agent citizens to buildings in their zone", () => {
    const state: any = {
        date: 0,
        worldSeed: 0,
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
                name: "Zone One",
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
        },
        nations: {
            n1: {
                id: "n1",
                name: "Nation",
                size: 1,
                governingOrganizationId: "empire-org",
            },
        },
        buildings: {
            b1: {
                id: "b1",
                name: "Factory",
                typeId: "factory",
                zoneId: "z1",
                tileId: "t1",
                intelLevel: 0,
                governingOrganizationId: "empire-org",
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
            a1: {
                id: "a1",
                name: "Agent One",
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
                agentStatus: {
                    job: "scientist",
                    salary: 10,
                },
            },
        },
        governingOrganizations: {
            "empire-org": {
                id: "empire-org",
                name: "Empire",
                intelLevel: 0,
                activeEffectIds: [],
            },
        },
        squads: {},
        plots: {},
        activities: {},
        research: {},
        captives: {},
        effectInstances: {},
        morgues: {
            byCitizen: {},
            byAgent: {},
        },
        empire: {
            id: "empire-org",
            overlordId: "a1",
            petId: "pet-1",
            resources: {
                money: 0,
                science: 0,
                infrastructure: 0,
            },
            evil: {
                actual: 0,
                perceived: 0,
            },
            innerCircleIds: [],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
            unlockedResearchIds: [],
        },
        pendingEvents: [],
        eventLog: [],
    };

    simulateCitizens(state);

    expect(state.persons.c1.employedBuildingId).toBe("b1");
    expect(state.persons.c2.employedBuildingId).toBe("b1");
    expect(state.persons.a1.employedBuildingId).toBeUndefined();
});
