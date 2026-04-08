import { expect, test } from "vitest";
import { reassignAgentJob, fireAgent, terminatePerson } from "../index.js";

function makeState(overrides: Record<string, unknown> = {}): any {
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

test("reassignAgentJob updates the job for an active agent", () => {
    const state = makeState({
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 100,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "scientist", salary: 10 },
            },
        },
    });

    reassignAgentJob(state, "a1", "operative");

    expect(state.persons.a1.agentStatus.job).toBe("operative");
});

test("fireAgent removes agent status and squad membership", () => {
    const state = makeState({
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 100,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "scientist", salary: 10, squadId: "s1" },
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
                leaderId: "a1",
            },
        },
    });

    fireAgent(state, "a1");

    expect(state.persons.a1.agentStatus).toBeUndefined();
    expect(state.squads.s1.memberIds).toEqual([]);
    expect(state.squads.s1.leaderId).toBeUndefined();
});

test("terminatePerson marks dead and removes active assignments", () => {
    const state = makeState({
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 100,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "troop", salary: 10, squadId: "s1" },
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
            },
        },
        activities: {
            act1: {
                id: "act1",
                activityDefinitionId: "a",
                assignedAgentIds: ["a1"],
                zoneId: "z1",
            },
        },
        plots: {
            p1: {
                id: "p1",
                plotDefinitionId: "p",
                currentStageIndex: 0,
                assignedAgentIds: ["a1"],
                daysRemaining: 1,
                accumulatedSuccessScore: 0,
                status: "active",
            },
        },
        research: {
            r1: {
                id: "r1",
                projectId: "r",
                assignedAgentIds: ["a1"],
                daysRemaining: 1,
                accumulatedScore: 0,
            },
        },
    });

    terminatePerson(state, "a1");

    expect(state.persons.a1.dead).toBe(true);
    expect(state.squads.s1.memberIds).toEqual([]);
    expect(state.activities.act1.assignedAgentIds).toEqual([]);
    expect(state.plots.p1.assignedAgentIds).toEqual([]);
    expect(state.research.r1.assignedAgentIds).toEqual([]);
});
