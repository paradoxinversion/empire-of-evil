import { expect, test } from "vitest";
import { executeStandingOrders } from "../day.js";

const makeState = (overrides: Record<string, unknown> = {}): any => ({
    tiles: {},
    zones: {},
    nations: {},
    buildings: {},
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
        overlordId: "overlord-1",
        petId: "",
        resources: { money: 1000, science: 0, infrastructure: 0 },
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
    ...overrides,
});

const makeAgent = (id: string, zoneId: string) => ({
    id,
    name: id,
    zoneId,
    homeZoneId: zoneId,
    governingOrganizationId: "empire",
    attributes: { leadership: 70 },
    skills: {},
    loyalties: {},
    intelLevel: 100,
    health: 100,
    money: 0,
    activeEffectIds: [],
    dead: false,
    agentStatus: { job: "operative", salary: 10 },
});

test("DEFEND_ZONE increases home zone intel", () => {
    const state = makeState({
        persons: {
            "overlord-1": makeAgent("overlord-1", "z1"),
            a1: makeAgent("a1", "z1"),
        },
        zones: {
            z1: {
                id: "z1",
                name: "Capital",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: [],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 10,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
                homeZoneId: "z1",
                standingOrders: "DEFEND_ZONE",
            },
        },
    });

    executeStandingOrders(state);

    expect(state.zones.z1.intelLevel).toBe(11);
});

test("RUN_RECONNAISSANCE gives higher intel gain", () => {
    const state = makeState({
        persons: {
            "overlord-1": makeAgent("overlord-1", "z1"),
            a1: makeAgent("a1", "z1"),
        },
        zones: {
            z1: {
                id: "z1",
                name: "Capital",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: [],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 10,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
                homeZoneId: "z1",
                standingOrders: "RUN_RECONNAISSANCE",
            },
        },
    });

    executeStandingOrders(state);

    expect(state.zones.z1.intelLevel).toBe(12);
});

test("MAINTAIN_ACTIVITY assigns available squad member to zone activity", () => {
    const state = makeState({
        persons: {
            "overlord-1": makeAgent("overlord-1", "z1"),
            a1: makeAgent("a1", "z1"),
        },
        zones: {
            z1: {
                id: "z1",
                name: "Capital",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: [],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 10,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        activities: {
            act1: {
                id: "act1",
                activityDefinitionId: "smuggling",
                assignedAgentIds: [],
                zoneId: "z1",
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
                homeZoneId: "z1",
                standingOrders: "MAINTAIN_ACTIVITY",
            },
        },
    });

    executeStandingOrders(state);

    expect(state.activities.act1.assignedAgentIds).toEqual(["a1"]);
});

test("ESCORT_OVERLORD moves overlord to squad home zone", () => {
    const state = makeState({
        persons: {
            "overlord-1": makeAgent("overlord-1", "z1"),
            a1: makeAgent("a1", "z2"),
        },
        zones: {
            z1: {
                id: "z1",
                name: "Capital",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: [],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 10,
                taxRate: 0.1,
                activeEffectIds: [],
            },
            z2: {
                id: "z2",
                name: "Outlands",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: [],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 0,
                intelLevel: 10,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
                homeZoneId: "z2",
                standingOrders: "ESCORT_OVERLORD",
            },
        },
    });

    executeStandingOrders(state);

    expect(state.persons["overlord-1"].zoneId).toBe("z2");
});
