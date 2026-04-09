import { describe, expect, it } from "vitest";
import type { GameState } from "@empire-of-evil/engine";
import { deriveEmpireBuildings, deriveEmpireOverview } from "./EmpireSelectors";

const mockState: GameState = {
    date: 12,
    worldSeed: 42,
    tiles: {
        t1: {
            id: "t1",
            typeId: "urban",
            zoneId: "z1",
            activeEffectIds: [],
            governingOrganizationId: "empire-1",
        },
        t2: {
            id: "t2",
            typeId: "urban",
            zoneId: "z1",
            activeEffectIds: [],
            governingOrganizationId: "empire-1",
        },
        t3: {
            id: "t3",
            typeId: "urban",
            zoneId: "z2",
            activeEffectIds: [],
            governingOrganizationId: "org-2",
        },
    },
    zones: {
        z1: {
            id: "z1",
            name: "Zone Alpha",
            nationId: "n1",
            governingOrganizationId: "empire-1",
            tileIds: ["t1", "t2"],
            buildingIds: ["b1", "b2"],
            generationWealth: 10,
            economicOutput: 500,
            population: 1000,
            intelLevel: 0,
            taxRate: 0.1,
            activeEffectIds: [],
        },
        z2: {
            id: "z2",
            name: "Zone Beta",
            nationId: "n1",
            governingOrganizationId: "org-2",
            tileIds: ["t3"],
            buildingIds: ["b3"],
            generationWealth: 10,
            economicOutput: 800,
            population: 1200,
            intelLevel: 0,
            taxRate: 0.1,
            activeEffectIds: [],
        },
    },
    nations: {
        n1: {
            id: "n1",
            name: "Test Nation",
            size: 1,
            governingOrganizationId: "org-2",
        },
    },
    buildings: {
        b1: {
            id: "b1",
            name: "Citadel Prime",
            typeId: "market-stall",
            zoneId: "z1",
            tileId: "t1",
            intelLevel: 3,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
        },
        b2: {
            id: "b2",
            name: "Bio Lab 9",
            typeId: "bank",
            zoneId: "z1",
            tileId: "t2",
            intelLevel: 1,
            governingOrganizationId: "empire-1",
            activeEffectIds: [],
        },
        b3: {
            id: "b3",
            name: "Foreign Bureau",
            typeId: "bank",
            zoneId: "z2",
            tileId: "t3",
            intelLevel: 4,
            governingOrganizationId: "org-2",
            activeEffectIds: [],
        },
    },
    persons: {
        p1: {
            id: "p1",
            name: "Agent One",
            zoneId: "z1",
            homeZoneId: "z1",
            governingOrganizationId: "empire-1",
            attributes: {},
            skills: {},
            loyalties: {},
            intelLevel: 0,
            health: 100,
            money: 0,
            activeEffectIds: [],
            dead: false,
            agentStatus: { job: "operative", salary: 10 },
        },
        p2: {
            id: "p2",
            name: "Citizen Two",
            zoneId: "z1",
            homeZoneId: "z1",
            governingOrganizationId: "empire-1",
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
    governingOrganizations: {
        "empire-1": {
            id: "empire-1",
            name: "Empire",
            intelLevel: 10,
            activeEffectIds: [],
        },
        "org-2": {
            id: "org-2",
            name: "Rivals",
            intelLevel: 10,
            activeEffectIds: [],
        },
    },
    empire: {
        id: "empire-1",
        overlordId: "p1",
        petId: "pet-1",
        resources: { money: 2000, science: 75, infrastructure: 1 },
        evil: { actual: 4, perceived: 7 },
        innerCircleIds: [],
        unlockedPlotIds: [],
        unlockedActivityIds: [],
        unlockedResearchIds: [],
    },
    plots: {
        plot1: {
            id: "plot1",
            plotDefinitionId: "blackmail",
            currentStageIndex: 0,
            assignedAgentIds: ["p1"],
            targetZoneId: "z2",
            daysRemaining: 3,
            accumulatedSuccessScore: 0,
            status: "active",
        },
    },
    activities: {
        act1: {
            id: "act1",
            activityDefinitionId: "research",
            assignedAgentIds: ["p1"],
            zoneId: "z1",
        },
    },
    research: {},
    captives: {},
    squads: {},
    effectInstances: {},
    morgues: { byCitizen: {}, byAgent: {} },
    pendingEvents: [],
    eventLog: [
        {
            event: {
                id: "e1",
                category: "informational",
                title: "Earlier Event",
                body: "",
                relatedEntityIds: [],
                requiresResolution: false,
                createdOnDate: 4,
            },
            resolvedOnDate: 4,
        },
        {
            event: {
                id: "e2",
                category: "informational",
                title: "Latest Event",
                body: "",
                relatedEntityIds: [],
                requiresResolution: false,
                createdOnDate: 5,
            },
            resolvedOnDate: 5,
        },
    ],
};

const buildingDefinitions = [
    {
        id: "market-stall",
        name: "Market Stall",
        resourceOutput: { money: 5 },
        upkeepPerDay: 1,
    },
    {
        id: "bank",
        name: "Bank",
        resourceOutput: { money: 30 },
        upkeepPerDay: 8,
    },
];

describe("EmpireSelectors", () => {
    it("derives only empire-owned buildings with config-enriched fields", () => {
        const buildings = deriveEmpireBuildings(mockState, buildingDefinitions);

        expect(buildings).toEqual([
            {
                id: "b1",
                name: "Citadel Prime",
                typeName: "Market Stall",
                zoneName: "Zone Alpha",
                tileLabel: "t1",
                outputResources: {
                    money: 5,
                    science: 0,
                    infrastructure: 0,
                },
                outputTotal: 5,
                outputMoney: 5,
                upkeep: 1,
                intelLevel: 3,
                status: "SECURED",
            },
            {
                id: "b2",
                name: "Bio Lab 9",
                typeName: "Bank",
                zoneName: "Zone Alpha",
                tileLabel: "t2",
                outputResources: {
                    money: 30,
                    science: 0,
                    infrastructure: 0,
                },
                outputTotal: 30,
                outputMoney: 30,
                upkeep: 8,
                intelLevel: 1,
                status: "EXPOSED",
            },
        ]);
    });

    it("derives overview counts, operations, controlled zones, and recent events", () => {
        const overview = deriveEmpireOverview(mockState);

        expect(overview.empireZoneCount).toBe(1);
        expect(overview.agentCount).toBe(1);
        expect(overview.operations).toEqual([
            {
                id: "plot1",
                operation: "blackmail",
                type: "plot",
                target: "z2",
                agents: 1,
                status: "ACTIVE",
                eta: "3d",
            },
            {
                id: "act1",
                operation: "research",
                type: "activity",
                target: "z1",
                agents: 1,
                status: "ACTIVE",
                eta: "—",
            },
        ]);
        expect(overview.controlledZones).toEqual([
            {
                id: "z1",
                zone: "Zone Alpha",
                nation: "Test Nation",
                empireTileCount: 2,
                totalTileCount: 2,
                output: 500,
                status: "STABLE",
            },
        ]);
        expect(
            overview.recentEvents.map((record) => record.event.title),
        ).toEqual(["Latest Event", "Earlier Event"]);
    });

    it("derives dynamic per-resource output from assigned agents and employed citizens", () => {
        const state = structuredClone(mockState);
        state.buildings.b1.assignedAgentIds = ["p1"];
        state.persons.p1.skills = { finance: 40 };
        state.persons.p2.skills = { finance: 60 };
        state.persons.p2.employedBuildingId = "b1";

        const defs = [
            {
                id: "market-stall",
                name: "Market Stall",
                resourceOutput: { money: 10, science: 4 },
                preferredSkills: ["finance"],
                upkeepPerDay: 1,
            },
            {
                id: "bank",
                name: "Bank",
                resourceOutput: { money: 30 },
                preferredSkills: ["finance"],
                upkeepPerDay: 8,
            },
        ];

        const buildings = deriveEmpireBuildings(state, defs as any);
        const target = buildings.find((b) => b.id === "b1");

        expect(target?.outputResources).toEqual({
            money: 14,
            science: 6,
            infrastructure: 0,
        });
    });

    it("derives outputTotal from all resource channels, including science-only buildings", () => {
        const state = structuredClone(mockState);
        state.buildings.b1.typeId = "research-lab";
        state.buildings.b1.assignedAgentIds = ["p1"];
        state.persons.p1.skills = { biology: 50 };

        const defs = [
            {
                id: "research-lab",
                name: "Research Lab",
                resourceOutput: { science: 10 },
                preferredSkills: ["biology"],
                upkeepPerDay: 1,
            },
            {
                id: "bank",
                name: "Bank",
                resourceOutput: { money: 30 },
                preferredSkills: ["finance"],
                upkeepPerDay: 8,
            },
        ];

        const buildings = deriveEmpireBuildings(state, defs as any);
        const lab = buildings.find((b) => b.id === "b1");

        expect(lab?.outputMoney).toBe(0);
        expect(lab?.outputResources.science).toBeGreaterThan(0);
        expect(lab?.outputTotal).toBe(lab?.outputResources.science);
    });
});
