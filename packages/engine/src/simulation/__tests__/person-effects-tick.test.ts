import { describe, expect, test } from "vitest";
import { runDay } from "../day.js";
import type { Config } from "../../config/loader.js";
import type { GameState } from "../../types/index.js";
import { tickEffects } from "../../effects/tick.js";

function makeConfig(): Config {
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
            zonesPerNation: 2,
            populationDensity: 0.1,
            maxBuildingsPerZone: 1,
        },
        activities: [],
        citizenActions: [],
        cpuBehaviors: [],
        events: [],
        effects: [],
        evilTiers: [],
        personAttributes: [],
        plots: [],
        researchProjects: [],
        skills: [],
    };
}

function makeState(overrides: Partial<GameState> = {}): GameState {
    return {
        date: 0,
        worldSeed: 1,
        tiles: {},
        zones: {
            z1: {
                id: "z1",
                name: "Zone",
                nationId: "n1",
                governingOrganizationId: "empire",
                tileIds: [],
                buildingIds: [],
                generationWealth: 0,
                economicOutput: 0,
                population: 1,
                intelLevel: 0,
                taxRate: 0.1,
                activeEffectIds: [],
            },
        },
        nations: {
            n1: {
                id: "n1",
                name: "Nation",
                size: 1,
                governingOrganizationId: "empire",
            },
        },
        buildings: {},
        persons: {
            p1: {
                id: "p1",
                name: "Citizen",
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
            overlord: {
                id: "overlord",
                name: "Overlord",
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
            pet: {
                id: "pet",
                name: "Pet",
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
        governingOrganizations: {
            empire: {
                id: "empire",
                name: "Empire",
                intelLevel: 0,
                activeEffectIds: [],
            },
        },
        squads: {},
        plots: {},
        activities: {},
        research: {},
        captives: {},
        effectInstances: {},
        morgues: { byCitizen: {}, byAgent: {} },
        empire: {
            id: "empire",
            overlordId: "overlord",
            petId: "pet",
            resources: { money: 0, science: 0, infrastructure: 0 },
            evil: { actual: 0, perceived: 0 },
            innerCircleIds: [],
            unlockedPlotIds: [],
            unlockedActivityIds: [],
            unlockedResearchIds: [],
        },
        pendingEvents: [],
        eventLog: [],
        ...overrides,
    };
}

describe("runDay passive person effects", () => {
    test("ticks duration, keeps effect active at zero for one day, then expires and cleans references", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    activeEffectIds: ["e1"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "sick",
                    targetId: "p1",
                    targetType: "person",
                    duration: 1,
                    appliedOnDate: 0,
                },
            },
        });

        const config = makeConfig();

        runDay(state, config);

        expect(state.effectInstances.e1).toBeDefined();
        expect(state.effectInstances.e1!.duration).toBe(0);
        expect(state.persons.p1!.activeEffectIds).toEqual(["e1"]);
        expect(state.persons.p1!.health).toBe(99);

        runDay(state, config);

        expect(state.effectInstances.e1).toBeUndefined();
        expect(state.persons.p1!.activeEffectIds).toEqual([]);
        expect(state.persons.p1!.health).toBe(98);
    });

    test("applies passive behavior once per day for active person effects", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    activeEffectIds: ["e1"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "inspired",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        runDay(state, makeConfig());
        runDay(state, makeConfig());

        expect(state.persons.p1!.intelLevel).toBe(2);
    });

    test("skips passive behavior for dead persons but still advances duration", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    dead: true,
                    activeEffectIds: ["e1"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "sick",
                    targetId: "p1",
                    targetType: "person",
                    duration: 2,
                    appliedOnDate: 0,
                },
            },
        });

        runDay(state, makeConfig());

        expect(state.persons.p1!.health).toBe(100);
        expect(state.effectInstances.e1!.duration).toBe(1);
    });

    test("radicalized reduces loyalty to the person's governing organization each day", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    loyalties: { empire: 10 },
                    activeEffectIds: ["e1"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "radicalized",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        runDay(state, makeConfig());

        expect(state.persons.p1!.loyalties.empire).toBe(9);
    });

    test("party-animal reduces intel and raises loyalty to governing organization each day", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    intelLevel: 2,
                    loyalties: { empire: 20 },
                    activeEffectIds: ["e1"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "party-animal",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        runDay(state, makeConfig());

        expect(state.persons.p1!.intelLevel).toBe(1);
        expect(state.persons.p1!.loyalties.empire).toBe(21);
    });

    test("conspiracy-theories shifts loyalty from governing organization to a rival organization", () => {
        const state = makeState({
            governingOrganizations: {
                empire: {
                    id: "empire",
                    name: "Empire",
                    intelLevel: 0,
                    activeEffectIds: [],
                },
                rival: {
                    id: "rival",
                    name: "Rival",
                    intelLevel: 0,
                    activeEffectIds: [],
                },
            },
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    loyalties: { empire: 50, rival: 10 },
                    activeEffectIds: ["e1"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "conspiracy-theories",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        runDay(state, makeConfig());

        expect(state.persons.p1!.loyalties.empire).toBe(49);
        expect(state.persons.p1!.loyalties.rival).toBe(11);
    });

    test("party-animal can spread to one other citizen in the same zone", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    activeEffectIds: ["e1"],
                },
                p2: {
                    ...makeState().persons.p1,
                    id: "p2",
                    name: "Citizen 2",
                    activeEffectIds: [],
                },
                agent: {
                    ...makeState().persons.p1,
                    id: "agent",
                    name: "Agent",
                    activeEffectIds: [],
                    agentStatus: {
                        job: "operative",
                        salary: 10,
                    },
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "party-animal",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        tickEffects(state, {
            random: () => 0,
        } as any);

        const p2EffectIds = state.persons.p2!.activeEffectIds;
        expect(p2EffectIds).toHaveLength(1);
        const spreadInstance = state.effectInstances[p2EffectIds[0]!];
        expect(spreadInstance).toBeDefined();
        expect(spreadInstance!.effectId).toBe("party-animal");
        expect(spreadInstance!.targetId).toBe("p2");
        expect(state.persons.agent!.activeEffectIds).toHaveLength(0);
    });

    test("conspiracy-theories can spread to one other person in the same zone", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    activeEffectIds: ["e1"],
                },
                p2: {
                    ...makeState().persons.p1,
                    id: "p2",
                    name: "Citizen 2",
                    activeEffectIds: [],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "conspiracy-theories",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        tickEffects(state, {
            random: () => 0,
        } as any);

        const p2EffectIds = state.persons.p2!.activeEffectIds;
        expect(p2EffectIds).toHaveLength(1);
        const spreadInstance = state.effectInstances[p2EffectIds[0]!];
        expect(spreadInstance).toBeDefined();
        expect(spreadInstance!.effectId).toBe("conspiracy-theories");
        expect(spreadInstance!.targetId).toBe("p2");
    });

    test("party-animal does not spread to persons in a different zone", () => {
        const state = makeState({
            zones: {
                z1: {
                    id: "z1",
                    name: "Zone 1",
                    nationId: "n1",
                    governingOrganizationId: "empire",
                    tileIds: [],
                    buildingIds: [],
                    generationWealth: 0,
                    economicOutput: 0,
                    population: 1,
                    intelLevel: 0,
                    taxRate: 0.1,
                    activeEffectIds: [],
                },
                z2: {
                    id: "z2",
                    name: "Zone 2",
                    nationId: "n1",
                    governingOrganizationId: "empire",
                    tileIds: [],
                    buildingIds: [],
                    generationWealth: 0,
                    economicOutput: 0,
                    population: 1,
                    intelLevel: 0,
                    taxRate: 0.1,
                    activeEffectIds: [],
                },
            },
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    zoneId: "z1",
                    activeEffectIds: ["e1"],
                },
                p2: {
                    ...makeState().persons.p1,
                    id: "p2",
                    name: "Remote Citizen",
                    zoneId: "z2",
                    homeZoneId: "z2",
                    activeEffectIds: [],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "party-animal",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        tickEffects(state, { random: () => 0 } as any);

        expect(state.persons.p2!.activeEffectIds).toHaveLength(0);
    });

    test("already-infected person does not receive a second party-animal instance", () => {
        const state = makeState({
            persons: {
                p1: {
                    ...makeState().persons.p1,
                    activeEffectIds: ["e1"],
                },
                p2: {
                    ...makeState().persons.p1,
                    id: "p2",
                    name: "Citizen 2",
                    activeEffectIds: ["e2"],
                },
                overlord: makeState().persons.overlord,
                pet: makeState().persons.pet,
            },
            effectInstances: {
                e1: {
                    id: "e1",
                    effectId: "party-animal",
                    targetId: "p1",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
                e2: {
                    id: "e2",
                    effectId: "party-animal",
                    targetId: "p2",
                    targetType: "person",
                    duration: 3,
                    appliedOnDate: 0,
                },
            },
        });

        tickEffects(state, { random: () => 0 } as any);

        expect(state.persons.p2!.activeEffectIds).toHaveLength(1);
    });
});
