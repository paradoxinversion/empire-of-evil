import type { GameState, WorldGenParams } from '../types/index.js';

export const generateWorld = (_params: WorldGenParams): GameState => {
  const empireGoId = 'empire-go';
  const overlordId = 'overlord';
  const petId = 'pet';

  return {
    tiles: {},
    zones: {},
    nations: {},
    buildings: {},
    persons: {},
    governingOrganizations: {},
    plots: {},
    activities: {},
    research: {},
    captives: {},
    effectInstances: {},
    morgues: {
      byCitizen: {},
      byAgent: {},
    },
    empire: {
      id: empireGoId,
      overlordId,
      petId,
      resources: { money: 0, science: 0, infrastructure: 0 },
      evil: { actual: 0, perceived: 0 },
      innerCircleIds: [],
      unlockedPlotIds: [],
      unlockedActivityIds: [],
    },
    date: 0,
    pendingEvents: [],
    eventLog: [],
  };
};
