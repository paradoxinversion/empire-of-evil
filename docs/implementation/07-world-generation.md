# World Generation

## Decision

World generation is a one-time synchronous operation that runs at game start and returns a fully-initialized `GameState`. It proceeds in a strict sequence of phases: terrain generation, zone formation, habitability assessment, parameter validation, nation placement, population seeding, and building placement. Each phase depends on the output of the last.

Parameters are configurable via `WorldGenParams` and validated early — if the requested configuration cannot produce a valid world, generation fails with a descriptive error before any state is constructed.

---

## Phase Order

```
1. Generate terrain grid         (tile type per grid cell)
2. Form zones                    (group contiguous tiles into zones)
3. Classify habitability         (mark zones as habitable / uninhabitable)
4. Validate parameters           (fail early if world can't be generated)
5. Place nations                 (seed + BFS expansion from origin zones)
6. Generate governing orgs       (one per nation + CPU org per nation)
7. Seed population               (persons per zone, scaled by wealth + density)
8. Place buildings               (types weighted by zone wealth)
9. Initialize empire             (player's starting zone, overlord, pet)
```

---

## Phase 1 — Terrain Generation

### Map grid

The world is a 2D grid of `mapWidth × mapHeight` cells. Each cell becomes one tile. Tiles are identified by grid coordinates `(x, y)` during generation; after generation they become `Tile` entities in `GameState` with a `typeId` referencing `config/tileTypes.json`.

### Noise-based terrain

Two independent noise maps are generated from the world seed:

- **Elevation map** — determines terrain ruggedness. High values → mountains; low values → coast or ocean.
- **Moisture map** — combined with elevation to refine biome assignment. High moisture + low elevation → city-eligible terrain (fertile, accessible). Low moisture + high elevation → barren wilderness.

Both maps use seeded Perlin (or simplex) noise with configurable scale. The seed is stored in `WorldGenParams` so a world is reproducible.

### Tile type assignment

Tile types are assigned by matching the noise values against each tile type's `terrainConditions` from `config/tileTypes.json`. No thresholds are hard-coded in the engine — all placement logic lives in config.

For each grid cell, the engine:

1. Evaluates every tile type in `tileTypes.json` and collects all types whose `elevationMin ≤ elevation ≤ elevationMax` and `moistureMin ≤ moisture ≤ moistureMax`.
2. Selects the matching type with the highest `priority`. If multiple types share the same priority, the one appearing first in the config file wins (stable sort).
3. Assigns that tile type to the cell.

Because noise is continuous, cells near the boundary of a type's range will transition naturally to adjacent types, producing smooth terrain. Mountains cluster because high-elevation noise values are continuous — no special clustering logic is needed.

**At least one tile type must cover the full 0.0–1.0 range for both elevation and moisture** (at low priority) so every cell maps to a type. The default `wilderness` entry serves this role. If no tile type matches a cell — which should not happen if the config is valid — generation throws a `WorldGenError`.

### Ocean placement

Oceans must be contiguous and plausible. After initial tile assignment, a **border flood fill** is applied: any tile with `isOcean: true` reachable from the map edge is kept; isolated inland ocean cells are converted to the highest-priority non-ocean tile type that matches their noise values. This prevents landlocked seas while keeping coastal and peripheral ocean bodies intact.

---

## Phase 2 — Zone Formation

### Zones span multiple tiles

A zone is a named region made up of one or more contiguous tiles. Zones are the unit of political control, population, and building placement — not individual tiles.

### Zone formation algorithm

Zone formation uses a **greedy flood-fill from random seed tiles**:

1. Select a random unassigned tile as the zone seed.
2. Expand outward to contiguous unassigned tiles of compatible types until the zone reaches `targetZoneSize` tiles.
3. Record the zone and its tile membership. Mark all tiles as assigned.
4. Repeat until all non-ocean tiles are assigned to a zone.

**Zone size** is not fixed — zones are allowed to vary between `minZoneSize` and `maxZoneSize` tiles (both configurable). Remaining tiles at map edges that cannot form a full zone are absorbed into adjacent zones.

**Ocean tiles are never part of a zone.** They remain as bare tile entities in `GameState` but do not belong to any zone, have no population, and cannot host buildings. They act as natural barriers between zones and nations.

**Mixed-tile zones are allowed.** A zone may contain multiple tile types (e.g., a mix of city and wilderness tiles). The zone's effective tile type for building restriction purposes is the **plurality type** — the tile type that makes up the most tiles in the zone.

### Zone wealth

Each zone is assigned a `generationWealth` value (0–100) during zone formation. Wealth is derived from:

- **Tile composition** — each tile type declares a `wealthContribution` (0–100) in `config/tileTypes.json`. The base wealth is the average of all tiles' contributions.
- **Noise-based variation** — a third seeded noise map adds local economic variation so not all city-rich zones are identical.

