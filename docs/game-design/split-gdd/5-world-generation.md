# 5. World Generation

## 5.1 Process

World generation proceeds in the following order:

1. **Map Generation** — A 2D tile map is procedurally generated with terrain types distributed according to realistic-but-fudged geographic rules.
2. **Nation Formation** — Nations are carved out of the map as contiguous regions of tiles.
3. **Zone Establishment** — Each nation is divided into zones. Zones are assigned contiguous tile groups within their nation.
4. **CPU Organization Creation** — One Governing Organization is created per nation and assigned control of it.
5. **Building Generation** — Zones are populated with buildings based on their `generation_wealth` value and terrain type.
6. **Population Generation** — Zones are populated with citizens. Each citizen is a fully simulated individual with unique attributes.
7. **Evil Empire Genesis** — The player creates their Overlord and is assigned a starting zone (see below).

## 5.2 World Scale

Default world generation targets hundreds of zones across several nations. Exact counts are configurable at game start. Default parameters are tuned to maximize simulation richness within the performance constraints of a JavaScript client.

Players may customize:

- Number of nations
- Average zones per nation
- Starting world population density
- World size (map tile dimensions)

## 5.3 Evil Empire Genesis

1. The player names their Evil Overlord and customizes their starting attributes (within limits).
2. A starting zone is selected — either randomly or from a filtered list based on player preference (terrain type, nation, etc.).
3. Citizens in the starting zone become empire subjects. Their loyalty begins at a low but workable level.
4. A portion of the starting zone's citizens are recruited as the empire's first agents.
5. The Overlord is placed in the starting zone.

The early game is deliberately difficult. The empire begins with minimal resources, few agents, and neighbors who will not yet take it seriously — but will, soon enough.

## 5.4 New Player Mode

An optional guided mode is available for new players. This mode:

- Provides contextual tooltips and event explanations during early turns.
- Reduces early CPU aggression during an initial grace period.
- Surfaces tutorial events that introduce core mechanics organically.

Players may opt out of this mode at game start, or disable it at any time.
