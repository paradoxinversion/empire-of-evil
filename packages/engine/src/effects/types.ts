import type { GameState, Person, Zone } from "../types/index.js";

export interface EffectContext {
    state: GameState;
    actor?: Person;
    target?: Person;
    zone?: Zone;
}

export type EffectResolver = (
    context: EffectContext,
    parameters: Record<string, unknown>,
) => void;

export interface EffectDeclaration {
    type: string;
    chance: number;
    parameters?: Record<string, unknown>;
}
