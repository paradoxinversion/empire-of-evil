import type { GameState } from '../types/index.js';

export const resolveEvent = (
  state: GameState,
  eventId: string,
  _choiceIndex?: number
): void => {
  // TODO: apply choice effects, move event from pendingEvents to eventLog
  state.pendingEvents = state.pendingEvents.filter(e => e.id !== eventId);
};
