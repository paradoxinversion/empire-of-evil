import type { Config } from "../config/loader.js";
import type { GameState } from "../types/index.js";

function isAssignedElsewhere(
    state: GameState,
    buildingId: string,
    agentId: string,
): boolean {
    const isAssignedToPlot = Object.values(state.plots).some((plot) =>
        plot.assignedAgentIds.includes(agentId),
    );
    if (isAssignedToPlot) return true;

    const isAssignedToActivity = Object.values(state.activities).some(
        (activity) => activity.assignedAgentIds.includes(agentId),
    );
    if (isAssignedToActivity) return true;

    return Object.values(state.buildings).some(
        (building) =>
            building.id !== buildingId &&
            (building.assignedAgentIds?.includes(agentId) ?? false),
    );
}

export const assignAgentToBuilding = (
    state: GameState,
    buildingId: string,
    agentId: string,
    config: Config,
): void => {
    const building = state.buildings[buildingId];
    if (!building) return;
    const person = state.persons[agentId];
    if (!person?.agentStatus || person.dead) return;

    const definition = config.buildings.find(
        (entry) => entry.id === building.typeId,
    );
    const capacity = definition?.capacity ?? 0;
    if (capacity <= 0) return;
    if (isAssignedElsewhere(state, buildingId, agentId)) return;

    if (!building.assignedAgentIds) {
        building.assignedAgentIds = [];
    }
    if (building.assignedAgentIds.length >= capacity) return;
    if (!building.assignedAgentIds.includes(agentId)) {
        building.assignedAgentIds.push(agentId);
    }
};

export const removeAgentFromBuilding = (
    state: GameState,
    buildingId: string,
    agentId: string,
): void => {
    const building = state.buildings[buildingId];
    if (!building?.assignedAgentIds) return;
    building.assignedAgentIds = building.assignedAgentIds.filter(
        (id) => id !== agentId,
    );
    if (building.assignedAgentIds.length === 0) {
        delete building.assignedAgentIds;
    }
};
