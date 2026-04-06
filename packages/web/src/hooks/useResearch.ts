import type { ActiveResearch, Person } from '@empire-of-evil/engine';
import type { ResearchProjectDefinition } from '@empire-of-evil/engine';
import {
    isResearchCompleted,
    isResearchActive,
    isResearchAvailable,
    getResearchProgressPct,
} from '@empire-of-evil/engine';
import { useGameState } from './useGameState.js';
import { BUNDLED_CONFIG } from '../store/gameStore.js';

export type ResearchStatus = 'completed' | 'active' | 'available' | 'locked';

export type EnrichedProject = {
    definition: ResearchProjectDefinition;
    status: ResearchStatus;
    activeRecord: ActiveResearch | null;
    progressPct: number;
    daysRemaining: number;
    assignedAgents: Person[];
};

const BRANCH_ORDER = [
    'surveillance-control',
    'military-hardware',
    'materials-engineering',
    'biology-medicine',
    'social-propaganda',
    'economic-disruption',
] as const;

function deriveStatus(
    state: Parameters<typeof isResearchCompleted>[0],
    config: typeof BUNDLED_CONFIG,
    projectId: string,
): ResearchStatus {
    if (isResearchCompleted(state, projectId)) return 'completed';
    if (isResearchActive(state, projectId)) return 'active';
    if (isResearchAvailable(state, config, projectId)) return 'available';
    return 'locked';
}

export function useResearch(): {
    projectsByBranch: Record<string, EnrichedProject[]>;
    activeResearches: EnrichedProject[];
    completedCount: number;
    scienceBalance: number;
    availableScientists: Person[];
} {
    const state = useGameState();
    const config = BUNDLED_CONFIG;

    const assignedAgentIds = new Set(
        Object.values(state.research).flatMap(r => r.assignedAgentIds),
    );

    const availableScientists = Object.values(state.persons).filter(
        p => !p.dead && p.agentStatus?.job === 'scientist' && !assignedAgentIds.has(p.id),
    );

    const enrichProject = (def: ResearchProjectDefinition): EnrichedProject => {
        const status = deriveStatus(state, config, def.id);
        const activeRecord =
            status === 'active'
                ? (Object.values(state.research).find(r => r.projectId === def.id) ?? null)
                : null;
        const progressPct = activeRecord
            ? getResearchProgressPct(state, config, activeRecord.id)
            : status === 'completed' ? 100 : 0;
        const daysRemaining = activeRecord?.daysRemaining ?? 0;
        const assignedAgents = activeRecord
            ? activeRecord.assignedAgentIds
                .map(id => state.persons[id])
                .filter((p): p is Person => p !== undefined && !p.dead)
            : [];
        return { definition: def, status, activeRecord, progressPct, daysRemaining, assignedAgents };
    };

    const projectsByBranch: Record<string, EnrichedProject[]> = {};
    for (const branch of BRANCH_ORDER) {
        projectsByBranch[branch] = config.researchProjects
            .filter(p => p.branch === branch)
            .map(enrichProject);
    }
    // Any branches not in our ordered list go at the end
    for (const project of config.researchProjects) {
        if (!BRANCH_ORDER.includes(project.branch as typeof BRANCH_ORDER[number])) {
            if (!projectsByBranch[project.branch]) {
                projectsByBranch[project.branch] = [];
            }
            projectsByBranch[project.branch].push(enrichProject(project));
        }
    }

    const activeResearches = Object.values(state.research)
        .map(record => {
            const def = config.researchProjects.find(p => p.id === record.projectId);
            if (!def) return null;
            return enrichProject(def);
        })
        .filter((p): p is EnrichedProject => p !== null);

    const completedCount = state.empire.unlockedResearchIds.length;

    return {
        projectsByBranch,
        activeResearches,
        completedCount,
        scienceBalance: state.empire.resources.science,
        availableScientists,
    };
}
