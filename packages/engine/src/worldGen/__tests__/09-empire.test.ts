import { describe, test, expect } from "vitest";
import { initializeEmpire } from "../phases/09-empire.js";
import type { PetDefinition } from "../../config/loader.js";
import type { Person } from "../../types/index.js";

const pets: PetDefinition[] = [
    { id: "cat", name: "Cat", description: "A cat." },
    { id: "tiger", name: "Tiger", description: "A tiger." },
];

const defaultResources = { money: 500, science: 0, infrastructure: 100 };

function makePerson(
    id: string,
    zoneId: string,
    overrides: Partial<Person> = {},
): Person {
    return {
        id,
        name: `Person ${id}`,
        zoneId,
        homeZoneId: zoneId,
        governingOrganizationId: "some-nation-org",
        attributes: {},
        skills: {},
        loyalties: {},
        intelLevel: 0,
        health: 100,
        money: 0,
        activeEffectIds: [],
        dead: false,
        ...overrides,
    };
}

// 12 living citizens in empire zone + 3 in a different zone
const empireZoneCitizens = Array.from({ length: 12 }, (_, i) =>
    makePerson(`citizen-${i}`, "empire-zone"),
);
const otherZoneCitizens = Array.from({ length: 3 }, (_, i) =>
    makePerson(`other-${i}`, "other-zone"),
);
const populationPersons: Record<string, Person> = Object.fromEntries(
    [...empireZoneCitizens, ...otherZoneCitizens].map((p) => [p.id, p]),
);

describe("initializeEmpire", () => {
    test("overlord person exists in persons result", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            42,
            populationPersons,
        );
        expect(result.persons[result.overlordId]).toBeDefined();
    });

    test("overlord has agentStatus with job unassigned", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            1,
            populationPersons,
        );
        const overlord = result.persons[result.overlordId]!;
        expect(overlord.agentStatus).toBeDefined();
        expect(overlord.agentStatus!.job).toBe("unassigned");
    });

    test("pet person exists in persons result", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            5,
            populationPersons,
        );
        expect(result.persons[result.petId]).toBeDefined();
    });

    test("pet matches petTypeId when provided", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            { petTypeId: "tiger" },
            defaultResources,
            3,
            populationPersons,
        );
        const pet = result.persons[result.petId]!;
        expect(pet.name).toBe("Tiger");
    });

    test("pet is randomly chosen when petTypeId is not provided", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            7,
            populationPersons,
        );
        const pet = result.persons[result.petId]!;
        expect(["Cat", "Tiger"]).toContain(pet.name);
    });

    test("headquarters building is placed in the empire zone", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            2,
            populationPersons,
        );
        expect(result.hqBuildingId).toBeDefined();
        const hq = result.buildings[result.hqBuildingId!];
        expect(hq).toBeDefined();
        expect(hq!.typeId).toBe("headquarters");
        expect(hq!.zoneId).toBe("empire-zone");
    });

    test("starting resources come from params when provided", () => {
        const customResources = {
            money: 1000,
            science: 50,
            infrastructure: 200,
        };
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            { startingResources: customResources },
            defaultResources,
            1,
            populationPersons,
        );
        expect(result.resources).toEqual(customResources);
    });

    test("starting resources fall back to defaults when not provided", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            1,
            populationPersons,
        );
        expect(result.resources).toEqual(defaultResources);
    });

    test("overlord and pet are placed in the empire zone", () => {
        const result = initializeEmpire(
            "empire-zone",
            "empire-org",
            pets,
            {},
            defaultResources,
            1,
            populationPersons,
        );
        expect(result.persons[result.overlordId]!.zoneId).toBe("empire-zone");
        expect(result.persons[result.petId]!.zoneId).toBe("empire-zone");
    });

    describe("subject setup", () => {
        test("starting zone citizens have governingOrganizationId set to empire org", () => {
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                populationPersons,
            );
            for (const citizen of empireZoneCitizens) {
                expect(
                    result.persons[citizen.id]!.governingOrganizationId,
                ).toBe("empire-org");
            }
        });

        test("starting zone citizens have initial loyalty and recruited agents have elevated loyalty", () => {
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                populationPersons,
            );
            for (const citizen of empireZoneCitizens) {
                const person = result.persons[citizen.id]!;
                if (person.agentStatus !== undefined) {
                    // recruited agents receive higher starting loyalty
                    expect(person.loyalties["empire-org"]).toBe(80);
                } else {
                    // regular subjects receive the standard starting loyalty
                    expect(person.loyalties["empire-org"]).toBe(65);
                }
            }
        });

        test("citizens in other zones are not modified", () => {
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                populationPersons,
            );
            for (const citizen of otherZoneCitizens) {
                expect(result.persons[citizen.id]).toBeUndefined();
            }
        });
    });

    describe("agent recruitment", () => {
        test("exactly 10 citizens are recruited as agents when zone has more than 10", () => {
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                populationPersons,
            );
            const agents = empireZoneCitizens.filter(
                (c) => result.persons[c.id]!.agentStatus !== undefined,
            );
            expect(agents).toHaveLength(10);
        });

        test("recruited agents have job unassigned and salary 0", () => {
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                populationPersons,
            );
            const agents = empireZoneCitizens.filter(
                (c) => result.persons[c.id]!.agentStatus !== undefined,
            );
            for (const agent of agents) {
                expect(result.persons[agent.id]!.agentStatus!.job).toBe(
                    "unassigned",
                );
                expect(result.persons[agent.id]!.agentStatus!.salary).toBe(0);
            }
        });

        test("all citizens are recruited when zone has fewer than 10", () => {
            const smallPop: Record<string, Person> = Object.fromEntries(
                Array.from({ length: 5 }, (_, i) =>
                    makePerson(`small-${i}`, "empire-zone"),
                ).map((p) => [p.id, p]),
            );
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                smallPop,
            );
            const citizens = Object.values(smallPop);
            const agents = citizens.filter(
                (c) => result.persons[c.id]!.agentStatus !== undefined,
            );
            expect(agents).toHaveLength(5);
        });

        test("dead citizens are not recruited as agents", () => {
            const popWithDead: Record<string, Person> = Object.fromEntries(
                [
                    ...Array.from({ length: 8 }, (_, i) =>
                        makePerson(`live-${i}`, "empire-zone"),
                    ),
                    makePerson("dead-1", "empire-zone", { dead: true }),
                    makePerson("dead-2", "empire-zone", { dead: true }),
                ].map((p) => [p.id, p]),
            );
            const result = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                1,
                popWithDead,
            );
            expect(result.persons["dead-1"]!.agentStatus).toBeUndefined();
            expect(result.persons["dead-2"]!.agentStatus).toBeUndefined();
        });

        test("recruitment is deterministic for the same seed", () => {
            const r1 = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                99,
                populationPersons,
            );
            const r2 = initializeEmpire(
                "empire-zone",
                "empire-org",
                pets,
                {},
                defaultResources,
                99,
                populationPersons,
            );
            const agents1 = empireZoneCitizens
                .filter((c) => r1.persons[c.id]!.agentStatus !== undefined)
                .map((c) => c.id)
                .sort();
            const agents2 = empireZoneCitizens
                .filter((c) => r2.persons[c.id]!.agentStatus !== undefined)
                .map((c) => c.id)
                .sort();
            expect(agents1).toEqual(agents2);
        });
    });
});
