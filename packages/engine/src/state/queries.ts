import type { GameState, Zone, Person, EffectInstance } from '../types/index.js';

export const getZone = (state: GameState, id: string): Zone => {
  const zone = state.zones[id];
  if (!zone) throw new Error(`Zone not found: ${id}`);
  return zone;
};

export const getPersonsInZone = (state: GameState, zoneId: string): Person[] =>
  Object.values(state.persons).filter(p => p.zoneId === zoneId && !p.dead);

export const getActiveEffectsOnPerson = (
  state: GameState,
  personId: string
): EffectInstance[] => {
  const person = state.persons[personId];
  if (!person) throw new Error(`Person not found: ${personId}`);
  return person.activeEffectIds.map(id => {
    const instance = state.effectInstances[id];
    if (!instance) throw new Error(`EffectInstance not found: ${id}`);
    return instance;
  });
};
