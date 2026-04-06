# 14. Buildings

## 14.1 Building Types

| Type      | Function                                                     | Who Works There              |
| --------- | ------------------------------------------------------------ | ---------------------------- |
| Residence | Houses citizens and agents; required for population capacity | N/A (occupants, not workers) |
| Office    | Generates Infrastructure; requires Administrator staff       | Administrators               |
| Lab       | Generates Science; requires Scientist staff                  | Scientists                   |
| Bank      | Generates steady Money income                                | Any (tellers, managers)      |
| Hospital  | Heals injured/sick agents and citizens                       | Medical staff                |

## 14.2 Building Attributes

Engine-side building entities are intentionally minimal; most per-type data (production, upkeep, capacity) lives in the building _definition_ in config. A runtime `Building` instance in `GameState` contains:

- `id` (string) — unique instance id
- `name` (string)
- `typeId` (string) — references a building definition in `config/<config-set>/buildings.json`
- `zoneId` (string) — the zone the building is nominally associated with (kept for compatibility)
- `tileId?` (string, optional) — the specific tile the building occupies (new: may be absent for legacy data)
- `governingOrganizationId` (string)
- `intelLevel` (number)
- `activeEffectIds` (string[])

Per-type attributes stored in the building definition include:

- `resourceOutput` (object: `{ money?: number; science?: number; infrastructure?: number }`) — what the building produces per day
- `upkeepPerDay` (number) — daily maintenance cost
- `wealthRequirement` / `wealthWeight` — controls when and how often a type appears during worldgen
- `buildableOnTileTypes` — list of tile types this building can be placed on

Note: there is no `staffing` array or `construction_complete` boolean on the runtime `Building` object in the engine; staffing is represented by `Person` entities with `agentStatus` and assignment systems elsewhere in the simulation.

## 14.3 Construction & Demolition

Players build on specific tiles inside zones. At generation and during player construction, a concrete `tileId` is chosen for a building from the target zone's `tileIds`.

- To place a building a player must control the zone containing the chosen tile (ownership rules may be tile- or zone-based depending on game mode).
- Building type availability may be gated by the tile's type (some buildings require `buildableOnTileTypes`), zone wealth, and research unlocks.
- Demolishing a building removes its future upkeep and resource output; it may also affect local loyalty or stability via effects.

Implementation notes for engineers:

- Worldgen selects a `tileId` deterministically from the zone's `tileIds` using the seeded PRNG so generation is reproducible.
- Runtime code should use the helper `getBuildingZoneId(state, building)` to resolve a building's zone in one place — this returns the zone of `building.tileId` if present, otherwise falls back to `building.zoneId`.
- Resource attribution and settlement use the tile-derived zone to avoid accidentally counting buildings that are in a player's starting _zone_ but physically located on tiles outside their control.
