import type { GameState } from "../types/index.js";
import { applyEffect, type EffectDeclaration } from "../effects/apply.js";

export function startActivity(
    state: GameState,
    activityDefinitionId: string,
    _config: any,
): void {
    if (!state.activities) state.activities = {} as any;
    const id = `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
    const days = 1;
    const rec = {
        id,
        activityDefinitionId,
        assignedAgentIds: [],
        daysRemaining: days,
        status: "active",
    } as any;
    state.activities[rec.id] = rec;
}

export function cancelActivity(
    state: GameState,
    activeActivityId: string,
): void {
    if (!state.activities) return;
    delete state.activities[activeActivityId];
}

export function assignAgentToActivity(
    state: GameState,
    activityId: string,
    agentId: string,
): void {
    if (!state.activities) return;
    const act = state.activities[activityId];
    if (!act) return;
    if (!act.assignedAgentIds) act.assignedAgentIds = [];
    if (!act.assignedAgentIds.includes(agentId))
        act.assignedAgentIds.push(agentId);
}

export function removeAgentFromActivity(
    state: GameState,
    activityId: string,
    agentId: string,
): void {
    if (!state.activities) return;
    const act = state.activities[activityId];
    if (!act) return;
    act.assignedAgentIds = (act.assignedAgentIds || []).filter(
        (id: string) => id !== agentId,
    );
}

export const executeActivities = (state: GameState, config?: any): void => {
    if (!state.activities) return;
    const defs: Record<string, any> = {};
    for (const d of config?.activities ?? []) defs[d.id] = d;

    for (const id of Object.keys(state.activities)) {
        const rec = state.activities[id] as any;
        if (!rec || rec.status !== "active") continue;

        // For each assigned agent, apply configured effects (guard unknown resolvers)
        const def: { effects?: EffectDeclaration[] } | undefined =
            defs[rec.activityDefinitionId];
        if (def?.effects && Array.isArray(def.effects)) {
            for (const actorId of rec.assignedAgentIds ?? []) {
                const actor = state.persons[actorId];
                for (const eff of def.effects as EffectDeclaration[]) {
                    try {
                        applyEffect(eff, {
                            state,
                            actor,
                            zone: rec.targetZoneId
                                ? state.zones[rec.targetZoneId]
                                : undefined,
                        });
                    } catch (err) {
                        // Unknown effect types or resolver errors are ignored for now
                    }
                }
            }
        }

        if (typeof rec.daysRemaining === "number") {
            rec.daysRemaining -= 1;
        }
        if (typeof rec.daysRemaining === "number" && rec.daysRemaining <= 0) {
            // complete activity: remove and enqueue a simple informational event
            delete state.activities[id];
            state.pendingEvents = state.pendingEvents || [];
            state.pendingEvents.push({
                category: "informational",
                title: `Activity ${rec.activityDefinitionId} completed`,
                requiresResolution: false,
            });
        }
    }
};
