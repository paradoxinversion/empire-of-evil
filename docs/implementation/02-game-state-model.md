# Game State Model

## Decision

All game data lives in a single **`GameState` object** with a normalized, flat entity model. Entities reference each other by string ID, never by direct object reference. The state is **mutated in place** during simulation, and serialized to JSON for save/load.

## Top-Level Structure

```typescript
type GameState = {
    // --- World entities (normalized lookup tables) ---
    tiles: Record<string, Tile>;
    zones: Record<string, Zone>;
    nations: Record<string, Nation>;
    buildings: Record<string, Building>;
    persons: Record<string, Person>; // citizens AND agents — same entity
    governingOrganizations: Record<string, GoverningOrganization>;

    // --- Active simulation state ---
    plots: Record<string, ActivePlot>;
    activities: Record<string, ActiveActivity>;
    research: Record<string, ActiveResearch>;
    captives: Record<string, Captive>;
    morgues: {
        byCitizen: Record<string, string[]>; // zoneId -> personId[]
        byAgent: Record<string, string[]>; // goId -> personId[]
    };

    // --- Empire ---
    empire: EmpireState;

    // --- Time ---
    date: number; // Day counter from game start (day 0)

    // --- Event queue ---
    pendingEvents: GameEvent[]; // Events awaiting player resolution
    eventLog: GameEventRecord[]; // Historical event log
};
```

## Entity Design Principles

### Normalized IDs everywhere

Entities never hold direct references to other entities — only their IDs. This makes the state fully serializable and eliminates circular reference issues.

```typescript
// Correct
interface Zone {
    id: string;
    nationId: string; // not: nation: Nation
    governingOrganizationId: string;
    tileIds: string[]; // not: tiles: Tile[]
    buildingIds: string[];
    // ...
}

// Correct — look up related entities via state
const zone = state.zones[zoneId];
const nation = state.nations[zone.nationId];
```

### Citizens and Agents are the same entity type

The GDD explicitly states: _"An agent is a citizen who has been recruited into the empire's service."_ There is no separate `Agent` type. A `Person` has an optional `agentStatus` field:

```typescript
interface Person {
    id: string;
    name: string;
    zoneId: string; // current location
    homeZoneId: string;
    governingOrganizationId: string; // who they "belong" to
    attributes: Record<string, number>; // attributeId -> value (0-100)
    skills: Record<string, number>; // skillId -> value (0-100)
    loyalties: Record<string, number>; // goId -> 0-100
    intelLevel: number; // empire's knowledge of this person (0-100)
    health: number; // 0-100; 0 = dead
    money: number; // personal finances
    activeEffectIds: string[]; // references to EffectInstance records
    agentStatus?: AgentStatus; // absent = civilian
    dead: boolean;
}

interface AgentStatus {
    job: AgentJob; // 'scientist' | 'administrator' | 'troop' | 'operative' | 'unassigned'
    squadId?: string;
    salary: number;
    departmentId?: string;
}
```

### Effects as Instances

Config defines **what an effect IS** (its id, category, description). Active effects on entities are **instances** that reference the config definition by ID and carry runtime parameters:

```typescript
interface EffectInstance {
    id: string; // unique instance id
    effectId: string; // references config/<config-set>/effects.json
    targetId: string; // entity this instance is on
    targetType: "person" | "zone" | "tile" | "organization";
    parameters?: Record<string, unknown>;
    duration?: number; // days remaining; undefined = permanent
    appliedOnDate: number;
}
```

Effect instances live in a dedicated lookup on state:

```typescript
type GameState = {
    // ...
    effectInstances: Record<string, EffectInstance>;
};
```

Entities store only the IDs of their active effect instances (`activeEffectIds: string[]`), not the instances themselves. This avoids duplication and makes bulk effect queries easy.

### EVIL Tracking

EVIL is dual-tracked per the GDD:

```typescript
interface EmpireState {
    id: string; // The empire's governingOrganizationId
    overlordId: string;
    resources: {
        money: number;
        science: number;
        infrastructure: number;
    };
    evil: {
        actual: number; // 0-100; true accumulated infamy
        perceived: number; // 0-100; what the world believes
    };
    innerCircleIds: string[]; // personIds
    petId: string;
    unlockedPlotIds: string[]; // researched/unlocked plot types
    unlockedActivityIds: string[];
}
```

## Mutable Simulation, Serializable State

The simulation mutates `GameState` in place for performance. With thousands of citizens per tick, creating new objects for every state transition would be prohibitively expensive in JavaScript.

**Invariant:** At any point between days, `GameState` must be fully serializable with `JSON.stringify`. This means:

- No functions stored in state
- No `undefined` values on required fields (use `exactOptionalPropertyTypes`)
- No class instances — only plain objects

**Save/Load** serializes the entire `GameState` to a JSON string and stores it in `localStorage`. On load, the JSON is parsed and passed to the engine. No migration layer is needed in MVP — breaking save compatibility is acceptable during early development.

## Date Representation

Dates are a single integer: the **day number** from the start of the game. Day 0 is the first day. This is simpler than a year/month/day structure and avoids calendar edge cases. Formatting for display (e.g., "Year 1, Day 47") is a presentation concern in the web package.

## Lookup Helpers

The engine exports helpers that prevent raw `Record` access from scattering:

```typescript
// packages/engine/src/state/queries.ts
export const getZone = (state: GameState, id: string): Zone => {
    const zone = state.zones[id];
    if (!zone) throw new Error(`Zone not found: ${id}`);
    return zone;
};

export const getPersonsInZone = (state: GameState, zoneId: string): Person[] =>
    Object.values(state.persons).filter((p) => p.zoneId === zoneId && !p.dead);

export const getActiveEffectsOnPerson = (
    state: GameState,
    personId: string,
): EffectInstance[] => {
    const person = state.persons[personId];
    return person.activeEffectIds.map((id) => state.effectInstances[id]);
};
```

These live in `packages/engine/src/state/queries.ts` and are the canonical way to traverse state relationships. They throw on missing IDs, which surfaces bugs early.
