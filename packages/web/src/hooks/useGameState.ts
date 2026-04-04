import type { GameState } from '@empire-of-evil/engine';
import { useGameStore } from '../store/gameStore.js';

export const useGameState = (): GameState => {
  useGameStore(s => s.version);
  const gameState = useGameStore(s => s.gameState);
  if (!gameState) throw new Error('No game state — render this hook only when a game is loaded');
  return gameState;
};
