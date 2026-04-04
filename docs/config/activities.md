# `config/activities.json`

Defines activities — recurring operations that assigned agents execute each day. Activities are simpler than plots: they have no stages or travel time, fire once per day per participant, and apply chance-based effects.

New activities require only a JSON entry unless they use a new effect `type` not already in `effectResolvers`, in which case a new resolver must be added to `packages/engine/src/effects/resolvers.ts`.

---

## Schema

An array of activity definition objects.

### Activity object

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Display name shown in the UI. |
| `description` | `string` | Yes | Flavor text explaining what the activity is. |
| `evilCategory` | `"cartoonish"` \| `"realWorld"` | No | Tags the activity's tone. Drives narrative register and world response severity. Omit for neutral activities. |
| `costPerParticipantPerDay` | `number` | No | Money deducted per assigned agent per day. Defaults to `0`. |
| `requirements` | `object` | No | Unlock conditions. See below. |
| `effects` | `EffectDeclaration[]` | Yes | Effects applied each day to each participant. See below. |

### `requirements` object

| Field | Type | Description |
|---|---|---|
| `researchIds` | `string[]` | Research project IDs that must be completed before this activity is available. |
| `skillRequirements` | `{ skillId: string; minimumValue: number }[]` | Each assigned agent must meet all listed skill minimums. |

### `EffectDeclaration` object

| Field | Type | Required | Description |
|---|---|---|---|
| `type` | `string` | Yes | Key into `effectResolvers`. Must match a registered resolver. |
| `chance` | `number` | Yes | Probability the effect fires on a given day. `0.0`–`1.0`. |
| `cost` | `number` | No | Additional money cost when the effect fires. |
| `parameters` | `object` | No | Resolver-specific parameters. Shape varies by `type`. |

---

## Example template

```json
[
  {
    "name": "Example Activity",
    "description": "A brief description of what this activity does and why it matters.",
    "evilCategory": "cartoonish",
    "costPerParticipantPerDay": 5,
    "requirements": {
      "researchIds": ["some-research-id"],
      "skillRequirements": [
        { "skillId": "infiltration", "minimumValue": 30 }
      ]
    },
    "effects": [
      {
        "type": "skill_increase",
        "chance": 0.5,
        "parameters": {
          "skills": ["infiltration", "surveillance"],
          "minIncrease": 0.01,
          "maxIncrease": 0.1
        }
      },
      {
        "type": "increase_loyalty",
        "chance": 1.0,
        "parameters": {
          "target": "participant",
          "minIncrease": 0.01,
          "maxIncrease": 0.05
        }
      }
    ]
  }
]
```
