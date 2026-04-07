import type {
    GameState,
    Zone,
    Person,
    EffectInstance,
    Squad,
    Building,
} from "../types/index.js";
import type { Config, ResearchProjectDefinition } from "../config/loader.js";

export const getZone = (state: GameState, id: string): Zone => {
    const zone = state.zones[id];
    if (!zone) throw new Error(`Zone not found: ${id}`);
    return zone;
};

export const getPersonsInZone = (state: GameState, zoneId: string): Person[] =>
    Object.values(state.persons).filter((p) => p.zoneId === zoneId && !p.dead);

export const getActiveEffectsOnPerson = (
    state: GameState,
    personId: string,
): EffectInstance[] => {
    const person = state.persons[personId];
    if (!person) throw new Error(`Person not found: ${personId}`);
    return person.activeEffectIds.map((id) => {
        const instance = state.effectInstances[id];
        if (!instance) throw new Error(`EffectInstance not found: ${id}`);
        return instance;
    });
};

// ─── Squad queries ────────────────────────────────────────────────────────────

export const getSquad = (state: GameState, id: string): Squad => {
    const squad = state.squads[id];
    if (!squad) throw new Error(`Squad not found: ${id}`);
    return squad;
};

export const getAgentSquad = (
    state: GameState,
    agentId: string,
): Squad | undefined =>
    Object.values(state.squads).find((s) => s.memberIds.includes(agentId));

export const getSquadMembers = (
    state: GameState,
    squadId: string,
): Person[] => {
    const squad = getSquad(state, squadId);
    return squad.memberIds.map((id) => {
        const p = state.persons[id];
        if (!p) throw new Error(`Person not found: ${id}`);
        return p;
    });
};

// ─── Income / expense queries ─────────────────────────────────────────────────

export const getDailyBuildingIncome = (
    state: GameState,
    config: Config,
): number => {
    const defs = new Map(config.buildings.map((b) => [b.id, b]));
    return Object.values(state.buildings).reduce(
        (sum, b) => sum + (defs.get(b.typeId)?.resourceOutput?.money ?? 0),
        0,
    );
};

export const getBuildingIncomeByZone = (
    state: GameState,
    config: Config,
): Record<string, number> => {
    const defs = new Map(config.buildings.map((b) => [b.id, b]));
    const result: Record<string, number> = {};
    for (const b of Object.values(state.buildings)) {
        const income = defs.get(b.typeId)?.resourceOutput?.money ?? 0;
        const zoneId = getBuildingZoneId(state, b as any);
        result[zoneId] = (result[zoneId] ?? 0) + income;
    }
    return result;
};

export const getDailyBuildingUpkeep = (
    state: GameState,
    config: Config,
): number => {
    const defs = new Map(config.buildings.map((b) => [b.id, b]));
    return Object.values(state.buildings).reduce(
        (sum, b) => sum + (defs.get(b.typeId)?.upkeepPerDay ?? 0),
        0,
    );
};

export const getBuildingUpkeepByZone = (
    state: GameState,
    config: Config,
): Record<string, number> => {
    const defs = new Map(config.buildings.map((b) => [b.id, b]));
    const result: Record<string, number> = {};
    for (const b of Object.values(state.buildings)) {
        const upkeep = defs.get(b.typeId)?.upkeepPerDay ?? 0;
        const zoneId = getBuildingZoneId(state, b as any);
        result[zoneId] = (result[zoneId] ?? 0) + upkeep;
    }
    return result;
};

export const getBuildingZoneId = (
    state: GameState,
    building: Building | { zoneId: string; tileId?: string },
): string => {
    const tileId = (building as any).tileId as string | undefined;
    if (tileId) {
        const tile = state.tiles[tileId];
        if (tile && tile.zoneId) return tile.zoneId;
    }
    return building.zoneId;
};

export const getDailyAgentSalaries = (state: GameState): number =>
    Object.values(state.persons)
        .filter((p) => p.agentStatus !== undefined && !p.dead)
        .reduce((sum, p) => sum + p.agentStatus!.salary, 0);

export const getZoneTaxIncome = (zone: Zone): number =>
    zone.economicOutput * zone.taxRate;

// ─── Research queries ─────────────────────────────────────────────────────────

export const getResearchProject = (
    config: Config,
    projectId: string,
): ResearchProjectDefinition => {
    const project = config.researchProjects.find((p) => p.id === projectId);
    if (!project) throw new Error(`Research project not found: ${projectId}`);
    return project;
};

export const isResearchCompleted = (
    state: GameState,
    projectId: string,
): boolean => state.empire.unlockedResearchIds.includes(projectId);

export const isResearchActive = (
    state: GameState,
    projectId: string,
): boolean =>
    Object.values(state.research).some((r) => r.projectId === projectId);

export const isResearchAvailable = (
    state: GameState,
    config: Config,
    projectId: string,
): boolean => {
    if (isResearchCompleted(state, projectId)) return false;
    if (isResearchActive(state, projectId)) return false;
    const project = config.researchProjects.find((p) => p.id === projectId);
    if (!project) return false;
    return project.prerequisites.every((id) => isResearchCompleted(state, id));
};

export const getResearchProgressPct = (
    state: GameState,
    config: Config,
    researchId: string,
): number => {
    const record = state.research[researchId];
    if (!record) return 0;
    const project = config.researchProjects.find(
        (p) => p.id === record.projectId,
    );
    if (!project) return 0;
    const byScore =
        project.scienceRequired > 0
            ? record.accumulatedScore / project.scienceRequired
            : 0;
    const byDays =
        project.completionDays > 0
            ? (project.completionDays - record.daysRemaining) /
              project.completionDays
            : 0;
    return Math.min(100, Math.round(Math.max(byScore, byDays) * 100));
};

export const getEmpireTiles = (state: GameState, zoneId?: string): string[] => {
    const tileIds = new Set<string>();
    for (const zone of Object.values(state.zones)) {
        if (zone.governingOrganizationId === state.empire.id) {
            if (!zoneId || zone.id === zoneId) {
                zone.tileIds.forEach((id) =>
                    state.tiles[id]
                        ? tileIds.add(id)
                        : console.warn(
                              `Tile ID ${id} from zone ${zone.id} not found in tiles record`,
                          ),
                );
            }
        }
    }
    return Array.from(tileIds);
};

export const getZoneTiles = (state: GameState, zoneId: string): string[] => {
    const zone = state.zones[zoneId];
    if (!zone) throw new Error(`Zone not found: ${zoneId}`);
    return zone.tileIds;
};
