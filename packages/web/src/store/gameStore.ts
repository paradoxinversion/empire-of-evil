import { create } from 'zustand';
import type { GameState, GameEvent, WorldGenParams, StandingOrder } from '@empire-of-evil/engine';
import type { Config, ResearchProjectDefinition } from '@empire-of-evil/engine';

// Import bundled config JSON files (Vite resolves these at build time)
import tileTypes from '../../../../config/default/tileTypes.json';
import buildings from '../../../../config/default/buildings.json';
import pets from '../../../../config/default/pets.json';
import worldgenDefaults from '../../../../config/default/worldgen.json';
import activities from '../../../../config/default/activities.json';
import citizenActions from '../../../../config/default/citizenActions.json';
import cpuBehaviors from '../../../../config/default/cpuBehaviors.json';
import effects from '../../../../config/default/effects.json';
import evilTiers from '../../../../config/default/evilTiers.json';
import personAttributes from '../../../../config/default/personAttributes.json';
import plots from '../../../../config/default/plots.json';
import researchProjects from '../../../../config/default/researchProjects.json';
import skills from '../../../../config/default/skills.json';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BUNDLED_CONFIG: Config = {
  tileTypes: tileTypes as Config['tileTypes'],
  buildings: buildings as Config['buildings'],
  pets: pets as Config['pets'],
  worldgen: worldgenDefaults as Config['worldgen'],
  activities: activities as unknown[],
  citizenActions: citizenActions as unknown[],
  cpuBehaviors: cpuBehaviors as unknown[],
  effects: effects as unknown[],
  evilTiers: evilTiers as unknown[],
  personAttributes: personAttributes as unknown[],
  plots: plots as unknown[],
  researchProjects: researchProjects as ResearchProjectDefinition[],
  skills: skills as unknown[],
};

export type SimulationStatus =
  | 'idle'
  | 'ready'
  | 'running'
  | 'interrupted'
  | 'victory'
  | 'defeat';

export type GameStore = {
  gameState: GameState | null;
  version: number;
  status: SimulationStatus;
  activeInterrupts: GameEvent[];
  targetDate: number | null;

  newGame: (params: WorldGenParams) => void;
  loadGame: (json: string) => void;
  saveGame: () => string;
  advanceTo: (targetDate: number) => void;
  pauseAdvance: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;
  resumeAfterInterrupt: () => void;
  createSquad: (name: string, homeZoneId?: string) => void;
  addAgentToSquad: (squadId: string, agentId: string) => void;
  removeAgentFromSquad: (squadId: string, agentId: string) => void;
  updateSquadOrders: (squadId: string, orders: StandingOrder) => void;
  setZoneTaxRate: (zoneId: string, taxRate: number) => void;
  startResearch: (projectId: string) => void;
  cancelResearch: (researchId: string) => void;
  assignAgentToResearch: (researchId: string, agentId: string) => void;
  removeAgentFromResearch: (researchId: string, agentId: string) => void;
};

