import { describe, expect, test, vi } from "vitest";

import { generateEvents } from "../generators/index.js";
import { resolveEvent } from "../resolve.js";
import type { GameState } from "../../types/index.js";
import type { Config } from "../../config/loader.js";

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

function makeConfig(events: Config["events"]): Config {
    return {
        tileTypes: {},
        buildings: [],
        pets: [],
        worldgen: {
            mapWidth: 4,
            mapHeight: 4,
            minZoneSize: 1,
            maxZoneSize: 4,
            nationCount: 1,
            zonesPerNation: 3,
            populationDensity: 0.1,
            maxBuildingsPerZone: 1,
        },
        activities: [],
        citizenActions: [],
        cpuBehaviors: [],
        events,
        effects: [],
        evilTiers: [],
        personAttributes: [],
        plots: [],
        researchProjects: [],
        skills: [],
    };
}

describe("generateEvents", () => {
    test("creates an interrupt event from daily_chance trigger", () => {
        const state = makeState();
        const config = makeConfig([
            {
                id: "daily-test",
                category: "informational",
                presentationTier: "notification",
                informationTier: "news_feed",
                title: "Daily Test",
                body: "Daily event fired",
                requiresResolution: true,
                recurrence: "recurring",
                trigger: {
                    type: "daily_chance",
                    chance: 1,
                },
            },
        ]);

        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

        generateEvents(state, config);

        expect(state.pendingEvents).toHaveLength(1);
        expect(state.pendingEvents[0].title).toBe("Daily Test");
        expect(state.eventLog).toHaveLength(0);

        randomSpy.mockRestore();
    });

    test("adds non-blocking events to the event log instead of pending", () => {
        const state = makeState();
        const config = makeConfig([
            {
                id: "uneventful-day",
                category: "informational",
                presentationTier: "notification",
                informationTier: "news_feed",
                title: "Uneventful Day",
                body: "Nothing happened.",
                requiresResolution: false,
                recurrence: "recurring",
                trigger: {
                    type: "daily_chance",
                    chance: 1,
                },
            },
        ]);

        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

        generateEvents(state, config);

        expect(state.pendingEvents).toHaveLength(0);
        expect(state.eventLog).toHaveLength(1);
        expect(state.eventLog[0].event.title).toBe("Uneventful Day");
        expect(state.eventLog[0].resolvedOnDate).toBe(state.date);

        randomSpy.mockRestore();
    });

    test("does not re-fire a once event that is already pending", () => {
        const state = makeState({
            pendingEvents: [
                {
                    id: "only-once-5-0",
                    definitionId: "only-once",
                    category: "informational",
                    title: "Only Once",
                    body: "Already active",
                    relatedEntityIds: [],
                    requiresResolution: false,
                    createdOnDate: 5,
                },
            ],
        });

        const config = makeConfig([
            {
                id: "only-once",
                category: "informational",
                presentationTier: "notification",
                informationTier: "news_feed",
                title: "Only Once",
                body: "Should not duplicate",
                requiresResolution: false,
                recurrence: "once",
                trigger: {
                    type: "daily_chance",
                    chance: 1,
                },
            },
        ]);

        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);

        generateEvents(state, config);

        expect(state.pendingEvents).toHaveLength(1);
        expect(state.pendingEvents[0].id).toBe("only-once-5-0");

        randomSpy.mockRestore();
    });

    test("fires evil_perceived_at_least trigger when perceived evil meets threshold", () => {
        const state = makeState({
            empire: {
                id: "empire",
                overlordId: "",
                petId: "",
                resources: { money: 100, science: 0, infrastructure: 0 },
                evil: { actual: 30, perceived: 25 },
                innerCircleIds: [],
                unlockedPlotIds: [],
                unlockedActivityIds: [],
                unlockedResearchIds: [],
            },
        });

        const config = makeConfig([
            {
                id: "evil-tier-irritant",
                category: "evil_tier",
                presentationTier: "landmark",
                informationTier: "news_feed",
                title: "They're Calling Us What?",
                body: "The world has noticed.",
                requiresResolution: true,
                recurrence: "once",
                trigger: {
                    type: "evil_perceived_at_least",
                    threshold: 20,
                },
            },
        ]);

        generateEvents(state, config);

        expect(state.pendingEvents).toHaveLength(1);
        expect(state.pendingEvents[0].definitionId).toBe("evil-tier-irritant");
    });

    test("does not fire evil_perceived_at_least trigger when below threshold", () => {
        const state = makeState({
            empire: {
                id: "empire",
                overlordId: "",
                petId: "",
                resources: { money: 100, science: 0, infrastructure: 0 },
                evil: { actual: 5, perceived: 10 },
                innerCircleIds: [],
                unlockedPlotIds: [],
                unlockedActivityIds: [],
                unlockedResearchIds: [],
            },
        });

        const config = makeConfig([
            {
                id: "evil-tier-irritant",
                category: "evil_tier",
                presentationTier: "landmark",
                informationTier: "news_feed",
                title: "They're Calling Us What?",
                body: "The world has noticed.",
                requiresResolution: true,
                recurrence: "once",
                trigger: {
                    type: "evil_perceived_at_least",
                    threshold: 20,
                },
            },
        ]);

        generateEvents(state, config);

        expect(state.pendingEvents).toHaveLength(0);
    });

    test("fires resource_below trigger when threshold is crossed", () => {
        const state = makeState({
            empire: {
                id: "empire",
                overlordId: "",
                petId: "",
                resources: {
                    money: 50,
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
        });

        const config = makeConfig([
            {
                id: "low-money",
                category: "informational",
                presentationTier: "notification",
                informationTier: "intelligence_report",
                title: "Low Money",
                body: "Money is low",
                requiresResolution: true,
                recurrence: "recurring",
                trigger: {
                    type: "resource_below",
                    resource: "money",
                    threshold: 100,
                },
            },
        ]);

        generateEvents(state, config);

        expect(state.pendingEvents).toHaveLength(1);
        expect(state.pendingEvents[0].definitionId).toBe("low-money");
    });
});

describe("resolveEvent", () => {
    test("applies selected choice effects and logs resolution", () => {
        const state = makeState({
            pendingEvents: [
                {
                    id: "event-1",
                    definitionId: "choice-event",
                    category: "player_choice",
                    title: "Choose",
                    body: "Pick one",
                    relatedEntityIds: [],
                    requiresResolution: true,
                    choices: [
                        {
                            label: "Gain Money",
                            effects: [
                                {
                                    type: "gain_resource",
                                    chance: 1,
                                    parameters: {
                                        resource: "money",
                                        minAmount: 25,
                                        maxAmount: 25,
                                    },
                                },
                            ],
                        },
                    ],
                    createdOnDate: 5,
                },
            ],
        });

        resolveEvent(state, "event-1", 0);

        expect(state.pendingEvents).toHaveLength(0);
        expect(state.eventLog).toHaveLength(1);
        expect(state.eventLog[0].event.id).toBe("event-1");
        expect(state.eventLog[0].choiceIndex).toBe(0);
        expect(state.empire.resources.money).toBe(125);
    });
});
