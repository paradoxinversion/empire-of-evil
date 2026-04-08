import { expect, test } from "vitest";
import {
    reassignAgentJob,
    fireAgent,
    terminatePerson,
    createSquadInState,
    renameSquad,
    setSquadHomeZone,
    setSquadStandingOrder,
    addAgentToSquad,
    removeAgentFromSquad,
    setSquadLeader,
    disbandSquad,
    addInnerCircleMember,
    removeInnerCircleMember,
    reorderInnerCircleMembers,
} from "../index.js";

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

test("reassignAgentJob throws when person does not exist", () => {
    const state = makeState();
    expect(() => reassignAgentJob(state, "missing", "operative")).toThrow(
        "Person not found: missing",
    );
});

test("reassignAgentJob throws when person is not an agent", () => {
    const state = makeState({
        persons: {
            c1: {
                id: "c1",
                name: "Civilian",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
            },
        },
    });
    expect(() => reassignAgentJob(state, "c1", "operative")).toThrow(
        "Person is not an agent: c1",
    );
});

test("fireAgent throws when person is not an agent", () => {
    const state = makeState({
        persons: {
            c1: {
                id: "c1",
                name: "Civilian",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: {},
                skills: {},
                loyalties: {},
                intelLevel: 0,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
            },
        },
    });
    expect(() => fireAgent(state, "c1")).toThrow("Person is not an agent: c1");
});

test("terminatePerson is idempotent for already-dead persons", () => {
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
                dead: true,
            },
        },
    });
    expect(() => terminatePerson(state, "a1")).not.toThrow();
    expect(state.persons.a1.dead).toBe(true);
});

test("createSquadInState creates and stores a new squad", () => {
    const state = makeState();

    const squad = createSquadInState(state, { name: "Night Shift" });

    expect(squad.name).toBe("Night Shift");
    expect(state.squads[squad.id]).toEqual(squad);
    expect(squad.memberIds).toEqual([]);
});

test("renameSquad updates squad name", () => {
    const state = makeState({
        squads: {
            s1: { id: "s1", name: "Old Name", memberIds: [] },
        },
    });

    renameSquad(state, "s1", "New Name");

    expect(state.squads.s1.name).toBe("New Name");
});

test("setSquadHomeZone sets valid zone id", () => {
    const state = makeState({
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
                intelLevel: 0,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        squads: {
            s1: { id: "s1", name: "Night Shift", memberIds: [] },
        },
    });

    setSquadHomeZone(state, "s1", "z1");

    expect(state.squads.s1.homeZoneId).toBe("z1");
});

test("setSquadStandingOrder updates standing order", () => {
    const state = makeState({
        squads: {
            s1: { id: "s1", name: "Night Shift", memberIds: [] },
        },
    });

    setSquadStandingOrder(state, "s1", "RUN_RECONNAISSANCE");

    expect(state.squads.s1.standingOrders).toBe("RUN_RECONNAISSANCE");
});

test("addAgentToSquad sets membership and agent squadId", () => {
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
                agentStatus: { job: "operative", salary: 10 },
            },
        },
        squads: {
            s1: { id: "s1", name: "Night Shift", memberIds: [] },
        },
    });

    addAgentToSquad(state, "s1", "a1");

    expect(state.squads.s1.memberIds).toEqual(["a1"]);
    expect(state.persons.a1.agentStatus?.squadId).toBe("s1");
});

test("removeAgentFromSquad removes membership and clears leader and agent squadId", () => {
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
                agentStatus: { job: "operative", salary: 10, squadId: "s1" },
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

    removeAgentFromSquad(state, "s1", "a1");

    expect(state.squads.s1.memberIds).toEqual([]);
    expect(state.squads.s1.leaderId).toBeUndefined();
    expect(state.persons.a1.agentStatus?.squadId).toBeUndefined();
});

test("setSquadLeader requires existing member", () => {
    const state = makeState({
        persons: {
            a1: {
                id: "a1",
                name: "Agent One",
                zoneId: "z1",
                homeZoneId: "z1",
                governingOrganizationId: "empire",
                attributes: { leadership: 70 },
                skills: {},
                loyalties: {},
                intelLevel: 100,
                health: 100,
                money: 0,
                activeEffectIds: [],
                dead: false,
                agentStatus: { job: "operative", salary: 10, squadId: "s1" },
            },
        },
        squads: {
            s1: {
                id: "s1",
                name: "Night Shift",
                memberIds: ["a1"],
            },
        },
    });

    setSquadLeader(state, "s1", "a1");

    expect(state.squads.s1.leaderId).toBe("a1");
});

test("disbandSquad removes squad and clears member squad references", () => {
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
                agentStatus: { job: "operative", salary: 10, squadId: "s1" },
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

    disbandSquad(state, "s1");

    expect(state.squads.s1).toBeUndefined();
    expect(state.persons.a1.agentStatus?.squadId).toBeUndefined();
});

test("addInnerCircleMember enforces uniqueness and agent requirement", () => {
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
                agentStatus: { job: "operative", salary: 10 },
            },
        },
    });

    addInnerCircleMember(state, "a1");
    addInnerCircleMember(state, "a1");

    expect(state.empire.innerCircleIds).toEqual(["a1"]);
});

test("removeInnerCircleMember removes existing member", () => {
    const state = makeState({
        empire: {
            id: "empire",
            overlordId: "",
            petId: "",
            resources: { money: 1000, science: 0, infrastructure: 0 },
            evil: { actual: 0, perceived: 0 },
            innerCircleIds: ["a1", "a2"],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
            unlockedResearchIds: [],
        },
    });

    removeInnerCircleMember(state, "a1");

    expect(state.empire.innerCircleIds).toEqual(["a2"]);
});

test("reorderInnerCircleMembers reorders list exactly", () => {
    const state = makeState({
        empire: {
            id: "empire",
            overlordId: "",
            petId: "",
            resources: { money: 1000, science: 0, infrastructure: 0 },
            evil: { actual: 0, perceived: 0 },
            innerCircleIds: ["a1", "a2", "a3"],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
            unlockedResearchIds: [],
        },
    });

    reorderInnerCircleMembers(state, ["a3", "a1", "a2"]);

    expect(state.empire.innerCircleIds).toEqual(["a3", "a1", "a2"]);
});
