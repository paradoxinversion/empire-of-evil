import type { GameState } from "../types/index.js";
import type { Config } from "../config/loader.js";

export const advancePlots = (state: GameState, _config?: Config): void => {
    for (const [id, record] of Object.entries(state.plots)) {
        // decrement days
        record.daysRemaining -= 1;

        if (record.daysRemaining <= 0) {
            // complete the plot — fire an informational event and remove the active record
            const event = {
                id: globalThis.crypto.randomUUID(),
                category: "informational",
                title: "Plot Complete",
                body: `Plot ${record.plotDefinitionId} has completed.`,
                relatedEntityIds: [],
                requiresResolution: false,
                createdOnDate: state.date,
            } as any;
            state.pendingEvents.push(event);
            delete state.plots[id];
        }
    }
};

export const startPlot = (
    state: GameState,
    plotDefinitionId: string,
    config: Config,
    targetZoneId?: string,
): void => {
    const def = (config.plots as any[]).find((p) => p.id === plotDefinitionId);
    if (!def) throw new Error(`Plot definition not found: ${plotDefinitionId}`);

    // if prerequisites (research) not met, no-op
    const prereqs: string[] = def.requirements?.researchIds ?? [];
    for (const id of prereqs) {
        if (!state.empire.unlockedResearchIds.includes(id)) return;
    }

    // disallow duplicate active plot of same definition
    const alreadyActive = Object.values(state.plots).some(
        (p) => p.plotDefinitionId === plotDefinitionId,
    );
    if (alreadyActive) return;

    // resource cost
    const cost = def.requirements?.resourceCosts?.money ?? 0;
    const requiredZoneCount = def.requirements?.zoneCount ?? 0;
    if (requiredZoneCount > 0 && !targetZoneId) return;
    if (state.empire.resources.money < cost) return;
    state.empire.resources.money -= cost;

    const days = def.stages?.[0]?.durationDays ?? def.durationDays ?? 1;

    const record = {
        id: globalThis.crypto.randomUUID(),
        plotDefinitionId,
        currentStageIndex: 0,
        assignedAgentIds: [],
        ...(targetZoneId ? { targetZoneId } : {}),
        daysRemaining: days,
        accumulatedSuccessScore: 0,
        status: "active",
    } as any;

    state.plots[record.id] = record;
};

export const cancelPlot = (state: GameState, activePlotId: string): void => {
    delete state.plots[activePlotId];
};

export const assignAgentToPlot = (
    state: GameState,
    activePlotId: string,
    agentId: string,
): void => {
    const record = state.plots[activePlotId];
    if (!record) return;
    if (!record.assignedAgentIds.includes(agentId)) {
        record.assignedAgentIds.push(agentId);
    }
};

export const removeAgentFromPlot = (
    state: GameState,
    activePlotId: string,
    agentId: string,
): void => {
    const record = state.plots[activePlotId];
    if (!record) return;
    record.assignedAgentIds = record.assignedAgentIds.filter(
        (id) => id !== agentId,
    );
};
