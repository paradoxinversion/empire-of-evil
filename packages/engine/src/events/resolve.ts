import type { GameState } from "../types/index.js";
import { applyEffect } from "../effects/apply.js";

export const resolveEvent = (
    state: GameState,
    eventId: string,
    choiceIndex?: number,
): void => {
    const eventIndex = state.pendingEvents.findIndex(
        (event) => event.id === eventId,
    );
    if (eventIndex < 0) return;

    const [event] = state.pendingEvents.splice(eventIndex, 1);

    if (
        choiceIndex !== undefined &&
        event.choices &&
        event.choices[choiceIndex]
    ) {
        const choice = event.choices[choiceIndex];
        for (const effect of choice.effects) {
            applyEffect(effect, { state });
        }
    }

    state.eventLog.push({
        event,
        resolvedOnDate: state.date,
        choiceIndex,
    });
};
