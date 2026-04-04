# 8. Economy

## 8.1 Two Distinct Income Systems

**Building Income:**
Buildings generate flat income each day based on their type, size, staffing level, and the zone's current `economic_output` value. This income flows directly to the owning GO's money pool. Banks are the primary building income source, but all staffed buildings contribute.

**Citizen Taxes:**
Citizens in empire-controlled zones are taxed. Tax income is calculated per citizen based on their employment status and a zone-level tax rate the player can adjust. Higher tax rates increase income but reduce loyalty over time. Lower tax rates cost money but can be used strategically to win over newly captured populations.

These two systems are tracked separately in the Economy screen so the player can see exactly what's driving their income.

## 8.2 Expenses

- **Agent Salaries** — Each agent draws a salary each day. Salary scales with agent rank/skill level.
- **Building Upkeep** — Each building has a daily upkeep cost. Unstaffed buildings still require upkeep unless demolished.
- **Plot Costs** — Active plots draw resources as specified in their requirements.
- **Activity Costs** — Active activities draw resources as specified.
- **Construction Costs** — One-time costs when building new structures.

## 8.3 Construction & Demolition

Players can construct new buildings in zones they control. Construction:

- Costs money (and potentially other resources, depending on building type).
- Takes a number of days to complete (construction time scales with building size).
- Requires the zone to have available tile space.

Players can also demolish existing buildings:

- Demolition is faster than construction.
- Removes the building's upkeep cost.
- May have loyalty effects (citizens don't always appreciate having their hospital torn down).
