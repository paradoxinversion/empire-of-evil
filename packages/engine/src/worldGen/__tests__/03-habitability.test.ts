import { describe, test, expect } from "vitest";
import { classifyHabitability } from "../phases/03-habitability.js";
import type { ZoneCandidate } from "../types.js";
import type { TileTypeDefinition } from "../../config/loader.js";

const habitablePlains: TileTypeDefinition = {
    icon: ".",
    name: "Plains",
    description: "",
    buildingRestrictions: [],
    effects: [],
    terrainConditions: {
        elevationMin: 0,
        elevationMax: 1,
        moistureMin: 0,
        moistureMax: 1,
        priority: 1,
    },
    canBeInhabited: true,
    wealthContribution: 45,
    governingOrganizationId: "none",
};
const uninhabitableMountain: TileTypeDefinition = {
    icon: "▲",
    name: "Mountain",
    description: "",
    buildingRestrictions: [],
    effects: [],
    terrainConditions: {
        elevationMin: 0.7,
        elevationMax: 1,
        moistureMin: 0,
        moistureMax: 1,
        priority: 90,
    },
    canBeInhabited: false,
    wealthContribution: 15,
    governingOrganizationId: "none",
};
const oceanType: TileTypeDefinition = {
    icon: "~",
    name: "Ocean",
    description: "",
    buildingRestrictions: [],
    effects: [],
    terrainConditions: {
        elevationMin: 0,
        elevationMax: 0.38,
        moistureMin: 0,
        moistureMax: 1,
        priority: 100,
    },
    canBeInhabited: false,
    wealthContribution: 0,
    isOcean: true,
    governingOrganizationId: "none",
};

const tileTypes: Record<string, TileTypeDefinition> = {
    plains: habitablePlains,
    mountain: uninhabitableMountain,
    ocean: oceanType,
};

function makeZone(
    id: string,
    pluralityTypeId: string,
    generationWealth: number,
): ZoneCandidate {
    return {
        id,
        pluralityTypeId,
        generationWealth,
        tileIds: ["tile-1"],
        tileCells: [{ x: 0, y: 0 }],
    };
}

describe("classifyHabitability", () => {
    test("empty zone list returns empty set", () => {
        const result = classifyHabitability([], tileTypes, 20);
        expect(result.size).toBe(0);
    });

    test("zone with canBeInhabited=false plurality type is uninhabitable", () => {
        const zone = makeZone("z1", "mountain", 80);
        const result = classifyHabitability([zone], tileTypes, 20);
        expect(result.has("z1")).toBe(false);
    });

    test("zone with wealth below uninhabitedWealthFloor is uninhabitable", () => {
        const zone = makeZone("z1", "plains", 15); // floor=20
        const result = classifyHabitability([zone], tileTypes, 20);
        expect(result.has("z1")).toBe(false);
    });

    test("zone with habitable type and wealth at floor is uninhabitable (strict <)", () => {
        const zone = makeZone("z1", "plains", 20); // wealth === floor → uninhabitable
        const result = classifyHabitability([zone], tileTypes, 20);
        expect(result.has("z1")).toBe(false);
    });

    test("zone with habitable type and wealth above floor is habitable", () => {
        const zone = makeZone("z1", "plains", 21);
        const result = classifyHabitability([zone], tileTypes, 20);
        expect(result.has("z1")).toBe(true);
    });

    test("ocean-typed plurality zone is uninhabitable", () => {
        const zone = makeZone("z1", "ocean", 0);
        const result = classifyHabitability([zone], tileTypes, 20);
        expect(result.has("z1")).toBe(false);
    });

    test("mixed zones: only habitable ones appear in result", () => {
        const zones = [
            makeZone("z1", "plains", 50), // habitable
            makeZone("z2", "mountain", 70), // uninhabitable (canBeInhabited=false)
            makeZone("z3", "plains", 10), // uninhabitable (below wealth floor)
            makeZone("z4", "plains", 30), // habitable
        ];
        const result = classifyHabitability(zones, tileTypes, 20);
        expect(result.has("z1")).toBe(true);
        expect(result.has("z2")).toBe(false);
        expect(result.has("z3")).toBe(false);
        expect(result.has("z4")).toBe(true);
        expect(result.size).toBe(2);
    });
});
