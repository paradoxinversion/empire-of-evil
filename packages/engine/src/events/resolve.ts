import type { GameState } from "../types/index.js";
import type {
    EffectContext,
    EffectDeclaration,
    EffectResolver,
    EventEffectType,
} from "../effects/types.js";
import { EVENT_EFFECT_TYPES } from "../effects/types.js";
import { createPerson } from "../factories/index.js";

function randBetween(min: number, max: number) {
    return min + Math.random() * (max - min);
}

function isEventEffectType(value: string): value is EventEffectType {
    return (EVENT_EFFECT_TYPES as readonly string[]).includes(value);
}

export const effectResolvers: Record<EventEffectType, EffectResolver> = {
    gain_resource: (ctx, params) => {
        const resource = String(params.resource ?? "money");
        const minA = Number(params.minAmount ?? 0);
        const maxA = Number(params.maxAmount ?? minA);
        const amt = Math.round(randBetween(minA, maxA));
        if (!ctx.state.empire.resources) return;
        if (resource in ctx.state.empire.resources) {
            // @ts-ignore
            ctx.state.empire.resources[resource] =
                (ctx.state.empire.resources as any)[resource] + amt;
        } else {
            // fallback: add to money
            ctx.state.empire.resources.money += amt;
        }
    },

    gain_evil: (ctx, params) => {
        const amount = Number(params.amount ?? 1);
        ctx.state.empire.evil.actual =
            (ctx.state.empire.evil.actual ?? 0) + amount;
    },

    increase_loyalty: (ctx, params) => {
        const minInc = Number(params.minIncrease ?? params.amount ?? 0);
        const maxInc = Number(params.maxIncrease ?? params.amount ?? minInc);
        const amt = randBetween(minInc, maxInc);
        const target = String(params.target ?? "participant");
        if (target === "participant" && ctx.actor) {
            const k = ctx.state.empire.id;
            ctx.actor.loyalties[k] = (ctx.actor.loyalties[k] ?? 0) + amt;
        } else if (target === "nearby_citizens" && ctx.actor) {
            // increase loyalty for citizens in same zone
            for (const p of Object.values(ctx.state.persons)) {
                if (p.zoneId === ctx.actor.zoneId) {
                    const k = ctx.state.empire.id;
                    p.loyalties[k] = (p.loyalties[k] ?? 0) + amt;
                }
            }
        }
    },

    skill_increase: (ctx, params) => {
        if (!ctx.actor) return;
        const minInc = Number(params.minIncrease ?? 0);
        const maxInc = Number(params.maxIncrease ?? minInc);
        const skills = (params.skills as string[]) ?? [];
        if (skills.length === 0) return;
        const pick = skills[Math.floor(Math.random() * skills.length)];
        const amt = randBetween(minInc, maxInc);
        ctx.actor.skills[pick] = (ctx.actor.skills[pick] ?? 0) + amt;
    },

    increase_intel: (ctx, params) => {
        const minInc = Number(params.minIncrease ?? 0);
        const maxInc = Number(params.maxIncrease ?? minInc);
        const amt = randBetween(minInc, maxInc);
        const target = String(params.target ?? "random_citizen");
        if (target === "random_citizen" && ctx.actor) {
            // pick a random citizen in actor's zone
            const zoneId = ctx.actor.zoneId;
            const candidates = Object.values(ctx.state.persons).filter(
                (p) => p.zoneId === zoneId,
            );
            if (candidates.length === 0) return;
            const pick =
                candidates[Math.floor(Math.random() * candidates.length)];
            pick.intelLevel = (pick.intelLevel ?? 0) + amt;
        }
    },

    reduce_citizen_loyalty: (ctx, params) => {
        const amount = Number(params.amount ?? 1);
        const target = String(params.target ?? "non_agent_citizens");
        if (!ctx.actor) return;
        if (target === "non_agent_citizens") {
            for (const p of Object.values(ctx.state.persons)) {
                if (p.zoneId === ctx.actor.zoneId && !p.agentStatus) {
                    const k = ctx.state.empire.id;
                    p.loyalties[k] = (p.loyalties[k] ?? 0) - amount;
                }
            }
        }
    },

    civilian_combat_encounter: (ctx, _params) => {
        const id = `combat-${ctx.state.date}-${ctx.state.pendingEvents.length}`;
        ctx.state.pendingEvents = ctx.state.pendingEvents || [];
        ctx.state.pendingEvents.push({
            id,
            category: "combat",
            title: "Civilian combat encountered",
            body: "",
            relatedEntityIds: [],
            requiresResolution: true,
            createdOnDate: ctx.state.date,
        });
    },

    capture_participant: (ctx, _params) => {
        if (!ctx.actor) return;
        const id = `captive-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        ctx.state.captives = ctx.state.captives || ({} as any);
        ctx.state.captives[id] = {
            id,
            personId: ctx.actor.id,
            capturedOnDate: ctx.state.date,
            zoneId: ctx.actor.zoneId,
        } as any;
        // remove agent status to mark captured
        if (ctx.actor.agentStatus) delete ctx.actor.agentStatus;
    },

    reduce_loyalty_target_zone: (ctx, params) => {
        const minA = Number(params.minAmount ?? 0);
        const maxA = Number(params.maxAmount ?? minA);
        const amt = randBetween(minA, maxA);
        const zoneId = (params.targetZoneId as string) ?? ctx.zone?.id;
        if (!zoneId) return;
        for (const p of Object.values(ctx.state.persons)) {
            if (p.zoneId === zoneId) {
                const k = ctx.state.empire.id;
                p.loyalties[k] = (p.loyalties[k] ?? 0) - amt;
            }
        }
    },

    siphon_citizen_funds: (ctx, params) => {
        const target = String(params.target ?? "empire_citizens");
        const amt = Number(params.amount ?? 1);
        if (target === "empire_citizens") {
            // find a random empire citizen and transfer funds
            const candidates = Object.values(ctx.state.persons).filter(
                (p) =>
                    p.governingOrganizationId === ctx.state.empire.id ||
                    p.loyalties?.[ctx.state.empire.id] >= 0,
            );
            if (candidates.length === 0) return;
            const pick =
                candidates[Math.floor(Math.random() * candidates.length)];
            pick.money = (pick.money ?? 0) - amt;
            ctx.state.empire.resources.money =
                (ctx.state.empire.resources.money ?? 0) + amt;
        } else if (target === "target_zone_citizens" && ctx.zone) {
            const candidates = Object.values(ctx.state.persons).filter(
                (p) => p.zoneId === ctx.zone?.id,
            );
            if (candidates.length === 0) return;
            const pick =
                candidates[Math.floor(Math.random() * candidates.length)];
            pick.money = (pick.money ?? 0) - amt;
            ctx.state.empire.resources.money =
                (ctx.state.empire.resources.money ?? 0) + amt;
        }
    },

    create_captive: (ctx, _params) => {
        const empireZone = Object.values(ctx.state.zones).find(
            (z) => z.governingOrganizationId === ctx.state.empire.id,
        );
        if (!empireZone) return;

        const person = createPerson({
            name: "Foreign Operative",
            zoneId: empireZone.id,
            homeZoneId: empireZone.id,
            governingOrganizationId: empireZone.governingOrganizationId,
        });
        ctx.state.persons[person.id] = person;

        const captiveId = `captive-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
        ctx.state.captives[captiveId] = {
            id: captiveId,
            personId: person.id,
            capturedOnDate: ctx.state.date,
            zoneId: empireZone.id,
        };
    },
};

export const applyEffect = (
    effectDecl: EffectDeclaration,
    context: EffectContext,
): void => {
    if (Math.random() > effectDecl.chance) return;
    if (!isEventEffectType(effectDecl.type)) {
        throw new Error(`Unknown effect type: "${effectDecl.type}"`);
    }
    const resolver = effectResolvers[effectDecl.type];
    resolver(context, effectDecl.parameters ?? {});
};

export const resolveEvent = (
    state: GameState,
    eventId: string,
    choiceIndex?: number,
): void => {
    const eventIndex = state.pendingEvents.findIndex(
        (event) => event.id === eventId,
    );
    if (eventIndex < 0) return;

    const [event] = state.pendingEvents.splice(eventIndex, 1);

    if (
        choiceIndex !== undefined &&
        event.choices &&
        event.choices[choiceIndex]
    ) {
        const choice = event.choices[choiceIndex];
        for (const effect of choice.effects) {
            applyEffect(effect, { state });
        }
    }

    state.eventLog.push(
        choiceIndex === undefined
            ? {
                  event,
                  resolvedOnDate: state.date,
              }
            : {
                  event,
                  resolvedOnDate: state.date,
                  choiceIndex,
              },
    );
};
