# Config Documentation

Documentation for each JSON file in `config/`. Adding game content generally requires only editing these files — see each doc for when a code change is also required.

| File | Doc | Purpose |
|---|---|---|
| `activities.json` | [activities.md](./activities.md) | Recurring daily operations assigned to agents |
| `buildings.json` | [buildings.md](./buildings.md) | Building types constructable on tiles |
| `citizenActions.json` | [citizenActions.md](./citizenActions.md) | Daily actions taken by civilians and agents in simulation |
| `cpuBehaviors.json` | [cpuBehaviors.md](./cpuBehaviors.md) | CPU governing organization behavior profiles by EVIL tier |
| `effects.json` | [effects.md](./effects.md) | Named effect type definitions (what an effect is) |
| `evilTiers.json` | [evilTiers.md](./evilTiers.md) | EVIL tier thresholds and world response escalation |
| `personAttributes.json` | [personAttributes.md](./personAttributes.md) | Innate person attributes that cap related skills |
| `pets.json` | [pets.md](./pets.md) | Overlord pet types and their special actions |
| `plots.json` | [plots.md](./plots.md) | Multi-stage covert operations |
| `researchProjects.json` | [researchProjects.md](./researchProjects.md) | Research projects that unlock content |
| `skills.json` | [skills.md](./skills.md) | Trainable skills governed by attributes |
| `tileTypes.json` | [tileTypes.md](./tileTypes.md) | Terrain types used in world generation |

## Shared: `EffectDeclaration`

Many config files use `EffectDeclaration` objects inside `effects` arrays. The canonical reference is in [activities.md](./activities.md#effectdeclaration-object). The `type` field must match a key in `effectResolvers` (`packages/engine/src/effects/resolvers.ts`).

## Adding new content

- **New plot, activity, citizen action, building, research project, pet:** Add a JSON entry to the relevant file. No code change needed if only existing effect types are used.
- **New effect type** (new `type` value in an `EffectDeclaration`): Add the resolver to `effectResolvers` in `packages/engine/src/effects/resolvers.ts`, then add the entry to `effects.json`.
- **New attribute or skill:** Add to `personAttributes.json` or `skills.json`. Update any `attributeCap` or `skillDrivers` references that need to use it.
