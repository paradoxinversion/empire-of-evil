import { effectResolvers } from './resolvers.js';
import type { EffectContext } from './resolvers.js';

export interface EffectDeclaration {
  type: string;
  chance: number;
  parameters?: Record<string, unknown>;
}

export const applyEffect = (
  effectDecl: EffectDeclaration,
  context: EffectContext
): void => {
  if (Math.random() > effectDecl.chance) return;
  const resolver = effectResolvers[effectDecl.type];
  if (!resolver) throw new Error(`Unknown effect type: "${effectDecl.type}"`);
  resolver(context, effectDecl.parameters ?? {});
};
