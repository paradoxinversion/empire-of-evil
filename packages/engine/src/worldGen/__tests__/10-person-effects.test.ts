import { beforeEach, describe, expect, test } from "vitest";
import { resetIdCounter } from "../../factories/index.js";
import type { Person } from "../../types/index.js";
import { seedFrom } from "../prng.js";
import { assignInitialPersonEffects } from "../phases/10-person-effects.js";

function makePerson(id: string): Person {
    return {
        id,
        name: `Person ${id}`,
        zoneId: "zone-1",
        homeZoneId: "zone-1",
        governingOrganizationId: "org-1",
        attributes: {},
        skills: {},
        loyalties: {},
        intelLevel: 0,
        health: 100,
        money: 0,
        activeEffectIds: [],
        dead: false,
    };
}

const PERSON_EFFECT_IDS = ["sick", "injured", "inspired"];

describe("assignInitialPersonEffects", () => {
    beforeEach(() => {
        resetIdCounter(1);
    });

    test("assigns between 0 and 2 unique effects to each eligible person", () => {
        const persons: Record<string, Person> = {
            p1: makePerson("p1"),
            p2: makePerson("p2"),
            p3: makePerson("p3"),
            p4: makePerson("p4"),
            p5: makePerson("p5"),
        };
        const { prng } = seedFrom(42);

        const effectInstances = assignInitialPersonEffects({
            persons,
            excludedPersonIds: new Set<string>(),
            personEffectIds: PERSON_EFFECT_IDS,
            prng,
            appliedOnDate: 0,
        });

        for (const person of Object.values(persons)) {
            expect(person.activeEffectIds.length).toBeGreaterThanOrEqual(0);
            expect(person.activeEffectIds.length).toBeLessThanOrEqual(2);
            expect(new Set(person.activeEffectIds).size).toBe(
                person.activeEffectIds.length,
            );

            for (const effectInstanceId of person.activeEffectIds) {
                const instance = effectInstances[effectInstanceId];
                expect(instance).toBeDefined();
                expect(instance!.targetId).toBe(person.id);
                expect(instance!.targetType).toBe("person");
                expect(PERSON_EFFECT_IDS).toContain(instance!.effectId);
            }
        }
    });

    test("excludes overlord and pet from assignment", () => {
        const persons: Record<string, Person> = {
            overlord: makePerson("overlord"),
            pet: makePerson("pet"),
            citizen: makePerson("citizen"),
        };
        const { prng } = seedFrom(7);

        const effectInstances = assignInitialPersonEffects({
            persons,
            excludedPersonIds: new Set<string>(["overlord", "pet"]),
            personEffectIds: PERSON_EFFECT_IDS,
            prng,
            appliedOnDate: 0,
        });

        expect(persons.overlord!.activeEffectIds).toHaveLength(0);
        expect(persons.pet!.activeEffectIds).toHaveLength(0);
        expect(persons.citizen!.activeEffectIds.length).toBeLessThanOrEqual(2);

        for (const instance of Object.values(effectInstances)) {
            expect(instance.targetId).not.toBe("overlord");
            expect(instance.targetId).not.toBe("pet");
        }
    });

    test("is deterministic for same seed", () => {
        const createPersons = () => ({
            p1: makePerson("p1"),
            p2: makePerson("p2"),
            p3: makePerson("p3"),
            p4: makePerson("p4"),
        });

        const run = (seed: number) => {
            resetIdCounter(1);
            const persons = createPersons();
            const { prng } = seedFrom(seed);
            const effectInstances = assignInitialPersonEffects({
                persons,
                excludedPersonIds: new Set<string>(),
                personEffectIds: PERSON_EFFECT_IDS,
                prng,
                appliedOnDate: 0,
            });

            return Object.fromEntries(
                Object.entries(persons).map(([personId, person]) => [
                    personId,
                    person.activeEffectIds.map(
                        (effectInstanceId) =>
                            effectInstances[effectInstanceId]!.effectId,
                    ),
                ]),
            );
        };

        expect(run(99)).toEqual(run(99));
    });

    test("no-ops when no person effects are configured", () => {
        const persons: Record<string, Person> = {
            p1: makePerson("p1"),
            p2: makePerson("p2"),
        };
        const { prng } = seedFrom(3);

        const effectInstances = assignInitialPersonEffects({
            persons,
            excludedPersonIds: new Set<string>(),
            personEffectIds: [],
            prng,
            appliedOnDate: 0,
        });

        expect(Object.keys(effectInstances)).toHaveLength(0);
        expect(persons.p1!.activeEffectIds).toHaveLength(0);
        expect(persons.p2!.activeEffectIds).toHaveLength(0);
    });
});
