# `config/plots.json`

Defines plots — multi-stage covert operations the player can assign agents to execute. Plots are the primary vehicle for expanding the empire, acquiring resources, eliminating threats, and generating narrative events. Unlike activities, plots have a defined lifecycle: they run to completion (or failure) and are then removed from active state.

---

## Schema

An array of plot definition objects.

### Plot object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier. Referenced by `researchProjects.json` `unlocks.plotIds` and by `EmpireState.unlockedPlotIds`. Use kebab-case. |
| `name` | `string` | Yes | Display name. |
| `description` | `string` | Yes | What this plot does and what the player is trying to achieve. |
| `tier` | `1` \| `2` \| `3` \| `4` | Yes | Complexity tier. Higher tiers require more agents, longer timelines, and unlock richer narrative branching. |
| `evilCategory` | `"cartoonish"` \| `"realWorld"` | No | Tone tag. Affects narrative register and world response consequences. Omit for neutral plots. |
| `requirements` | `object` | No | Conditions that must be met to execute this plot. See below. |
| `stages` | `PlotStage[]` | Yes | Ordered list of stages. Must have at least one entry. |

### `requirements` object

| Field | Type | Description |
|---|---|---|
| `agentCount` | `number` | Minimum number of agents that must be assigned. |
| `skillRequirements` | `{ skillId: string; minimumValue: number }[]` | All assigned agents must meet these skill minimums. |
| `researchIds` | `string[]` | Research projects that must be completed before this plot is available. |
| `minZoneIntelLevel` | `number` | Target zone's intel level must be at or above this value. |
| `minPerceivedEvil` | `number` | Empire's perceived EVIL must be at or above this value. |
| `maxPerceivedEvil` | `number` | Empire's perceived EVIL must be at or below this value. |
| `targetRequiresZoneControl` | `boolean` | The target zone must be controlled by the empire. |

All fields are optional.

### `PlotStage` object

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Display name for this stage (e.g., `"Infiltration"`, `"Extraction"`). |
| `durationDays` | `number` | Yes | Number of days this stage takes to complete. |
| `successThreshold` | `number` | Yes | Accumulated skill score required for success. `0`–`100`. |
| `skillDrivers` | `string[]` | Yes | Skill IDs whose values accumulate the success score each day. Agents with higher values in these skills push the score up faster. |
| `effects` | `StageEffects` | Yes | Effects applied on stage resolution. See below. |
| `branchingChoice` | `object` | No | If present, a player choice interrupt fires after this stage resolves. Tier 2+ plots typically include this. See below. |

### `StageEffects` object

| Field | Type | Description |
|---|---|---|
| `success` | `EffectDeclaration[]` | Effects applied when the stage succeeds. |
| `failure` | `EffectDeclaration[]` | Effects applied when the stage fails. |
| `always` | `EffectDeclaration[]` | Effects applied regardless of outcome. |

### `branchingChoice` object

| Field | Type | Description |
|---|---|---|
| `prompt` | `string` | Question or situation presented to the player. |
| `options` | `{ label: string; description: string; effects: EffectDeclaration[] }[]` | Available choices. Each carries a label, a short description of consequences, and effects applied on selection. |

### `EffectDeclaration` object

See [activities.md](./activities.md#effectdeclaration-object) for the full field reference — the shape is identical.

---

## Example template

```json
[
  {
    "id": "seize-supply-depot",
    "name": "Seize Supply Depot",
    "description": "Agents infiltrate and seize a rival organization's supply depot, acquiring resources and disrupting their operations.",
    "tier": 1,
    "evilCategory": "cartoonish",
    "requirements": {
      "agentCount": 2,
      "skillRequirements": [
        { "skillId": "infiltration", "minimumValue": 20 }
      ],
      "minZoneIntelLevel": 10
    },
    "stages": [
      {
        "name": "Infiltration",
        "durationDays": 5,
        "successThreshold": 40,
        "skillDrivers": ["infiltration", "surveillance"],
        "effects": {
          "success": [
            {
              "type": "gain_resource",
              "chance": 1.0,
              "parameters": { "resource": "money", "amount": 200 }
            }
          ],
          "failure": [
            {
              "type": "trigger_event",
              "chance": 0.7,
              "parameters": { "category": "combat" }
            }
          ],
          "always": []
        }
      },
      {
        "name": "Extraction",
        "durationDays": 3,
        "successThreshold": 30,
        "skillDrivers": ["evasion", "smuggling"],
        "effects": {
          "success": [
            {
              "type": "gain_resource",
              "chance": 1.0,
              "parameters": { "resource": "money", "amount": 100 }
            }
          ],
          "failure": [],
          "always": []
        },
        "branchingChoice": {
          "prompt": "A civilian witnessed the extraction. How do you handle it?",
          "options": [
            {
              "label": "Pay them off",
              "description": "Costs money but keeps your hands clean.",
              "effects": [
                { "type": "gain_resource", "chance": 1.0, "parameters": { "resource": "money", "amount": -50 } }
              ]
            },
            {
              "label": "Intimidate them",
              "description": "Free, but increases perceived EVIL.",
              "effects": [
                { "type": "increase_evil", "chance": 1.0, "parameters": { "amount": 2 } }
              ]
            }
          ]
        }
      }
    ]
  }
]
```
