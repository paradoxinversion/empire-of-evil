import { createEffectInstance } from "../../factories/index.js";
import type { EffectInstance, Person } from "../../types/index.js";
import type { Prng } from "../prng.js";

interface AssignInitialPersonEffectsParams {
    persons: Record<string, Person>;
    excludedPersonIds: Set<string>;
    personEffectIds: string[];
    prng: Prng;
    appliedOnDate: number;
}

function pickUniqueEffectIds(
    sourceEffectIds: string[],
    maxCount: number,
    prng: Prng,
): string[] {
    if (sourceEffectIds.length === 0 || maxCount <= 0) {
        return [];
    }

    const count = Math.min(maxCount, sourceEffectIds.length);
    const pool = [...sourceEffectIds];
    const selected: string[] = [];

    for (let i = 0; i < count; i++) {
        const pickIndex = Math.floor(prng() * pool.length);
        selected.push(pool[pickIndex]!);
        pool.splice(pickIndex, 1);
    }

    return selected;
}

/**
 * Assign deterministic startup person effects to generated citizens.
 * Excluded IDs (overlord and pet) are never assigned effects here.
 */
export function assignInitialPersonEffects({
    persons,
    excludedPersonIds,
    personEffectIds,
    prng,
    appliedOnDate,
}: AssignInitialPersonEffectsParams): Record<string, EffectInstance> {
    const effectInstances: Record<string, EffectInstance> = {};

    if (personEffectIds.length === 0) {
        return effectInstances;
    }

    const sortedPersonIds = Object.keys(persons).sort();
    for (const personId of sortedPersonIds) {
        if (excludedPersonIds.has(personId)) {
            continue;
        }

        const person = persons[personId]!;
        const assignCount = Math.floor(prng() * 3); // [0, 2]
        const pickedEffectIds = pickUniqueEffectIds(
            personEffectIds,
            assignCount,
            prng,
        );

        for (const effectId of pickedEffectIds) {
            const instance = createEffectInstance({
                effectId,
                targetId: person.id,
                targetType: "person",
                appliedOnDate,
            });
            effectInstances[instance.id] = instance;
            person.activeEffectIds.push(instance.id);
        }
    }

    return effectInstances;
}
