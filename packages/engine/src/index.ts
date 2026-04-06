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
} from './types/index.js';

export { advanceTime } from './simulation/advance.js';
export type { AdvanceResult } from './simulation/advance.js';

export { resolveEvent } from './events/resolve.js';
export { generateWorld } from './worldGen/index.js';
export type { Config } from './config/loader.js';
export { applyEffect } from './effects/apply.js';
export type { EffectDeclaration } from './effects/apply.js';
export type { EffectContext, EffectResolver } from './effects/resolvers.js';

export {
  getZone,
  getPersonsInZone,
  getActiveEffectsOnPerson,
} from './state/queries.js';

export {
  createTile,
  createZone,
  createNation,
  createBuilding,
  createPerson,
  createGoverningOrganization,
  createEffectInstance,
} from './factories/index.js';
