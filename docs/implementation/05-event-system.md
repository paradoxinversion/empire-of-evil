# Event System

## Decision

Events are the bridge between simulation outcomes and player experience. The engine generates two kinds of events: **interrupt events** (which pause time and require player input) and **log events** (informational; recorded for later review). Both types are plain data — the event system does not contain UI logic.

## Event Type Hierarchy

```typescript
// packages/engine/src/events/types.ts

type GameEventBase = {
    id: string;
    date: number; // day it was generated
    category: EventCategory;
    title: string;
    body: string; // narrative text; may contain flavor
    relatedEntityIds: string[]; // persons, zones, orgs involved
};

// Informational — goes to the event log
type LogEvent = GameEventBase & {
    requiresResolution: false;
};

// Interrupting — pauses time advancement; player must resolve before continuing
type InterruptEvent = GameEventBase & {
    requiresResolution: true;
    choices?: EventChoice[]; // if absent, player just acknowledges
    resolvedChoiceIndex?: number; // set when player resolves
};

type GameEvent = LogEvent | InterruptEvent;

type EventChoice = {
    label: string;
    description: string;
    effects: EffectDeclaration[]; // applied via effectResolvers on resolution
};

type EventCategory =
    | "combat"
    | "character_death"
    | "character_injury"
    | "plot_resolution"
    | "evil_tier_change"
    | "resource_milestone"
    | "world_response"
    | "citizen_activity"
    | "intelligence"
    | "recruitment"
    | "research_complete"
    | "succession";
```

## Event Generation

Events are generated during the `generateEvents` phase of the daily tick. Each event generator is a function that inspects state and pushes events to `state.pendingEvents`:

```typescript
// packages/engine/src/events/generators/

// Each generator is registered in a central list
const eventGenerators: Array<(state: GameState) => void> = [
    checkCombatOutcomes,
    checkCharacterDeaths,
    checkEvilTierTransition,
    checkPlotResolutions,
    checkResearchCompletion,
    checkWorldResponse,
    checkCitizenMilestones,
];

export const generateEvents = (state: GameState): void => {
    for (const generator of eventGenerators) {
        generator(state);
    }
};
```

Generators add to `state.pendingEvents`. The simulation loop collects interrupt events after `generateEvents` runs (see `03-simulation-engine.md`).

## Plot Resolution Events

Plot outcomes are the most event-rich content area. When a plot stage completes:

1. The plot advancement logic resolves success/failure.
2. A `plot_resolution` event is generated.
3. If the plot has a branching choice (Tier 2+), the event has a `choices` array. The interrupt fires and the player selects an option.
4. On resolution, the chosen `effects` array is processed via `applyEffect`.
5. If the plot has more stages, the next stage is initialized.

```typescript
// After-action-report text is generated from the plot definition's
// named outcomes, enriched with the actual agents involved and their
// skill levels. This gives each resolution a unique flavor tied to
// the specific characters in play.
const buildPlotResolutionEvent = (
    plot: ActivePlot,
    definition: PlotDefinition,
    outcome: "success" | "failure",
    state: GameState,
): GameEvent => {
    const agents = plot.assignedAgentIds.map((id) => state.persons[id]);
    const stage = definition.stages[plot.currentStageIndex];
    // Narrative text references agent names and attributes
    const body = interpolateNarrative(stage.outcomes[outcome].narrative, {
        agents,
        zone: plot.targetZoneId ? state.zones[plot.targetZoneId] : undefined,
    });
    return {
        id: generateId(),
        date: state.date,
        category: "plot_resolution",
        title: `${definition.name} — ${outcome === "success" ? "Succeeded" : "Failed"}`,
        body,
        relatedEntityIds: plot.assignedAgentIds,
        requiresResolution: stage.branchingChoice != null,
        choices: stage.branchingChoice?.options.map((opt) => ({
            label: opt.label,
            description: opt.description,
            effects: opt.effects,
        })),
    };
};
```

## Resolving Player Choices

When the player resolves an interrupt event, the web layer calls:

```typescript
// packages/engine/src/events/resolve.ts

export const resolveEvent = (
    state: GameState,
    eventId: string,
    choiceIndex?: number,
): void => {
    const event = state.pendingEvents.find((e) => e.id === eventId);
    if (!event) throw new Error(`Event not found: ${eventId}`);
    if (!event.requiresResolution) return;

    if (event.choices && choiceIndex !== undefined) {
        const choice = event.choices[choiceIndex];
        const context: EffectContext = {
            state,
            // Context derived from event's relatedEntityIds as appropriate
        };
        for (const effect of choice.effects) {
            applyEffect(effect, context);
        }
        (event as InterruptEvent).resolvedChoiceIndex = choiceIndex;
    }

    // Move from pending to log
    state.pendingEvents = state.pendingEvents.filter((e) => e.id !== eventId);
    state.eventLog.push({
        ...event,
        requiresResolution: false,
    } as GameEventRecord);
};
```

After all pending interrupt events are resolved, the simulation generator can be resumed.

## Event Log

The event log is the primary narrative record of the game. It holds all resolved events (interrupt and log) in chronological order. The Intel screen presents it with filtering by category, entity, and date range.

```typescript
type GameEventRecord = GameEvent & {
    resolvedChoiceIndex?: number;
    resolvedOnDate?: number;
};
```

The log is capped at a configurable maximum length (default 10,000 entries). Oldest entries are dropped when the cap is reached. This is an acceptable tradeoff for the MVP; a ring buffer or pagination strategy is a post-MVP concern.

## NPC Commentary Events

The GDD calls for intercepted communications, espionage reports, and overheard conversations that reflect the player's choices back at them (§2.4). These are generated as `log events` (non-interrupting) of category `intelligence`.

They are created by inspecting the last N days of the event log and constructing commentary from CPU org and citizen perspective. They reference actual events that happened (plot names, agents involved, zone names) to ground them in the simulation.

The content of these messages is templated: the engine fills in entity names and outcomes from the log. Template files live alongside config (e.g., `config/<config-set>/narrative/interceptedComms.json`) and follow the same Zod schema validation pattern.

## EVIL Tier Transition Events

When `perceived EVIL` crosses a tier boundary (see `config/<config-set>/evilTiers.json`), an interrupt event fires before the next day runs:

```typescript
const checkEvilTierTransition = (state: GameState): void => {
    const previousTier = getEvilTier(state.empire.evil.previousPerceived);
    const currentTier = getEvilTier(state.empire.evil.perceived);
    if (currentTier === previousTier) return;

    const tier = evilTiersConfig.find((t) => t.name === currentTier);
    state.pendingEvents.push({
        id: generateId(),
        date: state.date,
        category: "evil_tier_change",
        title: `EVIL Classification Updated: ${currentTier}`,
        body: tier.playerFacingDescription,
        relatedEntityIds: [],
        requiresResolution: true, // player must acknowledge tier shifts
    });
};
```

Tier transition events are acknowledgment-only (no choices) — they exist to ensure the player cannot miss that the world's response is escalating.
