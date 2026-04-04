import type { GameState, InterruptEvent } from '../types/index.js';
import { runDay } from './day.js';

export type AdvanceResult =
  | { type: 'day_complete'; date: number }
  | { type: 'interrupted'; events: InterruptEvent[] };

export function* advanceTime(
  state: GameState,
  targetDate: number
): Generator<AdvanceResult> {
  while (state.date < targetDate) {
    runDay(state);
    const interrupts = state.pendingEvents.filter(
      (e): e is InterruptEvent => e.requiresResolution
    );
    if (interrupts.length > 0) {
      yield { type: 'interrupted', events: interrupts };
      return;
    }
    yield { type: 'day_complete', date: state.date };
  }
}
