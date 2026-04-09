import type { GameState } from "../../types/index.js";
import type { Config, EventDefinition } from "../../config/loader.js";

function triggerMatches(state: GameState, eventDef: EventDefinition): boolean {
    switch (eventDef.trigger.type) {
        case "daily_chance":
            return Math.random() < eventDef.trigger.chance;
        case "resource_below": {
            const resourceValue =
                state.empire.resources[eventDef.trigger.resource];
            return resourceValue < eventDef.trigger.threshold;
        }
        case "evil_perceived_at_least":
            return state.empire.evil.perceived >= eventDef.trigger.threshold;
        default:
            return false;
    }
}

function wasAlreadyFired(state: GameState, definitionId: string): boolean {
    const activeMatch = state.pendingEvents.some(
        (event) => event.definitionId === definitionId,
    );
    if (activeMatch) return true;
    return state.eventLog.some(
        (record) => record.event.definitionId === definitionId,
    );
}

export const generateEvents = (state: GameState, config: Config): void => {
    for (const eventDef of config.events) {
        if (
            eventDef.recurrence === "once" &&
            wasAlreadyFired(state, eventDef.id)
        ) {
            continue;
        }

        if (!triggerMatches(state, eventDef)) {
            continue;
        }

        const event = {
            id: `${eventDef.id}-${state.date}-${state.pendingEvents.length + state.eventLog.length}`,
            definitionId: eventDef.id,
            category: eventDef.category,
            presentationTier: eventDef.presentationTier,
            informationTier: eventDef.informationTier,
            title: eventDef.title,
            body: eventDef.body,
            relatedEntityIds: eventDef.relatedEntityIds ?? [],
            requiresResolution: eventDef.requiresResolution,
            choices: eventDef.choices,
            createdOnDate: state.date,
        };

        if (event.requiresResolution) {
            state.pendingEvents.push(event);
        } else {
            state.eventLog.push({
                event,
                resolvedOnDate: state.date,
            });
        }
    }
};
