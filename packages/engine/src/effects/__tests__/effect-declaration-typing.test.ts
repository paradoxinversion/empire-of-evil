import { describe, expect, test } from "vitest";

import type { EffectDeclaration } from "../types.js";

describe("EffectDeclaration typing", () => {
    test("accepts event effect types", () => {
        const declaration: EffectDeclaration = {
            type: "gain_evil",
            chance: 1,
            parameters: { amount: 1 },
        };

        expect(declaration.type).toBe("gain_evil");
    });

    test("accepts non-event effect types for non-event systems", () => {
        const declaration: EffectDeclaration = {
            type: "building_maintenance_boost",
            chance: 1,
            parameters: { amount: 2 },
        };

        expect(declaration.type).toBe("building_maintenance_boost");
    });
});