The formula is: `baseWealth = weightedAverage(tile.wealthContribution) * 0.8 + noiseValue * 20`, clamped to 0–100.

Wealth is intentionally baked in at generation and does not change without player action. It represents the zone's intrinsic economic potential.

---

## Phase 3 — Habitability Classification

Not all zones are inhabited at world start. A zone is classified as **uninhabitable** if:

- Its plurality tile type has `canBeInhabited: false` in `config/tileTypes.json`. Ocean is the canonical example; any custom tile type can opt out of habitation the same way.
- Its `generationWealth` is below `uninhabitedWealthFloor` (configurable). Very low-wealth zones are treated as unpopulated wilderness at generation, even if they are technically accessible.

Tile types with low `wealthContribution` (such as `mountain` at 15, `desert` at 10, `tundra` at 12) will produce zones that frequently fall below `uninhabitedWealthFloor`, making those terrain types sparsely settled by default — without any special per-type logic in the engine.

Uninhabitable zones are part of the world — they exist in `GameState`, have tiles, and can be explored and eventually developed — but they start with zero population, no governing organization, and no buildings.

The fraction of uninhabited zones is an emergent consequence of map parameters, not a directly configurable ratio. The validation phase (Phase 4) uses the count of habitable zones to check feasibility.

---

## Phase 4 — Parameter Validation

Validation runs before any nation or population state is constructed. If it fails, `generateWorld` throws a `WorldGenError` with a human-readable message describing what the problem is and what to change. The error is surfaced to the player in the new game setup UI before generation is committed.

### Checks

**Minimum habitable zones:**
```
requiredHabitableZones = nationCount * zonesPerNation + 1   // +1 for empire start zone
```
If `habitableZoneCount < requiredHabitableZones`, fail:
> "Not enough habitable zones for [nationCount] nations with [zonesPerNation] zones each. Either reduce nation count, reduce zones per nation, or increase map size."

**Minimum contiguity:**
The BFS expansion used in nation placement requires that each nation's zones be contiguous. If the map is fragmented (many isolated habitable zones separated by ocean or mountains), it is possible that contiguous blocks of `zonesPerNation` zones don't exist for every nation. This is checked after Phase 3 by running a connectivity analysis on the habitable zone graph. If fewer than `nationCount` contiguous blocks of size `≥ zonesPerNation` exist:
> "Map topology cannot accommodate [nationCount] contiguous nations of [zonesPerNation] zones. Try a larger map, fewer nations, or a different seed."

**Zone size sanity:**
`minZoneSize` must be ≥ 1. `maxZoneSize` must be ≤ `(mapWidth * mapHeight) / requiredHabitableZones / 2` — zones cannot be so large that there isn't room for the required number of them.

**Zones per nation minimum:**
`zonesPerNation` must be ≥ 3. Nations with fewer than 3 zones cannot realistically have a capital zone plus expansion territory.

---

## Phase 5 — Nation Placement

### Seed selection

Each nation is assigned an **origin zone** — the zone that becomes its capital. Origin zones are selected to maximize spacing between nations: the algorithm picks seed zones using a **Poisson-disc-style spread** over habitable zones, ensuring no two nation origins are within `minNationSpacing` zones of each other (configurable; defaults to `zonesPerNation / 2`).

If spread selection fails (map too small for requested spacing), the algorithm falls back to random selection from habitable zones with at least a 2-zone gap between seeds.

### Territorial expansion

From each origin zone, the nation expands using **BFS over the habitable zone adjacency graph**:

1. Enqueue the origin zone.
2. Dequeue the front zone; claim it for the nation. Mark it assigned.
3. Enqueue all adjacent unassigned habitable zones.
4. Repeat until the nation has claimed `zonesPerNation` zones.

Expansion is **interleaved across nations in round-robin order** (nation 1 claims 1 zone, then nation 2, then nation 3, etc.). This prevents the first nation from monopolizing the map center and produces more realistic territorial boundaries.

Zones that cannot be reached by any nation (isolated pockets, entirely surrounded by ocean or mountains) remain unclaimed and uninhabited.

### Empire origin

The player's empire always starts with exactly **one zone**, selected after all CPU nations have finished claiming territory. The empire origin is chosen from the remaining unclaimed habitable zones, preferring zones adjacent to (but not inside) an existing nation — a plausible "emerging power" starting position.

---

## Phase 6 — Governing Organizations

One governing organization (`GoverningOrganization`) is created per nation. This CPU org controls all zones claimed by that nation. The org's initial `intelLevel` (representing the empire's knowledge of this org) is set to 0.

The empire's governing organization is also created here and linked to `EmpireState.id`.

---

## Phase 7 — Population Seeding

Each habitable zone (including empire origin) is populated with a number of `Person` entities. Population count is:

```
zonePopulation = floor(zone.generationWealth * populationDensity * zoneSize * randomVariation)
```

