import { test, expect } from "vitest";
import {
    advanceResearch,
    startResearch,
    cancelResearch,
    assignAgentToResearch,
    removeAgentFromResearch,
} from "../research.js";

// ─── Helpers ──────────────────────────────────────────────────────────────────

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

function makeConfig(projectOverrides: Record<string, any> = {}): any {
    return {
        researchProjects: [
            {
                id: "proj-a",
                name: "Project Alpha",
                description: "",
                branch: "military-hardware",
                cost: 100,
                scienceRequired: 10,
                completionDays: 5,
                prerequisites: [],
                skillDrivers: ["science"],
                unlocks: { researchIds: [], activityIds: [], plotIds: [], effectIds: [] },
                ...projectOverrides,
            },
        ],
    };
}

function makeAgent(id: string, skills: Record<string, number> = {}, dead = false): any {
    return {
        id,
        name: id,
        zoneId: "z1",
        homeZoneId: "z1",
        governingOrganizationId: "other",
        attributes: {},
        skills,
        loyalties: {},
        intelLevel: 0,
        health: 100,
        money: 0,
        activeEffectIds: [],
        dead,
        agentStatus: { job: "scientist", salary: 0 },
    };
}

function makeActiveResearch(id: string, projectId: string, overrides: Record<string, any> = {}): any {
    return {
        id,
        projectId,
        assignedAgentIds: [],
        daysRemaining: 5,
        accumulatedScore: 0,
        ...overrides,
    };
}

// ─── advanceResearch ──────────────────────────────────────────────────────────

test("advanceResearch accumulates score from assigned scientist's skill driver", () => {
    const state = makeState();
    state.persons["agent-1"] = makeAgent("agent-1", { science: 5 });
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        assignedAgentIds: ["agent-1"],
        daysRemaining: 3,
    });

    advanceResearch(state, makeConfig());

    expect(state.research["r1"].accumulatedScore).toBe(5);
    expect(state.research["r1"].daysRemaining).toBe(2);
});

test("advanceResearch averages multiple skill drivers", () => {
    const state = makeState();
    state.persons["agent-1"] = makeAgent("agent-1", { science: 6, engineering: 4 });
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        assignedAgentIds: ["agent-1"],
        daysRemaining: 3,
    });
    const config = makeConfig({ skillDrivers: ["science", "engineering"] });

    advanceResearch(state, config);

    expect(state.research["r1"].accumulatedScore).toBe(5);
});

test("advanceResearch skips dead agents", () => {
    const state = makeState();
    state.persons["agent-1"] = makeAgent("agent-1", { science: 10 }, true /* dead */);
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        assignedAgentIds: ["agent-1"],
        daysRemaining: 3,
    });

    advanceResearch(state, makeConfig());

    expect(state.research["r1"].accumulatedScore).toBe(0);
});

test("advanceResearch completes when daysRemaining reaches zero", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        daysRemaining: 1,
        accumulatedScore: 0,
    });
    const config = makeConfig({ scienceRequired: 999 });

    advanceResearch(state, config);

    expect(state.research["r1"]).toBeUndefined();
    expect(state.empire.unlockedResearchIds).toContain("proj-a");
    expect(state.pendingEvents).toHaveLength(1);
    expect(state.pendingEvents[0].category).toBe("informational");
});

test("advanceResearch completes when accumulatedScore reaches scienceRequired", () => {
    const state = makeState();
    state.persons["agent-1"] = makeAgent("agent-1", { science: 2 });
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        assignedAgentIds: ["agent-1"],
        daysRemaining: 99,
        accumulatedScore: 9,
    });
    const config = makeConfig({ scienceRequired: 10 });

    advanceResearch(state, config);

    expect(state.research["r1"]).toBeUndefined();
    expect(state.empire.unlockedResearchIds).toContain("proj-a");
});

test("advanceResearch unlocks plots and activities on completion", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a", { daysRemaining: 1 });
    const config = makeConfig({
        scienceRequired: 999,
        unlocks: { researchIds: [], activityIds: ["act-1"], plotIds: ["plot-1"], effectIds: [] },
    });

    advanceResearch(state, config);

    expect(state.empire.unlockedPlotIds).toContain("plot-1");
    expect(state.empire.unlockedActivityIds).toContain("act-1");
});

