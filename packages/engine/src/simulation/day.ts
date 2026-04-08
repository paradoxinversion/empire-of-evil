import type { GameState } from "../types/index.js";
import type { Config } from "../config/loader.js";
import {
    getBuildingIncomeByZone,
    getBuildingUpkeepByZone,
} from "../state/queries.js";
import { simulateCitizens } from "./citizens.js";
import { advancePlots } from "../plots/index.js";
import { executeActivities } from "../activities/index.js";
import { generateEvents } from "../events/generators/index.js";
import { advanceResearch } from "./research.js";

export const runDay = (state: GameState, config: Config): void => {
    state.date += 1;

    // 1. Tick effect durations
    tickEffects(state);

    // 2. Citizen simulation
    simulateCitizens(state);

    // 3. Building output
    processBuildingOutput(state);

    // 4. Plot advancement
    advancePlots(state);

    // 5. Activity execution
    executeActivities(state);

    // 6. Research advancement
    advanceResearch(state, config);

    // 7. Squad standing orders
    executeStandingOrders(state);

    // 8. Resource settlement
    settleResources(state, config);

    // 9. CPU org actions
    processCpuOrgs(state);

    // 10. Event generation
    generateEvents(state);
};

// TODO: implement each phase below

const tickEffects = (_state: GameState): void => {};

const processBuildingOutput = (_state: GameState): void => {};

export const executeStandingOrders = (state: GameState): void => {
    for (const squad of Object.values(state.squads)) {
        if (squad.memberIds.length === 0) continue;

        const activeMemberIds = squad.memberIds.filter((memberId) => {
            const person = state.persons[memberId];
            return !!person && !person.dead && !!person.agentStatus;
        });
        if (activeMemberIds.length === 0) continue;

        const fallbackZoneId = state.persons[activeMemberIds[0]]?.zoneId;
        const zoneId = squad.homeZoneId ?? fallbackZoneId;
        const zone = zoneId ? state.zones[zoneId] : undefined;
        const order = squad.standingOrders ?? "IDLE";

        switch (order) {
            case "DEFEND_ZONE":
                if (zone) {
                    zone.intelLevel = Math.min(100, zone.intelLevel + 1);
                }
                break;

            case "RUN_RECONNAISSANCE":
                if (zone) {
                    zone.intelLevel = Math.min(100, zone.intelLevel + 2);
                }
                break;

            case "MAINTAIN_ACTIVITY": {
                if (!zoneId) break;
                const targetActivity = Object.values(state.activities).find(
                    (activity) => activity.zoneId === zoneId,
                );
                if (!targetActivity) break;
                for (const memberId of activeMemberIds) {
                    if (!targetActivity.assignedAgentIds.includes(memberId)) {
                        targetActivity.assignedAgentIds.push(memberId);
                    }
                }
                break;
            }

            case "COUNTERINTELLIGENCE":
                if (zone) {
                    zone.intelLevel = Math.min(100, zone.intelLevel + 1);
                }
                break;

            case "MANAGE_STABILITY":
                if (zone) {
                    zone.taxRate = Math.max(0, zone.taxRate - 0.01);
                }
                break;

            case "ESCORT_OVERLORD": {
                if (!zoneId) break;
                const overlord = state.persons[state.empire.overlordId];
                if (overlord && !overlord.dead) {
                    overlord.zoneId = zoneId;
                }
                break;
            }

            case "IDLE":
            default:
                break;
        }
    }
};

export const settleResources = (state: GameState, config?: Config): void => {
    if (!config) return;

    const incomeByZone = getBuildingIncomeByZone(state, config);
    const upkeepByZone = getBuildingUpkeepByZone(state, config);

    let empireIncome = 0;
    let empireUpkeep = 0;

    for (const [zoneId, income] of Object.entries(incomeByZone)) {
        const zone = state.zones[zoneId];
        if (!zone) continue;
        if (zone.governingOrganizationId === state.empire.id)
            empireIncome += income;
    }

    for (const [zoneId, upkeep] of Object.entries(upkeepByZone)) {
        const zone = state.zones[zoneId];
        if (!zone) continue;
        if (zone.governingOrganizationId === state.empire.id)
            empireUpkeep += upkeep;
    }

    state.empire.resources.money += empireIncome - empireUpkeep;
};

const processCpuOrgs = (_state: GameState): void => {};