Where:
- `populationDensity` is from `WorldGenParams` (a scalar multiplier; higher = more people per wealth unit).
- `zoneSize` is the tile count of the zone.
- `randomVariation` is a small ±20% noise factor for natural unevenness.

All generated persons start as civilians (`agentStatus` absent). Their attributes and skills are assigned using random distributions seeded from the world seed, with attribute ranges informed by the zone's wealth (wealthier zones trend toward slightly higher education-related attributes like `intelligence` and `administration`).

Persons are placed in `state.persons` keyed by ID. The zone's `population` field is updated to match the count.

---

## Phase 8 — Building Placement

Buildings are placed in each inhabited zone according to a **wealth-weighted probability table**. The number of buildings in a zone scales with zone size and wealth:

```
buildingCount = floor(zone.generationWealth / 100 * maxBuildingsPerZone * zoneSize / avgZoneSize)
```

Building type selection is a weighted draw where weights are defined per building type as a function of the zone's `generationWealth`. Richer zones have access to a broader palette and higher weights for expensive building types:

| Wealth range | Available building types (illustrative) |
|---|---|
| 0–25 | Basic housing, market stall |
| 26–50 | Warehouse, clinic, small factory |
| 51–75 | Bank, hospital, factory |
| 76–100 | Research lab, financial centre, military base |

The exact per-type wealth thresholds and weights are defined in `config/buildings.json` (see `docs/config/buildings.md`) rather than hard-coded. Each building definition includes a `wealthRequirement` (minimum wealth to appear) and a `wealthWeight` curve (how likely it is at various wealth levels above the minimum).

Tile type restrictions are applied before selection: a building whose `buildableOnTileTypes` doesn't include the zone's plurality tile type is excluded from the draw, regardless of wealth.

Buildings are placed with no assigned agents at generation — staffing is the player's responsibility after game start. The generating organization for each building is the zone's governing org.

---

## Phase 9 — Empire Initialization

The empire's starting zone is configured with:

- One designated headquarters building (type defined in config; always placed regardless of wealth).
- The Overlord entity as a `Person` in the zone (with `agentStatus` set, role `'unassigned'`).
- A pet `Person` selected from `config/pets.json` based on `WorldGenParams.petTypeId` (or random if absent).
- Starting resources from `WorldGenParams.startingResources` (or config defaults).
- EVIL initialized to `{ actual: 0, perceived: 0 }`.

---

## WorldGenParams

Full parameter reference. All fields except `seed` are required.

```typescript
interface WorldGenParams {
  // Reproducibility
  seed?: number;                 // omit for random; stored in GameState for display

  // Map dimensions
  mapWidth: number;              // grid columns
  mapHeight: number;             // grid rows

  // Terrain
  terrainProfile?: {
    noiseScale: number;          // noise frequency; larger = smoother terrain (default 4.0)
    uninhabitedWealthFloor: number; // zones below this generationWealth are uninhabited at start (default 20)
  };

  // Zone formation
  minZoneSize: number;           // minimum tiles per zone (default 2)
  maxZoneSize: number;           // maximum tiles per zone (default 6)

  // Nations
  nationCount: number;           // number of CPU nations
  zonesPerNation: number;        // zones each nation claims (minimum 3)
  minNationSpacing: number;      // minimum zone-graph distance between nation origins (default: zonesPerNation / 2)

  // Population
  populationDensity: number;     // persons-per-wealth-unit scalar (default 1.0)

  // Buildings
  maxBuildingsPerZone: number;   // upper bound on buildings per zone (default 5)

  // Empire start
  startingResources?: {
    money: number;               // default from config
    science: number;
    infrastructure: number;
  };
  petTypeId?: string;            // ID from config/pets.json; random if omitted
}
```

---

## Error Reporting

`generateWorld` throws `WorldGenError` (a typed subclass of `Error`) if validation fails. The error has a `code` field for programmatic handling in the UI:

```typescript
class WorldGenError extends Error {
  constructor(
    public code:
      | 'INSUFFICIENT_HABITABLE_ZONES'
      | 'INSUFFICIENT_CONTIGUOUS_ZONES'
      | 'ZONE_SIZE_INVALID'
      | 'ZONES_PER_NATION_TOO_SMALL',
    message: string      // human-readable, surfaced directly to the player
  ) {
    super(message);
  }
}
```

The UI catches `WorldGenError` and displays `error.message` inline on the new game setup screen before the player commits to generation. Generation is never partially committed — it either succeeds and returns a complete `GameState`, or it throws before modifying any state.

---

## Determinism

If `WorldGenParams.seed` is provided, world generation is fully deterministic. The same seed and parameters always produce the same world. The seed is written into `GameState` (as `worldSeed: number`) so it can be displayed in the UI and copied by players who want to share their map.

All random draws during generation use a seeded pseudo-random number generator (e.g., a simple mulberry32 or xorshift implementation) rather than `Math.random()`, ensuring reproducibility.
