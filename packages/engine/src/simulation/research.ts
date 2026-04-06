import type { GameState, ActiveResearch, GameEvent } from '../types/index.js';
import type { Config } from '../config/loader.js';

// ─── Daily simulation ─────────────────────────────────────────────────────────

export const advanceResearch = (state: GameState, config: Config): void => {
    for (const [researchId, record] of Object.entries(state.research)) {
        const project = config.researchProjects.find(p => p.id === record.projectId);
        if (!project) continue;

        // Accumulate science from assigned scientists
        for (const agentId of record.assignedAgentIds) {
            const person = state.persons[agentId];
            if (!person || person.dead) continue;
            const driverCount = project.skillDrivers.length;
            if (driverCount === 0) continue;
            const dailyScore = project.skillDrivers.reduce(
                (sum, driver) => sum + (person.skills[driver] ?? 0),
                0,
            ) / driverCount;
            record.accumulatedScore += dailyScore;
        }

        record.daysRemaining -= 1;

        const isComplete =
            record.daysRemaining <= 0 ||
            record.accumulatedScore >= project.scienceRequired;

        if (isComplete) {
            // Unlock the project
            if (!state.empire.unlockedResearchIds.includes(record.projectId)) {
                state.empire.unlockedResearchIds.push(record.projectId);
            }
            for (const id of project.unlocks.plotIds) {
                if (!state.empire.unlockedPlotIds.includes(id)) {
                    state.empire.unlockedPlotIds.push(id);
                }
            }
            for (const id of project.unlocks.activityIds) {
                if (!state.empire.unlockedActivityIds.includes(id)) {
                    state.empire.unlockedActivityIds.push(id);
                }
            }

            const event: GameEvent = {
                id: globalThis.crypto.randomUUID(),
                category: 'informational',
                title: 'Research Complete',
                body: `"${project.name}" research has been completed.`,
                relatedEntityIds: [],
                requiresResolution: false,
                createdOnDate: state.date,
            };
            state.pendingEvents.push(event);

            delete state.research[researchId];
        }
    }
};

// ─── Player mutations ─────────────────────────────────────────────────────────

export const startResearch = (
    state: GameState,
    projectId: string,
    config: Config,
): void => {
    const project = config.researchProjects.find(p => p.id === projectId);
    if (!project) throw new Error(`Research project not found: ${projectId}`);

    if (state.empire.unlockedResearchIds.includes(projectId)) return;

    const alreadyActive = Object.values(state.research).some(
        r => r.projectId === projectId,
    );
    if (alreadyActive) return;

    for (const prereqId of project.prerequisites) {
        if (!state.empire.unlockedResearchIds.includes(prereqId)) return;
    }

    if (state.empire.resources.money < project.cost) return;

    state.empire.resources.money -= project.cost;

    const record: ActiveResearch = {
        id: globalThis.crypto.randomUUID(),
        projectId,
        assignedAgentIds: [],
        daysRemaining: project.completionDays,
        accumulatedScore: 0,
    };
    state.research[record.id] = record;
};

export const cancelResearch = (state: GameState, researchId: string): void => {
    delete state.research[researchId];
};

export const assignAgentToResearch = (
    state: GameState,
    researchId: string,
    agentId: string,
): void => {
    const record = state.research[researchId];
    if (!record) return;
    if (!record.assignedAgentIds.includes(agentId)) {
        record.assignedAgentIds.push(agentId);
    }
};

export const removeAgentFromResearch = (
    state: GameState,
    researchId: string,
    agentId: string,
): void => {
    const record = state.research[researchId];
    if (!record) return;
    record.assignedAgentIds = record.assignedAgentIds.filter(id => id !== agentId);
};
