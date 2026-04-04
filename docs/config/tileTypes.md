# `config/tileTypes.json`

Defines tile type templates used during world generation. Each zone is made up of tiles; tiles determine what buildings can be placed on them and grant passive effects to units and operations in that zone.

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

| Field | Type | Required | Description |
|---|---|---|---|
| `name` | `string` | Yes | Display name shown in the UI. |
| `description` | `string` | Yes | Flavor text describing the terrain. |
| `buildingRestrictions` | `string[]` | Yes | Building type IDs that **cannot** be built on this tile. Use `["all"]` to prevent all building placement. Use `[]` to allow all. |
| `effects` | `string[]` | Yes | Effect IDs (from `effects.json`) that are permanently active on this tile type. Applied to all entities operating on tiles of this type. |

---

## Notes

- This file uses an object keyed by ID rather than an array — the tile type's key in this object is its ID. This is different from most other config files which use arrays with explicit `id` fields.
- `buildingRestrictions` lists building IDs that are **disallowed**, not allowed. The restriction is a blocklist.
- Effects listed here reference IDs from `effects.json`. The engine validates these references at startup.

---

## Example template

```json
{
  "city": {
    "name": "City",
    "description": "A dense urban environment with many people and resources.",
    "buildingRestrictions": [],
    "effects": ["combat-cover"]
  },
  "mountain": {
    "name": "Mountain",
    "description": "Rugged terrain that slows movement but favors defenders.",
    "buildingRestrictions": ["bank"],
    "effects": ["heavily-slowed-movement", "defender-advantage"]
  }
}
```
