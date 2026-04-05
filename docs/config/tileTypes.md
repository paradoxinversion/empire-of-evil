# `tileTypes.json`

Defines tile type templates used during world generation. Each zone is made up of tiles; tiles determine what buildings can be placed on them and grant passive effects to units and operations in that zone.

Tile types are fully user-configurable — add, remove, or modify entries without touching engine code. The engine reads this file at startup and validates it against the schema. World generation derives terrain placement entirely from each tile type's `terrainConditions`, so new tile types participate in generation automatically.

---

## Schema

An **object** (not an array) where each key is the tile type's ID and the value is the tile type definition. The key serves as the tile type's identifier throughout the engine.

```json
{
  "<tileTypeId>": { ... },
  "<tileTypeId>": { ... }
}
```

### Tile type definition object

| Field                  | Type       | Required | Description                                                                                                                                |
| ---------------------- | ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------ |
| `name`                 | `string`   | Yes      | Display name shown in the UI.                                                                                                              |
| `description`          | `string`   | Yes      | Flavor text describing the terrain.                                                                                                        |
| `buildingRestrictions` | `string[]` | Yes      | Building type IDs that **cannot** be built on this tile. Use `["all"]` to prevent all building placement. Use `[]` to allow all.           |
| `effects`              | `string[]` | Yes      | Effect IDs (from `effects.json`) that are permanently active on this tile type. Applied to all entities operating on tiles of this type.   |
| `terrainConditions`    | `object`   | Yes      | Controls where on the noise map this tile type appears during world generation. See below.                                                 |
| `canBeInhabited`       | `boolean`  | Yes      | Whether zones whose plurality tile type is this can be inhabited. Set to `false` for ocean and other impassable terrain.                   |
| `wealthContribution`   | `number`   | Yes      | How much each tile of this type contributes to its zone's `generationWealth` (0–100). City tiles are high; desert and ocean tiles are low. |
| `isOcean`              | `boolean`  | No       | Marks this tile type as ocean for the border flood-fill contiguity pass. Omit or set `false` for all non-ocean types.                      |

### `terrainConditions` object

| Field          | Type               | Description                                                                            |
| -------------- | ------------------ | -------------------------------------------------------------------------------------- |
| `elevationMin` | `number` (0.0–1.0) | Minimum elevation noise value (inclusive) for this tile type to appear.                |
| `elevationMax` | `number` (0.0–1.0) | Maximum elevation noise value (inclusive).                                             |
| `moistureMin`  | `number` (0.0–1.0) | Minimum moisture noise value (inclusive).                                              |
| `moistureMax`  | `number` (0.0–1.0) | Maximum moisture noise value (inclusive).                                              |
| `priority`     | `integer`          | Tiebreaker when multiple tile types match the same noise values. Higher priority wins. |

**Priority guidance:** Multiple tile types may have overlapping ranges — this is intentional. Use priority to control which type wins. Recommended conventions:

| Priority range | Role                                                      |
| -------------- | --------------------------------------------------------- |
| 90–100         | Dominant terrain (ocean, mountain) — override everything  |
| 50–89          | Specific overrides within a band (coastal, swamp, tundra) |
| 20–49          | Normal terrain types (city, forest, plains, desert)       |
| 1–19           | Fallback / catch-all (wilderness)                         |

**Catch-all:** At least one tile type should cover the full 0.0–1.0 range for both elevation and moisture at low priority so that every noise value maps to something. `wilderness` serves this role by default.

---

## Notes

- This file uses an object keyed by ID rather than an array — the tile type's key in this object is its ID.
- `buildingRestrictions` is a **blocklist** (disallowed types), not an allowlist.
- Effects listed here reference IDs from `effects.json`. The engine validates these references at startup.
- `wealthContribution` feeds into the zone wealth formula: `baseWealth = weightedAverage(tileWealthContributions) * 0.8 + noiseValue * 20`. A zone of all city tiles approaches 80 base wealth; pure desert approaches 8.
- `canBeInhabited: false` means the zone is skipped entirely during population seeding and nation placement, regardless of wealth. `canBeInhabited: true` means the zone is eligible — whether it actually becomes inhabited depends on its computed `generationWealth` vs the world gen `uninhabitedWealthFloor` parameter.

---

## Example template

```json
{
    "city": {
        "name": "City",
        "description": "A dense urban environment with many people and resources.",
        "buildingRestrictions": [],
        "effects": ["combat-cover"],
        "terrainConditions": {
            "elevationMin": 0.38,
            "elevationMax": 0.7,
            "moistureMin": 0.45,
            "moistureMax": 1.0,
            "priority": 40
        },
        "canBeInhabited": true,
        "wealthContribution": 80
    },
    "wilderness": {
        "name": "Wilderness",
        "description": "Untamed natural areas.",
        "buildingRestrictions": ["bank"],
        "effects": ["slowed-movement", "reduced-visibility"],
        "terrainConditions": {
            "elevationMin": 0.0,
            "elevationMax": 1.0,
            "moistureMin": 0.0,
            "moistureMax": 1.0,
            "priority": 1
        },
        "canBeInhabited": true,
        "wealthContribution": 20
    }
}
```
