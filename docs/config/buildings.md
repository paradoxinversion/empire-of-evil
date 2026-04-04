# `config/buildings.json`

Defines building types that can be constructed on tiles within zones. Buildings generate resources, provide capacity for agents, and apply effects to their zone. Each zone tile may only host buildings not listed in that tile type's `buildingRestrictions`.

---

## Schema

An array of building type definition objects.

### Building type object

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | Yes | Unique identifier. Referenced by `tileTypes.json` `buildingRestrictions` arrays. Use kebab-case. |
| `name` | `string` | Yes | Display name. |
| `description` | `string` | Yes | What the building does and why the player would build it. |
| `capacity` | `number` | No | Number of agents that can be staffed here. Unstaffed buildings do not generate output. |
| `resourceOutput` | `object` | No | Resources generated per day when fully staffed. See below. |
| `upkeepPerDay` | `number` | No | Money deducted each day the building exists, regardless of staffing. Defaults to `0`. |
| `buildableOnTileTypes` | `string[]` | No | If present, restricts construction to only these tile type IDs. If absent, placement is governed entirely by each tile type's `buildingRestrictions`. |
| `effects` | `string[]` | No | Effect IDs (from `effects.json`) permanently applied to the zone while this building exists. |

### `resourceOutput` object

| Field | Type | Description |
|---|---|---|
| `money` | `number` | Money generated per day at full staff. |
| `science` | `number` | Science points generated per day at full staff. |
| `infrastructure` | `number` | Infrastructure points generated per day at full staff. |

All fields are optional — omit any resource the building does not produce.

---

## Example template

```json
[
  {
    "id": "research-lab",
    "name": "Research Laboratory",
    "description": "A facility dedicated to advancing the empire's scientific capabilities. Generates science points daily when staffed with scientist agents.",
    "capacity": 4,
    "resourceOutput": {
      "science": 10
    },
    "upkeepPerDay": 20,
    "effects": []
  },
  {
    "id": "bank",
    "name": "Bank",
    "description": "A financial institution that generates steady money income. Cannot be built in mountainous terrain.",
    "capacity": 2,
    "resourceOutput": {
      "money": 50
    },
    "upkeepPerDay": 10,
    "effects": []
  }
]
```
