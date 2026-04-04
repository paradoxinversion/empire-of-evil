# 3. Core Mechanics Overview

## 3.1 Gameplay Loop

1. **Player Turn** — The player allocates resources, assigns agents to activities, queues plots, manages buildings, and reviews intelligence.
2. **Advance Time** — The player chooses to advance 1 day, 7 days, or to a specified date. The simulation runs day by day under the hood.
3. **Event Interruption** — Certain events pause time advancement and require player response before the simulation continues. These include: combat encounters, events that kill or injure named characters, events with mandatory player choices, and threshold EVIL events.
4. **Simulation Phase** — Each day, all citizens in all zones take simulated actions. Resources are generated and upkeep is deducted. CPU organizations take actions.
5. **Repeat.**

## 3.2 Turn Structure Detail

A "turn" in EoE is one day of in-game time. When the player advances time:

- Each day, every citizen in every zone executes their daily simulated actions.
- Resources are calculated: income generated, upkeep deducted, salaries paid.
- Active plots and activities advance by one day.
- CPU organizations take their daily action.
- Any events triggered that day are queued for resolution.

If the player has chosen to advance multiple days, the simulation continues until either the target date is reached or an interrupting event fires.

## 3.3 Win & Loss Conditions (Summary)

- **Military Victory** — Control every zone in the world (uninhabitable zones excluded).
- **Cultural Victory** — Achieve loyalty from a sufficient percentage of the world's total population without requiring zone ownership.
- **Defeat** — The Evil Overlord is killed, or the empire controls zero zones.
