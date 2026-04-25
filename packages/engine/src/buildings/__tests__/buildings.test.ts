import { describe, expect, test } from "vitest";
import type { Config, GameState } from "../../index.js";
import * as engine from "../../index.js";

function createConfig(): Config {
    return {
        tileTypes: {},
        buildings: [
            {
                id: "market-stall",
                name: "Market Stall",
                description: "",
                baseCost: {},
                capacity: 1,
                infrastructureLoad: 1,
                preferredSkills: [],
            },
        ],
        pets: [],
        worldgen: {} as Config["worldgen"],
        activities: [],
        citizenActions: [],
        cpuBehaviors: [],
        events: [],
        effects: [],
        evilTiers: [],
        personAttributes: [],
        plots: [],
        researchProjects: [],
        skills: [],
    };
}

function createState(): GameState {
    return {
        tiles: {},
        zones: {
            z1: {
                id: "z1",
                name: "Zone One",
                nationId: "n1",
                governingOrganizationId: "empire-1",
                tileIds: [],
                buildingIds: ["b1"],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 0,
                taxRate: 0,
                activeEffectIds: [],
            },
        },
        nations: {
            n1: {
                id: "n1",
                name: "Nation One",
                size: 1,
                governingOrganizationId: "empire-1",
            },
        },
        buildings: {
            b1: {
                id: "b1",
                name: "Market One",
                typeId: "market-stall",
                zoneId: "z1",
                intelLevel: 0,
                governingOrganizationId: "empire-1",
                activeEffectIds: [],
            },
        },
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire-1",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: {
                    job: "unassigned",
                    salary: 0,
                },
            },
        },
        governingOrganizations: {
            "empire-1": {
                id: "empire-1",
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
            id: "empire-1",
            overlordId: "a1",
            petId: "a1",
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
        date: 0,
        worldSeed: 1,
        pendingEvents: [],
        eventLog: [],
    };
}

describe("building staffing", () => {
    test("assigns an agent to a building", () => {
        const state = createState();

        (engine as any).assignAgentToBuilding(
            state,
            "b1",
            "a1",
            createConfig(),
        );

        expect((state.buildings.b1 as any).assignedAgentIds).toEqual(["a1"]);
        expect(JSON.parse(JSON.stringify(state)).buildings.b1).toMatchObject({
            id: "b1",
        });
    });

    test("does not assign beyond building capacity", () => {
        const state = createState();
        state.persons.a2 = {
            ...state.persons.a1,
            id: "a2",
            name: "Agent Two",
        };

        (engine as any).assignAgentToBuilding(
            state,
            "b1",
            "a1",
            createConfig(),
        );
        (engine as any).assignAgentToBuilding(
            state,
            "b1",
            "a2",
            createConfig(),
        );

        expect((state.buildings.b1 as any).assignedAgentIds).toEqual(["a1"]);
    });

    test("does not assign an agent already assigned to another operation", () => {
        const state = createState();
        state.plots.p1 = {
            id: "p1",
            plotDefinitionId: "plot-1",
            currentStageIndex: 0,
            assignedAgentIds: ["a1"],
            daysRemaining: 2,
            accumulatedSuccessScore: 0,
            status: "active",
        };

        (engine as any).assignAgentToBuilding(
            state,
            "b1",
            "a1",
            createConfig(),
        );

        expect((state.buildings.b1 as any).assignedAgentIds).toBeUndefined();
    });

    test("removes assigned agents and deletes empty staffing arrays", () => {
        const state = createState();
        state.buildings.b1.assignedAgentIds = ["a1"];

        (engine as any).removeAgentFromBuilding(state, "b1", "a1");

        expect((state.buildings.b1 as any).assignedAgentIds).toBeUndefined();
    });
});
