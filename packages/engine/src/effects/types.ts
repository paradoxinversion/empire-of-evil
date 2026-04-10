import type { GameState, Person, Zone } from "../types/index.js";

export const EVENT_EFFECT_TYPES = [
    "gain_resource",
    "gain_evil",
    "increase_loyalty",
    "skill_increase",
    "increase_intel",
    "reduce_citizen_loyalty",
    "civilian_combat_encounter",
    "capture_participant",
    "reduce_loyalty_target_zone",
    "siphon_citizen_funds",
    "create_captive",
] as const;

export type EventEffectType = (typeof EVENT_EFFECT_TYPES)[number];

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

export interface EventEffectDeclaration extends EffectDeclaration {
    type: EventEffectType;
}
