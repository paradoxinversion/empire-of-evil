export type {
  GameState,
  WorldGenParams,
  Tile,
  Zone,
  Nation,
  Building,
  Person,
  AgentStatus,
  AgentJob,
  GoverningOrganization,
  EmpireState,
  ActivePlot,
  ActiveActivity,
  ActiveResearch,
  Captive,
  EffectInstance,
  GameEvent,
  InterruptEvent,
  EventChoice,
  EventCategory,
  GameEventRecord,
  Squad,
  StandingOrder,
} from './types/index.js';

export { advanceTime } from './simulation/advance.js';
export type { AdvanceResult } from './simulation/advance.js';

export { resolveEvent } from './events/resolve.js';
export { generateWorld } from './worldGen/index.js';
export type { Config, TileTypeDefinition } from './config/loader.js';
export { applyEffect } from './effects/apply.js';
export type { EffectDeclaration } from './effects/apply.js';
export type { EffectContext, EffectResolver } from './effects/resolvers.js';

export {
  getZone,
  getPersonsInZone,
  getActiveEffectsOnPerson,
  getSquad,
  getAgentSquad,
  getSquadMembers,
  getDailyBuildingIncome,
  getBuildingIncomeByZone,
  getDailyBuildingUpkeep,
  getBuildingUpkeepByZone,
  getDailyAgentSalaries,
  getZoneTaxIncome,
} from './state/queries.js';

export {
  createTile,
  createZone,
  createNation,
  createBuilding,
  createPerson,
  createGoverningOrganization,
  createEffectInstance,
  createSquad,
} from './factories/index.js';
