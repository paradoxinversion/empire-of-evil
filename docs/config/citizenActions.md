# `config/citizenActions.json`

Defines the daily actions available to civilians and agents during the citizen simulation phase. Each day, every living non-incapacitated person evaluates which actions they are eligible for, then selects one via a weighted random draw. Actions are the primary driver of emergent narrative — what citizens do shapes zone conditions, loyalty, health, and the empire's intel picture.

Adding a new citizen action only requires a JSON entry unless it uses a new effect `type`, which requires a new resolver in `packages/engine/src/effects/resolvers.ts`.

---

## Schema

An array of citizen action definition objects.

### Citizen action object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier. Use kebab-case (e.g., `"go-to-work"`, `"attend-protest"`). |
| `name` | `string` | Yes | Display name used in event log entries. |
| `conditions` | `object` | No | Eligibility filters. A person must pass all specified conditions to have this action in their pool. See below. |
| `baseWeight` | `number` | Yes | Base probability weight for the action. Higher values make the action more likely relative to other eligible actions. |
| `effectWeightModifiers` | `Record<string, number>` | No | Multipliers applied to `baseWeight` when the person has specific effects active. Key is an effect ID; value is the weight multiplier (e.g., `2.0` doubles likelihood, `0.0` excludes the action). |
| `effects` | `EffectDeclaration[]` | Yes | Effects applied when this action is taken. May target the acting person, a random citizen in the same zone, or the zone itself. |

### `conditions` object

All fields are optional. A person must satisfy every specified condition to be eligible.

| Field | Type | Description |
|---|---|---|
| `minLoyalty` | `number` | Minimum loyalty to the empire (`0`–`100`). |
| `maxLoyalty` | `number` | Maximum loyalty to the empire (`0`–`100`). |
| `minHealth` | `number` | Minimum health (`0`–`100`). |
| `maxHealth` | `number` | Maximum health (`0`–`100`). |
| `minAttribute` | `Record<string, number>` | Minimum value for named attributes (e.g., `{ "intelligence": 60 }`). Attribute names are lowercased `personAttributes.json` names. |
| `requiresEffectId` | `string` | Person must have this effect active. |
| `requiresEmployment` | `boolean` | If `true`, person must be employed (assigned to a building or activity). |
| `zoneEffectRequired` | `string` | The person's current zone must have this effect active. |

### `EffectDeclaration` object

See [activities.md](./activities.md#effectdeclaration-object) for the full field reference. The `target` parameter in `parameters` is particularly important here — common values are `"actor"` (the person taking the action), `"random_citizen"` (a random person in the same zone), and `"zone"` (the zone itself).

---

## Example template

```json
[
  {
    "id": "go-to-work",
    "name": "Go to Work",
    "conditions": {
      "minHealth": 30,
      "requiresEmployment": true
    },
    "baseWeight": 10,
    "effects": [
      {
        "type": "gain_resource",
        "chance": 1.0,
        "parameters": { "resource": "money", "amount": 5 }
      }
    ]
  },
  {
    "id": "attend-protest",
    "name": "Attend Protest",
    "conditions": {
      "maxLoyalty": 30
    },
    "baseWeight": 3,
    "effectWeightModifiers": {
      "radicalized": 3.0
    },
    "effects": [
      {
        "type": "increase_evil",
        "chance": 0.1,
        "parameters": { "amount": 1, "type": "perceived" }
      }
    ]
  }
]
```
