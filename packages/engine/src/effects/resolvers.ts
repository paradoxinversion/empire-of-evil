import type { GameState, Person, Zone } from '../types/index.js';

export interface EffectContext {
  state: GameState;
  actor?: Person;
  target?: Person;
  zone?: Zone;
}

export type EffectResolver = (
  context: EffectContext,
  parameters: Record<string, unknown>
) => void;

export const effectResolvers: Record<string, EffectResolver> = {
  // TODO: implement resolvers — skill_increase, increase_loyalty, increase_intel,
  // apply_effect, remove_effect, gain_resource, damage_building, trigger_event,
  // civilian_combat_encounter, …
};
