# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project State

Pre-implementation. Architecture is fully designed in `docs/implementation/`; only stubs and config files exist so far. The `common/` and `lib/` directories are legacy stubs — all new code goes in `packages/engine/` and `packages/web/`.

## Build & Dev Commands

The workspace is pnpm workspaces (`packages/*`). Once set up:

```
pnpm install                                      # install all workspace deps
pnpm --filter @empire-of-evil/engine build
pnpm --filter @empire-of-evil/web build
pnpm --filter @empire-of-evil/web dev             # Vite dev server
pnpm --filter @empire-of-evil/engine test         # engine tests (no browser required)
```

## Architecture

Full ADRs are in `docs/implementation/01–06`. Summary of what matters most day-to-day:

### Package boundary

`packages/engine` is pure TypeScript — **no browser or React imports ever**. `packages/web` (React/Vite) imports from `@empire-of-evil/engine`. The engine can be tested and run without a browser.

### GameState

Single mutable `GameState` object. Entities live in flat `Record<string, Entity>` lookup maps. Entities reference each other by string ID only — never by direct object reference. The state is mutated in place during simulation and must be `JSON.stringify`-able at all times between days.

Lookup helpers in `packages/engine/src/state/queries.ts` are the canonical way to traverse state. They throw on missing IDs — use them instead of raw `Record` access.

### Citizens and Agents

Same `Person` type. A recruited citizen gains an `agentStatus?: AgentStatus` field. There is no separate Agent entity.

### Effect system

`config/effects.json` defines what effect types exist. Active effects on entities are `EffectInstance` objects stored in `state.effectInstances`; entities hold only `activeEffectIds: string[]`. Config-declared effects (on plots, activities, citizen actions) are applied through `applyEffect()` in `packages/engine/src/effects/apply.ts`, which dispatches to `effectResolvers` by type string. **All effect execution goes through this single call site.**

### Simulation loop

`advanceTime(state, targetDate)` is a generator (`packages/engine/src/simulation/advance.ts`). It yields `{ type: 'day_complete' }` or `{ type: 'interrupted', events }` between days. It does not schedule itself — the React store drives it via `requestAnimationFrame`. Day phases run in fixed order: tick effects → simulate citizens → building output → advance plots → execute activities → advance research → settle resources → CPU orgs → generate events.

### React integration

Zustand store at `packages/web/src/store/gameStore.ts` holds `GameState` by reference plus a `version: number` counter. The counter increments each day tick and is the only signal React uses to re-render. Components read directly from `gameState` after subscribing to `version` via `useGameState()`. **No game data in component state (`useState`/`useReducer`).**

### Config & data-driven design

Game content (plots, activities, citizen actions, buildings, research, EVIL tiers) lives in `config/*.json`. Each file has a corresponding Zod schema in `packages/engine/src/config/schemas/`. Schemas are strict — unknown fields error. Config is validated once at engine init.

Adding new content (plot, activity, citizen action): edit the relevant JSON. If the new content uses a new effect type, add a resolver to `effectResolvers`. No other code changes needed.

### TypeScript config

`exactOptionalPropertyTypes: true` is set globally. Fields absent from state must be absent (not `undefined`). Do not set optional fields to `undefined` — use `delete` or omit them in object literals.

## Key Invariants

- `GameState` must be serializable with `JSON.stringify` between days (no functions, no class instances, no circular refs)
- The engine package must never import from `packages/web` or any browser API
- All effect execution routes through `applyEffect()` — no inline state mutation for effect outcomes
- Entities reference each other by string ID only; use query helpers to resolve them
- Date is a plain integer (day count from 0); display formatting is a UI concern only