test("advanceResearch advances multiple active researches independently", () => {
    const state = makeState();
    state.persons["agent-1"] = makeAgent("agent-1", { science: 3 });
    state.persons["agent-2"] = makeAgent("agent-2", { science: 7 });
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        assignedAgentIds: ["agent-1"],
        daysRemaining: 5,
    });
    // Second project needs its own config entry
    const config: any = {
        researchProjects: [
            ...makeConfig().researchProjects,
            {
                id: "proj-b",
                name: "Project Beta",
                description: "",
                branch: "biology-medicine",
                cost: 50,
                scienceRequired: 20,
                completionDays: 10,
                prerequisites: [],
                skillDrivers: ["science"],
                unlocks: { researchIds: [], activityIds: [], plotIds: [], effectIds: [] },
            },
        ],
    };
    state.research["r2"] = makeActiveResearch("r2", "proj-b", {
        assignedAgentIds: ["agent-2"],
        daysRemaining: 5,
    });

    advanceResearch(state, config);

    expect(state.research["r1"].accumulatedScore).toBe(3);
    expect(state.research["r2"].accumulatedScore).toBe(7);
});

// ─── startResearch ────────────────────────────────────────────────────────────

test("startResearch creates a record and deducts cost", () => {
    const state = makeState();
    state.empire.resources.money = 200;

    startResearch(state, "proj-a", makeConfig());

    const records = Object.values(state.research) as any[];
    expect(records).toHaveLength(1);
    expect(records[0].projectId).toBe("proj-a");
    expect(records[0].daysRemaining).toBe(5);
    expect(records[0].accumulatedScore).toBe(0);
    expect(records[0].assignedAgentIds).toEqual([]);
    expect(state.empire.resources.money).toBe(100);
});

test("startResearch is no-op if project already completed", () => {
    const state = makeState();
    state.empire.unlockedResearchIds = ["proj-a"];

    startResearch(state, "proj-a", makeConfig());

    expect(Object.keys(state.research)).toHaveLength(0);
    expect(state.empire.resources.money).toBe(1000);
});

test("startResearch is no-op if project already active", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a");

    startResearch(state, "proj-a", makeConfig());

    expect(Object.keys(state.research)).toHaveLength(1);
});

test("startResearch is no-op if prerequisites not met", () => {
    const state = makeState();
    const config = makeConfig({ prerequisites: ["proj-b"] });

    startResearch(state, "proj-a", config);

    expect(Object.keys(state.research)).toHaveLength(0);
    expect(state.empire.resources.money).toBe(1000);
});

test("startResearch is no-op if insufficient money", () => {
    const state = makeState();
    state.empire.resources.money = 50;

    startResearch(state, "proj-a", makeConfig());

    expect(Object.keys(state.research)).toHaveLength(0);
    expect(state.empire.resources.money).toBe(50);
});

// ─── cancelResearch ───────────────────────────────────────────────────────────

test("cancelResearch removes the active record", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a");

    cancelResearch(state, "r1");

    expect(state.research["r1"]).toBeUndefined();
});

// ─── assignAgentToResearch / removeAgentFromResearch ─────────────────────────

test("assignAgentToResearch adds agent to record", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a");

    assignAgentToResearch(state, "r1", "agent-1");

    expect(state.research["r1"].assignedAgentIds).toContain("agent-1");
});

test("assignAgentToResearch is idempotent — no duplicates", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a");

    assignAgentToResearch(state, "r1", "agent-1");
    assignAgentToResearch(state, "r1", "agent-1");

    expect(state.research["r1"].assignedAgentIds).toHaveLength(1);
});

test("removeAgentFromResearch removes a specific agent", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        assignedAgentIds: ["agent-1", "agent-2"],
    });

    removeAgentFromResearch(state, "r1", "agent-1");

    expect(state.research["r1"].assignedAgentIds).toEqual(["agent-2"]);
});
