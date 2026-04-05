# `buildings.json`

Defines building types that can be constructed on tiles within zones. Buildings generate resources, provide capacity for agents, and apply effects to their zone. Each zone tile may only host buildings not listed in that tile type's `buildingRestrictions`.

> **Base values:** All numerical fields (`baseCost`, `resourceOutput`, `upkeepPerDay`, `capacity`) represent base values before any modifiers are applied. Research unlocks, agent skills, zone effects, and EVIL tier bonuses may scale or offset these values at runtime. The config defines the floor; the engine applies multipliers on top.

---

## Schema

An array of building type definition objects.

### Building type object

| Field                  | Type       | Required | Description                                                                                                                                                                                                                                |
| ---------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `id`                   | `string`   | Yes      | Unique identifier. Referenced by `tileTypes.json` `buildingRestrictions` arrays. Use kebab-case.                                                                                                                                           |
| `name`                 | `string`   | Yes      | Display name.                                                                                                                                                                                                                              |
| `description`          | `string`   | Yes      | What the building does and why the player would build it.                                                                                                                                                                                  |
| `baseCost`             | `object`   | Yes      | Resources spent once when the player constructs the building. See below.                                                                                                                                                                   |
| `capacity`             | `number`   | No       | Base number of agents that can be staffed here. Unstaffed buildings do not generate output.                                                                                                                                                |
| `resourceOutput`       | `object`   | No       | Base resources generated per day when fully staffed. See below.                                                                                                                                                                            |
| `upkeepPerDay`         | `number`   | No       | Base money deducted each day the building exists, regardless of staffing. Defaults to `0`.                                                                                                                                                 |
| `wealthRequirement`    | `number`   | No       | Minimum zone `generationWealth` for this building to appear during world generation. Defaults to `0`. Has no effect on player construction.                                                                                                |
| `wealthWeight`         | `number`   | No       | Relative probability of this building being placed during world generation in zones that meet `wealthRequirement`. Higher = more common. `0` means never placed by world gen (e.g. headquarters).                                          |
| `infrastructureLoad`   | `number`   | Yes      | Base infrastructure points consumed from the zone each day while the building exists. Represents the building's draw on local utilities, supply chains, and maintenance capacity.                                                          |
| `preferredSkills`      | `string[]` | Yes      | Skill IDs (from `config/skills.json`) that benefit agents staffed here. Used by the UI to surface good candidates and by the simulation to scale output bonuses. An agent with a preferred skill produces better results than one without. |
| `buildableOnTileTypes` | `string[]` | No       | If present, restricts player construction to only these tile type IDs. If absent, placement is governed entirely by each tile type's `buildingRestrictions`.                                                                               |
| `effects`              | `string[]` | No       | Effect IDs (from `effects.json`) permanently applied to the zone while this building exists.                                                                                                                                               |

### `baseCost` object

Resources the player pays once at construction time. All fields optional — omit any resource not required.

| Field            | Type     | Description                                     |
| ---------------- | -------- | ----------------------------------------------- |
| `money`          | `number` | Money paid at construction.                     |
| `infrastructure` | `number` | Infrastructure points consumed at construction. |
| `science`        | `number` | Science points consumed at construction.        |

### `resourceOutput` object

Base resources generated per day at full staffing. All fields optional.

| Field            | Type     | Description                                       |
| ---------------- | -------- | ------------------------------------------------- |
| `money`          | `number` | Base money per day at full staff.                 |
| `science`        | `number` | Base science points per day at full staff.        |
| `infrastructure` | `number` | Base infrastructure points per day at full staff. |

---

## World generation placement

During world generation (Phase 8), the engine places buildings in inhabited zones using `wealthRequirement` and `wealthWeight`:

- `wealthRequirement` gates eligibility — buildings whose requirement exceeds the zone's `generationWealth` are excluded from the draw entirely.
- `wealthWeight` is the relative probability weight among eligible buildings. A building with weight 10 is twice as likely to be chosen as one with weight 5.
- `wealthWeight: 0` means the building is never placed by world generation (used for player-exclusive or special buildings like headquarters).

Player-constructed buildings ignore `wealthRequirement` and `wealthWeight` — any building can be constructed anywhere that `buildableOnTileTypes` and tile `buildingRestrictions` permit.

---

## Example

```json
[
    {
        "id": "research-lab",
        "name": "Research Laboratory",
        "description": "A facility dedicated to advancing the empire's scientific capabilities. Generates science points daily when staffed.",
        "capacity": 4,
        "baseCost": { "money": 800, "infrastructure": 100 },
        "resourceOutput": { "science": 10 },
        "upkeepPerDay": 20,
        "wealthRequirement": 65,
        "wealthWeight": 4,
        "effects": []
    },
    {
        "id": "bank",
        "name": "Bank",
        "description": "A financial institution that generates steady money income. Requires accessible, developed terrain.",
        "capacity": 2,
        "baseCost": { "money": 500 },
        "resourceOutput": { "money": 30 },
        "upkeepPerDay": 8,
        "wealthRequirement": 40,
        "wealthWeight": 6,
        "effects": []
    }
]
```
