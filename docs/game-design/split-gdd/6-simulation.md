# 6. Simulation

## 6.1 Individual Simulation

Every citizen in every zone is simulated as an individual entity each day. There are no demographic abstractions or population buckets. Each person has their own attributes, status effects, loyalties, employment status, and daily actions.

This is the core of EoE's depth. The player's decisions — a propaganda campaign, a tax increase, a plot gone wrong — ripple through the simulation person by person, producing emergent outcomes that feel earned rather than scripted.

## 6.2 Daily Citizen Actions

Each day, every citizen takes a number of actions from the following list. Which actions are available to a citizen depends on their attributes, status effects, employment, zone conditions, and current loyalty values.

| Action                    | Requirements                       | Possible Effects                                              |
| ------------------------- | ---------------------------------- | ------------------------------------------------------------- |
| Go to Work                | Employed at a building             | Contributes to building's resource output                     |
| Seek Employment           | Unemployed, willing                | May become employed at a local building                       |
| Protest                   | Low loyalty, high motivation       | Reduces zone stability; may trigger events                    |
| Pick a Fight              | High aggression or low loyalty     | May trigger combat event                                      |
| Go to the Bar             | None                               | Small morale effect; social connections                       |
| Go for a Walk             | None                               | Minor health/morale effect                                    |
| Create Art                | High intelligence or creativity    | May produce cultural effects in zone                          |
| Go Tagging                | Low loyalty, some agility          | Increases zone unrest; minor EVIL to empire if in empire zone |
| Set Something on Fire     | Very low loyalty, high aggression  | Damages building; triggers event                              |
| Go Shopping               | Money available                    | Minor economic effect                                         |
| Laze at Home              | Low motivation (character trait)   | No output; may reduce loyalty further over time               |
| Stare at the Wall and Cry | Low morale                         | No output; health may decrease                                |
| Binge on Conspiracies     | Has Conspiracy Theory effect       | Deepens effect; may spread to one other citizen               |
| Start a Project           | High intelligence                  | Begins a personal project (multi-day)                         |
| Finish a Project          | Active project near completion     | Completes project; possible skill gain                        |
| Spend Time with a Friend  | Social connections                 | Minor loyalty/morale boost                                    |
| Got Sick                  | Outbreak in zone, low constitution | Gains Sick status effect                                      |
| Death                     | Health at zero                     | Character dies; moved to morgue                               |

Citizens with character quirks (lazy, antisocial, paranoid, etc.) will have weighted action probabilities that reflect their personality.

## 6.3 Employment & Job Seeking

Unemployed citizens will attempt to seek employment each day, subject to:

- Available job slots at buildings in their zone.
- Their relevant skill/attribute level meeting the building's minimum requirements.
- Their personal motivation trait — some citizens are less likely to seek work than others.

Citizens do not automatically receive the best available job. Their search is influenced by the same attributes that make them useful employees. A high-intelligence citizen is more likely to end up in a lab. A strong, low-intelligence citizen may end up in manual roles.

The empire can influence employment by building or destroying certain building types, by assigning agents to manage hiring, or by executing plots that affect the workforce.

## 6.4 Death & The Morgue

When a person's health reaches zero, they are dead. Dead characters:

- Cannot take actions, participate in plots, or be assigned activities.
- Have their `dead` attribute set to `true`.
- Are moved to a morgue.

**Morgue Assignment:**

- Dead citizens are assigned to their zone's morgue (indexed by zone ID).
- Dead agents are assigned to their Governing Organization's agent morgue.
- Exception: agents who are stripped of agent status before death (e.g. fired, then killed) are assigned to the citizen morgue of their home zone.

Taking action involving a corpse in a GO's agent morgue generates less loyalty loss among zone citizens than handling corpses from the citizen morgue. The distinction matters for optics.

## 6.5 Capture

Captured persons are added to the capturing GO's `captives` list. Captives may be:

- **Held** — remain captive indefinitely.
- **Released** — returned to their home zone; loyalty effects vary.
- **Killed** — moved to the appropriate morgue.

Holding captives has upkeep implications and may trigger events (e.g., rescue attempts by foreign agents).
