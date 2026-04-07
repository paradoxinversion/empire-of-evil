import { test, expect } from "vitest";
import {
    advancePlots,
    startPlot,
    cancelPlot,
    assignAgentToPlot,
    removeAgentFromPlot,
} from "../index.js";

function makeState(overrides: Record<string, any> = {}): any {
    return {
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
            overlordId: "",
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
    };
}

function makeConfig(plotOverrides: Record<string, any> = {}): any {
    return {
        plots: [
            {
                id: "plot-a",
                name: "Plot A",
                description: "",
                tier: 1,
                evilCategory: "cartoonish",
                category: "test",
                requirements: {
                    agentCount: 1,
                    zoneCount: 0,
                    resourceCosts: { money: 100 },
                    researchIds: [],
                },
                durationDays: 5,
                stages: [{ name: "Stage 1", durationDays: 5 }],
                ...plotOverrides,
            },
        ],
    };
}

test("startPlot creates a record and deducts money", () => {
    const state = makeState();
    const config = makeConfig();

    startPlot(state, "plot-a", config as any);

    const records = Object.values(state.plots) as any[];
    expect(records).toHaveLength(1);
    expect(records[0].plotDefinitionId).toBe("plot-a");
    expect(records[0].assignedAgentIds).toEqual([]);
    expect(records[0].daysRemaining).toBe(5);
    expect(state.empire.resources.money).toBe(900);
});

test("startPlot is no-op if prerequisites not met", () => {
    const state = makeState();
    const config = makeConfig({
        requirements: {
            researchIds: ["r-x"],
            agentCount: 1,
            zoneCount: 0,
            resourceCosts: { money: 0 },
        },
    });

    startPlot(state, "plot-a", config as any);

    expect(Object.keys(state.plots)).toHaveLength(0);
});

test("startPlot is no-op if insufficient money", () => {
    const state = makeState();
    state.empire.resources.money = 50;
    const config = makeConfig();

    startPlot(state, "plot-a", config as any);

    expect(Object.keys(state.plots)).toHaveLength(0);
    expect(state.empire.resources.money).toBe(50);
});

test("cancelPlot removes the active record", () => {
    const state = makeState();
    state.plots["p1"] = {
        id: "p1",
        plotDefinitionId: "plot-a",
        currentStageIndex: 0,
        assignedAgentIds: [],
        daysRemaining: 3,
        accumulatedSuccessScore: 0,
        status: "active",
    };

    cancelPlot(state, "p1");

    expect(state.plots["p1"]).toBeUndefined();
});

test("assign/remove agent to/from plot", () => {
    const state = makeState();
    state.plots["p1"] = {
        id: "p1",
        plotDefinitionId: "plot-a",
        currentStageIndex: 0,
        assignedAgentIds: [],
        daysRemaining: 3,
        accumulatedSuccessScore: 0,
        status: "active",
    };

    assignAgentToPlot(state, "p1", "a1");
    expect(state.plots["p1"].assignedAgentIds).toContain("a1");

    assignAgentToPlot(state, "p1", "a1");
    expect(state.plots["p1"].assignedAgentIds).toHaveLength(1);

    state.plots["p1"].assignedAgentIds.push("a2");
    removeAgentFromPlot(state, "p1", "a1");
    expect(state.plots["p1"].assignedAgentIds).toEqual(["a2"]);
});

test("advancePlots decrements days and completes plots when days reach zero", () => {
    const state = makeState();
    state.plots["p1"] = {
        id: "p1",
        plotDefinitionId: "plot-a",
        currentStageIndex: 0,
        assignedAgentIds: [],
        daysRemaining: 1,
        accumulatedSuccessScore: 0,
        status: "active",
    };
    const config = makeConfig();

    advancePlots(state, config as any);

    expect(state.plots["p1"]).toBeUndefined();
    expect(state.pendingEvents).toHaveLength(1);
    expect(state.pendingEvents[0].category).toBe("informational");
});
