import { describe, expect, test } from "vitest";

import { applyEffect } from "../../effects/apply.js";
import { effectResolvers } from "../resolve.js";
import type { GameState, Person } from "../../types/index.js";

function makeState(overrides: Partial<GameState> = {}): GameState {
    const state: GameState = {
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
        morgues: {
            byCitizen: {},
            byAgent: {},
        },
        empire: {
            id: "empire",
            overlordId: "",
            petId: "",
            resources: {
                money: 100,
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
        date: 5,
        worldSeed: 42,
        pendingEvents: [],
        eventLog: [],
    };

    return {
        ...state,
        ...overrides,
    };
}

function makeActor(overrides: Partial<Person> = {}): Person {
    return {
        id: "agent-1",
        name: "Agent One",
        zoneId: "zone-a",
        homeZoneId: "zone-a",
        governingOrganizationId: "empire",
        attributes: {},
        skills: {},
        loyalties: { empire: 10 },
        intelLevel: 0,
        health: 100,
        money: 0,
        activeEffectIds: [],
        dead: false,
        agentStatus: {
            job: "operative",
            salary: 0,
        },
        ...overrides,
    };
}

describe("event resolver registry ownership", () => {
    test("exports effect resolver map from events/resolve", () => {
        expect(effectResolvers.gain_resource).toBeTypeOf("function");
        expect(effectResolvers.civilian_combat_encounter).toBeTypeOf(
            "function",
        );
    });

    test("applyEffect still resolves via moved registry", () => {
        const actor = makeActor();
        const state = makeState({ persons: { [actor.id]: actor } });

        applyEffect(
            {
                type: "civilian_combat_encounter",
                chance: 1,
                parameters: { baseEnemyCount: 3 },
            },
            { state, actor },
        );

        expect(state.pendingEvents).toHaveLength(1);
        expect(state.pendingEvents[0].category).toBe("combat");
    });
});
