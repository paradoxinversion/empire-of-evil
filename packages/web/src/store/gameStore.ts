import { create } from 'zustand';
import type { GameState, GameEvent, WorldGenParams } from '@empire-of-evil/engine';

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
        const gameState = generateWorld(params);
        set({ gameState, status: 'ready', version: 1 });
      });
    },

    advanceTo: (targetDate) => {
      const { gameState } = get();
      if (!gameState) return;
      import('@empire-of-evil/engine').then(({ advanceTime }) => {
        simulationGenerator = advanceTime(gameState, targetDate);
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
        simulationGenerator = advanceTime(gameState, targetDate);
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
  };
});
