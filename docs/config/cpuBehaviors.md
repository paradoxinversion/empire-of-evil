# `config/cpuBehaviors.json`

Defines behavior profiles for CPU governing organizations (the nations and factions that are not controlled by the player). Each profile is referenced by a `worldResponseProfile` ID in `evilTiers.json`, which links an EVIL tier to how aggressively the world responds to the empire.

---

## Schema

An array of CPU behavior profile objects.

### CPU behavior profile object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier. Must match a `worldResponseProfile` value in `evilTiers.json`. Use kebab-case (e.g., `"none"`, `"low"`, `"critical"`). |
| `name` | `string` | Yes | Display name for debugging and editor tooling. |
| `description` | `string` | No | Notes on what this profile means in play terms. |
| `actionWeights` | `object` | Yes | Weighted probabilities for different CPU action categories each day. See below. |

### `actionWeights` object

Each key is an action category; the value is a relative weight. Higher values make that category more likely to be chosen. All weights are relative to each other — they do not need to sum to any particular value.

| Key | Description |
|---|---|
| `ignore` | Take no action against the empire. |
| `investigate` | Increase intel on empire zones and agents. |
| `sanction` | Apply economic or diplomatic pressure. |
| `counter_operation` | Launch a counter-operation targeting empire agents or buildings. |
| `military_action` | Direct military action against empire-controlled zones. |

---

## Notes

- The `"none"` profile (used at the lowest EVIL tier) should have a high `ignore` weight and zero or near-zero weights for aggressive actions.
- The `"maximum"` profile (used at `Apocalyptic` tier) should weight `military_action` and `counter_operation` heavily.
- Profiles not referenced by any tier in `evilTiers.json` are valid but have no effect on gameplay.

---

## Example template

```json
[
  {
    "id": "none",
    "name": "No Response",
    "description": "CPU organizations do not yet consider the empire a meaningful threat.",
    "actionWeights": {
      "ignore": 100,
      "investigate": 0,
      "sanction": 0,
      "counter_operation": 0,
      "military_action": 0
    }
  },
  {
    "id": "low",
    "name": "Low Response",
    "description": "CPU organizations begin passive monitoring but take no direct action.",
    "actionWeights": {
      "ignore": 70,
      "investigate": 30,
      "sanction": 0,
      "counter_operation": 0,
      "military_action": 0
    }
  },
  {
    "id": "maximum",
    "name": "Maximum Response",
    "description": "CPU organizations treat the empire as an existential threat and respond with full force.",
    "actionWeights": {
      "ignore": 0,
      "investigate": 10,
      "sanction": 20,
      "counter_operation": 40,
      "military_action": 30
    }
  }
]
```
