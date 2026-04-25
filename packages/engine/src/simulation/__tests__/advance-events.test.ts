import { describe, test, expect, vi } from "vitest";
import { advanceTime } from "../advance.js";
import type { GameState } from "../../types/index.js";
import type { Config } from "../../config/loader.js";

function makeState(overrides: Partial<GameState> = {}): GameState {
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
            resources: { money: 500, science: 0, infrastructure: 0 },
            evil: { actual: 0, perceived: 0 },
            innerCircleIds: [],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
            unlockedResearchIds: [],
        },
        date: 0,
        worldSeed: 42,
        pendingEvents: [],
        eventLog: [],
        ...overrides,
    };
}

function makeConfig(events: Config["events"] = []): Config {
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

describe("advanceTime event interruption", () => {
    test("yields interrupted when a blocking event fires, and does not advance further", () => {
        const state = makeState();
        const config = makeConfig([
            {
                id: "blocking-event",
                category: "player_choice",
                presentationTier: "event",
                informationTier: "news_feed",
                title: "Stop Here",
                body: "This event must be resolved before continuing.",
                requiresResolution: true,
                recurrence: "recurring",
                trigger: { type: "daily_chance", chance: 1 },
                choices: [{ label: "OK", effects: [] }],
            },
        ]);

        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
        const gen = advanceTime(state, 5, config);

        const first = gen.next();
        randomSpy.mockRestore();

        expect(first.value).toMatchObject({ type: "interrupted" });
        expect(first.done).toBe(false);

        // After interruption, generator should be exhausted (returned)
        const second = gen.next();
        expect(second.done).toBe(true);

        // State should have advanced only one day
        expect(state.date).toBe(1);
        expect(state.pendingEvents).toHaveLength(1);
        expect(state.pendingEvents[0].title).toBe("Stop Here");
    });

    test("yields day_complete and continues when only non-blocking events fire", () => {
        const state = makeState();
        const config = makeConfig([
            {
                id: "feed-only",
                category: "informational",
                presentationTier: "notification",
                informationTier: "news_feed",
                title: "Nothing Notable",
                body: "Informational only; no resolution required.",
                requiresResolution: false,
                recurrence: "recurring",
                trigger: { type: "daily_chance", chance: 1 },
            },
        ]);

        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
        const gen = advanceTime(state, 3, config);

        const results: ReturnType<typeof gen.next>[] = [];
        for (const result of gen) {
            results.push({ value: result, done: false });
        }
        randomSpy.mockRestore();

        expect(results).toHaveLength(3);
        expect(results.every((r) => r.value.type === "day_complete")).toBe(
            true,
        );
        expect(state.date).toBe(3);
        // All events went to the log, none blocked the sim
        expect(state.pendingEvents).toHaveLength(0);
        expect(state.eventLog.length).toBeGreaterThanOrEqual(3);
    });

    test("interrupted result carries the pending interrupt events", () => {
        const state = makeState();
        const config = makeConfig([
            {
                id: "alert-event",
                category: "player_choice",
                presentationTier: "event",
                informationTier: "intelligence_report",
                title: "Alert",
                body: "Something happened.",
                requiresResolution: true,
                recurrence: "recurring",
                trigger: { type: "daily_chance", chance: 1 },
                choices: [{ label: "Acknowledge", effects: [] }],
            },
        ]);

        const randomSpy = vi.spyOn(Math, "random").mockReturnValue(0);
        const result = advanceTime(state, 5, config).next();
        randomSpy.mockRestore();

        expect(result.value).toMatchObject({ type: "interrupted" });
        const interrupted = result.value as {
            type: "interrupted";
            events: unknown[];
        };
        expect(interrupted.events).toHaveLength(1);
        expect(interrupted.events[0]).toMatchObject({
            title: "Alert",
            requiresResolution: true,
        });
    });
});
