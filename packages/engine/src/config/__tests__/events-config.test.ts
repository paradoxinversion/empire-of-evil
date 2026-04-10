import { describe, expect, test } from "vitest";
import { mkdtempSync, cpSync, writeFileSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { tmpdir } from "node:os";

import { loadConfig } from "../loader.js";
import { EventsSchema } from "../schemas/index.js";

const repoRoot = resolve(process.cwd(), "../..");
const defaultConfigDir = join(repoRoot, "config/default");

const VALID_EVENT = {
    id: "citizen-recruited",
    category: "player_choice",
    presentationTier: "event",
    informationTier: "intelligence_report",
    title: "Citizen Recruited",
    body: "A citizen has been flagged as a potential recruit.",
    requiresResolution: true,
    recurrence: "recurring",
    trigger: {
        type: "daily_chance",
        chance: 0.3,
    },
    choices: [
        {
            label: "Recruit",
            effects: [],
        },
        {
            label: "Ignore",
            effects: [],
        },
    ],
};

describe("events config schema", () => {
    test("parses a valid event definition", () => {
        const parsed = EventsSchema.parse([VALID_EVENT]);
        expect(parsed).toHaveLength(1);
        expect(parsed[0].id).toBe("citizen-recruited");
    });

    test("accepts event effects that are currently supported by resolvers", () => {
        const parsed = EventsSchema.parse([
            {
                ...VALID_EVENT,
                choices: [
                    {
                        label: "Apply Effects",
                        effects: [
                            {
                                type: "gain_evil",
                                chance: 1,
                                parameters: { amount: 1 },
                            },
                            {
                                type: "gain_resource",
                                chance: 1,
                                parameters: {
                                    resource: "money",
                                    minAmount: -10,
                                    maxAmount: -10,
                                },
                            },
                            {
                                type: "create_captive",
                                chance: 1,
                                parameters: {},
                            },
                        ],
                    },
                ],
            },
        ]);

        expect(parsed).toHaveLength(1);
    });

    test("rejects unknown event effect types", () => {
        expect(() =>
            EventsSchema.parse([
                {
                    ...VALID_EVENT,
                    choices: [
                        {
                            label: "Broken",
                            effects: [
                                {
                                    type: "unknown_effect_type",
                                    chance: 1,
                                    parameters: {},
                                },
                            ],
                        },
                    ],
                },
            ]),
        ).toThrow();
    });

    test("rejects unknown top-level fields", () => {
        expect(() =>
            EventsSchema.parse([
                {
                    ...VALID_EVENT,
                    accidentalExtraField: "not-allowed",
                },
            ]),
        ).toThrow();
    });

    test("rejects invalid trigger payloads for discriminated trigger types", () => {
        expect(() =>
            EventsSchema.parse([
                {
                    ...VALID_EVENT,
                    trigger: {
                        type: "resource_below",
                        resource: "money",
                    },
                },
            ]),
        ).toThrow();
    });
});

describe("config loader events integration", () => {
    test("loads events from default config", () => {
        const config = loadConfig(defaultConfigDir);
        expect(Array.isArray(config.events)).toBe(true);
        expect(config.events.length).toBeGreaterThan(0);
    });

    test("fails loadConfig when events.json is malformed", () => {
        const tempDir = mkdtempSync(join(tmpdir(), "eoe-events-config-"));
        cpSync(defaultConfigDir, tempDir, { recursive: true });

        writeFileSync(
            join(tempDir, "events.json"),
            JSON.stringify([
                {
                    id: "broken-event",
                    category: "informational",
                    presentationTier: "notification",
                    informationTier: "news_feed",
                    title: "Broken",
                    body: "Missing trigger",
                    requiresResolution: false,
                    recurrence: "once",
                },
            ]),
            "utf-8",
        );

        expect(() => loadConfig(tempDir)).toThrow();
    });

    test("fails loadConfig when an event effect type is unknown", () => {
        const tempDir = mkdtempSync(join(tmpdir(), "eoe-events-config-"));
        cpSync(defaultConfigDir, tempDir, { recursive: true });

        const eventsPath = join(tempDir, "events.json");
        const events = JSON.parse(readFileSync(eventsPath, "utf-8")) as Array<{
            choices?: Array<{
                effects: Array<{ type: string; chance: number }>;
            }>;
        }>;

        const eventWithChoices = events.find(
            (event) => event.choices && event.choices.length > 0,
        );
        if (!eventWithChoices || !eventWithChoices.choices) {
            throw new Error(
                "Expected default events config to include choices",
            );
        }

        eventWithChoices.choices[0].effects = [
            {
                type: "unknown_effect_type",
                chance: 1,
            },
        ];

        writeFileSync(eventsPath, JSON.stringify(events), "utf-8");

        expect(() => loadConfig(tempDir)).toThrow(/unknown_effect_type/);
    });
});
