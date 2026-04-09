import type {
    GameState,
    Zone,
    Person,
    EffectInstance,
    Squad,
    Building,
} from "../types/index.js";
import type { Config, ResearchProjectDefinition } from "../config/loader.js";

type ResourceOutput = {
    money: number;
    science: number;
    infrastructure: number;
};

export const getZone = (state: GameState, id: string): Zone => {
    const zone = state.zones[id];
    if (!zone) throw new Error(`Zone not found: ${id}`);
    return zone;
};

type ZoneSearchParams = {
    id?: string;
    name?: string;
    nationId?: string;
    governingOrganizationId?: string;
};

export const getZones = (
    state: GameState,
    searchParams: ZoneSearchParams,
): Zone[] => {
    return Object.values(state.zones).filter((zone) => {
        if (searchParams.id && zone.id !== searchParams.id) return false;
        if (searchParams.name && zone.name !== searchParams.name) return false;
        if (searchParams.nationId && zone.nationId !== searchParams.nationId)
            return false;
        if (
            searchParams.governingOrganizationId &&
            zone.governingOrganizationId !==
                searchParams.governingOrganizationId
        )
            return false;
        return true;
    });
};

export const getZoneTiles = (state: GameState, zoneId: string): string[] => {
    return getZone(state, zoneId).tileIds;
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

type BuildingSearchParams = {
    id?: string;
    typeId?: string;
    zoneId?: string;
    tileId?: string;
    governingOrganizationId?: string;
};

export const getBuildings = (
    state: GameState,
    searchParams: BuildingSearchParams,
): Building[] => {
    return Object.values(state.buildings).filter((b) => {
        if (searchParams.id && b.id !== searchParams.id) return false;
        if (searchParams.typeId && b.typeId !== searchParams.typeId)
            return false;
        if (searchParams.zoneId) {
            const bZoneId = getBuildingZoneId(state, b as any);
            if (bZoneId !== searchParams.zoneId) return false;
        }
        if (searchParams.tileId && b.tileId !== searchParams.tileId)
            return false;
        if (
            searchParams.governingOrganizationId &&
            b.governingOrganizationId !== searchParams.governingOrganizationId
        )
            return false;
        return true;
    });
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
    const empireBuildings = getBuildings(state, {
        governingOrganizationId: state.empire.id,
    });
    return empireBuildings.reduce(
        (sum, b) => sum + getCurrentBuildingOutput(state, config, b.id).money,
        0,
    );
};

export const getCurrentBuildingOutput = (
    state: GameState,
    config: Config,
    buildingId: string,
): ResourceOutput => {
    const building = state.buildings[buildingId];
    if (!building) {
        return { money: 0, science: 0, infrastructure: 0 };
    }

    const definition = config.buildings.find((d) => d.id === building.typeId);
    const buildingZoneId = getBuildingZoneId(state, building);
    const base: ResourceOutput = {
        money: definition?.resourceOutput?.money ?? 0,
        science: definition?.resourceOutput?.science ?? 0,
        infrastructure: definition?.resourceOutput?.infrastructure ?? 0,
    };

    const assignedAgentIds = building.assignedAgentIds ?? [];
    const employedCitizenIds = Object.values(state.persons)
        .filter(
            (person) =>
                !person.dead &&
                !person.agentStatus &&
                person.employedBuildingId === buildingId,
        )
        .map((person) => person.id);
    const workerIds = Array.from(
        new Set([...assignedAgentIds, ...employedCitizenIds]),
    );
    const workers = workerIds
        .map((id) => state.persons[id])
        .filter(
            (person): person is Person =>
                Boolean(person) &&
                !person.dead &&
                person.zoneId === buildingZoneId,
        );

    if (workers.length === 0) {
        return base;
    }

    const preferredSkills = definition?.preferredSkills ?? [];
    const totalSkillScore = workers.reduce((sum, worker) => {
        if (preferredSkills.length === 0) {
            return sum;
        }

        const workerSkillTotal = preferredSkills.reduce(
            (skillSum, skill) => skillSum + (worker.skills[skill] ?? 0),
            0,
        );

        return sum + workerSkillTotal / preferredSkills.length;
    }, 0);

    const multiplier = 1 + workers.length * 0.1 + totalSkillScore / 500;

    return {
        money: Math.round(base.money * multiplier),
        science: Math.round(base.science * multiplier),
        infrastructure: Math.round(base.infrastructure * multiplier),
    };
};

export const getBuildingIncomeByZone = (
    state: GameState,
    config: Config,
): Record<string, number> => {
    const result: Record<string, number> = {};
    for (const b of getBuildings(state, {
        governingOrganizationId: state.empire.id,
    }) as Building[] as any) {
        const income = getCurrentBuildingOutput(state, config, b.id).money;
        const zoneId = getBuildingZoneId(state, b as any);
        result[zoneId] = (result[zoneId] ?? 0) + income;
    }
    return result;
};

export const getDailyBuildingUpkeep = (
    state: GameState,
    config: Config,
): number => {
    const empireBuildings = getBuildings(state, {
        governingOrganizationId: state.empire.id,
    });
    const defs = new Map(config.buildings.map((b) => [b.id, b]));
    return empireBuildings.reduce(
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
    for (const b of getBuildings(state, {
        governingOrganizationId: state.empire.id,
    }) as Building[] as any) {
        const upkeep = defs.get(b.typeId)?.upkeepPerDay ?? 0;
        const zoneId = getBuildingZoneId(state, b as any);
        result[zoneId] = (result[zoneId] ?? 0) + upkeep;
    }
    return result;
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
