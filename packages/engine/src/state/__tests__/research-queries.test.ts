import { test, expect } from "vitest";
import {
    getResearchProject,
    isResearchCompleted,
    isResearchActive,
    isResearchAvailable,
    getResearchProgressPct,
} from "../queries.js";

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

// ─── getResearchProject ───────────────────────────────────────────────────────

test("getResearchProject returns the definition when found", () => {
    const result = getResearchProject(makeConfig(), "proj-a");
    expect(result.id).toBe("proj-a");
    expect(result.name).toBe("Project Alpha");
});

test("getResearchProject throws when project not found", () => {
    expect(() => getResearchProject(makeConfig(), "missing")).toThrow();
});

// ─── isResearchCompleted ──────────────────────────────────────────────────────

test("isResearchCompleted returns true when project is in unlockedResearchIds", () => {
    const state = makeState();
    state.empire.unlockedResearchIds = ["proj-a"];
    expect(isResearchCompleted(state, "proj-a")).toBe(true);
});

test("isResearchCompleted returns false when project is not in unlockedResearchIds", () => {
    expect(isResearchCompleted(makeState(), "proj-a")).toBe(false);
});

// ─── isResearchActive ─────────────────────────────────────────────────────────

test("isResearchActive returns true when an active record exists for the project", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a");
    expect(isResearchActive(state, "proj-a")).toBe(true);
});

test("isResearchActive returns false when no active record exists", () => {
    expect(isResearchActive(makeState(), "proj-a")).toBe(false);
});

// ─── isResearchAvailable ──────────────────────────────────────────────────────

test("isResearchAvailable returns true for a project with no prerequisites that is not active or completed", () => {
    expect(isResearchAvailable(makeState(), makeConfig(), "proj-a")).toBe(true);
});

test("isResearchAvailable returns false when already completed", () => {
    const state = makeState();
    state.empire.unlockedResearchIds = ["proj-a"];
    expect(isResearchAvailable(state, makeConfig(), "proj-a")).toBe(false);
});

test("isResearchAvailable returns false when already active", () => {
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a");
    expect(isResearchAvailable(state, makeConfig(), "proj-a")).toBe(false);
});

test("isResearchAvailable returns false when prerequisites not met", () => {
    const state = makeState();
    const config = makeConfig({ prerequisites: ["proj-b"] });
    expect(isResearchAvailable(state, config, "proj-a")).toBe(false);
});

// ─── getResearchProgressPct ───────────────────────────────────────────────────

test("getResearchProgressPct returns 0 when research ID not found", () => {
    expect(getResearchProgressPct(makeState(), makeConfig(), "missing")).toBe(0);
});

test("getResearchProgressPct returns day-based progress when score is zero", () => {
    // completionDays: 5, daysRemaining: 3 → elapsed = 2 → 2/5 = 40%
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        daysRemaining: 3,
        accumulatedScore: 0,
    });
    const config = makeConfig({ completionDays: 5, scienceRequired: 100 });

    expect(getResearchProgressPct(state, config, "r1")).toBe(40);
});

test("getResearchProgressPct returns score-based progress when score is higher than day-based", () => {
    // daysRemaining: 4, completionDays: 5 → day-based = 20%
    // accumulatedScore: 8, scienceRequired: 10 → score-based = 80%
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        daysRemaining: 4,
        accumulatedScore: 8,
    });
    const config = makeConfig({ completionDays: 5, scienceRequired: 10 });

    expect(getResearchProgressPct(state, config, "r1")).toBe(80);
});

test("getResearchProgressPct clamps to 100", () => {
    // accumulatedScore exceeds scienceRequired
    const state = makeState();
    state.research["r1"] = makeActiveResearch("r1", "proj-a", {
        daysRemaining: 0,
        accumulatedScore: 20,
    });
    const config = makeConfig({ completionDays: 5, scienceRequired: 10 });

    expect(getResearchProgressPct(state, config, "r1")).toBe(100);
});
