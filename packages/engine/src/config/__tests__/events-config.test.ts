import { describe, expect, test } from "vitest";
import { mkdtempSync, cpSync, writeFileSync } from "node:fs";
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
});
