# Simulation Engine

## Decision

The simulation uses a **generator-based daily tick** that mutates `GameState` in place. The generator yields control between days, enabling interrupt handling (pausing for player decisions) and non-blocking UI updates without Web Workers in the MVP.

## The Daily Tick Loop

```typescript
// packages/engine/src/simulation/advance.ts

export type AdvanceResult =
    | { type: "day_complete"; date: number }
    | { type: "interrupted"; events: InterruptEvent[] };

export function* advanceTime(
    state: GameState,
    targetDate: number,
): Generator<AdvanceResult> {
    while (state.date < targetDate) {
        runDay(state);
        const interrupts = collectInterrupts(state);
        if (interrupts.length > 0) {
            // Move interrupt events to pending queue; caller is responsible for resolving them
            state.pendingEvents.push(...interrupts);
            yield { type: "interrupted", events: interrupts };
            return; // caller must resume the generator after resolving events
        }
        yield { type: "day_complete", date: state.date };
    }
}
```

The generator is driven by the React layer (see `06-react-integration.md`). Between each `yield`, the UI can update and check for user interaction. The generator **does not use `setTimeout` or `requestAnimationFrame`** — that scheduling is the caller's responsibility.

## `runDay` Phase Order

Each day runs phases in a fixed sequence. Phase order matters because outputs of earlier phases feed into later ones.

```typescript
// packages/engine/src/simulation/day.ts

export const runDay = (state: GameState): void => {
    state.date += 1;

    // 1. Tick effect durations — decrement countdown, remove expired instances
    tickEffects(state);

    // 2. Citizen simulation — every living, non-incapacitated person takes their daily actions
    simulateCitizens(state);

    // 3. Building output — staffed buildings generate resources
    processBuildingOutput(state);

    // 4. Plot advancement — move plots forward by one day; resolve completed/failed plots
    advancePlots(state);

    // 5. Activity execution — execute one day of each active activity
    executeActivities(state);

    // 6. Research advancement — progress active research projects
    advanceResearch(state);

    // 7. Resource settlement — tally income, deduct expenses, handle shortfalls
    settleResources(state);

    // 8. CPU org actions — each non-empire GO takes its daily action
    processCpuOrgs(state);

    // 9. Event generation — evaluate triggers, create new events
    generateEvents(state);
};
```

## Citizen Simulation

Citizens are processed one by one. This is the most computationally expensive phase. Each citizen gets a list of eligible actions (filtered by their status, zone, loyalty, and attributes), then one or more actions are selected by a weighted random draw.

```typescript
// packages/engine/src/simulation/citizens.ts

const simulateCitizens = (state: GameState): void => {
    for (const person of Object.values(state.persons)) {
        if (person.dead) continue;
        if (isIncapacitated(person, state)) continue;
        simulatePersonDay(person, state);
    }
};

const simulatePersonDay = (person: Person, state: GameState): void => {
    const zone = state.zones[person.zoneId];
    const eligibleActions = getEligibleActions(person, zone, state);
    if (eligibleActions.length === 0) return;

    // Most citizens take one action; some may take two
    const action = weightedRandom(eligibleActions);
    executeCitizenAction(action, person, state);
};
```

Citizen action definitions come from `config/<config-set>/citizenActions.json`. Each action definition has:

- Eligibility conditions (attribute thresholds, zone conditions, loyalty ranges, required effects)
- Weight modifiers (how personality traits affect likelihood)
- Effects (what the action does to the person, the zone, or other persons)

## Interrupt Events

Not all events interrupt time. The GDD specifies that **only certain categories** pause advancement:

| Category                        | Example                    | Interrupts?      |
| ------------------------------- | -------------------------- | ---------------- |
| Combat encounter                | Citizen attacks agent      | Yes              |
| Named character death or injury | Agent killed in plot       | Yes              |
| Mandatory player choice         | Branching plot resolution  | Yes              |
| EVIL tier threshold crossed     | Entering "Menace" tier     | Yes              |
| Informational                   | Resource milestone reached | No (logged only) |

```typescript
type InterruptEvent = GameEvent & { requiresResolution: true };

const collectInterrupts = (state: GameState): InterruptEvent[] => {
    // Events are added to state.pendingEvents during generateEvents()
    // This function filters for those requiring player resolution
    return state.pendingEvents.filter(
        (e) => e.requiresResolution,
    ) as InterruptEvent[];
};
```

## Performance Approach

For the MVP, all simulation runs synchronously on the main thread. A world with several hundred zones and thousands of citizens should process a single day in well under 100ms in JavaScript, which is acceptable. The generator yields between days, so the UI remains responsive during multi-day advances.

If profiling reveals that citizen simulation dominates (the most likely bottleneck), the first optimization is to **skip citizens who cannot meaningfully act**: dead, jailed, and incapacitated persons are all short-circuits before any action evaluation.

Premature optimization beyond this is deferred to post-MVP. Web Worker offloading is a post-MVP option if needed.

## Plot Resolution Pipeline

Plots have multi-stage lifecycles. An `ActivePlot` in state tracks current stage and accumulated progress:

```typescript
interface ActivePlot {
    id: string;
    plotDefinitionId: string; // references config/<config-set>/plots.json
    currentStageIndex: number;
    assignedAgentIds: string[];
    targetZoneId?: string;
    targetPersonId?: string;
    daysRemaining: number; // for current stage
    accumulatedSuccessScore: number; // skill rolls accumulated so far
    status:
        | "traveling"
        | "active"
        | "awaiting_resolution"
        | "complete"
        | "failed";
}
```

Each day, `advancePlots` decrements `daysRemaining`. When it hits zero:

1. Resolve the current stage using accumulated skill scores vs. the plot definition's success thresholds.
2. If the plot has more stages: transition to the next stage and create a branching `InterruptEvent` if required.
3. If the plot is single-stage or on its final stage: generate outcome effects and mark complete or failed.

Plot outcome effects are resolved by the **Effect System** (see `04-data-driven-design.md`).

## Activity Execution

Activities are simpler than plots — they fire once per day per assigned agent and apply their effects. Each day:

1. For each `ActiveActivity`, iterate assigned agents.
2. For each agent, roll the activity's chance-based effects.
3. Apply resolved effects via the effect resolver.

Activities do not have stages or travel time. An agent assigned to an activity is assumed to be in-zone.

## Resource Settlement

After buildings generate and activities fire, `settleResources` computes the daily balance:

```typescript
const settleResources = (state: GameState): void => {
    const income = computeDailyIncome(state); // building output + citizen taxes
    const expenses = computeDailyExpenses(state); // salaries + upkeep + plot costs

    state.empire.resources.money += income.money - expenses.money;
    state.empire.resources.science += income.science - expenses.science;
    state.empire.resources.infrastructure +=
        income.infrastructure - expenses.infrastructure;

    if (state.empire.resources.money < 0) {
        handleMoneyShortfall(state); // loyalty decay, agent defection risk
    }
};
```

Resources are allowed to go negative (the empire does not automatically prevent overspending). Running deeply negative money triggers escalating consequences applied via the effect system.

## World Generation

World generation is a one-time synchronous operation at game start. It does not use the generator pattern — it runs to completion and returns a fully initialized `GameState`. The procedural steps follow the GDD order: map → nations → zones → CPU orgs → buildings → population → empire genesis.

World generation parameters (nation count, zone density, population density, map dimensions) are passed as a `WorldGenParams` object. Defaults come from a config file but can be overridden at game start.
