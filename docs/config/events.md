# events.json — Config Contract

`config/default/events.json` defines the full catalog of in-game events. Each entry is an `EventDefinition` object validated by `EventDefinitionSchema` in `packages/engine/src/config/schemas/index.ts`.

---

## Schema

```typescript
EventDefinition {
    id: string                    // Unique kebab-case identifier
    category: EventCategory       // "combat" | "death" | "player_choice" | "evil_tier" | "informational"
    presentationTier: "notification" | "event" | "landmark"
    informationTier: "news_feed" | "intelligence_report" | "intercepted_communication"
    title: string
    body: string
    requiresResolution: boolean   // true → interrupt simulation; false → log-only
    recurrence: "once" | "recurring"
    trigger: EventTrigger         // Discriminated union — see below
    relatedEntityIds?: string[]   // Optional entity context (future dynamic binding)
    choices?: EventChoice[]       // Required when requiresResolution: true + player agency
}
```

---

## Trigger Types

All triggers are defined as a discriminated union on the `type` field. All variants use `.strict()` — unknown fields are rejected by the schema validator.

### `daily_chance`

Fires each simulated day with a random probability.

```json
{
    "type": "daily_chance",
    "chance": 0.05
}
```

| Field    | Type           | Notes                         |
| -------- | -------------- | ----------------------------- |
| `chance` | `number [0–1]` | Probability of firing per day |

Use this for events with no explicit state prerequisite — personality events, random incidents, flavor notifications.

---

### `resource_below`

Fires when the named empire resource is strictly below the threshold.

```json
{
    "type": "resource_below",
    "resource": "money",
    "threshold": 200
}
```

| Field       | Type                                       | Notes                       |
| ----------- | ------------------------------------------ | --------------------------- |
| `resource`  | `"money" \| "science" \| "infrastructure"` | Which resource to check     |
| `threshold` | `number`                                   | Strict less-than comparison |

Use this for economic stress events. This trigger fires **every day** the condition is true, so `"recurring"` events on this trigger can fire repeatedly — use `"once"` for staged-escalation entries that should fire only once per playthrough.

---

### `evil_perceived_at_least`

Fires when `state.empire.evil.perceived >= threshold`.

```json
{
    "type": "evil_perceived_at_least",
    "threshold": 20
}
```

| Field       | Type             | Notes                             |
| ----------- | ---------------- | --------------------------------- |
| `threshold` | `number [0–100]` | Minimum perceived evil to trigger |

Use this for EVIL tier shift landmarks (fire once at tier-crossing perceived evil values: 20, 40, 60, 80) and for events gated on world attention.

---

## Routing: `requiresResolution`

This field is the definitive signal for whether an event blocks simulation:

| Value   | Route                     | Effect                                                                         |
| ------- | ------------------------- | ------------------------------------------------------------------------------ |
| `true`  | `state.pendingEvents`     | Simulation pauses; interrupt modal shown; player must resolve before advancing |
| `false` | `state.eventLog` directly | Event logged immediately; simulation continues uninterrupted                   |

The `advanceTime()` generator in `simulation/advance.ts` yields `{ type: "interrupted" }` only when `pendingEvents` has any entry with `requiresResolution: true`. Non-blocking events never trigger an interrupt.

---

## Recurrence

| Value         | Behavior                                                                                                          |
| ------------- | ----------------------------------------------------------------------------------------------------------------- |
| `"once"`      | Once an event with this ID appears in `pendingEvents` **or** `eventLog`, it is skipped on subsequent evaluations. |
| `"recurring"` | Evaluated every day unless the trigger condition is not met.                                                      |

The `wasAlreadyFired(state, definitionId)` guard in `generators/index.ts` enforces `"once"` by checking both collections.

---

## Choices

Events with `requiresResolution: true` should declare `choices` when player agency is intended. Each choice resolves through `applyEffect()`.

```json
{
    "choices": [
        {
            "label": "TERMINATE",
            "effects": [
                {
                    "type": "gain_evil",
                    "chance": 1,
                    "parameters": { "amount": 5 }
                }
            ]
        },
        {
            "label": "Release",
            "effects": []
        }
    ]
}
```

| Field     | Type            | Notes                                      |
| --------- | --------------- | ------------------------------------------ |
| `label`   | `string`        | Display text for the choice button         |
| `effects` | `EventEffect[]` | Zero or more effects applied on resolution |

An event without `choices` (or with an empty array) that `requiresResolution: true` will render an "Acknowledge" button in the interrupt modal.

---

## `EventChoice.effects` Schema

Each effect in a choice follows:

```typescript
EventEffect {
    type: string          // Effect type key — must match a registered effectResolver
    chance: number        // [0–1] probability this effect fires on resolution
    parameters?: object   // Type-specific parameters passed to the resolver
}
```

All effects execute via the single call site `applyEffect()` in `packages/engine/src/effects/apply.ts`. No event-specific outcome logic lives in runtime code.

---

## Adding a New Event

1. Add an entry to `config/default/events.json`
2. Schema validates on engine init — unknown fields cause a startup error
3. If your event requires a new trigger type:
    - Add a new `.strict()` object branch to `EventTriggerSchema` discriminated union in `schemas/index.ts`
    - Write a failing test in `events/__tests__/events-runtime.test.ts` for the trigger resolver
    - Add the `case` to `triggerMatches()` in `events/generators/index.ts`
4. If your event applies new effect types, add a resolver to `effectResolvers` in `effects/resolvers.ts`

No other code changes are needed.

---

## Presentation Tiers

| Tier           | Interrupts                              | Usage                                                                                     |
| -------------- | --------------------------------------- | ----------------------------------------------------------------------------------------- |
| `notification` | No                                      | Minor flags, passive intel, flavor. Player reviews in Events > FEED.                      |
| `event`        | Yes (if `requiresResolution: true`)     | Named incidents requiring acknowledgment or a player decision.                            |
| `landmark`     | Yes (always `requiresResolution: true`) | One-time major events with significant mechanical consequences. Multi-stage progressions. |

---

## Information Tiers

Determines the visual badge style and implied source in the Events FEED:

| Tier                        | UI Type             | Implied source                                            |
| --------------------------- | ------------------- | --------------------------------------------------------- |
| `news_feed`                 | `"news"` badge      | Public information; wire-service tone                     |
| `intelligence_report`       | `"intel"` badge     | Active surveillance; quality scales with intel investment |
| `intercepted_communication` | `"intercept"` badge | Personal, specific; requires Surveillance Tap or similar  |
