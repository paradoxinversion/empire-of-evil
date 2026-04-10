import type { EffectInstance, GameState, Person } from "../types/index.js";
import { createEffectInstance } from "../factories/index.js";

// ─── Types ────────────────────────────────────────────────────────────────────

interface PendingSpread {
    targetId: string;
    effectId: string;
    duration?: number;
}

/**
 * Per-tick indexes built once and shared across all effect processing.
 * Eliminates O(N) scans inside spread candidate selection.
 */
interface TickIndexes {
    /** Live (non-dead) persons grouped by zone ID. */
    personsByZone: Map<string, Person[]>;
    /** Set of active effect IDs (not instance IDs) per person. */
    effectIdsByPerson: Map<string, Set<string>>;
}

interface PersonEffectContext {
    state: GameState;
    random: () => number;
    pendingSpreads: PendingSpread[];
    /** O(1) dedup: `"${targetId}:${effectId}"` */
    pendingSpreadKeys: Set<string>;
    indexes: TickIndexes;
}

type PersonEffectResolver = (
    person: Person,
    effect: EffectInstance,
    context: PersonEffectContext,
) => void;

type EntityKind = "person" | "zone" | "tile" | "organization";

// ─── Public hook interface ────────────────────────────────────────────────────

export interface EffectTickHooks {
    onTickStart?: (state: GameState) => void;
    onEntityEffectTick?: (
        state: GameState,
        entityKind: EntityKind,
        effect: EffectInstance,
    ) => void;
    onTickEnd?: (state: GameState) => void;
    /** Override RNG for deterministic testing. */
    random?: () => number;
}

// ─── Index construction ───────────────────────────────────────────────────────

/**
 * Build per-tick lookup structures in a single O(N + E) pass.
 * Used to replace repeated O(N) scans in spread candidate selection.
 */
const buildTickIndexes = (state: GameState): TickIndexes => {
    const personsByZone = new Map<string, Person[]>();
    const effectIdsByPerson = new Map<string, Set<string>>();

    for (const person of Object.values(state.persons)) {
        if (!person.dead) {
            const list = personsByZone.get(person.zoneId);
            if (list) {
                list.push(person);
            } else {
                personsByZone.set(person.zoneId, [person]);
            }
        }
    }

    for (const instance of Object.values(state.effectInstances)) {
        if (instance.targetType !== "person") continue;
        let set = effectIdsByPerson.get(instance.targetId);
        if (!set) {
            set = new Set();
            effectIdsByPerson.set(instance.targetId, set);
        }
        set.add(instance.effectId);
    }

    return { personsByZone, effectIdsByPerson };
};

// ─── Helpers ──────────────────────────────────────────────────────────────────

const clamp01To100 = (value: number): number =>
    Math.max(0, Math.min(100, value));

const getLoyalty = (person: Person, orgId: string): number =>
    person.loyalties[orgId] ?? 0;

const setLoyalty = (person: Person, orgId: string, value: number): void => {
    person.loyalties[orgId] = clamp01To100(value);
};

const pickRivalOrgId = (person: Person): string | undefined => {
    const keys = Object.keys(person.loyalties);
    for (let i = 0; i < keys.length; i++) {
        if (keys[i] !== person.governingOrganizationId) return keys[i];
    }
    return undefined;
};

// ─── Spread ───────────────────────────────────────────────────────────────────

const PARTY_ANIMAL_SPREAD_CHANCE = 0.2;
const CONSPIRACY_THEORIES_SPREAD_CHANCE = 0.15;

const queueSpreadToZoneResident = (
    source: Person,
    effect: EffectInstance,
    context: PersonEffectContext,
    chance: number,
    citizensOnly: boolean,
): void => {
    if (context.random() >= chance) return;

    const residents = context.indexes.personsByZone.get(source.zoneId);
    if (!residents) return;

    const effectId = effect.effectId;
    const candidates: Person[] = [];

    for (let i = 0; i < residents.length; i++) {
        const person = residents[i]!;
        if (person.id === source.id) continue;
        if (citizensOnly && person.agentStatus) continue;
        if (context.indexes.effectIdsByPerson.get(person.id)?.has(effectId))
            continue;
        if (context.pendingSpreadKeys.has(`${person.id}:${effectId}`)) continue;
        candidates.push(person);
    }

    if (candidates.length === 0) return;

    const target =
        candidates[Math.floor(context.random() * candidates.length)]!;
    context.pendingSpreads.push({
        targetId: target.id,
        effectId,
        duration: effect.duration,
    });
    context.pendingSpreadKeys.add(`${target.id}:${effectId}`);
};

