# 4. The World

## 4.1 Structure

The world is organized hierarchically:

```
World
└── Nations (multiple)
    └── Zones (multiple per nation)
        └── Tiles (multiple per zone)
            └── Buildings
            └── People
```

## 4.2 Tiles & The Map

The world is presented as a 2D tile-based map. Tiles are the atomic unit of geography. Each tile has a terrain type and belongs to a zone.

Zones span multiple contiguous tiles. The number of tiles per zone scales with the zone's size attribute, but the exact tile-to-zone ratio is subject to performance optimization during development. The design target is multi-tile zones; the minimum viable implementation is one tile per zone with multi-tile zones as an enhancement.

## 4.3 Terrain Types

| Terrain    | Movement Effect        | Building Restrictions      | Combat Effect      |
| ---------- | ---------------------- | -------------------------- | ------------------ |
| City       | Normal                 | None                       | Cover available    |
| Wilderness | Slowed                 | No Banks                   | Reduced visibility |
| Ocean      | Blocked (without tech) | None                       | N/A                |
| Mountain   | Heavily slowed         | No Banks, reduced capacity | Defender advantage |

Additional terrain types may be added. Terrain generation follows realistic geography conventions at a fudged scale — oceans border landmasses, mountains cluster, cities appear near coasts and low-lying areas — but the world prioritizes being _interesting_ over being _accurate_. Population clusters should always be reachable and strategically meaningful.

## 4.4 Zone Adjacency & Movement

Geography matters. Agents physically travel across tiles to reach target zones. Travel time is calculated in days based on the number of tiles traversed and the terrain types crossed. This affects:

- How long it takes to execute plots that require agents to travel to a target zone.
- How quickly reinforcements can arrive to a zone under attack.
- The spread of zone-level effects (e.g., disease outbreaks, conspiracy theory propagation).
- CPU org agents entering empire territory — the player has time to respond if they're paying attention.

## 4.5 Nations

Nations are geographic and political groupings of zones. Each nation is controlled by a Governing Organization at world generation. Nations have cultural identity that affects citizen loyalty baselines and how citizens respond to foreign occupation.

**Nation Attributes:**

- `name` (string)
- `size` (number) — determines zone count at world gen
- `governing_organization_id` (string)

## 4.6 Zones

Zones are the primary unit of territorial control. Owning a zone means the empire collects its resources, can station agents there, and can build or destroy its buildings.

**Zone Attributes:**

_Basic:_

- `name` (string)
- `tiles` (Tile[]) — the tiles that make up this zone
- `nation_id` (string)
- `governing_organization_id` (string)
- `generation_wealth` (number) — used at world gen to determine building types; static after generation
- `economic_output` (number) — dynamic; represents the current daily resource flow from this zone; affected by building health, citizen employment, loyalty, and player actions
- `population` (number) — derived from citizen count

_Intelligence:_

- `intel_level` (number) — the empire's current knowledge of this zone; affects accuracy of reports

**Zone Capture & Pacification:**

When a zone is captured, all citizens in the zone become subjects of the capturing organization. Their loyalty to the new organization starts extremely low — most people do not welcome occupation. Citizens who already had positive opinions of the empire (through prior propaganda, conspiracy theory effects, or cultural victory mechanics) may have higher starting loyalty. A newly captured zone should be treated as unstable until loyalty has been managed upward.
