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

    // 7. Resource settlement
    settleResources(state, config);

    // 8. CPU org actions
    processCpuOrgs(state);

    // 9. Event generation
    generateEvents(state);
};

// TODO: implement each phase below

const tickEffects = (_state: GameState): void => {};

const processBuildingOutput = (_state: GameState): void => {};

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