export const useGameStore = create<GameStore>((set, get) => {
  // eslint-disable-next-line prefer-const
  let simulationGenerator: Generator | null = null;
  let animationFrameId: number | null = null;

  const stepSimulation = () => {
    const { gameState, targetDate } = get();
    if (!gameState || targetDate === null || !simulationGenerator) return;

    const result = simulationGenerator.next();

    if (result.done) {
      simulationGenerator = null;
      set({ status: 'ready', targetDate: null });
      return;
    }

    const value = result.value as { type: string; events?: GameEvent[] };

    if (value.type === 'interrupted') {
      simulationGenerator = null;
      set(s => ({
        status: 'interrupted',
        activeInterrupts: value.events ?? [],
        version: s.version + 1,
      }));
      return;
    }

    set(s => ({ version: s.version + 1 }));
    animationFrameId = requestAnimationFrame(stepSimulation);
  };

  return {
    gameState: null,
    version: 0,
    status: 'idle',
    activeInterrupts: [],
    targetDate: null,

    newGame: (params) => {
      import('@empire-of-evil/engine').then(({ generateWorld }) => {
        const gameState = generateWorld(params, BUNDLED_CONFIG);
        set({ gameState, status: 'ready', version: 1 });
      });
    },

    advanceTo: (targetDate) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ advanceTime }) => {
        simulationGenerator = advanceTime(gameState, targetDate, BUNDLED_CONFIG);
        set({ status: 'running', targetDate });
        animationFrameId = requestAnimationFrame(stepSimulation);
      });
    },

    pauseAdvance: () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      simulationGenerator = null;
      set({ status: 'ready', targetDate: null });
    },

    resolveEvent: (eventId, choiceIndex) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ resolveEvent }) => {
        resolveEvent(gameState, eventId, choiceIndex);
        const remaining = gameState.pendingEvents.filter((e) => e.requiresResolution);
        set(s => ({
          activeInterrupts: remaining,
          version: s.version + 1,
        }));
      });
    },

    resumeAfterInterrupt: () => {
      const { activeInterrupts, targetDate, gameState } = get();
      if (activeInterrupts.length > 0 || !targetDate || !gameState) return;
      import('@empire-of-evil/engine').then(({ advanceTime }) => {
        simulationGenerator = advanceTime(gameState, targetDate, BUNDLED_CONFIG);
        set({ status: 'running' });
        animationFrameId = requestAnimationFrame(stepSimulation);
      });
    },

    saveGame: () => {
      const { gameState } = get();
      if (!gameState) throw new Error('No game to save');
      return JSON.stringify(gameState);
    },

    loadGame: (json) => {
      const gameState = JSON.parse(json) as GameState;
      set({ gameState, status: 'ready', version: 1 });
    },

    createSquad: (name, homeZoneId) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ createSquad }) => {
        const squad = createSquad({
          name,
          ...(homeZoneId !== undefined ? { homeZoneId } : {}),
        });
        gameState.squads[squad.id] = squad;
        set(s => ({ version: s.version + 1 }));
      });
    },

    addAgentToSquad: (squadId, agentId) => {
      const { gameState } = get();
      if (!gameState) return;
      const squad = gameState.squads[squadId];
      if (!squad || squad.memberIds.includes(agentId)) return;
      squad.memberIds.push(agentId);
      const person = gameState.persons[agentId];
      if (person?.agentStatus) {
        person.agentStatus.squadId = squadId;
      }
      set(s => ({ version: s.version + 1 }));
    },

    removeAgentFromSquad: (squadId, agentId) => {
      const { gameState } = get();
      if (!gameState) return;
      const squad = gameState.squads[squadId];
      if (!squad) return;
      squad.memberIds = squad.memberIds.filter(id => id !== agentId);
      const person = gameState.persons[agentId];
      if (person?.agentStatus?.squadId === squadId) {
        delete person.agentStatus.squadId;
      }
      set(s => ({ version: s.version + 1 }));
    },

    updateSquadOrders: (squadId, orders) => {
      const { gameState } = get();
      if (!gameState) return;
      const squad = gameState.squads[squadId];
      if (!squad) return;
      squad.standingOrders = orders;
      set(s => ({ version: s.version + 1 }));
    },

    setZoneTaxRate: (zoneId, taxRate) => {
      const { gameState } = get();
      if (!gameState) return;
      const zone = gameState.zones[zoneId];
      if (!zone) return;
      zone.taxRate = Math.max(0, Math.min(1, taxRate));
      set(s => ({ version: s.version + 1 }));
    },

    startResearch: (projectId) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ startResearch }) => {
        startResearch(gameState, projectId, BUNDLED_CONFIG);
        set(s => ({ version: s.version + 1 }));
      });
    },

    cancelResearch: (researchId) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ cancelResearch }) => {
        cancelResearch(gameState, researchId);
        set(s => ({ version: s.version + 1 }));
      });
    },

    assignAgentToResearch: (researchId, agentId) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ assignAgentToResearch }) => {
        assignAgentToResearch(gameState, researchId, agentId);
        set(s => ({ version: s.version + 1 }));
      });
    },

    removeAgentFromResearch: (researchId, agentId) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ removeAgentFromResearch }) => {
        removeAgentFromResearch(gameState, researchId, agentId);
        set(s => ({ version: s.version + 1 }));
      });
    },
  };
});
