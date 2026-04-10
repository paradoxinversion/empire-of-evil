import { describe, expect, test } from "vitest";

import { applyEffect } from "../../effects/apply.js";
import { effectResolvers, resolveEvent } from "../resolve.js";
import type { GameState, Person, Zone } from "../../types/index.js";

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

function makeZone(overrides: Partial<Zone> = {}): Zone {
    return {
        id: "zone-a",
        name: "Zone A",
        nationId: "nation-1",
        governingOrganizationId: "empire",
        tileIds: [],
        buildingIds: [],
        generationWealth: 0,
        economicOutput: 0,
        population: 100,
        intelLevel: 0,
        taxRate: 0,
        activeEffectIds: [],
        ...overrides,
    };
}

describe("create_captive effect resolver", () => {
    test("does nothing when no empire zones exist", () => {
        const state = makeState({
            zones: {
                "zone-foreign": makeZone({
                    id: "zone-foreign",
                    governingOrganizationId: "foreign-org",
                }),
            },
        });

        effectResolvers.create_captive({ state }, {});

        expect(Object.keys(state.persons)).toHaveLength(0);
        expect(Object.keys(state.captives)).toHaveLength(0);
    });

    test("adds a new person to state.persons when an empire zone exists", () => {
        const empireZone = makeZone({ id: "zone-empire" });
        const state = makeState({ zones: { "zone-empire": empireZone } });

        effectResolvers.create_captive({ state }, {});

        expect(Object.keys(state.persons)).toHaveLength(1);
        expect(Object.values(state.persons)[0].name).toBe("Foreign Operative");
    });

    test("adds a new captive to state.captives with correct date and zone", () => {
        const empireZone = makeZone({ id: "zone-empire" });
        const state = makeState({
            zones: { "zone-empire": empireZone },
            date: 42,
        });

        effectResolvers.create_captive({ state }, {});

        const captives = Object.values(state.captives);
        expect(captives).toHaveLength(1);
        expect(captives[0].capturedOnDate).toBe(42);
        expect(captives[0].zoneId).toBe("zone-empire");
    });

    test("captive personId references the newly created person", () => {
        const empireZone = makeZone({ id: "zone-empire" });
        const state = makeState({ zones: { "zone-empire": empireZone } });

        effectResolvers.create_captive({ state }, {});

        const captive = Object.values(state.captives)[0];
        expect(state.persons[captive.personId]).toBeDefined();
        expect(state.persons[captive.personId].name).toBe("Foreign Operative");
    });

    test("resolveEvent with 'Keep Captive' choice adds a captive to state", () => {
        const empireZone = makeZone({ id: "zone-empire" });
        const state = makeState({ zones: { "zone-empire": empireZone } });

        state.pendingEvents.push({
            id: "test-espionage-1",
            category: "player_choice",
            title: "Attempted Espionage",
            body: "...",
            relatedEntityIds: [],
            requiresResolution: true,
            createdOnDate: 1,
            choices: [
                {
                    label: "TERMINATE",
                    effects: [
                        {
                            type: "gain_evil",
                            chance: 1,
                            parameters: { amount: 5 },
                        },
                    ],
                },
                {
                    label: "Keep Captive",
                    effects: [
                        { type: "create_captive", chance: 1, parameters: {} },
                    ],
                },
                {
                    label: "Release",
                    effects: [
                        {
                            type: "gain_evil",
                            chance: 1,
                            parameters: { amount: -2 },
                        },
                    ],
                },
            ],
        });

        resolveEvent(state, "test-espionage-1", 1);

        expect(Object.keys(state.captives)).toHaveLength(1);
    });
});
