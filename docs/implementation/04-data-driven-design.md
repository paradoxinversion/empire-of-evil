# Data-Driven Design & Config Patterns

## Decision

Game content (plots, activities, citizen actions, research, buildings, effects) is defined in JSON config files. The engine contains **resolver functions** that know how to execute named effect types, but does not hard-code specific effects for specific content. Adding new content means editing JSON — adding new *kinds* of effects requires a new resolver function.

## Config File Schema Pattern

Every config file has a corresponding Zod schema. Validation runs once at engine initialization.

```typescript
// packages/engine/src/config/schemas/activities.ts
import { z } from 'zod';

const ActivityEffectSchema = z.object({
  type: z.string(),             // matches an EffectResolver key
  chance: z.number().min(0).max(1),
  cost: z.number().optional(),
  parameters: z.record(z.unknown()).optional(),
});

export const ActivitySchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  costPerParticipantPerDay: z.number().default(0),
  evilCategory: z.enum(['cartoonish', 'realWorld']).optional(),
  effects: z.array(ActivityEffectSchema),
  requirements: z.object({
    researchIds: z.array(z.string()).optional(),
    skillRequirements: z.array(z.object({
      skillId: z.string(),
      minimumValue: z.number(),
    })).optional(),
  }).optional(),
});

export type ActivityDefinition = z.infer<typeof ActivitySchema>;
```

Schemas are strict — unknown fields cause validation errors. This catches typos in JSON immediately.

## Effect Resolver Registry

The engine maintains a registry that maps effect type strings to resolver functions:

```typescript
// packages/engine/src/effects/resolvers.ts

export type EffectContext = {
  state: GameState;
  actor?: Person;             // person performing the action, if any
  target?: Person;            // target person, if any
  zone?: Zone;                // relevant zone, if any
};

export type EffectResolver = (
  context: EffectContext,
  parameters: Record<string, unknown>
) => void;                    // mutates state in place

export const effectResolvers: Record<string, EffectResolver> = {
  skill_increase: (ctx, params) => {
    const { skills, minIncrease, maxIncrease } = params as SkillIncreaseParams;
    const person = ctx.actor;
    if (!person) return;
    const skill = skills[Math.floor(Math.random() * skills.length)];
    const cap = getSkillCap(person, skill, ctx.state);
    const increase = randomBetween(minIncrease as number, maxIncrease as number);
    person.skills[skill] = Math.min(cap, (person.skills[skill] ?? 0) + increase);
  },

  increase_loyalty: (ctx, params) => {
    const { target, minIncrease, maxIncrease } = params as LoyaltyIncreaseParams;
    const person = resolveTarget(target as string, ctx);
    if (!person) return;
    const current = person.loyalties[ctx.state.empire.id] ?? 0;
    const increase = randomBetween(minIncrease as number, maxIncrease as number);
    person.loyalties[ctx.state.empire.id] = Math.min(100, current + increase);
  },

  increase_intel: (ctx, params) => { /* ... */ },
  apply_effect: (ctx, params) => { /* creates an EffectInstance on an entity */ },
  remove_effect: (ctx, params) => { /* ... */ },
  gain_resource: (ctx, params) => { /* adjusts empire resources */ },
  damage_building: (ctx, params) => { /* ... */ },
  trigger_event: (ctx, params) => { /* pushes an event to pendingEvents */ },
  civilian_combat_encounter: (ctx, params) => { /* ... */ },
  // ... more resolvers as needed
};
```

**Applying a config-declared effect:**

```typescript
// packages/engine/src/effects/apply.ts

export const applyEffect = (
  effectDecl: { type: string; chance: number; parameters?: Record<string, unknown> },
  context: EffectContext
): void => {
  if (Math.random() > effectDecl.chance) return;
  const resolver = effectResolvers[effectDecl.type];
  if (!resolver) throw new Error(`Unknown effect type: "${effectDecl.type}"`);
  resolver(context, effectDecl.parameters ?? {});
};
```

This is the single call site. Activity execution, plot resolution, and citizen action resolution all go through `applyEffect`.

## Plot Definition Schema

Plots are the most complex config entities. Multi-stage plots define each stage as a discrete object:

