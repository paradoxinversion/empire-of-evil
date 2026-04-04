import type { GameState } from '../types/index.js';
import { simulateCitizens } from './citizens.js';
import { advancePlots } from '../plots/index.js';
import { executeActivities } from '../activities/index.js';
import { generateEvents } from '../events/generators/index.js';

export const runDay = (state: GameState): void => {
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
  advanceResearch(state);

  // 7. Resource settlement
  settleResources(state);

  // 8. CPU org actions
  processCpuOrgs(state);

  // 9. Event generation
  generateEvents(state);
};

// TODO: implement each phase below

const tickEffects = (_state: GameState): void => {};

const processBuildingOutput = (_state: GameState): void => {};

const advanceResearch = (_state: GameState): void => {};

const settleResources = (_state: GameState): void => {};

const processCpuOrgs = (_state: GameState): void => {};