// ─── Resolvers ────────────────────────────────────────────────────────────────

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
    "party-animal": (person, effect, context) => {
        person.intelLevel = Math.max(0, person.intelLevel - 1);
        const orgId = person.governingOrganizationId;
        setLoyalty(person, orgId, getLoyalty(person, orgId) + 1);
        queueSpreadToZoneResident(
            person,
            effect,
            context,
            PARTY_ANIMAL_SPREAD_CHANCE,
            true,
        );
    },
    "conspiracy-theories": (person, effect, context) => {
        const govOrgId = person.governingOrganizationId;
        const rivalOrgId = pickRivalOrgId(person);
        if (rivalOrgId) {
            setLoyalty(person, govOrgId, getLoyalty(person, govOrgId) - 1);
            setLoyalty(person, rivalOrgId, getLoyalty(person, rivalOrgId) + 1);
        }
        queueSpreadToZoneResident(
            person,
            effect,
            context,
            CONSPIRACY_THEORIES_SPREAD_CHANCE,
            false,
        );
    },
};

const applyPersonEffect = (
    person: Person,
    effect: EffectInstance,
    context: PersonEffectContext,
): void => {
    const resolver = personResolvers[effect.effectId];
    if (resolver) resolver(person, effect, context);
};

// ─── Spread application ───────────────────────────────────────────────────────

const addSpreadEffects = (
    state: GameState,
    pendingSpreads: PendingSpread[],
): void => {
    for (const spread of pendingSpreads) {
        const target = state.persons[spread.targetId];
        if (!target || target.dead) continue;

        const base = {
            effectId: spread.effectId,
            targetId: target.id,
            targetType: "person" as const,
            appliedOnDate: state.date,
        };
        const instance =
            spread.duration !== undefined
                ? createEffectInstance({ ...base, duration: spread.duration })
                : createEffectInstance(base);

        state.effectInstances[instance.id] = instance;
        target.activeEffectIds.push(instance.id);
    }
};

// ─── Main tick ────────────────────────────────────────────────────────────────

const tickPersonEffects = (state: GameState, hooks?: EffectTickHooks): void => {
    const random = hooks?.random ?? Math.random;
    const pendingSpreads: PendingSpread[] = [];
    const pendingSpreadKeys = new Set<string>();
    const indexes = buildTickIndexes(state);

    for (const person of Object.values(state.persons)) {
        if (person.activeEffectIds.length === 0) continue;

        const staleOrExpired = new Set<string>();

        // Iterate the live array directly — nothing modifies activeEffectIds
        // until after this inner loop completes.
        for (let i = 0; i < person.activeEffectIds.length; i++) {
            const effectId = person.activeEffectIds[i]!;
            const effect = state.effectInstances[effectId];

            if (!effect) {
                staleOrExpired.add(effectId);
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
                applyPersonEffect(person, effect, {
                    state,
                    random,
                    pendingSpreads,
                    pendingSpreadKeys,
                    indexes,
                });
            }

            if (typeof effect.duration === "number") {
                if (effect.duration <= 0) {
                    staleOrExpired.add(effect.id);
                } else {
                    effect.duration -= 1;
                }
            }
        }

        if (staleOrExpired.size === 0) continue;

        person.activeEffectIds = person.activeEffectIds.filter(
            (id) => !staleOrExpired.has(id),
        );
        for (const id of staleOrExpired) {
            delete state.effectInstances[id];
        }
    }

    addSpreadEffects(state, pendingSpreads);
};

export const tickEffects = (
    state: GameState,
    hooks?: EffectTickHooks,
): void => {
    hooks?.onTickStart?.(state);
    tickPersonEffects(state, hooks);
    hooks?.onTickEnd?.(state);
};