```typescript
// Abbreviated schema for illustration
const PlotStageSchema = z.object({
  name: z.string(),
  durationDays: z.number(),
  successThreshold: z.number().min(0).max(100),  // accumulated skill score needed
  skillDrivers: z.array(z.string()),              // which skills accumulate the score
  effects: z.object({
    success: z.array(ActivityEffectSchema),
    failure: z.array(ActivityEffectSchema),
    always: z.array(ActivityEffectSchema).optional(),
  }),
  branchingChoice: z.object({                     // present on Tier 2+ plots
    prompt: z.string(),
    options: z.array(z.object({
      label: z.string(),
      effects: z.array(ActivityEffectSchema),
    })),
  }).optional(),
});

const PlotSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  tier: z.number().min(1).max(4),
  evilCategory: z.enum(['cartoonish', 'realWorld']).optional(),
  requirements: z.object({
    agentCount: z.number().optional(),
    skillRequirements: z.array(z.object({
      skillId: z.string(),
      minimumValue: z.number(),
    })).optional(),
    researchIds: z.array(z.string()).optional(),
    minZoneIntelLevel: z.number().optional(),
    minPerceivedEvil: z.number().optional(),
    maxPerceivedEvil: z.number().optional(),
    targetRequiresZoneControl: z.boolean().optional(),
  }),
  stages: z.array(PlotStageSchema),
});
```

The `skillDrivers` on each stage determine how assigned agents accumulate the success score each day. An agent with high `Infiltration` on a plot with `skillDrivers: ["infiltration"]` will push the score up faster.

## Citizen Action Config Schema

Citizen actions drive the individual simulation. Their conditions and effects are config-defined:

```typescript
const CitizenActionSchema = z.object({
  id: z.string(),                                // e.g., "go_to_work"
  name: z.string(),
  conditions: z.object({
    minLoyalty: z.number().optional(),
    maxLoyalty: z.number().optional(),
    minHealth: z.number().optional(),
    maxHealth: z.number().optional(),
    minAttribute: z.record(z.number()).optional(), // e.g., { "intelligence": 60 }
    requiresEffectId: z.string().optional(),
    requiresEmployment: z.boolean().optional(),
    zoneEffectRequired: z.string().optional(),    // e.g., "outbreak"
  }),
  // Base weight; modified at runtime by personality traits and zone conditions
  baseWeight: z.number(),
  // Weight multipliers keyed by effectId present on person
  effectWeightModifiers: z.record(z.number()).optional(),
  effects: z.array(ActivityEffectSchema),
});
```

The `baseWeight` and `effectWeightModifiers` enable personality-driven action probability without hard-coding. A citizen with the `party-animal` effect has a higher weight for `go_to_bar`.

## Config-Defined EVIL Tiers

EVIL tier thresholds and their display names live in config, not in code:

```json
// config/evilTiers.json
[
  { "minPerceived": 0,  "maxPerceived": 19, "name": "Nuisance",    "worldResponseProfile": "none" },
  { "minPerceived": 20, "maxPerceived": 39, "name": "Irritant",    "worldResponseProfile": "low" },
  { "minPerceived": 40, "maxPerceived": 59, "name": "Threat",      "worldResponseProfile": "moderate" },
  { "minPerceived": 60, "maxPerceived": 79, "name": "Menace",      "worldResponseProfile": "high" },
  { "minPerceived": 80, "maxPerceived": 94, "name": "Supervillain","worldResponseProfile": "critical" },
  { "minPerceived": 95, "maxPerceived": 100,"name": "Apocalyptic", "worldResponseProfile": "maximum" }
]
```

The `worldResponseProfile` string maps to CPU org behavior weight adjustments defined in `config/cpuBehaviors.json`. Tier transitions (crossing a threshold) generate an interrupt event.

## Unlocks via Research

Research projects declare what they unlock in their config entry. The engine maintains an `unlockedIds` set on empire state. Before presenting a plot or activity to the player, the engine checks:

```typescript
const isPlotAvailable = (
  plot: PlotDefinition,
  state: GameState
): boolean => {
  const { empire } = state;
  return plot.requirements.researchIds?.every(id =>
    empire.unlockedPlotIds.includes(id)
  ) ?? true;
};
```

When research completes, the engine adds its `unlocks` array entries to the appropriate empire set (`unlockedPlotIds`, `unlockedActivityIds`, or applies a permanent effect). No special unlock handling code per research project — the config data drives it.

## Adding New Content (Moddability Workflow)

To add a **new plot**:
1. Add an entry to `config/plots.json` following the schema.
2. If the plot uses only existing effect types (`gain_resource`, `damage_building`, etc.), no code change needed.
3. If the plot requires a new effect type, add a resolver to `effectResolvers`.

To add a **new activity**: same pattern.

To add a **new citizen action**: same pattern.

To add a **new effect type**: add the resolver to `effectResolvers` and document the parameter shape.

To rename an attribute or skill: edit `config/personAttributes.json` or `config/skills.json`. Any config entries that reference that skill by ID must be updated. The engine validates all skill/attribute references at startup and will surface broken references.

## Cartoonish vs. Real Evil Tagging

The `evilCategory` field on plot and activity definitions drives the tone-shift mechanic from GDD §2.2 and §9.3. The engine uses this tag when determining:
- The flavor/register of generated events and AAR text
- The relative severity of world response consequences
- Whether NPC commentary takes a grimmer tone

This is a data field, not a code branch. New plots opt into the appropriate register by setting the tag.
