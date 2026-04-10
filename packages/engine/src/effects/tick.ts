import type { EffectInstance, GameState, Person } from "../types/index.js";

type PersonEffectResolver = (person: Person, effect: EffectInstance) => void;

type EntityKind = "person" | "zone" | "tile" | "organization";

const clamp01To100 = (value: number): number =>
    Math.max(0, Math.min(100, value));

const getLoyalty = (person: Person, orgId: string): number =>
    person.loyalties[orgId] ?? 0;

const setLoyalty = (person: Person, orgId: string, value: number): void => {
    person.loyalties[orgId] = clamp01To100(value);
};

const pickRivalOrgId = (person: Person): string | undefined => {
    const rivals = Object.keys(person.loyalties)
        .filter((orgId) => orgId !== person.governingOrganizationId)
        .sort();
    return rivals[0];
};

export interface EffectTickHooks {
    onTickStart?: (state: GameState) => void;
    onEntityEffectTick?: (
        state: GameState,
        entityKind: EntityKind,
        effect: EffectInstance,
    ) => void;
    onTickEnd?: (state: GameState) => void;
}

const personResolvers: Record<string, PersonEffectResolver> = {
    sick: (person) => {
        person.health = Math.max(0, person.health - 1);
    },
    injured: (person) => {
        person.health = Math.max(0, person.health - 1);
    },
    inspired: (person) => {
        person.intelLevel = Math.min(100, person.intelLevel + 1);
    },
    radicalized: (person) => {
        const orgId = person.governingOrganizationId;
        setLoyalty(person, orgId, getLoyalty(person, orgId) - 1);
    },
    "party-animal": (person) => {
        person.intelLevel = Math.max(0, person.intelLevel - 1);
        const orgId = person.governingOrganizationId;
        setLoyalty(person, orgId, getLoyalty(person, orgId) + 1);
    },
    "conspiracy-theories": (person) => {
        const govOrgId = person.governingOrganizationId;
        const rivalOrgId = pickRivalOrgId(person);
        if (!rivalOrgId) return;

        setLoyalty(person, govOrgId, getLoyalty(person, govOrgId) - 1);
        setLoyalty(person, rivalOrgId, getLoyalty(person, rivalOrgId) + 1);
    },
};

const applyPersonEffect = (person: Person, effect: EffectInstance): void => {
    const resolver = personResolvers[effect.effectId];
    if (!resolver) return;
    resolver(person, effect);
};

const tickPersonEffects = (state: GameState, hooks?: EffectTickHooks): void => {
    for (const person of Object.values(state.persons)) {
        if (person.activeEffectIds.length === 0) continue;

        const staleOrExpiredEffectIds = new Set<string>();
        for (const effectId of [...person.activeEffectIds]) {
            const effect = state.effectInstances[effectId];
            if (!effect) {
                staleOrExpiredEffectIds.add(effectId);
                continue;
            }
            if (
                effect.targetType !== "person" ||
                effect.targetId !== person.id
            ) {
                continue;
            }

            hooks?.onEntityEffectTick?.(state, "person", effect);

            if (!person.dead) {
                applyPersonEffect(person, effect);
            }

            if (typeof effect.duration === "number") {
                if (effect.duration <= 0) {
                    staleOrExpiredEffectIds.add(effect.id);
                } else {
                    effect.duration -= 1;
                }
            }
        }

        if (staleOrExpiredEffectIds.size === 0) continue;
        person.activeEffectIds = person.activeEffectIds.filter(
            (effectId) => !staleOrExpiredEffectIds.has(effectId),
        );
        for (const effectId of staleOrExpiredEffectIds) {
            delete state.effectInstances[effectId];
        }
    }
};

export const tickEffects = (
    state: GameState,
    hooks?: EffectTickHooks,
): void => {
    hooks?.onTickStart?.(state);

    tickPersonEffects(state, hooks);

    hooks?.onTickEnd?.(state);
};
