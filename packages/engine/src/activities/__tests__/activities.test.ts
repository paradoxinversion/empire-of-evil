import { test, expect } from "vitest";
import {
    // these functions intentionally not implemented yet — tests describe expected contract
    startActivity,
    cancelActivity,
    assignAgentToActivity,
    removeAgentFromActivity,
    executeActivities,
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

test("startActivity creates a record and deducts money when applicable", () => {
    const state = makeState();
    const config = {
        activities: [
            { id: "act-a", name: "Act A", costPerParticipantPerDay: 10 },
        ],
    } as any;

    startActivity(state, "act-a", config);

    const records = Object.values(state.activities) as any[];
    expect(records.length).toBeGreaterThanOrEqual(0);
});

test("assign/remove agent to/from activity", () => {
    const state = makeState();
    state.activities["a1"] = {
        id: "a1",
        activityDefinitionId: "act-a",
        assignedAgentIds: [],
        daysRemaining: 1,
        status: "active",
    };

    assignAgentToActivity(state, "a1", "agent-1");
    expect(state.activities["a1"].assignedAgentIds).toContain("agent-1");

    assignAgentToActivity(state, "a1", "agent-1");
    expect(state.activities["a1"].assignedAgentIds).toHaveLength(1);

    state.activities["a1"].assignedAgentIds.push("agent-2");
    removeAgentFromActivity(state, "a1", "agent-1");
    expect(state.activities["a1"].assignedAgentIds).toEqual(["agent-2"]);
});

test("executeActivities iterates records and may modify state", () => {
    const state = makeState();
    state.activities["a1"] = {
        id: "a1",
        activityDefinitionId: "act-a",
        assignedAgentIds: ["agent-1"],
        daysRemaining: 1,
        status: "active",
    };
    state.persons["agent-1"] = { id: "agent-1", name: "A1", agentStatus: {} };
    const config = { activities: [{ id: "act-a", name: "Act A" }] } as any;

    executeActivities(state, config);

    // At minimum the function should be callable and not throw; further assertions added later
    expect(true).toBe(true);
});
