# Monorepo & Package Structure

## Decision

The project uses **npm workspaces** with two packages: `packages/engine` and `packages/web`. The existing `common/` and `lib/` directories are consolidated into `packages/engine`. JSON config files remain at the repo root under `config/`.

## Directory Layout

```
empire-of-evil/
├── config/                         # JSON configuration files (source of truth for game data)
|   ├── default                     # Default game configuration
│   │   ├── activities.json
│   │   ├── buildings.json
│   │   ├── citizenActions.json
│   │   ├── effects.json
│   │   ├── evilTiers.json
│   │   ├── personAttributes.json
│   │   ├── pets.json
│   │   ├── plots.json
│   │   ├── researchProjects.json
│   │   ├── skills.json
│   │   └── tileTypes.json
│   └── <custom-config-set>          # Optional custom config set
│       ├── activities.json
│       ├── buildings.json
│       ├── citizenActions.json
│       ├── effects.json
│       ├── evilTiers.json
│       ├── personAttributes.json
│       ├── pets.json
│       ├── plots.json
│       ├── researchProjects.json
│       ├── skills.json
│       └── tileTypes.json
├── packages/
│   ├── engine/                # Simulation engine — no browser dependencies
│   │   ├── src/
│   │   │   ├── types/         # All shared TypeScript types (replaces common/)
│   │   │   ├── config/        # Config loader + Zod schemas
│   │   │   ├── factories/     # Entity factories (replaces lib/src/entityFactories.ts)
│   │   │   ├── simulation/    # Daily tick, citizen actions, resource tallying
│   │   │   ├── plots/         # Plot execution and resolution
│   │   │   ├── activities/    # Activity execution
│   │   │   ├── effects/       # Effect registry and resolvers
│   │   │   ├── events/        # Event generation and interrupt handling
│   │   │   ├── worldGen/      # Procedural world generation
│   │   │   └── index.ts       # Public API surface
│   │   ├── package.json
│   │   └── tsconfig.json
│   └── web/                   # React application
│       ├── src/
│       │   ├── components/
│       │   ├── screens/       # One directory per major screen (Empire, Intel, Personnel, etc.)
│       │   ├── store/         # Zustand store(s)
│       │   └── main.tsx
│       ├── package.json
│       └── tsconfig.json
├── docs/
├── package.json               # Root workspace config
└── tsconfig.base.json         # Shared TS settings
```

## Package Dependency Rule

`web` depends on `engine`. `engine` has **zero dependencies on `web`** — the engine is a pure TypeScript library with no browser or React coupling. This boundary must be maintained.

## Root `package.json`

```json
{
    "name": "empire-of-evil",
    "private": true,
    "workspaces": ["packages/*"]
}
```

## Why This Structure

**Engine isolation** is the most important constraint. The simulation must be runnable outside a browser (for testing, for future server-side use). Keeping all game logic in `engine` enforces this cleanly.

**Config at the root** keeps JSON files accessible to both the engine (at runtime via import) and to human editors/modders without navigating into a package directory. The engine loads them via relative path from the package root using a path alias, or via a config loader that accepts a base path.

**Two packages only (for now).** A shared `types` package would add indirection without benefit — the engine is already the sole source of types. The web package imports types from `@empire-of-evil/engine`.

## TypeScript Configuration

`tsconfig.base.json` at the repo root sets shared compiler options. Each package extends it:

```json
// tsconfig.base.json
{
    "compilerOptions": {
        "strict": true,
        "target": "ES2022",
        "module": "ESNext",
        "moduleResolution": "bundler",
        "exactOptionalPropertyTypes": true
    }
}
```

`exactOptionalPropertyTypes` is important: the game state has many optional fields that must not be accidentally set to `undefined` when they should be absent entirely.

## Config File Conventions

Each JSON config file has a corresponding Zod schema in `packages/engine/src/config/schemas/`. Config is validated once at engine initialization and fails fast if schemas are violated. After validation, the typed output is exported as readonly constants.

This is how moddability works: users edit JSON files; the engine validates their changes on load and surfaces any schema errors before the game starts.
