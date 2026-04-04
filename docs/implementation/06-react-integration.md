# React Integration & State Management

## Decision

The React layer consumes engine state via a **Zustand store**. The simulation generator runs inside the store's action logic, driven by `setTimeout` between days to keep the UI responsive. The engine has zero React dependencies; the store is the only integration point.

## Store Shape

```typescript
// packages/web/src/store/gameStore.ts
import { create } from 'zustand';
import type { GameState, GameEvent } from '@empire-of-evil/engine';

type SimulationStatus =
  | 'idle'             // no game loaded
  | 'ready'            // game loaded, player taking their turn
  | 'running'          // time advancing
  | 'interrupted'      // paused for event resolution
  | 'victory'
  | 'defeat';

type GameStore = {
  // Game state — the engine's mutable object
  // Held by reference; React triggers re-renders via version counter
  gameState: GameState | null;
  version: number;                                 // incremented to trigger re-renders

  status: SimulationStatus;
  activeInterrupts: GameEvent[];                   // interrupt events awaiting resolution
  targetDate: number | null;                       // where we're advancing to

  // Actions
  newGame: (params: WorldGenParams) => void;
  loadGame: (json: string) => void;
  saveGame: () => string;
  advanceTo: (targetDate: number) => void;
  pauseAdvance: () => void;
  resolveEvent: (eventId: string, choiceIndex?: number) => void;
  resumeAfterInterrupt: () => void;
};
```

## Driving the Generator

```typescript
// packages/web/src/store/gameStore.ts (continued)

export const useGameStore = create<GameStore>((set, get) => {
  let simulationGenerator: Generator | null = null;
  let animationFrameId: number | null = null;

  const stepSimulation = () => {
    const { gameState, targetDate } = get();
    if (!gameState || targetDate === null || !simulationGenerator) return;

    const result = simulationGenerator.next();

    if (result.done) {
      simulationGenerator = null;
      set({ status: 'ready', targetDate: null });
      return;
    }

    const value = result.value;

    if (value.type === 'interrupted') {
      set(s => ({
        status: 'interrupted',
        activeInterrupts: value.events,
        version: s.version + 1,
      }));
      return; // do not schedule next step; wait for resolveEvent + resumeAfterInterrupt
    }

    // day_complete — update version to trigger re-renders, schedule next step
    set(s => ({ version: s.version + 1 }));
    animationFrameId = requestAnimationFrame(stepSimulation);
  };

  return {
    gameState: null,
    version: 0,
    status: 'idle',
    activeInterrupts: [],
    targetDate: null,

    newGame: (params) => {
      const { generateWorld } = await import('@empire-of-evil/engine');
      const gameState = generateWorld(params);
      set({ gameState, status: 'ready', version: 1 });
    },

    advanceTo: (targetDate) => {
      const { gameState } = get();
      if (!gameState) return;
      const { advanceTime } = await import('@empire-of-evil/engine');
      simulationGenerator = advanceTime(gameState, targetDate);
      set({ status: 'running', targetDate });
      animationFrameId = requestAnimationFrame(stepSimulation);
    },

    pauseAdvance: () => {
      if (animationFrameId !== null) cancelAnimationFrame(animationFrameId);
      simulationGenerator = null;
      set({ status: 'ready', targetDate: null });
    },

    resolveEvent: (eventId, choiceIndex) => {
      const { gameState } = get();
      if (!gameState) return;
      const { resolveEvent } = await import('@empire-of-evil/engine');
      resolveEvent(gameState, eventId, choiceIndex);
      const remaining = gameState.pendingEvents.filter(e => e.requiresResolution);
      set(s => ({
        activeInterrupts: remaining,
        version: s.version + 1,
      }));
    },

    resumeAfterInterrupt: () => {
      const { activeInterrupts, targetDate, gameState } = get();
      if (activeInterrupts.length > 0) return; // still unresolved events
      if (!targetDate || !gameState) return;
      const { advanceTime } = await import('@empire-of-evil/engine');
      simulationGenerator = advanceTime(gameState, targetDate);
      set({ status: 'running' });
      animationFrameId = requestAnimationFrame(stepSimulation);
    },

    saveGame: () => {
      const { gameState } = get();
      if (!gameState) throw new Error('No game to save');
      return JSON.stringify(gameState);
    },

    loadGame: (json) => {
      const gameState = JSON.parse(json) as GameState;
      set({ gameState, status: 'ready', version: 1 });
    },
  };
});
```

## Reading State in Components

Because `gameState` is mutated in place, components cannot use `gameState.someField` as a selector directly — it would never trigger re-renders. Instead, components subscribe to the `version` counter and read from `gameState` directly:

```typescript
// packages/web/src/hooks/useGameState.ts

export const useGameState = (): GameState => {
  // version subscription causes re-render when engine mutates state
  useGameStore(s => s.version);
  const gameState = useGameStore(s => s.gameState);
  if (!gameState) throw new Error('No game state');
  return gameState;
};

// Usage in a component:
const EmpireResourceBar = () => {
  const state = useGameState();
  const { money, science, infrastructure } = state.empire.resources;
  return <ResourceDisplay money={money} science={science} infra={infrastructure} />;
};
```

This is intentionally simple. Version-based invalidation means every component re-renders on every day tick. If profiling reveals this is too expensive, the optimization path is to split the store into sub-stores (resources, personnel, etc.) with their own version counters — but this is a post-MVP concern.

## Screen Structure

Each major screen in the GDD maps to a directory under `packages/web/src/screens/`:

```
screens/
  Empire/       # overview dashboard — resources, map, quick stats
  Intel/        # event log, intercepted comms, zone intel reports
  Personnel/    # agent roster, squads, inner circle, recruitment
  Economy/      # income/expense breakdown, building income, citizen taxes
  Science/      # research tree, active projects, completed research
  Plots/        # active plots, plot queue, available plots
  Activities/   # ongoing activities, participant management
  Events/       # interrupt event resolver (modal overlay pattern)
  World/        # the map view
```

Screens are lazy-loaded (`React.lazy`). The heavy simulation state is never imported by screen components directly — only through `useGameState`.

## The Time Advance UI

Per GDD §22.5, the player chooses to advance 1 day, 7 days, or to a specific date. The UI shows a simple control:

```
[ +1 Day ]  [ +7 Days ]  [ Choose Date... ]  [ Pause ]
```

These map directly to `store.advanceTo(state.date + 1)`, `advanceTo(state.date + 7)`, and `advanceTo(pickedDate)`.

The **Pause** button calls `store.pauseAdvance()`. The simulation stops cleanly between days (the generator is abandoned; state is consistent because `runDay` completes atomically before the generator yields).

## Interrupt Event Display

Interrupt events render as a blocking modal over whatever screen the player is on. The modal cannot be dismissed without resolution. It shows:

- Event title and narrative body
- Character portraits for `relatedEntityIds` (if agents or named persons)
- Choice buttons (if `choices` is present) or a single "Acknowledged" button

On resolution, `store.resolveEvent(id, choiceIndex)` is called. When `activeInterrupts` is empty, `store.resumeAfterInterrupt()` restarts the simulation if a target date is still pending.

## No React State for Game Data

All game data lives in the Zustand store, which wraps the engine's `GameState`. There is no `useState` or `useReducer` for game entities. Component-local state is limited to UI-only concerns: dropdown open/closed, selected tab, modal visibility, hover states.
