# Empire of EVIL — Game Design Document

**Version 0.7**

---

## Table of Contents

1. [Concept & Vision](#1-concept--vision)
2. [Tone & Design Philosophy](#2-tone--design-philosophy)
3. [Core Mechanics Overview](#3-core-mechanics-overview)
4. [The World](#4-the-world)
5. [World Generation](#5-world-generation)
6. [Simulation](#6-simulation)
7. [Resource Management](#7-resource-management)
8. [Economy](#8-economy)
9. [EVIL & The Escalation System](#9-evil--the-escalation-system)
10. [Characters & People](#10-characters--people)
11. [The Evil Overlord](#11-the-evil-overlord)
12. [Agents, Squads & The Inner Circle](#12-agents-squads--the-inner-circle)
13. [The Emperor's Pet](#13-the-emperors-pet)
14. [Buildings](#14-buildings)
15. [Activities](#15-activities)
16. [Plots](#16-plots)
17. [Science & Research](#17-science--research)
18. [Combat](#18-combat)
19. [Events](#19-events)
20. [The CPU & World Response](#20-the-cpu--world-response)
21. [Victory & Defeat](#21-victory--defeat)
22. [The Interface](#22-the-interface)
    - 22.1 Design Philosophy & Aesthetic
    - 22.2 Design System
    - 22.3 Layout Architecture
    - 22.4 Navigation & Routing
    - 22.5 The Time Advance Flow
    - 22.6 The Event System UX
    - 22.7 Screen Specifications (Empire, Intel, Personnel, Economy, Science, Plots, Activities, Events)
    - 22.8 Overlay & Modal Patterns
    - 22.9 The After Action Report
    - 22.10 Character Profile Panel
    - 22.11 The World Map
    - 22.12 Notification & Feed System
    - 22.13 First Run & New Player Experience
    - 22.14 Victory & Defeat Screens
    - 22.15 Data States
    - 22.16 Accessibility & Keyboard Shortcuts
    - 22.17 Tone Escalation Rules
23. [Effects Reference](#23-effects-reference)
24. [Post-MVP Features](#24-post-mvp-features)

---

## 1. Concept & Vision

**Empire of EVIL (EoE)** is a turn-based browser strategy game in which the player takes the role of an Evil Overlord building an organization from a single occupied zone toward total world domination.

The game is presented as a faux-corporate dashboard — the player's interface is the administrative backend of their growing empire, complete with personnel rosters, resource summaries, operational queues, and intelligence reports. The aesthetic is deliberate: the banality of spreadsheets and org charts applied to world domination.

EoE draws primary inspiration from two games:

- **Liberal Crime Squad** by Jonathan S. Fox — for its tongue-in-cheek political satire, emergent narrative events, and interface style.
- **Aurora 4X** by Steve Walmsley — for its deep individual-entity simulation, richly interlocking systems, and the satisfaction of building a well-oiled machine over many hours of play.

The long-term vision is a rich interactive simulation where the player's decisions have tangible, traceable effects on individual citizens, economies, and the political landscape of the world — turn by turn, citizen by citizen.

Development targets a web application with a React frontend. The initial release is a single-player experience designed from the ground up to support multiplayer in a future phase.

---

## 2. Tone & Design Philosophy

### 2.1 Satire with a Conscience

EoE is a satire. Its primary target is authoritarianism, fascism, and dictatorship — the mechanics, aesthetics, and flavor text of the game are designed to lampoon these systems while making them the subject of play. The game understands that being evil is bad. Playing evil, however, is fun — and EoE leans into that tension deliberately.

**The game must never glorify real-world evil or celebrate real-world authoritarian figures.** The player is a cartoon villain in a cartoon world. The satire works by making the player complicit in systems they can recognize from reality, then holding up a mirror.

### 2.2 Cartoonish vs. Real Evil — The Consequence Spectrum

EoE distinguishes between two registers of villainy, and the game's systems respond to them differently:

**Cartoonish Evil** — Pigeon-guided missiles. Hypno disco balls. Sending your raven to deliver threatening notes. Holding a mandatory EVIL Oratory for your minions. This is the fun end of the spectrum. The world reacts with appropriate drama. Heroes arrive with capes. The consequences are operatic.

**Real Evil** — Actions that mirror genuine authoritarian tactics: mass surveillance, ethnic persecution, forced labor, systematic torture, calculated oppression of the powerless. When the player crosses into this territory, the game's tone shifts. Citizens don't cheer. The dashboard gets quieter. Heroes don't make speeches — they just come for you. The mechanical consequences are harsher and less forgiving.

This distinction is intentionally not spelled out to the player in a tutorial. It is a system they are meant to discover — and reckon with — on their own.

### 2.3 Naming & Flavor Text Conventions

The register of the game's writing scales with the cartoonishness of what's being described:

- **Mundane operations** (administering a zone, paying salaries, filing infrastructure reports) use dry corporate language. The humor is in the contrast.
- **Mid-tier villainy** (espionage, propaganda, intimidation) uses bureaucratic euphemism. "Involuntary relocation." "Citizen feedback management."
- **Peak cartoonish evil** (superweapons, hypnosis, the pet tiger) goes full Bond villain. Exclamation points earn their place here.

### 2.4 NPC Commentary & The World Watching

The world in EoE is aware of the player. As the empire grows, intercepted communications, espionage reports, and overheard conversations provide NPC commentary on the empire's actions. Citizens gossip. Foreign agents file reports. A resistance pamphlet might quote the player's last three plots back at them.

This commentary is the game's primary mechanism for reflecting the player's choices back at them — not through a morality score, but through the voices of the people living inside the simulation.

---

## 3. Core Mechanics Overview

### 3.1 Gameplay Loop

1. **Player Turn** — The player allocates resources, assigns agents to activities, queues plots, manages buildings, and reviews intelligence.
2. **Advance Time** — The player chooses to advance 1 day, 7 days, or to a specified date. The simulation runs day by day under the hood.
3. **Event Interruption** — Certain events pause time advancement and require player response before the simulation continues. These include: combat encounters, events that kill or injure named characters, events with mandatory player choices, and threshold EVIL events.
4. **Simulation Phase** — Each day, all citizens in all zones take simulated actions. Resources are generated and upkeep is deducted. CPU organizations take actions.
5. **Repeat.**

### 3.2 Turn Structure Detail

A "turn" in EoE is one day of in-game time. When the player advances time:

- Each day, every citizen in every zone executes their daily simulated actions.
- Resources are calculated: income generated, upkeep deducted, salaries paid.
- Active plots and activities advance by one day.
- CPU organizations take their daily action.
- Any events triggered that day are queued for resolution.

If the player has chosen to advance multiple days, the simulation continues until either the target date is reached or an interrupting event fires.

### 3.3 Win & Loss Conditions (Summary)

- **Military Victory** — Control every zone in the world (uninhabitable zones excluded).
- **Cultural Victory** — Achieve loyalty from a sufficient percentage of the world's total population without requiring zone ownership.
- **Defeat** — The Evil Overlord is killed, or the empire controls zero zones.

---

## 4. The World

### 4.1 Structure

The world is organized hierarchically:

```
World
└── Nations (multiple)
    └── Zones (multiple per nation)
        └── Tiles (multiple per zone)
            └── Buildings
            └── People
```

### 4.2 Tiles & The Map

The world is presented as a 2D tile-based map. Tiles are the atomic unit of geography. Each tile has a terrain type and belongs to a zone.

Zones span multiple contiguous tiles. The number of tiles per zone scales with the zone's size attribute, but the exact tile-to-zone ratio is subject to performance optimization during development. The design target is multi-tile zones; the minimum viable implementation is one tile per zone with multi-tile zones as an enhancement.

### 4.3 Terrain Types

| Terrain    | Movement Effect        | Building Restrictions      | Combat Effect      |
| ---------- | ---------------------- | -------------------------- | ------------------ |
| City       | Normal                 | None                       | Cover available    |
| Wilderness | Slowed                 | No Banks                   | Reduced visibility |
| Ocean      | Blocked (without tech) | None                       | N/A                |
| Mountain   | Heavily slowed         | No Banks, reduced capacity | Defender advantage |

Additional terrain types may be added. Terrain generation follows realistic geography conventions at a fudged scale — oceans border landmasses, mountains cluster, cities appear near coasts and low-lying areas — but the world prioritizes being _interesting_ over being _accurate_. Population clusters should always be reachable and strategically meaningful.

### 4.4 Zone Adjacency & Movement

Geography matters. Agents physically travel across tiles to reach target zones. Travel time is calculated in days based on the number of tiles traversed and the terrain types crossed. This affects:

- How long it takes to execute plots that require agents to travel to a target zone.
- How quickly reinforcements can arrive to a zone under attack.
- The spread of zone-level effects (e.g., disease outbreaks, conspiracy theory propagation).
- CPU org agents entering empire territory — the player has time to respond if they're paying attention.

### 4.5 Nations

Nations are geographic and political groupings of zones. Each nation is controlled by a Governing Organization at world generation. Nations have cultural identity that affects citizen loyalty baselines and how citizens respond to foreign occupation.

**Nation Attributes:**

- `name` (string)
- `size` (number) — determines zone count at world gen
- `governing_organization_id` (string)

### 4.6 Zones

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

---

## 5. World Generation

### 5.1 Process

World generation proceeds in the following order:

1. **Map Generation** — A 2D tile map is procedurally generated with terrain types distributed according to realistic-but-fudged geographic rules.
2. **Nation Formation** — Nations are carved out of the map as contiguous regions of tiles.
3. **Zone Establishment** — Each nation is divided into zones. Zones are assigned contiguous tile groups within their nation.
4. **CPU Organization Creation** — One Governing Organization is created per nation and assigned control of it.
5. **Building Generation** — Zones are populated with buildings based on their `generation_wealth` value and terrain type.
6. **Population Generation** — Zones are populated with citizens. Each citizen is a fully simulated individual with unique attributes.
7. **Evil Empire Genesis** — The player creates their Overlord and is assigned a starting zone (see below).

### 5.2 World Scale

Default world generation targets hundreds of zones across several nations. Exact counts are configurable at game start. Default parameters are tuned to maximize simulation richness within the performance constraints of a JavaScript client.

Players may customize:

- Number of nations
- Average zones per nation
- Starting world population density
- World size (map tile dimensions)

### 5.3 Evil Empire Genesis

1. The player names their Evil Overlord and customizes their starting attributes (within limits).
2. A starting zone is selected — either randomly or from a filtered list based on player preference (terrain type, nation, etc.).
3. Citizens in the starting zone become empire subjects. Their loyalty begins at a low but workable level.
4. A portion of the starting zone's citizens are recruited as the empire's first agents.
5. The Overlord is placed in the starting zone.

The early game is deliberately difficult. The empire begins with minimal resources, few agents, and neighbors who will not yet take it seriously — but will, soon enough.

### 5.4 New Player Mode

An optional guided mode is available for new players. This mode:

- Provides contextual tooltips and event explanations during early turns.
- Reduces early CPU aggression during an initial grace period.
- Surfaces tutorial events that introduce core mechanics organically.

Players may opt out of this mode at game start, or disable it at any time.

---

## 6. Simulation

### 6.1 Individual Simulation

Every citizen in every zone is simulated as an individual entity each day. There are no demographic abstractions or population buckets. Each person has their own attributes, status effects, loyalties, employment status, and daily actions.

This is the core of EoE's depth. The player's decisions — a propaganda campaign, a tax increase, a plot gone wrong — ripple through the simulation person by person, producing emergent outcomes that feel earned rather than scripted.

### 6.2 Daily Citizen Actions

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

### 6.3 Employment & Job Seeking

Unemployed citizens will attempt to seek employment each day, subject to:

- Available job slots at buildings in their zone.
- Their relevant skill/attribute level meeting the building's minimum requirements.
- Their personal motivation trait — some citizens are less likely to seek work than others.

Citizens do not automatically receive the best available job. Their search is influenced by the same attributes that make them useful employees. A high-intelligence citizen is more likely to end up in a lab. A strong, low-intelligence citizen may end up in manual roles.

The empire can influence employment by building or destroying certain building types, by assigning agents to manage hiring, or by executing plots that affect the workforce.

### 6.4 Death & The Morgue

When a person's health reaches zero, they are dead. Dead characters:

- Cannot take actions, participate in plots, or be assigned activities.
- Have their `dead` attribute set to `true`.
- Are moved to a morgue.

**Morgue Assignment:**

- Dead citizens are assigned to their zone's morgue (indexed by zone ID).
- Dead agents are assigned to their Governing Organization's agent morgue.
- Exception: agents who are stripped of agent status before death (e.g. fired, then killed) are assigned to the citizen morgue of their home zone.

Taking action involving a corpse in a GO's agent morgue generates less loyalty loss among zone citizens than handling corpses from the citizen morgue. The distinction matters for optics.

### 6.5 Capture

Captured persons are added to the capturing GO's `captives` list. Captives may be:

- **Held** — remain captive indefinitely.
- **Released** — returned to their home zone; loyalty effects vary.
- **Killed** — moved to the appropriate morgue.

Holding captives has upkeep implications and may trigger events (e.g., rescue attempts by foreign agents).

---

## 7. Resource Management

### 7.1 The Four Core Resources

| Resource       | Description                                                   | Primary Sources                                 | Primary Sinks                                             |
| -------------- | ------------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------- |
| Money          | Operational currency of the empire                            | Building income, citizen taxes, activity income | Agent salaries, building upkeep, plot costs, construction |
| Science        | Research capacity and accumulated knowledge                   | Scientists in labs, research activities         | Science projects                                          |
| Infrastructure | Empire management capacity; determines effective zone control | Administrators in offices                       | Consumed by zone count (above-cap penalty)                |
| EVIL           | Infamy gauge; drives world response and unlocks content       | Successful plots, certain activities            | Reputation management plots (reduces perceived EVIL)      |

### 7.2 Infrastructure & Zone Cap

Infrastructure represents the empire's administrative capacity. Each zone under empire control requires a baseline infrastructure allocation to be "effectively managed."

**At or below the infrastructure cap:**

- All zones function normally.
- Full resource output from all zones.
- Normal agent capacity.

**Above the infrastructure cap:**

- Upkeep costs increase per zone over the cap.
- Agent command capacity decreases (fewer agents can be effectively directed).
- Loyalty may decay in over-extended zones.
- Resource output from excess zones is reduced.

The cap is not a hard wall — the empire can overextend, but it pays for it. Managing the infrastructure gap is one of the central mid-game challenges.

### 7.3 Resource Decay on Failure to Pay

If the empire cannot meet its financial obligations:

- Resource accumulation rates decay severely across all categories.
- Agents who go unpaid begin losing loyalty to the empire.
- Agents with sufficiently low loyalty may defect, revolt, or take independent hostile actions.
- Building output degrades if upkeep is not met.

The empire does not automatically prioritize payments — the player manages cash flow. Running out of money is a serious crisis, not a minor inconvenience.

---

## 8. Economy

### 8.1 Two Distinct Income Systems

**Building Income:**
Buildings generate flat income each day based on their type, size, staffing level, and the zone's current `economic_output` value. This income flows directly to the owning GO's money pool. Banks are the primary building income source, but all staffed buildings contribute.

**Citizen Taxes:**
Citizens in empire-controlled zones are taxed. Tax income is calculated per citizen based on their employment status and a zone-level tax rate the player can adjust. Higher tax rates increase income but reduce loyalty over time. Lower tax rates cost money but can be used strategically to win over newly captured populations.

These two systems are tracked separately in the Economy screen so the player can see exactly what's driving their income.

### 8.2 Expenses

- **Agent Salaries** — Each agent draws a salary each day. Salary scales with agent rank/skill level.
- **Building Upkeep** — Each building has a daily upkeep cost. Unstaffed buildings still require upkeep unless demolished.
- **Plot Costs** — Active plots draw resources as specified in their requirements.
- **Activity Costs** — Active activities draw resources as specified.
- **Construction Costs** — One-time costs when building new structures.

### 8.3 Construction & Demolition

Players can construct new buildings in zones they control. Construction:

- Costs money (and potentially other resources, depending on building type).
- Takes a number of days to complete (construction time scales with building size).
- Requires the zone to have available tile space.

Players can also demolish existing buildings:

- Demolition is faster than construction.
- Removes the building's upkeep cost.
- May have loyalty effects (citizens don't always appreciate having their hospital torn down).

---

## 9. EVIL & The Escalation System

### 9.1 EVIL as a Dual Metric

EVIL has two values that are tracked separately:

- **Actual EVIL** — The true accumulated infamy of the empire, based on its actions.
- **Perceived EVIL** — What the rest of the world believes about the empire. This is what drives world response.

The gap between actual and perceived EVIL can be managed. Propaganda, false flag operations, strategic bribes to international bodies, and careful plot selection can keep perceived EVIL lower than actual EVIL — for a while. The world will eventually catch up.

### 9.2 EVIL Tiers

EVIL thresholds are named for tone. The names are played with dry corporate absurdity — internal designations the empire uses for itself.

| Perceived EVIL Range | Tier Name    | World Response                                                                                            |
| -------------------- | ------------ | --------------------------------------------------------------------------------------------------------- |
| 0–19                 | Nuisance     | No formal response. Minor diplomatic side-eye.                                                            |
| 20–39                | Irritant     | Foreign orgs begin increasing border security. Espionage attempts increase.                               |
| 40–59                | Threat       | Resistance movements emerge in empire-adjacent nations. CPU aggression toward empire increases.           |
| 60–79                | Menace       | Hero organizations begin to form. International coalitions discuss "the problem."                         |
| 80–94                | Supervillain | Active hero teams deploy against the empire. World Police mobilizes.                                      |
| 95–100               | Apocalyptic  | All non-empire orgs treat the EoE as primary threat. Heroes are at full strength. Maximum world response. |

Tier names are visible to the player on their dashboard. The mechanical thresholds that trigger world response events are not displayed directly — players learn them through play.

### 9.3 The Consequence Spectrum

The severity and nature of consequences scales with the _type_ of evil being practiced, not just the EVIL score:

**Cartoonish evil** (absurd plots, theatrical oppression, pigeon missiles) generates EVIL and triggers proportionally dramatic responses — heroes with speeches, dramatic rescues, operatic confrontations. The world treats this as the premise of an adventure.

**Real-world-mirroring evil** (mass surveillance of citizens, systematic persecution, calculated civilian harm) triggers quieter, harder consequences. Loyalty collapses faster. Hero orgs grow angrier and more capable. NPC commentary in intercepted communications becomes pointed and bleak. The mechanical penalties are steeper and less forgiving. The game does not make this fun.

This distinction is not labeled. Players discover it.

### 9.4 Reducing Perceived EVIL

Players can invest in reducing their perceived EVIL through:

- Propaganda plots and activities.
- Diplomatic plots targeting foreign org opinion.
- Science projects that enable reputation management tools.
- Strategic release of captives or public gestures of "goodwill."

Actual EVIL can only be reduced through specific high-cost, late-game research unlocks. It is much harder to undo what you've actually done than to manage how it looks.

---

## 10. Characters & People

### 10.1 Every Person is an Individual

Every person in the game world — citizen or agent — is a fully simulated individual entity. There are no demographic abstractions. Each person has a unique set of attributes, skills, loyalties, status effects, and behavioral tendencies.

### 10.2 Core Attributes

| Attribute      | Description                                                         |
| -------------- | ------------------------------------------------------------------- |
| Strength       | Factors into combat damage                                          |
| Constitution   | Primary determinant of max health                                   |
| Agility        | Factors into combat evasion                                         |
| Intelligence   | Affects science output, conspiracy theory resistance, skill ceiling |
| Leadership     | Determines how many people this character can effectively command   |
| Administration | Factors into infrastructure output when working as an administrator |
| Combat         | Overall combat proficiency                                          |
| Empathy        | Low empathy increases risk of "Gone Too Far" type events            |
| Motivation     | Affects willingness to seek work, take initiative, follow orders    |

### 10.3 Skills

Skills are separate from attributes and represent learned capabilities. Skills have a ceiling determined by the character's relevant attribute — a low-Intelligence character cannot become a master scientist regardless of training time.

Skills improve through:

- The Training activity.
- Repeated execution of relevant actions during simulation.
- Certain events.

#### Combat

| Skill          | Attribute Cap | Passive Effect                                                                                                   |
| -------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Firearms       | Combat        | Increases ranged damage output in combat                                                                         |
| Melee          | Combat        | Increases close-quarters damage output                                                                           |
| Tactics        | Leadership    | Improves squad combat effectiveness as a function of the character's Leadership attribute                        |
| Evasion        | Agility       | Improves chance of avoiding damage in combat                                                                     |
| Field Medicine | Intelligence  | Reduces health loss from injuries sustained in combat; allows basic in-field injury treatment without a hospital |

#### Science & Research

| Skill       | Attribute Cap | Passive Effect                                                                                                                                                          |
| ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Biology     | Intelligence  | Improves science output in labs; gates biology-adjacent research branches                                                                                               |
| Engineering | Intelligence  | Improves construction speed; gates hardware and materials research branches                                                                                             |
| Computing   | Intelligence  | Improves intel accuracy on surveilled citizens and zones; improves science output for computing-adjacent research; improves detection of foreign agents in empire zones |

#### Administration

| Skill     | Attribute Cap  | Passive Effect                                                        |
| --------- | -------------- | --------------------------------------------------------------------- |
| Logistics | Administration | Improves infrastructure output; reduces upkeep costs per managed zone |
| Finance   | Administration | Improves building income; reduces salary overhead                     |

#### Medicine

| Skill     | Attribute Cap | Passive Effect                                                                                                              |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Medicine  | Intelligence  | Improves healing rate of patients in hospitals; reduces health loss from injuries and sickness in the character's zone      |
| First Aid | Intelligence  | Allows basic stabilization of injured characters outside of a hospital; reduces chance of injury worsening before treatment |

#### Intelligence & Espionage

| Skill               | Attribute Cap | Passive Effect                                                                                                       |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Surveillance        | Intelligence  | Improves intel gain rate on citizens and zones                                                                       |
| Infiltration        | Agility       | Improves plot success chance and reduces detection risk when operating in foreign zones                              |
| Counterintelligence | Intelligence  | Reduces chance of empire agents being detected or captured in empire zones                                           |
| Forgery             | Intelligence  | Improves effectiveness of false flag operations and identity-based plots; gates Advanced Forgeries research benefits |

#### Social

| Skill        | Attribute Cap | Passive Effect                                                                         |
| ------------ | ------------- | -------------------------------------------------------------------------------------- |
| Persuasion   | Empathy       | Improves loyalty gain from recruitment attempts and social activities                  |
| Intimidation | Combat        | Improves loyalty retention through fear; increases effectiveness of threat-based plots |
| Oratory      | Empathy       | Improves loyalty effects from speeches, propaganda plots, and EVIL Oratory activity    |
| Deception    | Intelligence  | Improves success chance of manipulation-based plots and misdirection                   |

#### Command

| Skill      | Attribute Cap | Passive Effect                                                                                                 |
| ---------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| Delegation | Leadership    | Improves effectiveness of standing squad orders; reduces loyalty decay in squads under the character's command |
| Training   | Leadership    | Improves the rate at which agents under the character's command gain skills                                    |

#### Criminal

| Skill      | Attribute Cap | Passive Effect                                                                                                                  |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Smuggling  | Agility       | Improves resource gain and reduces capture risk when running smuggling operations                                               |
| Larceny    | Agility       | Improves success chance of theft and break-in operations; useful for plots involving stealing resources or intel from buildings |
| Streetwise | Intelligence  | Improves black market access and resource rates; improves chance of finding and recruiting criminal-type citizens               |

### 10.4 Loyalties

Each person has a loyalty map: a key-value store where keys are Governing Organization IDs and values are 0–100.

- **100** — Total loyalty. Will act in the org's interests even at personal cost.
- **50** — Neutral. Follows orders but won't go out of their way.
- **25** — Disgruntled. May refuse assignments; risk of hostile action.
- **0** — Active resistance. Hostile to the org.

A person can have loyalty values to multiple organizations simultaneously. A citizen might be moderately loyal to their home nation's GO and also have growing loyalty to the empire due to propaganda.

### 10.5 Intel Level

The empire's knowledge about a specific person is tracked as an `intel_level` value (0–100). Low intel level means reports on that person are inaccurate or absent. High intel level means the empire has detailed, reliable information about their attributes, location, and loyalties.

Intel level is raised through the Survey Citizens activity, Reconnaissance plots, and certain science research effects.

### 10.6 Status Effects

People can carry status effects that modify their behavior and attributes. Key effects include:

- **Conspiracy Theories** — Reduces intelligence (resist check); may spread to adjacent citizens daily.
- **Sick** — Reduces health each day; may spread in zones with an active Outbreak.
- **Injured** — Reduced combat effectiveness; heals over time or in a hospital.
- **Inspired** — Temporary loyalty and productivity boost.
- **Radicalized** — High hostility to a specific GO; more likely to take hostile actions.

---

## 11. The Evil Overlord

### 11.1 The Overlord as a Character

The Evil Overlord is the player's avatar in the game world. They are represented as a full character entity using the same attribute and skill system as every other person in the simulation. They begin with higher-than-average starting attributes, reflecting their exceptional nature, but they are not mechanically unique — they live, act, age, and can die like anyone else.

The Overlord begins in the empire's starting zone and can be moved, assigned to plots, and placed in danger.

### 11.2 The Overlord's Role

The Overlord is the leader of the Governing Organization. Their Leadership attribute determines the empire's baseline command capacity. They can:

- Be assigned to plots, lending their personal attributes to improve outcomes.
- Lead the Inner Circle (see Section 12).
- Execute Overlord-specific plots unlocked through research (e.g., Inspiring Speech, Public Appearance).
- Be killed, which triggers immediate defeat.

### 11.3 Overlord Death & Succession

If the Overlord is killed, the game ends in defeat (MVP). Post-MVP, a succession/exile mechanic is planned.

Because the Overlord's death is a loss condition, player decisions about when to personally deploy the Overlord involve genuine risk management. Sending the Overlord on a plot in a hostile zone is powerful but dangerous.

### 11.4 CPU Org Leaders

Every CPU Governing Organization also has a leader character generated using the same system. CPU leaders can be killed. When a CPU leader dies:

- The organization enters a succession period.
- A new leader is selected from among the organization's agents, prioritizing highest Leadership attribute.
- The succession period creates a brief window of reduced CPU effectiveness that the player can exploit.

---

## 12. Agents, Squads & The Inner Circle

### 12.1 Citizens & Agents

The distinction between citizen and agent is one of status, not fundamental nature. An agent is a citizen who has been recruited into the empire's service. Any citizen can become an agent (subject to recruitment mechanics), and agents retain all their citizen attributes.

Citizens and agents share the same job system. An agent assigned to a lab as a Scientist is doing the same job a civilian scientist does — they just owe their loyalty to the empire.

### 12.2 Recruitment

New agents can be recruited through:

- **Citizen Recruited event** — A citizen is surfaced to the player for potential recruitment.
- **Active Headhunting** — If the empire has sufficient intel on a citizen, the player can initiate active recruitment. This costs resources and may fail depending on the citizen's current loyalty.
- **Post-conquest intake** — After capturing a zone, a portion of citizens may be eligible for recruitment.

Recruitment assigns the new agent to a commanding agent (based on the recruiter's Leadership capacity) and sets their initial departmental assignment.

### 12.3 Jobs & Departments

Agents are assigned to jobs. Jobs determine their daily activities and what resources they contribute to the empire. The current job list is not exhaustive and will expand.

| Job                  | Primary Output   | Notes                                                 |
| -------------------- | ---------------- | ----------------------------------------------------- |
| Unassigned (Recruit) | None             | Default state for newly recruited agents              |
| Scientist            | Science          | Works in labs                                         |
| Administrator        | Infrastructure   | Works in offices                                      |
| Troop                | Combat capacity  | Can be deployed in combat and zone defense            |
| Operative            | Plots/Activities | Available for espionage, propaganda, field operations |

Citizens in empire zones can also hold equivalent civilian jobs (working in labs, offices, banks, etc.) without being agents. Their output contributes to the zone's economic output and resource generation.

### 12.4 Squads

Squads are the empire's delegation layer. A squad is a named, configured group of agents with:

- A designated squad leader (must have sufficient Leadership).
- A roster of assigned agents.
- Standing orders (e.g., "defend this zone," "run recon on adjacent zones," "maintain this activity").
- A home zone.

Squads allow the player to set up repeating operational patterns that run without daily micromanagement. A well-configured squad system is the foundation of late-game empire management.

Squads are created and managed through the Personnel screen.

### 12.5 The Inner Circle

The Inner Circle is the Overlord's personal squad — a hand-selected group of elite agents who operate as the empire's most trusted and capable operatives.

**Inner Circle properties:**

- Members are selected directly by the player.
- Inner Circle members have a higher loyalty ceiling and gain experience faster than standard agents.
- The Inner Circle stays close to the Overlord's location by default (can be deployed separately, at risk).
- Losing an Inner Circle member is a significant narrative and mechanical event — they are named, known, and their loss should feel like a loss.
- The Inner Circle functions as the Overlord's last line of personal defense if hero orgs come calling.

The Inner Circle is introduced to the player as they grow their empire. It represents the shift from managing individuals to managing an organization.

---

## 13. The Emperor's Pet

The Evil Overlord has a pet. The pet is selected at game start from a list of available options (cat, tiger, raven, shark in a tank, etc.). Each pet type has a small set of unique special actions it can perform.

The pet is a named character in the simulation. It has simplified attributes (no Intelligence, Administration, etc.) and cannot be killed by standard combat. It can be deployed on a limited number of special actions per game period.

**Example pet actions (illustrative, not final):**

| Pet   | Action               | Effect                                                                             |
| ----- | -------------------- | ---------------------------------------------------------------------------------- |
| Cat   | Knock Something Over | Triggers a minor chaos event in target zone; slight loyalty disruption             |
| Tiger | Motivational Visit   | Sends tiger to "visit" a disloyal agent; significant loyalty increase (fear-based) |
| Raven | Message Delivery     | Delivers an untraceable communication; used in certain plot chains                 |
| Shark | Threatening Display  | Used in interrogation events; increases information extraction success             |

The pet exists at the cartoonish end of the EVIL spectrum. Its actions should never have the tone of real-world cruelty.

---

## 14. Buildings

### 14.1 Building Types

| Type      | Function                                                     | Who Works There              |
| --------- | ------------------------------------------------------------ | ---------------------------- |
| Residence | Houses citizens and agents; required for population capacity | N/A (occupants, not workers) |
| Office    | Generates Infrastructure; requires Administrator staff       | Administrators               |
| Lab       | Generates Science; requires Scientist staff                  | Scientists                   |
| Bank      | Generates steady Money income                                | Any (tellers, managers)      |
| Hospital  | Heals injured/sick agents and citizens                       | Medical staff                |

### 14.2 Building Attributes

- `name` (string)
- `type` (enum: Residence, Office, Lab, Bank, Hospital)
- `size` (number) — determines occupant/worker capacity
- `zone_id` (string)
- `governing_organization_id` (string)
- `resource_output` (object: type + value) — what resource this building produces and at what rate
- `upkeep_cost` (number) — daily money cost
- `staffing` (Person[]) — current workers
- `construction_complete` (boolean) — false during construction period

### 14.3 Construction & Demolition

Players can build new buildings in controlled zones at a money cost and construction time. Buildings can also be demolished, removing their upkeep but potentially affecting citizen loyalty.

Building type availability may be gated by zone terrain and research unlocks (e.g., advanced lab types requiring specific science projects).

---

## 15. Activities

Activities are ongoing daily tasks that agents can be assigned to. An agent assigned to an activity continues it each day until reassigned, incapacitated, or the activity is cancelled.

### 15.1 Activity List

**Training**

- Cost: $10/participant/day
- Effect: Chance to raise a skill (ceiling limited by relevant attribute)

**EVIL Oratory**

- Cost: Free
- Effects: Small money gain; chance to increase loyalty of nearby citizens; small EVIL increase

**EVIL Education**

- Cost: $5/participant/day
- Effect: Increases participant loyalty to empire (up to cap)

**Harass Nuns**

- Cost: $0
- Effects: Raises EVIL; chance to reduce non-agent citizen loyalty; chance to trigger hostile citizen event
- Note: This is a dick move. The game knows this.

**Survey Citizens**

- Cost: $1/participant/day
- Effect: Raises intel level on one citizen per participant per day (in participant's zone)

**Smuggle Resources**

- Cost: $3/participant/day
- Effects: Chance to gain money; small EVIL increase; chance participants are captured by foreign agents

**Intimidation Campaign**

- Cost: $2/participant/day
- Effects: Decreases loyalty in target rival zone; increases EVIL

**Siphon Domestic Accounts**

- Effect: Siphons funds from empire citizens (reduces their economic contribution; one-time gain)

**Siphon Global Accounts**

- Effect: Siphons funds from non-empire citizens in target zone

---

## 16. Plots

Plots are deliberate operations the empire executes to achieve strategic goals. Unlike activities (which are passive and ongoing), plots are goal-directed, resource-bounded, and have defined success and failure states.

### 16.1 Plot Resolution

All plots have:

- **Requirements** — Agents, zones, resources, and research needed.
- **Execution time** — Number of days to complete (including agent travel time to target zone).
- **Success condition** — What needs to happen for the plot to succeed.
- **Results** — Defined outcomes for success, failure, and any result.
- **Failure severity scaling** — Failure consequences are harsher the higher the empire's EVIL rating. High-EVIL empires are watched more closely; failed plots attract more attention.

### 16.2 Plot Capacity

The number of simultaneous active plots is limited by available agents who meet each plot's requirements. There is no arbitrary plot queue cap — the bottleneck is agent availability, required research, and resource sufficiency.

### 16.3 Plot Complexity Tiers

Plots are designed across four complexity tiers to ensure variety. At any point in the game the player should have plots available from multiple tiers running simultaneously.

| Tier                     | Shape                                                                   | Player Involvement      |
| ------------------------ | ----------------------------------------------------------------------- | ----------------------- |
| 1 — Fire and Forget      | Assign agents, plot runs to completion                                  | None after assignment   |
| 2 — Branching Resolution | Plot triggers a choice event mid-execution or at resolution             | One meaningful decision |
| 3 — Multi-Stage          | Distinct phases, each requiring agent assignment or resource commitment | Ongoing management      |
| 4 — World-Altering       | Empire-wide or world-wide consequences; long execution; heavy cost      | High; often multi-stage |

### 16.4 Plot List

---

#### Economic Disruption

**The Biggest Tax for the Oldest Profession** _(Tier 1)_
Enforce exploitative taxes on adult services workers in target zones.

- Requirements: 1+ agents, 1+ target zones, $1/zone
- Success: Increased wealth bonuses in zones; small EVIL gain
- Failure: Small loyalty loss in target zone; agents may be reported to foreign org

---

**Funny Money Printing Press** _(Tier 1)_
Flood a target zone's economy with counterfeit currency.

- Requirements: Counterfeiter research; 1+ agents; target zone
- Success: Target zone economic output decreases; empire gains moderate money
- Failure: Agents captured; moderate EVIL gain; foreign org alerted
- Any result: Small EVIL gain

---

**Establish a Front Company** _(Tier 2)_
Plant a legitimate-seeming business in a target zone as a persistent imperial asset.

- Requirements: Finance skill agent; Forgery skill agent; target zone; moderate money cost
- Success: Persistent asset created in target zone; provides passive income and acts as cover for future plots in that zone (reduces detection risk for subsequent operations)
- Failure: Agents exposed; front company seized; moderate EVIL gain
- Note: Front company can be discovered over time through enemy espionage

---

**Siphon Zone Accounts** _(Tier 1)_
Systematically drain financial accounts in a target zone.

- Requirements: Computing skill agent; target zone
- Success: Money gained scaled to zone economic output; loyalty decrease in target zone
- Failure: Agent captured or expelled; foreign org alerted

---

**Forge Trade Documents** _(Tier 1)_
Fabricate trade agreements or tariff documents to manipulate a zone's economy.

- Requirements: Forgery skill agent; target zone; Advanced Forgeries research
- Success: Unlocks smuggling routes in target zone (reduces cost and capture risk of Smuggling activity there); target zone economic output slightly reduced
- Failure: Forgery detected; agents expelled or captured; Forgery plot cooldown in that zone

---

#### Political Manipulation

**Send Ade** _(Tier 2)_
Infiltrate a target zone with cult-like loyalty manipulation. Send them some ade. Cool-ade. Tons and tons of Cool-ade.

- Requirements: Persuasion skill agent; Oratory skill agent; target zone; moderate money cost
- Success: A portion of target zone citizens gain loyalty to empire; small EVIL gain
- Failure: Agents expelled; loyalty decrease toward empire in target zone
- Branching: If plot succeeds beyond threshold, player chooses to push further (higher loyalty gain, higher EVIL, higher blowback risk) or consolidate

---

**Back a Puppet Candidate** _(Tier 3)_
Engineer the political rise of an empire-aligned figure in a foreign zone.

- Requirements: Persuasion skill agent; Surveillance skill agent; Deception skill agent; target zone; high money cost; intel level on target zone > 50
- Stages: Identify candidate → Fund campaign → Suppress opposition → Install
- Success: Zone control transfers to empire _(MVP; post-MVP: installs friendly-but-independent org that may later act as wildcard)_
- Failure at any stage: Agents captured or expelled; significant EVIL gain; foreign org opinion of empire decreases sharply
- Any result: Chance that citizens of target org identify empire involvement; perceived EVIL increase scales with evidence left behind

---

**Engineer a Coup** _(Tier 3)_
Destabilize a foreign org's leadership and install a new leader directly loyal to the empire.

- Requirements: Infiltration skill agent; Deception skill agent; target nation; high money and Science cost; intel level on target org leader > 60
- Stages: Surveil leadership → Turn key personnel → Execute coup
- Success: New leader installed; new leader begins with high loyalty to empire
- High risk: Citizens of target org have a significant chance of identifying the empire as responsible; perceived EVIL spikes sharply on exposure
- Failure: Coup attempt collapses; participating agents captured or killed; major EVIL gain; all orgs increase hostility toward empire temporarily

---

**Inspiring Speech** _(Tier 1)_
The Overlord or a high-Oratory agent delivers a rousing address to empire citizens.

- Requirements: Oratory skill agent (Overlord preferred); research unlock
- Success: Empire-wide loyalty boost; small EVIL gain
- Effect scales with Oratory skill of delivering agent

---

#### Military Operations

**Reconnaissance** _(Tier 1)_
Gather intelligence on a foreign zone.

- Requirements: 1+ agents; target zone
- Success: Zone intel level raised; margin of error on reports about the zone, its nation, and its GO decreases; small EVIL gain
- Failure: Agents either captured, enter combat with foreign zone agents, or escape

---

**Sabotage** _(Tier 1)_
Damage or destroy a specific building in a foreign zone without attempting to take the zone.

- Requirements: 1+ agents; target zone; target building; Engineering or Larceny skill preferred
- Success: Target building damaged or destroyed; target zone economic output reduced; small EVIL gain
- Failure: Agents captured or killed; foreign org alerted; EVIL gain

---

**Assassination** _(Tier 2)_
Kill a specific named target in a foreign zone.

- Requirements: 1+ Combat skill agents; target person; intel level on target > 40
- Success: Target killed; significant EVIL gain; foreign org enters succession if target was a leader
- Failure: Agents captured or killed; target alerted and goes into hiding (intel level on target resets); major EVIL gain
- Branching: If target is a GO leader, player chooses whether to publicize the assassination (higher EVIL, greater fear effect on other orgs) or keep it quiet (lower EVIL, slower succession disruption)

---

**Destabilize Zone** _(Tier 2)_
Weaken a zone's defenses and loyalty ahead of a planned Takeover.

- Requirements: Infiltration skill agent; Intimidation or Persuasion skill agent; target zone
- Success: Target zone combat defense reduced; citizen loyalty in zone decreases; subsequent Takeover Zone plot in this zone has improved success chance
- Failure: Agents expelled; zone defense increases (org becomes alert); EVIL gain

---

**Takeover Zone** _(Tier 3)_
Attempt to seize control of a foreign zone. Core military victory mechanic.

- Requirements: 1+ Troop agents; target zone
- Stages: Travel to zone → Engage defenses → Combat encounter
- Success: Zone and its buildings come under empire control; zone intel level raised to maximum; moderate EVIL gain
- Failure: Participating agents killed in combat; EVIL gain
- Note: Preceding with Reconnaissance and Destabilize Zone significantly improves success odds

---

**Abduction** _(Tier 2)_
Capture a specific person from a foreign zone and bring them to empire territory.

- Requirements: 1+ agents; target person; intel level on target > 30
- Success: Target added to empire captives list
- Failure: Agents captured or killed; EVIL gain; foreign org alerted
- Branching: On success, player chooses to hold, interrogate, ransom, or release captive

---

#### Espionage & Intelligence

**Surveillance Tap** _(Tier 1)_
Plant listening devices in a target zone's key locations.

- Requirements: Surveillance skill agent; target zone; Centralized Communications research
- Success: Ongoing intel feed from target zone; intercepted communications events begin appearing for that zone; zone intel level slowly increases over time while tap is active
- Failure: Agents captured; tap discovered and removed

---

**Plant Disinformation** _(Tier 1)_
Corrupt the intel available to a foreign org about an empire zone.

- Requirements: Deception skill agent; Forgery skill preferred; target zone
- Success: Target zone's intel level (from the enemy's perspective) is corrupted; enemy recon operations on that zone return inaccurate data for a period
- Failure: Deception discovered; empire's actual intel level on that zone decreases as the enemy becomes more careful

---

**Purge Foreign Agents** _(Tier 2)_
Sweep an empire zone for foreign operatives.

- Requirements: Counterintelligence skill agent; Surveillance skill agent; target empire zone
- Success: Foreign agents in the zone identified and captured or expelled
- Risk: Low intel on zone citizens means innocent citizens may be caught in the sweep; collateral capture or harm triggers loyalty loss and may generate a Gone Too Far-type event
- Failure: Foreign agents go to ground; harder to detect for a period; small loyalty loss from citizens due to disruption

---

**Encryption Protocols** _(Tier 1)_
Deploy advanced encryption across empire communications.

- Requirements: Computing skill agent; Encryption Protocols research
- Success: Adds `encryption-protocols` effect to empire; reduces success chance of enemy surveillance operations
- Note: If encryption key is lost (agent carrying it is killed or captured), communications become vulnerable until re-established

---

#### Social Engineering & Propaganda

**Spread Conspiracy Theories** _(Tier 1)_
Seed conspiracy theories among citizens in a target zone.

- Requirements: Deception skill agent; target zone
- Success: A portion of target zone citizens gain Conspiracy Theories status effect; intelligence reduced, loyalty may shift toward empire
- Any result: Each affected citizen has a daily chance to spread the effect to one neighbor

---

**Organize Antiwork Unions** _(Tier 1)_
Plant agents in a foreign zone to convince citizens that work is bad, actually.

- Requirements: Persuasion skill agent; target zone
- Success: A portion of building personnel in target zone quit; zone economic output reduced
- Failure: Personnel loyalty to their GO increases; agents expelled

---

**Free Internet** _(Tier 2)_
Provide free internet access to citizens in a target zone as a loyalty-building measure.

- Requirements: Scientist agent; EVIL ≥ 25; Science 10; 1 Infrastructure/controlled zone
- Success: Loyalty increase among target zone citizens; empire intel level on those citizens increases passively over time
- Branching: Player can choose to include surveillance backdoor (higher intel gain, risk of discovery and loyalty collapse if found)

---

**False Flag Operation** _(Tier 2)_
Attribute an empire action or a fabricated incident to another org.

- Requirements: Forgery skill agent; Deception skill agent; target org
- Success: Perceived EVIL decreases; target org's reputation damaged; other orgs' opinion of target org decreases
- Failure: False flag exposed; perceived EVIL increases; empire credibility damaged (future Deception plots harder for a period)

---

**Global Propaganda Campaign** _(Tier 3)_
A sustained, coordinated multi-zone propaganda effort targeting world opinion of the empire.

- Requirements: Oratory skill agent; Deception skill agent; Propaganda Department research; high money cost; 3+ target zones
- Stages: Develop messaging → Place agents in target zones → Sustain broadcast
- Success: Perceived EVIL reduced across all target zones; loyalty increases among non-empire citizens in target zones; empire opinion improves with target orgs
- Failure at any stage: Campaign exposed; perceived EVIL spikes; significant money lost

---

#### Criminal

**Rob a Bank** _(Tier 2)_
Hit a bank in a target zone for direct money gain.

- Requirements: Larceny skill agent; Firearms or Melee skill agent; target zone with a bank
- Success: Money gained scaled to bank size; EVIL gain
- Failure: Agents captured or killed; EVIL gain
- Blowback scaling: Robbing an empire bank (internal corruption) generates loyalty loss among empire citizens and lower EVIL gain; robbing a foreign bank generates higher EVIL but triggers foreign org hostility
- Branching: On success, player chooses to launder money through a front company (slower gain, lower EVIL) or take it directly (faster, higher EVIL)

---

**Establish a Smuggling Route** _(Tier 2)_
Set up a persistent underground supply line between two zones.

- Requirements: Smuggling skill agent; Streetwise skill agent; two connected zones
- Success: Persistent smuggling route established; reduces cost of Smuggle Resources activity between those zones; provides passive money income; provides cover for moving agents between zones without detection
- Failure: Route exposed; agents captured; EVIL gain; both zones' orgs become more alert

---

**Recruit Criminal Network** _(Tier 2)_
Absorb an existing criminal network in a target zone into the empire's operations.

- Requirements: Streetwise skill agent; Intimidation or Persuasion skill agent; target zone; moderate money cost
- Success: Criminal network becomes an empire asset; improves black market access in that zone; provides passive intel on zone citizens; occasional money income
- Failure: Network hostile; agents at risk; EVIL gain

---

**Forge Identity Documents** _(Tier 1)_
Create false identities for empire agents operating in foreign zones.

- Requirements: Forgery skill agent; Advanced Forgeries research
- Success: Target agents gain a cover identity; detection risk on their next plot in a foreign zone significantly reduced; cover can be blown by high-Counterintelligence foreign agents
- Failure: Forgery detected; agents flagged by foreign org; increased detection risk for a period

---

#### Defensive

**Fortify Zone** _(Tier 2 — Ongoing)_
Establish and maintain ongoing defensive infrastructure in an empire zone.

- Requirements: Engineering skill agent; Logistics skill agent; target empire zone; ongoing money cost
- Effect: Persistent combat defense bonus in target zone; incoming Takeover Zone plots face increased difficulty; agent detection improved
- Stopping the plot: Defense bonus degrades back to baseline over time once the plot is cancelled
- Note: Fortification does not prevent infiltration-based plots, only direct military action

---

**Counterintelligence Sweep** _(Tier 1)_
Assign agents to monitor and intercept foreign espionage operations empire-wide.

- Requirements: Counterintelligence skill agent; Computing skill preferred
- Success: Reduced success chance of all foreign espionage plots targeting empire zones while active; chance to identify and capture foreign agents
- Note: This is a standing operation that runs until cancelled, similar to an activity

---

**Operation Clean Hands** _(Tier 3 — Multi-stage; targets Adjudicators specifically)_
Make the world believe the Adjudicators are corrupt. This will take time, patience, and exceptional forgery work. Perceived EVIL must be below 60 to initiate; Advanced Forgeries and Propaganda Department research required.

- Stage 1 — Plant the Seeds: Fabricate Adjudicator misconduct evidence and place it where credible parties will find it. Forgery skill agent; Deception skill agent; 2+ target zones with Lamplight Society or press presence. Duration: 10 days. Success: Evidence in circulation; 3 orgs receive fabricated documents; suspicion begins. Failure: Forgery detected; Adjudicators alerted; plot chain fails; perceived EVIL increases.
- Stage 2 — Cultivate the Narrative: Support and amplify the emerging story through propaganda and planted witnesses. Oratory skill agent; Propaganda Department research; money cost. Duration: 15 days. Success: 2+ orgs formally question Adjudicator legitimacy; Adjudicator capability temporarily reduced. Failure: Narrative collapses; empire identified as source; significant perceived EVIL increase; Adjudicators gain capability from rally effect.
- Stage 3 — The Revelation: Coordinated release of fabricated evidence timed for maximum impact. Deception skill agent; Computing skill agent; Forgery skill agent; all prior stages must have succeeded. Duration: 5 days. Success: World turns on Adjudicators; mandate revoked; org enters collapse state; may reconstitute slowly if empire doesn't follow up. Partial success: Adjudicators damaged but not destroyed; perceived EVIL reduced significantly regardless. Failure: Catastrophic; empire identified as orchestrator; all orgs increase hostility; Adjudicators gain maximum capability from worldwide sympathy.

---

**Disinformation Network** _(Tier 3)_
Build a sustained, multi-zone false intelligence infrastructure that corrupts enemy recon across the empire.

- Requirements: Deception skill agent; Forgery skill agent; Computing skill agent; 3+ empire zones; Propaganda Department research
- Stages: Establish false data sources → Place disinformation agents → Maintain network
- Success: All enemy recon operations targeting empire zones return corrupted data; empire effectively becomes harder to read for all foreign orgs simultaneously
- Failure: Network exposed; agents captured; enemy intel on empire zones improves significantly as they now know to distrust prior data

---

#### Tier 4 — World-Altering Operations

_These plots are only available at high Science and/or EVIL levels. They represent the most ambitious and consequential operations available to the empire. Their tone ranges from cartoonishly absurd to genuinely threatening. All Tier 4 plots carry significant risk of world response escalation._

---

**The Hypno Disco Ball** _(Tier 4)_
Deploy a hyper-refractive light installation capable of broadcasting hypnotic frequencies across an entire zone.

- Requirements: Hyper-refractive Materials research; Engineering skill agent; Scientist agent; high Science cost; target zone
- Success: Mass loyalty conversion in target zone; affected citizens gain a new status effect making them more prone to socializing, partying, and reduced productivity (they are having a great time, actually); intelligence of affected citizens reduced
- Failure: Device malfunctions; agents injured; significant EVIL gain; foreign org in target zone becomes aware of empire's optical research
- Note: Sits firmly at the cartoonish end of the EVIL spectrum. Consequences are dramatic, not grim.

---

**Blot Out the Sun** _(Tier 4)_
Launch a stratospheric particulate dispersal system that reduces global solar energy output — then sell the solution back to a dependent world.

- Requirements: Advanced Engineering research chain; Scientist agent; very high Science and money cost; multi-stage
- Stages: Develop dispersal system → Deploy globally → Establish power infrastructure → Begin extortion
- Success: All non-empire orgs must pay ongoing tribute or face loyalty and health penalties among their citizens (reduced sunlight affects agriculture and morale); empire gains massive ongoing income
- Risk: Every org in the world now has maximum incentive to destroy the empire immediately; hero orgs, world police, and resistances all escalate to maximum aggression; the empire must sustain the extortion or lose the investment
- Failure: Dispersal system destroyed or fails; massive EVIL gain; all orgs increase hostility; empire loses investment entirely
- Note: This plot is a global hostage situation. It is only viable if the empire is already strong enough to withstand maximum world response.

---

**Control the World's Water Supply** _(Tier 4)_
Seize control of global freshwater infrastructure through a combination of physical infiltration and technological override.

- Requirements: Engineering research chain; Surveillance research chain; very high Science, money, and Infrastructure cost; agents in multiple zones across multiple nations
- Stages: Map global water infrastructure → Infiltrate key nodes → Deploy control systems → Activate leverage
- Success: All non-empire orgs must pay ongoing tribute or face direct health effects among their citizens (Sick status effects begin appearing); empire gains ongoing tribute income
- Failure: Infrastructure seizure collapses; agents killed or captured; massive EVIL gain; world response escalates
- Note: Unlike Blot Out the Sun, water control is regional in its first stages — the empire can target specific nations before going global, building leverage incrementally.

---

**The Supersoldier Program** _(Tier 4)_
Develop and deploy genetically or chemically enhanced soldiers. Results may vary.

- Requirements: Biology research chain; advanced lab buildings; very high Science cost; willing (or unwilling) test subjects
- Success: Empire gains a cohort of supersoldier agents with significantly enhanced Combat, Strength, and Constitution attributes
- Catastrophic failure (low Biology skill, rushed research, or sabotage): Program produces uncontrolled subjects; Zombie Plague effect begins in the lab's zone
    - Zombie Plague spreads zone by zone like Outbreak but is far more lethal and renders zones uninhabitable
    - Empire can attempt to quell the plague by force (reclaiming zones via combat) or research a cure (requires Biology research; takes significant time)
    - Unchecked plague can trigger the alternate defeat condition (all zones uninhabitable)
- Note: The catastrophic failure path is a true runaway consequence. The game will not prevent the player from rushing this research.

---

**Soylent Green** _(Tier 4)_
Develop a cheap, efficient food product to feed empire citizens — made from a proprietary and confidential ingredient.

- Requirements: Biology research; Food Processing research; lab buildings; ongoing supply of the confidential ingredient
- Success: Empire food costs eliminated; citizen health maintained cheaply; moderate loyalty gain from "improved standard of living"
- The secret: The confidential ingredient is people. Specifically, people who have gone missing from empire zones. The longer the program runs, the more disappearances accumulate in the simulation.
- Discovery mechanic: Other orgs and citizens can piece this together over time. Discovery risk scales with how many people have gone missing. High-intel foreign agents, citizens with high Intelligence, and intercepted communications all contribute to the investigation. Full exposure triggers a massive loyalty collapse empire-wide and a world response escalation event.
- Note: This plot sits at the boundary of cartoonish and real evil. The game's tone reflects this — the consequences of exposure are played seriously, not for laughs.

---

**Pigeon Missile Barrage** _(Tier 4)_
Deploy a coordinated strike of missile-guided pigeons (or pigeon-guided missiles, depending on available research) against a target zone.

- Requirements: Missile Pigeons or Pigeon Missiles research (or both, for maximum effect); target zone
- Success: Significant military damage to target zone; buildings damaged; agents and citizens injured or killed; EVIL gain
- Failure: Pigeons go off course; possible friendly fire in adjacent zones; significant EVIL gain regardless
- Note: Entirely cartoonish. The After Action Report for this plot should be written accordingly.

---

## 17. Science & Research

### 17.1 The Research Tree

Science projects are organized into a freeform web of interconnected clusters. Projects belong to thematic branches, but branches cross-connect throughout — some of the most powerful unlocks require prior investment in two or more branches. There are no labeled eras or tiers; the tree flows freely, rewarding exploration.

**Early game** research rewards breadth — small investments across multiple branches unlock cross-branch nodes faster and give the player a feel for their preferred playstyle. **Late game** research rewards depth — the most powerful and world-altering projects require sustained investment in specific branches. Players who have spread too thin will find themselves unable to reach the endgame nodes that define a dominant strategy.

Dead-end paths exist and are intentional. Some research chains lead to goofy, niche, or situationally powerful outcomes that won't suit every playstyle — but will delight players who seek them out.

### 17.2 Science Project Structure

Each science project has the following properties:

- `name` — Humorous or euphemistic; written in dry corporate register
- `description` — Factual; tells the player exactly what the project does and unlocks
- `cost` (money) — One-time expenditure on project initiation
- `science_required` (science resource) — Consumed during research
- `completion_days` — Base research time; reduced by assigned agent skill levels
- `prerequisites` — List of required prior research projects
- `skill_drivers` — Which agent skills affect research speed and output quality
- `unlocks` — Plots, activities, effects, or further research this project enables

**Research speed and output** are affected by the skills of agents assigned to the project. Assigning agents with the wrong skill profile will cause research to crawl. The right agents can meaningfully reduce completion time and improve the quality of what's unlocked.

**Parallel research** is supported. Multiple projects can run simultaneously, each requiring their own assigned agents and ongoing resource draw.

**Interrupted research** — If a lab is destroyed or its scientists killed or removed, research pauses. A portion of accumulated progress is lost on interruption; the remainder is retained when research resumes.

**Stolen research** — The empire can acquire foreign research through espionage plots, either accelerating its own progress in a branch or learning what capabilities a CPU org has developed.

### 17.3 Research Branches & Projects

The following describes each branch, its projects, their dependencies, and what they unlock. Cross-branch dependencies are noted explicitly.

---

#### Surveillance & Control

_Skill drivers: Computing, Surveillance_
_Early game breadth branch. Foundational for intelligence operations and several cross-branch unlocks._

---

**Operational Transparency Initiative**
Deploy basic internal communications infrastructure across empire zones.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Unlocks: Empire Intranet; Survey Citizens activity improvement; minor intel accuracy boost empire-wide

---

**Empire Intranet**
Connect empire zones through a proprietary internal network.

- Prerequisites: Operational Transparency Initiative
- Cost: Moderate money; moderate Science; moderate completion
- Unlocks: Centralized Telecommunications; cross-branch: Free Internet plot becomes available

---

**Centralized Telecommunications**
Tap into the communications infrastructure of target zones.

- Prerequisites: Empire Intranet
- Cost: Moderate money; high Science; long completion
- Unlocks: Surveillance Tap plot; ongoing passive intel on tapped zones; adds `centralized-telecom` effect

---

**Predictive Behavioral Modeling**
Analyze citizen behavior patterns to anticipate dissent before it manifests.

- Prerequisites: Centralized Telecommunications
- Cost: High money; high Science; long completion
- Skill drivers: Computing (primary), Surveillance
- Unlocks: Improved accuracy on citizen loyalty reports; early warning system for revolt/protest events; cross-branch: required for Disinformation Network plot (with Social & Propaganda branch)

---

**Pattern Recognition Systems**
Automated analysis of surveillance data to identify foreign operatives by behavioral signature.

- Prerequisites: Centralized Telecommunications
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Computing (primary)
- Unlocks: Passive foreign agent detection improvement in surveilled zones; Counterintelligence Sweep plot effectiveness increased

---

**Deep Cover Protocols**
Formalize methods for establishing and maintaining long-term agent cover identities.

- Prerequisites: Operational Transparency Initiative
- Cost: Low money; low Science; short completion
- Skill drivers: Surveillance, Infiltration
- Unlocks: Forge Identity Documents plot; cover identity duration increased

---

#### Military & Hardware

_Skill drivers: Engineering (primary), Tactics, Firearms_
_Breadth-friendly early, depth-required late. Core branch for force projection._

---

**Standardized Armaments Program**
Equip empire agents with consistent, reliable weaponry.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Skill drivers: Engineering
- Unlocks: Small combat effectiveness bonus for all Troop agents; prerequisite for further weapons research

---

**Fortification Engineering**
Develop methods for rapidly reinforcing zone defenses.

- Prerequisites: Standardized Armaments Program
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Engineering (primary), Logistics
- Unlocks: Fortify Zone plot; improved building durability in empire zones

---

**Advanced Weapons Development**
Push the limits of conventional armament design.

- Prerequisites: Standardized Armaments Program
- Cost: High money; high Science; long completion
- Skill drivers: Engineering (primary), Firearms
- Unlocks: Significant combat effectiveness bonus for Troop agents; prerequisite for Miniaturized Locomotion and pigeon programs

---

**Miniaturized Locomotion**
Explore the engineering of small-scale propulsion and guidance systems.

- Prerequisites: Advanced Weapons Development
- Cost: Moderate money; high Science; long completion
- Skill drivers: Engineering (primary), Computing
- Unlocks: Micro Flight Control; cross-branch: required for Blot Out the Sun (with Materials & Engineering branch)

---

**Micro Flight Control**
Develop precision guidance systems for small airborne platforms.

- Prerequisites: Miniaturized Locomotion
- Cost: High money; high Science; long completion
- Skill drivers: Engineering (primary), Computing
- Unlocks: Drone Strike plot (targeted building damage); improved Sabotage plot effectiveness; prerequisite for Pigeon Missile Barrage

---

**Avian Ordnance Integration**
Explore the synergistic potential of biological carriers and precision munitions.

- Prerequisites: Micro Flight Control; cross-branch: Basic Avian Conditioning (Biology & Medicine branch)
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Engineering, Biology
- Unlocks: Missile Pigeons effect; Pigeon Missiles effect; Pigeon Missile Barrage plot; adds both `missile-pigeons` and `pigeon-missiles` effects — these are distinct and both are available

---

#### Materials & Engineering

_Skill drivers: Engineering (primary), Computing_
_Mid-game depth branch. Required for several Tier 4 plots. Rewards players who invest early._

---

**Structural Optimization Research**
Improve the empire's understanding of advanced construction materials.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Skill drivers: Engineering
- Unlocks: Construction speed improvement empire-wide; building upkeep cost reduction; prerequisite for further materials research

---

**Composite Materials Program**
Develop advanced composite materials for specialized applications.

- Prerequisites: Structural Optimization Research
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Engineering (primary)
- Unlocks: Improved building durability; prerequisite for Hyper-refractive Materials and Atmospheric Engineering

---

**Hyper-refractive Materials**
Synthesize materials capable of manipulating light at previously impossible frequencies.

- Prerequisites: Composite Materials Program
- Cost: High money; high Science; long completion
- Skill drivers: Engineering (primary), Computing
- Unlocks: Hypno Disco Ball plot; adds `hyperrefractive-materials` effect; cross-branch: required for Hypno Disco Ball (with Social & Propaganda branch)

---

**Atmospheric Engineering Foundations**
Develop the theoretical and practical basis for large-scale atmospheric intervention.

- Prerequisites: Composite Materials Program; cross-branch: Predictive Behavioral Modeling (Surveillance branch)
- Cost: High money; very high Science; very long completion
- Skill drivers: Engineering (primary), Biology
- Unlocks: Stratospheric Dispersal Systems; prerequisite for Blot Out the Sun plot

---

**Stratospheric Dispersal Systems**
Engineer systems capable of deploying particulate matter at stratospheric altitudes with global coverage.

- Prerequisites: Atmospheric Engineering Foundations; cross-branch: Miniaturized Locomotion (Military branch)
- Cost: Very high money; very high Science; very long completion
- Skill drivers: Engineering (primary), Computing
- Unlocks: Blot Out the Sun plot

---

**Global Hydraulic Infrastructure Mapping**
Comprehensively map and model the world's freshwater distribution systems.

- Prerequisites: Structural Optimization Research; cross-branch: Centralized Telecommunications (Surveillance branch)
- Cost: High money; high Science; long completion
- Skill drivers: Engineering (primary), Surveillance
- Unlocks: Water Infrastructure Infiltration; prerequisite for Control the World's Water Supply plot

---

**Water Infrastructure Infiltration**
Develop methods for accessing and controlling freshwater distribution nodes.

- Prerequisites: Global Hydraulic Infrastructure Mapping; cross-branch: Advanced Pathogen Research (Biology branch)
- Cost: Very high money; very high Science; very long completion
- Skill drivers: Engineering (primary), Biology
- Unlocks: Control the World's Water Supply plot

---

#### Biology & Medicine

_Skill drivers: Biology (primary), Medicine_
_Dual-use branch: legitimate medical research and deeply questionable applications. Contains the tree's most dangerous dead-end paths._

---

**Basic Medical Protocols**
Standardize medical care across empire facilities.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Skill drivers: Medicine
- Unlocks: Hospital healing rate improvement; First Aid activity effectiveness improved; prerequisite for further biology research

---

**Epidemiological Studies**
Research the spread and containment of disease in population centers.

- Prerequisites: Basic Medical Protocols
- Cost: Low money; moderate Science; moderate completion
- Skill drivers: Biology, Medicine
- Unlocks: Outbreak event management tools (slows spread in empire zones); Zombie Plague Cure research becomes visible; cross-branch: required for Water Infrastructure Infiltration (Materials branch)

---

**Basic Avian Conditioning**
Study and apply behavioral conditioning techniques to avian subjects.

- Prerequisites: Basic Medical Protocols
- Cost: Low money; low Science; short completion
- Skill drivers: Biology
- Unlocks: Emperor's Pet — Raven special actions improved; cross-branch: required for Avian Ordnance Integration (Military branch)
- Note: A foundational dead-end branch that pays off specifically in the pigeon program. Players who skip it will not access pigeon-based Tier 4 content.

---

**Advanced Pathogen Research**
Push the boundaries of disease engineering and biological leverage.

- Prerequisites: Epidemiological Studies
- Cost: High money; high Science; long completion
- Skill drivers: Biology (primary)
- Unlocks: Weaponized Pathogen plot (targeted disease deployment); cross-branch: required for Water Infrastructure Infiltration (Materials branch); prerequisite for Supersoldier Program

---

**Human Performance Optimization**
Investigate the upper limits of human physical and cognitive capability through pharmaceutical and genetic intervention.

- Prerequisites: Advanced Pathogen Research
- Cost: Very high money; very high Science; very long completion
- Skill drivers: Biology (primary), Medicine
- Unlocks: Supersoldier Program plot; catastrophic failure path generates Zombie Plague; Zombie Plague Cure research becomes available post-failure

---

**Zombie Plague Cure**
Develop a cure for the uncontrolled biological agent produced by a failed Supersoldier Program.

- Prerequisites: Human Performance Optimization (post-failure state); Epidemiological Studies
- Cost: Very high money; very high Science; very long completion
- Skill drivers: Biology (primary), Medicine
- Unlocks: Ability to begin reclaiming plague-infected zones; slows plague spread empire-wide
- Note: Only becomes available after a Supersoldier Program catastrophic failure. Rushing this research is the only in-game path to recovery short of military reconquest.

---

**Nutritional Science Initiative**
Research efficient methods of mass food production and citizen nutrition management.

- Prerequisites: Basic Medical Protocols
- Cost: Low money; low Science; short completion
- Skill drivers: Biology, Medicine
- Unlocks: Citizen health baseline improvement in empire zones; prerequisite for Food Processing Research

---

**Food Processing Research**
Develop scalable food processing systems for empire-wide deployment.

- Prerequisites: Nutritional Science Initiative; cross-branch: Establish a Front Company plot must be active or completed (Criminal branch)
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Biology (primary)
- Unlocks: Soylent Green plot; adds `soylent-green-program` effect

---

#### Social & Propaganda

_Skill drivers: Persuasion, Oratory, Deception_
_Early game breadth branch. Core to cultural victory path. Cross-connects with Surveillance for late-game dominance._

---

**Communications Strategy Framework**
Establish a formal internal approach to citizen messaging and loyalty management.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Skill drivers: Oratory, Persuasion
- Unlocks: EVIL Oratory activity effectiveness improved; Inspiring Speech plot available; prerequisite for further propaganda research

---

**Narrative Control Systems**
Develop methodologies for shaping public perception at scale.

- Prerequisites: Communications Strategy Framework
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Deception (primary), Oratory
- Unlocks: Spread Conspiracy Theories plot effectiveness improved; False Flag Operation plot available; prerequisite for Propaganda Department

---

**Propaganda Department**
Establish a dedicated internal organization for empire-wide influence operations.

- Prerequisites: Narrative Control Systems
- Cost: High money; moderate Science; long completion
- Skill drivers: Oratory (primary), Persuasion, Deception
- Unlocks: Global Propaganda Campaign plot; passive perceived EVIL reduction per turn; enhances all Social Engineering plots

---

**Behavioral Influence Research**
Study and systematize the psychological levers of mass loyalty and compliance.

- Prerequisites: Narrative Control Systems; cross-branch: Basic Medical Protocols (Biology branch)
- Cost: Moderate money; high Science; long completion
- Skill drivers: Persuasion (primary), Deception
- Unlocks: Send Ade plot effectiveness improved; Free Internet surveillance backdoor option improved; cross-branch: required for Hypno Disco Ball (with Hyper-refractive Materials)

---

**Memetic Propagation Studies**
Research the mechanics of idea spread through populations, with an eye toward weaponization.

- Prerequisites: Behavioral Influence Research; cross-branch: Predictive Behavioral Modeling (Surveillance branch)
- Cost: High money; high Science; long completion
- Skill drivers: Deception (primary), Computing
- Unlocks: Disinformation Network plot; Conspiracy Theory spread rate increased; cross-branch: required for Disinformation Network plot (with Surveillance branch)

---

#### Economic Disruption

_Skill drivers: Finance (primary), Forgery, Streetwise_
_Breadth-friendly throughout. Supports both criminal and political manipulation cross-branch unlocks._

---

**Financial Systems Analysis**
Study the economic structures of foreign zones to identify points of leverage.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Skill drivers: Finance
- Unlocks: Siphon Zone Accounts plot effectiveness improved; zone economic output reports become more accurate; prerequisite for further economic research

---

**Advanced Forgeries**
Develop the capability to produce convincing fraudulent financial and legal documents.

- Prerequisites: Financial Systems Analysis
- Cost: Low money; moderate Science; moderate completion
- Skill drivers: Forgery (primary)
- Unlocks: Forge Trade Documents plot; Forge Identity Documents plot improvement; Funny Money Printing Press plot; adds `counterfeiter` effect

---

**Market Manipulation Methodologies**
Develop techniques for systematically distorting economic activity in target zones.

- Prerequisites: Financial Systems Analysis
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Finance (primary), Deception
- Unlocks: Funny Money Printing Press plot effectiveness improved; The Biggest Tax for the Oldest Profession plot improvement; prerequisite for Global Financial Crash

---

**Offshore Infrastructure Development**
Establish empire financial assets in jurisdictions beyond the reach of foreign orgs.

- Prerequisites: Market Manipulation Methodologies; cross-branch: Establish a Front Company plot must be active or completed (Criminal branch)
- Cost: High money; moderate Science; long completion
- Skill drivers: Finance (primary), Streetwise
- Unlocks: Empire partially insulated from Global Financial Crash blowback; passive money generation from offshore assets; prerequisite for Global Financial Crash plot

---

**Global Financial Crash**
Engineer a coordinated collapse of world financial systems.

- Prerequisites: Offshore Infrastructure Development; cross-branch: Recruit Criminal Network plot must be active or completed (Criminal branch)
- Cost: Very high money; high Science; very long completion
- Skill drivers: Finance (primary), Computing, Streetwise
- Unlocks: Global Financial Crash plot
- Note: Empire with Offshore Infrastructure Development active suffers reduced blowback. Empire without it suffers alongside everyone else.

---

#### Security & Defense

_Skill drivers: Counterintelligence (primary), Computing, Engineering_
_Primarily a defensive branch. Rewards players who invest early; punishes those who ignore it._

---

**Internal Security Protocols**
Establish baseline security practices across all empire operations.

- Prerequisites: None
- Cost: Low money; low Science; short completion
- Skill drivers: Counterintelligence
- Unlocks: Small reduction in foreign agent detection difficulty in empire zones; prerequisite for further security research

---

**Encryption Protocols**
Deploy advanced cryptographic systems across empire communications.

- Prerequisites: Internal Security Protocols; cross-branch: Operational Transparency Initiative (Surveillance branch)
- Cost: Moderate money; moderate Science; moderate completion
- Skill drivers: Computing (primary), Counterintelligence
- Unlocks: Encryption Protocols plot; adds `encryption-protocols` effect; significantly reduces enemy surveillance plot success rate
- Note: If the agent carrying the encryption key is killed or captured, empire communications become vulnerable until re-established

---

**Cyberwarfare Defense**
Develop active countermeasures against foreign digital intrusion.

- Prerequisites: Encryption Protocols
- Cost: High money; high Science; long completion
- Skill drivers: Computing (primary)
- Unlocks: Enemy Computing-based plots against empire have reduced effectiveness; passive detection of foreign Computing operations in empire zones

---

**Enhanced Border Enforcement**
Systematize the monitoring and control of agent movement across empire zone borders.

- Prerequisites: Internal Security Protocols
- Cost: Moderate money; low Science; moderate completion
- Skill drivers: Counterintelligence, Logistics
- Unlocks: Improved detection of foreign agents crossing into empire zones; travel time for foreign agents through empire territory increased

---

**Counterintelligence Operations Framework**
Formalize the empire's approach to identifying, tracking, and neutralizing foreign operatives.

- Prerequisites: Enhanced Border Enforcement; cross-branch: Pattern Recognition Systems (Surveillance branch)
- Cost: High money; high Science; long completion
- Skill drivers: Counterintelligence (primary), Computing, Surveillance
- Unlocks: Purge Foreign Agents plot effectiveness significantly improved; Counterintelligence Sweep standing operation available; passive foreign agent identification in high-intel zones

---

### 17.4 Cross-Branch Dependency Summary

For quick reference, the following plots and projects require investment in two or more branches:

| Unlock                                   | Branches Required                                  |
| ---------------------------------------- | -------------------------------------------------- |
| Pigeon Missile Barrage                   | Military & Hardware + Biology & Medicine           |
| Blot Out the Sun                         | Materials & Engineering + Military & Hardware      |
| Control the World's Water Supply         | Materials & Engineering + Biology & Medicine       |
| Hypno Disco Ball                         | Materials & Engineering + Social & Propaganda      |
| Disinformation Network                   | Social & Propaganda + Surveillance & Control       |
| Global Financial Crash                   | Economic Disruption + Criminal (plot prerequisite) |
| Soylent Green                            | Biology & Medicine + Criminal (plot prerequisite)  |
| Forge Trade Documents / Identity         | Economic Disruption + Criminal (plot prerequisite) |
| Counterintelligence Operations Framework | Security & Defense + Surveillance & Control        |
| Encryption Protocols                     | Security & Defense + Surveillance & Control        |
| Water Infrastructure Infiltration        | Materials & Engineering + Biology & Medicine       |
| Atmospheric Engineering Foundations      | Materials & Engineering + Surveillance & Control   |
| Avian Ordnance Integration               | Military & Hardware + Biology & Medicine           |
| Behavioral Influence Research            | Social & Propaganda + Biology & Medicine           |
| Memetic Propagation Studies              | Social & Propaganda + Surveillance & Control       |

### 17.5 CPU Research

CPU organizations research science projects when they have sufficient resources. Research outcomes are tracked and may result in CPU orgs gaining new capabilities that change their behavior toward the empire. The player can learn what research a CPU org has completed through espionage plots.

CPU orgs do not have access to all branches equally — their research priorities are influenced by their organizational traits and strategic goals. An aggressive military org will prioritize Military & Hardware; a surveillance-focused org will invest in Surveillance & Control. This creates meaningful asymmetry between different CPU opponents.

---

## 18. Combat

### 18.1 Combat Style

Combat in EoE is abstracted — it does not involve tactical positioning or real-time input. When a combat encounter is triggered, the simulation resolves it based on the involved parties' attributes, numbers, equipment (from research unlocks), and zone terrain.

The result is presented to the player as an **After Action Report (AAR)** — a narrative combat log describing what happened, who was involved, what the turning points were, and the final outcome.

### 18.2 Combat Triggers

Combat encounters can be triggered by:

- A Takeover Zone plot.
- A Raid event (hostile force entering empire territory).
- CPU orgs executing an attack against an empire zone.
- Certain citizen events (revolt, riot escalation).
- Hero org operations against empire agents.

### 18.3 Combat Resolution

Combat resolution considers:

- **Force size** — Number of combatants on each side.
- **Individual attributes** — Each combatant's Combat, Strength, Agility, and Constitution.
- **Terrain** — Some terrain types favor defenders (mountains) or add cover options (cities).
- **Equipment & research unlocks** — Tech advantages (drones, advanced weapons) provide modifiers.
- **Leadership** — The leading agent's Leadership attribute affects squad effectiveness.

Casualties are applied to individual characters. Dead characters are moved to the morgue. Injured characters lose health and require healing time or a hospital.

### 18.4 After Action Report

The AAR screen shows:

- Which side won.
- A narrative turn-by-turn log of significant combat moments.
- Named characters who were killed, injured, or captured.
- Resource effects (zone control change, building damage, etc.).

Combat events interrupt time advancement and must be resolved before the simulation continues.

---

## 19. Events

### 19.1 Event System Overview

Events are happenings in the game world surfaced to the player for awareness or resolution. The player should expect something meaningful to respond to at least every couple of weeks. As the game progresses and the empire grows, events become more frequent, more consequential, and wilder.

**Three presentation tiers:**

- **Notification** — Minor events logged in the feed. Player can opt to pause on them or let the simulation continue. Reviewed at leisure via the Intel screen or event log.
- **Event** — Interrupts time advancement. Requires player acknowledgment before simulation continues. May include player choices.
- **Landmark** — One-time or rare major events with elaborate writing and significant mechanical consequences. Always interrupts. Often multi-stage.

**Events that always interrupt time advancement:**

- Combat encounters
- Events that kill or injure named characters
- Events requiring mandatory player choice
- EVIL threshold crossings
- Tier 4 plot consequence milestones

### 19.2 Information Surfacing Tiers

Beyond the presentation tier, events are categorized by how they reach the player:

- **News Feed** — Public information. Surfaces automatically regardless of intel level. Wire-service tone.
- **Intelligence Report** — Discovered through active surveillance. Quality and accuracy scales with empire intel investment.
- **Intercepted Communication** — Richest tier. Personal, specific, sometimes alarming. Requires Surveillance Tap or Centralized Telecommunications active in relevant zone.

### 19.3 Flavor Note — TERMINATE

Within the empire's internal documentation, communications, and event writing, the act of the empire executing a person is referred to as **TERMINATE** (all caps). This is consistent corporate euphemism. It applies to player-directed executions of agents, citizens, captives, and named targets. External organizations do not use this terminology.

---

### 19.4 Foundational Events

_Events present from early game; may recur throughout_

---

**Uneventful Day**
_Notification — Skippable_
Nothing of any importance happens. The empire continues to function within normal parameters.

---

**Citizen Recruited**
_Event — Interrupts_
A citizen in an empire zone has been flagged as a potential recruit. Their full stat block is displayed.

- **Recruit** — Select a commanding agent; citizen becomes an agent; assigned to recommended department based on top attributes
- **Ignore** — Nothing happens; citizen remains in simulation

---

**Angry Admin**
_Event — Interrupts_
The empire's most effective Administrator has decided to resign in a manner that is difficult to characterize as professional.

- Effects: Agent with highest Administration loses agent status and loyalty to empire
- If they remain for resolution: **TERMINATE** option available
- If they leave immediately: May deal damage to their home zone on the way out
- **Do Nothing** — Nothing happens; former agent remains in zone as a potentially hostile citizen

---

**Attempted Espionage**
_Event — Interrupts_
Authorities have apprehended a foreign operative engaged in espionage activities within the empire's borders.

- Requirements: Foreign org with opinion of EoE < 25
- Effects: Foreign agent added to empire captives list
- Options:
    - **TERMINATE** — Agent killed; EVIL gain; foreign org alerted
    - **Keep Captive** — Agent held; may be interrogated; foreign org may attempt rescue
    - **Release** — Agent returned; small perceived EVIL decrease; foreign org notes the gesture

---

**Raid**
_Event — Interrupts_
A hostile force has entered empire territory. They appear to believe this will go well for them. Combat encounter initiated.

---

**A Can of Soup… Or Something**
_Event — Interrupts_
An agent has been struck by a projectile thrown by a discontented citizen. The projectile's exact nature is unclear. The agent's dignity is not.

- Effects: Named agent loses moderate HP; Injured status effect applied
- Requirements: Citizen with loyalty below 20 in agent's zone

---

**Scientific Breakthrough**
_Notification — Skippable_
The research team has achieved an incremental milestone.

- Requirements: At least one staffed lab
- Effects: Small Science resource bonus

---

**Gone Too Far**
_Event — Interrupts_
An agent with insufficient empathy has exceeded their authority in the most permanent way possible. A civilian is dead.

- Requirements: Agent with Empathy below 20 in zone with citizens
- Effects: Civilian killed; zone loyalty disruption; potential citizen retaliation
- Options:
    - **Physical Punishment** — Agent loses moderate HP; may reduce agent loyalty slightly; zone loyalty improves moderately
    - **TERMINATE Agent** — Agent killed; zone loyalty improves significantly; small empire-wide agent loyalty increase
    - **Fire Agent** — Agent dismissed; zone loyalty improves slightly; dismissed agent loyalty drops sharply; dismissed agent becomes potentially hostile citizen
    - **Give Bonus** — Agent paid from empire funds; agent loyalty increases significantly; empire gains small EVIL

---

**Immigration**
_Event — Interrupts_
A citizen of another nation has arrived in empire territory seeking... something. Their motivations are their own.

- Effects: Named foreign citizen added to a random empire zone; low initial loyalty to empire; full stat block generated

---

**Sickness**
_Event — Interrupts_
A disease has emerged in an empire zone.

- Requirements: Zone population > 50
- Effects: Outbreak effect added to zone; citizens begin accumulating Sick status effect

---

**The People's Revolution**
_Landmark — Interrupts_
The citizens of the empire have collectively decided that enough is enough. This is inconvenient.

- Effects: All citizen loyalty decreases empire-wide; income reduced 50%; infrastructure capacity damaged
- Options:
    - **Suppress** — Deploy agents to quell unrest; combat encounters in affected zones; if successful, loyalty partially restored; EVIL gain
    - **Negotiate** — Requires Persuasion skill agent; concessions required (tax reduction, captive release, etc.); loyalty partially restored; no EVIL gain
    - **Ignore** — Revolution runs its course; income remains suppressed until loyalty recovers naturally; risk of escalation to zone loss

---

**The Great Fire**
_Event — Interrupts_
A devastating fire has broken out in an empire zone. The cause is unclear. The damage is not.

- Effects: Zone loyalty and infrastructure decrease; empire income reduced 25% from affected zone; buildings in zone damaged
- Options:
    - **Send agents to help** — Agents assigned to zone; fire contained faster; loyalty decrease reduced; agent injury risk
    - **Do nothing** — Fire burns out naturally; full damage applied

---

**EVIL Outing**
_Notification — Skippable_
The Overlord has organized a morale outing for select agents. Records indicate a good time was had.

- Effects: Attending agents gain loyalty; chance of Charisma-adjacent skill gain for participants

---

**[Intercepted Communication]**
_Notification — Skippable; player can opt to interrupt_
An intercepted message from foreign citizens, agents, or organizations. Content reflects the current state of world opinion of the empire. This is the primary vehicle for NPC commentary on player behavior. Tone shifts with EVIL tier — early game communications are dismissive; late game communications are frightened or furious.

---

### 19.5 Empire Internal Events

---

**The Payroll Problem — Stage 1: Payroll Advisory**
_Notification_
The empire's accounts are running low. Agent salaries are at risk.

- Trigger: Empire money drops below 2x current daily salary obligations
- Effects: Warning only; no mechanical consequence yet

---

**The Payroll Problem — Stage 2: The Troops Are Grumbling**
_Event — Interrupts_
Several agents have gone unpaid. Morale is suffering in ways that are beginning to affect operational readiness.

- Trigger: Agents unpaid for 3+ consecutive days
- Effects: Affected agents begin loyalty decay; small chance of work refusal per affected agent
- Options:
    - **Emergency payment** — Draw from reserves; loyalty decay stops immediately
    - **Promise payment** — Buys 3 days; requires Oratory skill agent; if promise broken, Stage 3 triggers with increased severity
    - **Do nothing** — Escalates to Stage 3

---

**The Payroll Problem — Stage 3: Mutiny in the Ranks**
_Landmark — Interrupts — one-time in most severe form_
This is no longer a payroll problem. Named agents and squads are acting on their grievances.

- Trigger: 5+ agents unpaid for 7+ consecutive days; loyalty below 25
- Effects: Affected agents defect, revolt, or go rogue; squads with defecting leaders may fracture; significant zone loyalty disruption
- Options:
    - **Emergency lockdown** — Contain defections by force; combat events with former agents; money cost; injury risk
    - **Negotiate** — Requires high Persuasion or Oratory skill agent; significant back pay required; partial defections prevented
    - **Let it burn** — Accept the losses; defected agents become potential enemies in their former zones

---

**Workplace Incident Report**
_Notification_
A low-empathy agent has done something uncomfortable. Not criminal. Just uncomfortable.

- Trigger: Agent with Empathy below 20 in zone with citizens; random chance
- Effects: Minor loyalty decrease among citizens in agent's zone; small escalation chance to Gone Too Far next turn if agent remains unaddressed
- Player option: Reassign agent preemptively via Personnel screen after reading

---

**Building Neglect Notice**
_Notification_
A building in an empire zone has been understaffed long enough that its output is degrading noticeably.

- Trigger: Building staffed below 25% capacity for 5+ consecutive days
- Effects: Building output reduced 50%; escalates to Structural Failure if ignored 5 more days

---

**Structural Failure**
_Event — Interrupts_
A neglected building has partially collapsed. This is being treated as a facilities management issue.

- Trigger: Building neglect notification ignored for 5+ days
- Effects: Building output halted; occupants injured; zone loyalty decrease; repair cost required
- Options:
    - **Fund repairs** — Building restored over several days; moderate money cost
    - **Demolish** — Upkeep removed immediately; citizen loyalty hit

---

**The Exceptional One**
_Event — Interrupts — Recurring (rare)_
A citizen in an empire zone has been displaying unusual capability. Their attributes are notably above average. They are currently filing reports. This seems like a waste.

- Trigger: Citizen with 2+ attributes in top 10% of current population; empire intel level on citizen above 50
- Effects: None automatically
- Options:
    - **Recruit immediately** — Citizen becomes agent; assigned to recommended department
    - **Flag for Inner Circle** — Citizen noted for player review on Personnel screen
    - **Ignore** — Citizen remains; foreign orgs may eventually notice them

---

**The Rivalry**
_Notification → Event escalation — Recurring (guardrailed)_
Two agents in the same squad are engaged in a professionally destabilizing competition.

- Trigger: Two high-Leadership agents in same squad for 10+ days; compatible rivalry attributes
- Guardrails: Maximum one active interpersonal drama per squad; minimum proximity requirement; cooldown after resolution
- Notification: Tension observed between named agents
- Escalated effects: Squad effectiveness reduced; sabotage risk between agents; loyalty decrease for both
- Options (at Event tier):
    - **Separate them** — Transfer one to different squad; rivalry cools; short-term morale dip for both
    - **Let them compete** — One dominates; loser loyalty drops; winner gains small skill bonus
    - **Mediate** — Requires Persuasion skill agent; chance to convert rivalry to grudging respect; loyalty boost for both on success

---

**The Romance**
_Notification → Event escalation — Recurring (guardrailed)_
Two agents have developed a personal attachment. HR has no official policy on this. HR is reconsidering that position.

- Trigger: Two high-Empathy agents in same zone for 15+ days; compatible attributes
- Passive effect: Both agents gain small loyalty boost while in same zone
- Escalation: Separation triggers loyalty decrease for both; death of one triggers significant loyalty drop and temporary performance penalty for survivor
- Player option: Awareness only; no direct intervention required; player simply knows this dependency exists

---

**The Pet Incident — Tiger**
_Event — Interrupts — Recurring (requires Tiger pet)_
An agent has attempted to pet the Emperor's tiger. This was not approved. The tiger was not consulted.

- Trigger: Tiger present in zone with agents; chance weighted by high Motivation and low Intelligence
- Effects: Named agent loses moderate HP; Injured status effect applied; small loyalty decrease for that agent; small loyalty increase for other zone agents (entertainment value)
- Written in dry corporate incident-report tone
- Options:
    - **Medical attention** — Agent sent to hospital; faster recovery; money cost
    - **Walk it off** — Agent heals slowly; remains on assignment at reduced effectiveness

---

**The Pet Incident — Cat**
_Notification — Recurring (requires Cat pet)_
The Emperor's cat has knocked something important off a desk. The cat has no comment.

- Trigger: Cat present in empire headquarters zone; random chance
- Effect: One minor random consequence — small resource loss, delayed research completion, or temporarily obscured agent stat on Personnel screen
- Note: Written entirely for laughs. Consequences are annoying, never severe.

---

**The Informant**
_Landmark — One-time_
An Inner Circle member has been passing information to a foreign organization. The duration of this arrangement is unclear. The damage may not be.

- Trigger: Empire has 8+ agents; Inner Circle member active for 20+ days; foreign org with opinion below 30
- Warning signs (catchable with attentive play):
    - Intel level above 70 on the agent reveals loyalty anomalies in their history
    - Counterintelligence Sweep in agent's zone may flag them
    - Pattern Recognition Systems research increases warning sign visibility
    - Failed plots briefed to the agent show suspicious correlation
- Resolution paths:
    - **Caught early** — Player confronts agent directly; skips to options
    - **Not caught** — Foreign org action tipped by agent fires first; betrayal then revealed; written to reference what was compromised
- Options:
    - **TERMINATE** — Pipeline closed; EVIL gain; Inner Circle loyalty dips empire-wide
    - **Turn them** — Use agent as double agent; requires Deception skill handler; high risk, high reward
    - **Imprison** — Agent held; foreign org loses asset; agent may be interrogated for foreign org intelligence
    - **Confront quietly** — Attempt to rebuy loyalty; significant money cost; no guarantee of success

---

**The Secret Child**
_Landmark — One-time; mutually exclusive with Clone events_
A young person has arrived at empire headquarters claiming to be the Overlord's child. The claim is... plausible.

- Trigger: Empire at EVIL tier "Threat" or above; Overlord active 30+ days
- Effects: Child generated as full character with attributes partially derived from Overlord's stats; high initial loyalty to empire
- Options:
    - **Welcome them** — Child joins empire; can be trained, assigned, placed in Inner Circle; generates ongoing minor events
    - **Test the claim** — Investigation event chain begins; child remains in holding
    - **Send them away** — Child leaves; small chance they resurface later with a foreign org
    - **Absorb quietly** — Child joins but existence is classified; lower EVIL impact; foreign orgs unaware of heir

---

**The Clone**
_Landmark — One-time; mutually exclusive with Secret Child; one variant fires per playthrough_

Three possible trigger variants — only one fires:

**Variant A — Foreign Creation**
A foreign org has been operating an agent who matches the Overlord's description in disturbing detail.

- Trigger: Enemy org with high research capability and opinion below 20; Surveillance branch research active

**Variant B — Supersoldier Accident**
Something went wrong — or right — in the lab. One of the test subjects is looking at the Overlord with an unsettling degree of recognition.

- Trigger: Supersoldier Program plot active or recently completed

**Variant C — Player-Initiated**
The Overlord authorized a classified continuity program. The results are standing in the lab looking confused.

- Trigger: Continuity Protocol research completed (Biology branch deep node)

**Shared resolution options:**

- **TERMINATE the clone** — Clean solution; EVIL gain; if foreign-created, doesn't address how they made it
- **Integrate the clone** — Clone joins as full agent; loyalty uncertain and fluctuating; other agents uncomfortable; can be deployed as Overlord decoy
- **Study them** — Clone held for research; Biology research speed increases; clone loyalty decays in captivity
- **The switch** — Deploy clone publicly as the Overlord; reduces real Overlord risk; if discovered, massive EVIL and loyalty consequences

---

### 19.6 World Response Events

---

**EVIL Tier Shift — "They're Calling Us What?"**
_Landmark — One-time; fires at EVIL tier "Irritant"_
The world has noticed the empire. It finds the empire mildly annoying. This is communicated entirely through a cluster of intercepted communications that arrive simultaneously — no direct announcement.

- Intercepted Ministry memo: dry bureaucratic language; empire described as "localized criminal organization requiring routine monitoring"
- Intercepted citizen conversation: two people joking about the empire over drinks; tone is almost affectionate
- Intercepted field report: professional; terse; recommends "standard surveillance protocols"
- News transcript: empire gets three sentences in a regional summary between a trade dispute and a weather event

No player options. No resolution required. The communications simply arrive. The player understands exactly where they stand.

---

**EVIL Tier Shift — "The Emergency Session"**
_Landmark — One-time; fires at EVIL tier "Threat"_
The jokes have stopped.

- Intercepted security briefing transcript: empire is primary agenda item; language clipped and serious; someone asks why they weren't paying attention sooner
- Intercepted intelligence memo: detailed, accurate summary of empire capabilities; some details wrong (reflecting actual intel level on empire); recommendations include "accelerated response options"
- Intercepted citizen conversation: no jokes; someone is worried about family near empire territory
- News transcript: empire gets the headline; anchor's language is careful; subtext is fear

Effects: All foreign orgs increase passive hostility; CPU org aggression toward empire increases; first Resistance Movement events begin appearing; Intel screen now displays foreign org opinion values more visibly as they move.

---

**EVIL Tier Shift — "The Resolution"**
_Landmark — One-time; fires at EVIL tier "Menace"_
The world has formally decided the empire is a problem. Delivered as an intercepted copy of an international resolution document — formatted as a bureaucratic instrument with devastating implications buried in clause 7.

- Clause 3: member organizations agree to share intelligence on empire operations
- Clause 7: authorizes "proportional responsive measures"
- Appended: dissenting note from two minor orgs who abstained — potential diplomatic targets the empire might cultivate

Effects: Hero org formation events begin; World Police mobilization begins; foreign orgs can now formally coordinate; perceived EVIL reduction becomes harder and more expensive.

---

**EVIL Tier Shift — "Supervillain"**
_Landmark — One-time; fires at EVIL tier "Supervillain"_
They are no longer discussing the empire. They are afraid of it. Three things arrive in the same notification cluster:

- A classified foreign threat assessment written for heads of state; the Overlord is described in terms usually reserved for natural disasters
- A message from an unknown untraceable sender — possibly Null/Void — addressed directly to the Overlord: _"We see you."_
- A personnel report from empire HR flagging that three minor administrators in peripheral zones have quietly resigned in the past week. No forwarding addresses.

Effects: Adjudicators formally mobilize; all active hero orgs gain capability increase; Null/Void becomes active if not already; world response plots against empire increase in frequency. The three resigned administrators are real named citizens in the simulation. They are out there somewhere.

---

**Preliminary Intelligence — Hero Org Formation**
_Notification cluster — fires 10-15 days before a hero org's official arrival_
Three notifications arrive over several days, not obviously connected:

- Day 1: Reconnaissance report notes unusual agent clustering in a foreign zone — several high-Combat individuals with no clear organizational affiliation meeting regularly
- Day 5: Intercepted communication mentions "the project" in passing; context unclear; sender's loyalty to their GO seems low
- Day 10: A citizen in a foreign zone with high Intelligence and high loyalty to their GO has gone off-grid — their normal daily simulation actions have stopped registering

None are labeled as hero org related. Attentive players will notice the pattern.

---

**They Have A Name**
_Landmark — One-time per hero org; fires on official arrival_
A formal introduction, written with unique flavor for each hero org type.

Effects: Hero org active in simulation; their agents begin appearing on Intel screen; first operational event fires within 5-10 days.

- Options:
    - **Assess the threat** — Intel screen filtered to show all known hero org agent locations
    - **Issue internal advisory** — Notification to all squad leaders; small agent loyalty boost (they appreciate being informed)
    - **TERMINATE their broadcast analysts** — Requires knowing locations; hero org gains small capability boost from martyrdom effect; EVIL gain

---

**Hero Org Profiles**

The following hero organizations may be generated in a playthrough. Names are procedurally generated — the following serve as example anchors for name generation and behavioral templates.

**The ReVengers** _(Direct Combat)_
Elite, well-resourced, government-backed. Favor frontal confrontation and high-profile operations.

- Can be permanently disbanded by TERMINATing leadership and key members
- Operations: Direct Strike (combat encounter against empire zone)
- Grows stronger with each successful operation
- Weakness: Leadership-dependent; succession disruption creates windows of vulnerability

**The Th0rns** _(Sabotage & Infiltration)_
Decentralized network. No fixed headquarters. Operate through infiltration and disruption.

- Nearly impossible to fully disband; always reconstitutes
- Operations: The Quiet Kind (building damage appearing as anomalies before confirmed)
- Weakness: Counterintelligence Sweep during operation window can catch agents before completion

**The Lamplight Society** _(Information Warfare)_
Their weapon is exposure. They don't fight — they publish.

- Can be disbanded through successful discrediting False Flag campaign
- Operations: The Publication (accurate, sourced expose of empire plots; perceived EVIL spike)
- Weakness: Vulnerable to False Flag operations that make them appear corrupt

**The Pastoral Front** _(Grassroots Resistance)_
Emerged from citizens the empire oppressed. Scrappy, emotionally motivated, embedded in empire zones.

- Cannot be permanently disbanded; suppression radicalizes more citizens
- Operations: embedded sabotage; citizen loyalty conversion in empire zones
- Weakness: None meaningful; they look like ordinary citizens

**The Stalwart Few** _(Fail-Forward Wildcard)_
Genuinely heroic intentions. Catastrophically inconsistent execution. Their failures still cost the empire something.

- Theoretically possible to disband; they would probably accidentally survive their own disbanding
- Operations: The Attempt — stated intention always clear; actual outcome always random within thematic range; empire always loses something; nothing ever goes entirely to plan for either side
- Example operations:
    - _Attempted_: Rescue captive. _Actual_: Captive rescued; holding facility wall structurally compromised; two agents concussed by a door; one Stalwart Few agent locked in supply closet containing regional salary ledgers, now public.
    - _Attempted_: Steal research data. _Actual_: Wrong lab; stole cafeteria inventory records; accidentally released lab animals; lab productivity halved while animals recovered.
    - _Attempted_: TERMINATE high-value agent. _Actual_: Wrong agent TERMINATed; intended target now knows they are a target and goes into hiding; Stalwart Few agent escapes but leaves behind a very distinctive hat.

**Null/Void** _(Hacktivist Exposure)_
No central node. No fixed membership. They just share information.

- Cannot be disbanded; no central node to destroy
- Operations: The Leak — exposes active empire plots to primary target org; target org alerted; plot success chance reduced
- Detection range scales with Null/Void capability level; Encryption Protocols and Cyberwarfare Defense research reduces their effectiveness
- Primary target of leaks is the plot's affected org, not all orgs simultaneously — though range expands at higher capability

**The Adjudicators** _(World Police Enforcement)_
Cold, professional, legally mandated. Show up late. Hit hard.

- Cannot be disbanded through conventional means
- Unique vulnerability: Can be discredited through Operation Clean Hands plot chain (see Section 16); if successful, mandate revoked and org collapses
- Can also be manipulated into committing acts that turn world opinion against them — a sustained Deception campaign using Forgery and False Flag operations
- Operations: Precise, well-targeted; first operation always reflects intel gathered during initial 10-15 day assessment period

---

**ReVengers Operation — Direct Strike**
_Event — Interrupts — Recurring_
The ReVengers have identified a target and are engaging directly.

- Warning: Intel screen shows unusual agent movement toward empire zone 3-5 days prior (if Surveillance research active)
- Effects: Combat encounter; if ReVengers win, building damaged or agent captured; org does not disband on defeat
- Preemptive option: Reinforce target zone if warning caught

---

**Th0rns Operation — The Quiet Kind**
_Notification → Event — Recurring_
Something in an empire zone isn't working right. It takes a few days to understand why.

- Day 1 Notification: Building output drops unexpectedly; flagged as anomalous
- Day 3 Notification: Second building in same zone reports similar issues
- Day 5 Event (if unaddressed): Sabotage confirmed; buildings damaged; one agent cover identity compromised; Th0rns agents already gone
- Preemptive option: Counterintelligence Sweep during notification window may catch Th0rns agents before completion

---

**Lamplight Society — The Publication**
_Event — Interrupts — Recurring_
The Lamplight Society has published something. It is accurate. It has sources.

- Trigger: Lamplight active; empire has run 3+ plots since last publication
- Effects: Perceived EVIL increase; loyalty decrease in affected zones; foreign org opinion decreases
- Options:
    - **Discredit** — Requires Propaganda Department; Deception skill agent; reduces impact 50% but draws attention to the story
    - **Suppress distribution** — Agents in target zones; slows loyalty impact; Lamplight gains EVIL from suppression
    - **Do nothing** — Full effects apply

---

**Stalwart Few — The Attempt**
_Event — Interrupts — Recurring_
The Stalwart Few have executed an operation. Here is what they were trying to do. Here is what actually happened.

- Structure: Every Stalwart Few event presents the stated intention and the actual outcome separately. The gap is the joke and the threat simultaneously.
- Effects: Always random within thematic range of intention; always costs the empire something; player options occasionally available for follow-up (recover the ledgers, catch the animals, find the hat)

---

**Null/Void — The Leak**
_Notification → targeted org response — Recurring_
An active empire plot has been exposed to its target.

- Trigger: Null/Void active; empire has active plots; Null/Void capability sufficient
- Notification: _"An unattributed transmission has been detected referencing [plot name] in [zone]. Origin untraceable."_
- Effects: Target org alerted; plot success chance reduced; zone defensive posture increased; perceived EVIL increases slightly

---

**The Adjudicators Arrive**
_Landmark — One-time; fires at EVIL tier "Supervillain" or above_
No warning. No intercepted comms. A formal document appears in the empire's intelligence feed with the letterhead of an organization the empire has never seen before.

_"Notice of Mandate: The Imperial Adjudication Authority, acting under Resolution 7 of the International Security Accord, hereby formally designates the organization known as [Empire Name] and its leadership as subject to active interdiction. This notice is provided as a professional courtesy. Compliance is not expected."_

Effects: Adjudicators active; agents begin appearing globally; first 10-15 days spent gathering intelligence; first operation is always precise and well-targeted.

- Options:
    - **Assess** — Intel screen shows Adjudicator agent locations (if Surveillance research sufficient)
    - **Begin Operation Clean Hands** — Initiates discrediting plot chain (requires Advanced Forgeries and Propaganda Department)
    - **Increase security posture** — Empire-wide counterintelligence boost; slows their intel gathering; money cost

---

### 19.7 CPU Org Action Events

---

**Unusual Troop Movement**
_Intelligence Report — Notification_
Agent activity consistent with pre-operation staging has been observed near empire territory.

- Requires: Intel level on source zone > 40
- Trigger: CPU org has queued military operation; fires 3-7 days before execution (earlier warning with higher intel level)
- Content scales with intel level:
    - Intel 40-60: "Unusual agent clustering detected near [zone]. Nature unclear."
    - Intel 61-80: "Military-profile agents observed staging in [zone]. Operation likely within the week."
    - Intel 81-100: "Confirmed pre-operation staging by [org]. Target: [empire zone]. Estimated timeline: [X] days."

---

**Under Attack**
_Event — Interrupts — Recurring_
A CPU org has initiated a military operation against an empire zone.

- Effects: Combat encounter; if CPU wins, zone loyalty decreases and buildings damaged; full takeover requires separate Takeover Zone success
- Writing note: If firing within 10 days of an empire plot against that org, event writing explicitly references the connection

---

**Zone Falls to [Org Name]**
_News Feed — Notification_
A zone has changed hands between two non-empire organizations.

- Trigger: CPU org successfully executes Takeover Zone against another CPU org
- Effects: None directly on empire; map updates; balance of power shifts

---

**The Siege**
_Landmark — Interrupts — Recurring_
This is not a raid. A CPU org has committed major resources to a sustained campaign against empire territory.

- Trigger: CPU org launches operations against 2+ empire zones within 5 days; or hero org commits to major sustained operation
- Effects: Multiple combat events queued; empire income reduced in affected zones; world news picks up story; perceived EVIL increases
- Options:
    - **Concentrate defense** — Pull agents from other zones; leaves those zones exposed
    - **Counter-offensive** — Launch Takeover or Destabilize against attacker's home territory; forces split attention
    - **Negotiate cessation** — Requires Persuasion skill agent; significant money; CPU org must have opinion above 10
    - **Activate Inner Circle** — Deploy Inner Circle to lead defense; significantly improves outcomes; puts members at risk

---

**Operational Chatter**
_Intercepted Communication — Notification_
A fragment of foreign operational planning has been intercepted.

- Requires: Surveillance Tap or Centralized Telecommunications active in source zone
- Content varies by what org is actually planning; provides partial forewarning

---

**Foreign Agent Detected**
_Notification — Recurring_
Empire counterintelligence has flagged a suspicious individual in an empire zone.

- Trigger: Foreign agent in zone; empire Counterintelligence skill agents present; detection scales with skill and research
- Options via Intel/Personnel screen:
    - **Launch Purge Foreign Agents** — Sweep the zone
    - **Surveil the agent** — Gather more intel; chance to identify handler and source org
    - **Do nothing** — Agent continues operation

---

**Intelligence Breach**
_Event — Interrupts — Recurring_
A foreign agent has successfully extracted information from an empire zone.

- Effects scale with what was extracted: agent identities compromised / research data stolen / zone defenses revealed / financial records exposed
- Options:
    - **Damage control** — Reassign compromised agents; disrupts operations
    - **Feed false information** — Requires Deception skill agent; turns breach into disinformation opportunity; risky
    - **TERMINATE the breach agent** — If still in zone and identified; stops extraction; EVIL gain; foreign org retaliates

---

**Our Agent Has Been Captured**
_Event — Interrupts — Recurring_
An empire agent operating in a foreign zone has been apprehended.

- Effects: Agent added to foreign org captives; active plots requiring that agent suspended
- Options:
    - **Extraction plot** — Queue recovery plot; Infiltration skill agents; time-sensitive
    - **Disavow** — Empire denies knowledge; reduces perceived EVIL impact; agent loyalty drops if they survive; may talk under interrogation
    - **Negotiate release** — Requires opinion above 20; money cost; agent returned but plots exposed
    - **Leave them** — Remains captive; foreign org gains intel through interrogation over time; agent loyalty decays to zero

---

**Leadership Transition**
_Intelligence Report — Notification_
A CPU org has a new leader.

- Trigger: CPU org leader dies and succession completes
- Content scales with intel level on org
- Effects: Org enters brief reduced-effectiveness succession period; new leader attributes affect future org behavior

---

**The Fall of [Org Name]**
_Landmark (if defeated by empire) or News Feed (if collapsed independently)_

**Defeated by Empire variant:**

- Presentation: Landmark; interrupts; elaborate writing; named org; references the campaign
- Effects: Surviving org agents scatter — some join other orgs, some become independent hostile actors, some may be recruitable
- World reaction: Perceived EVIL increases significantly; remaining orgs increase hostility

**Collapsed independently variant:**

- Presentation: News Feed; brief; matter-of-fact
- Effects: Former org zones redistributed to adjacent orgs
- Note: Significantly less dramatic than the empire-defeated variant

---

**Research Completion — CPU**
_Intelligence Report — Notification_
A CPU org has completed a research project.

- Requires: Intel level on org > 50
- Content scales with intel level; at high intel, specific project and capability change identified
- Note: If Stolen Research plot is active against this org, this event opens the plot's payoff window

---

**Alliance Formation**
_News Feed or Intelligence Report_
Two or more CPU orgs have agreed to coordinate against the empire.

- Trigger: Two orgs both have opinion of empire below 30 and have been in proximity sufficient turns
- Intelligence Report version (if caught early): **Poison the Well** disruption plot becomes available before alliance finalizes
- News Feed version: Alliance already formed; no disruption window

---

**[Org Name] Declares the Empire an Enemy of Civilization**
_News Feed — Notification_
A CPU org has made its hostility toward the empire a matter of public record.

- Trigger: CPU org opinion of empire drops below 10
- Effects: Org agents treat empire agents as hostile on sight in neutral zones; org contributes to World Police mobilization speed

---

**Diplomatic Backchannel**
_Intercepted Communication — Notification_
Two orgs are negotiating something. The empire wasn't supposed to know.

- Requires: Surveillance Tap in either zone
- Content: Partial transcript; key terms visible; detail level scales with intel level
- Value: Early warning of alliance formations, territory deals, or coordinated operations

---

**Measured Response**
_Notification or Event — Recurring_
A CPU org has responded to an empire operation with a proportional counter-action.

- Trigger: Empire executes Tier 1-2 plot against CPU org; retaliation fires within 5-15 days
- Thematic examples:
    - Empire ran Spread Conspiracy Theories → org runs loyalty recovery campaign; some empire-influenced citizens revert
    - Empire ran Siphon Zone Accounts → org increases financial security; future Siphon plots harder
    - Empire ran Organize Antiwork Unions → org improves working conditions; staffing recovers; workers less susceptible
    - Empire ran Sabotage → org repairs and increases security; future Sabotage faces higher detection risk

---

**Direct Retaliation**
_Event — Interrupts — Recurring_
A CPU org has responded to a serious empire operation with immediate targeted force.

- Trigger: Empire executes Tier 3-4 plot against CPU org; retaliation fires within 3-7 days
- Thematic examples:
    - Empire ran Assassination → org launches Assassination against named empire agent
    - Empire ran Takeover Zone → org launches immediate counter-Takeover against empire border zone
    - Empire ran Engineer a Coup → org launches Purge Foreign Agents empire-wide and formally declares empire enemy
    - Empire ran Back a Puppet → org exposes puppet publicly; installed leader loses legitimacy; zone loyalty collapses
- Note: At maximum hostility, retaliation becomes general aggression rather than thematic — org attacks whatever is most vulnerable

---

**They Know What We Did**
_Landmark — One-time per major escalation_
A CPU org has connected enough dots to understand the full scope of what the empire has been doing to them.

- Trigger: Single CPU org targeted by 5+ empire plots; opinion at minimum; sufficient resources to act
- Presentation: Elaborate writing; org leader named; event written as intercepted address to their own agents
- Effects: Org enters maximum aggression state; all agents redirected toward empire; full intelligence shared with allied orgs; military research accelerated; world news picks up story
- Options:
    - **TERMINATE their leadership** — Assassination immediately available; succeeds more easily (they're focused on empire, not their own security); succession disrupts campaign temporarily
    - **Negotiate** — Requires opinion above 5; extremely expensive; humiliating concessions; perceived EVIL decreases
    - **Absorb the pressure** — Reinforce border zones; wait for their resources to deplete

---

### 19.8 Research & Science Events

---

**Project Complete — [Research Name]**
_Notification — player can opt to interrupt_
Standard research completion with a small flavor moment.

Format: _"After [X] days of dedicated effort, the [project name] initiative has concluded. [One sentence flavor]. The following capabilities are now available: [unlocks listed]."_

Flavor examples by branch:

- **Surveillance:** _"Dr. [name] reports that the system performed beyond initial projections, though she notes in her personal log that she finds it 'a little unsettling, honestly.'"_
- **Military:** _"The prototype performed adequately in controlled testing. Three walls will need to be replaced."_
- **Biology:** _"Lead researcher [name] has filed the results under seventeen layers of classification and requested a long vacation."_
- **Social/Propaganda:** _"Focus group responses were, in the assessment of the project lead, 'concerningly positive.'"_
- **Materials:** _"The material behaves exactly as theorized. No one is entirely sure why."_
- **Economic:** _"The legal team has reviewed the methodology and formally declined to comment."_
- **Security:** _"Implementation complete. The IT department has already lost the master password once."_

---

**Major Breakthrough — [Research Name]**
_Landmark — Interrupts — One-time per Tier 4 unlock_
A major research project has reached completion. This one changes things.

- Trigger: Tier 4 plot prerequisite research completes
- Effects: Full Tier 4 plot unlock; small Science momentum bonus; lead researcher gains skill increase; small EVIL increase
- World reaction: If Null/Void active, chance this completion is detected and leaked — world learns of the capability before it is deployed

---

**Laboratory Incident — Minor**
_Notification → Event if unaddressed — Recurring_
Something went wrong in a lab. Severity scales with research branch danger level.

- **Low-danger (Surveillance, Economic, Social):** Data deleted; research set back 5 days. Academic dispute; researcher transfer requested. Unauthorized personal projects on empire hardware discovered.
- **Mid-danger (Military, Security, Engineering):** Prototype discharge; one researcher injured; lab productivity halved 7 days. Structural test exceeded parameters; lab building damaged.
- **High-danger (Biology, Materials):** Containment failure; three researchers exposed to experimental compound; Sick status effect applied; research pauses if untreated. Unexpected reaction; lab damaged; two researchers injured; one wall inexplicably transparent.

Options (Event tier):

- **Send medical attention** — Money cost; researchers recover; research resumes at reduced pace
- **Reassign researchers** — Research pauses; incident contained
- **Push through** — Research continues; further incident risk increases; researcher loyalty decreases

---

**The Ethical Objection**
_Event — Interrupts — Recurring (once per branch per playthrough)_
A named researcher has developed serious reservations about the work they are doing. They have filed a memo. It is well-reasoned.

- Trigger: Research in high-consequence branch at 50%+ completion; assigned researcher Empathy above 60
- Presentation: Written as a formal memo to the Overlord — dry, professional, specific
- Effects: Research pauses until resolved; researcher loyalty decreased
- Options:
    - **Reassign** — Research resumes with replacement; original researcher loyalty drops further; small chance they leak to Null/Void or foreign org
    - **Persuade** — Requires Persuasion skill agent; chance scales with skill; success keeps researcher; failure triggers resignation
    - **TERMINATE** — Research resumes immediately; EVIL gain; other lab researchers suffer loyalty decrease; possible collective work-slowdown
    - **Address their concerns** — Research takes 20% longer; produces slightly less extreme unlock version; researcher stays; loyalty recovers

---

**The Passionate Researcher**
_Notification → Event — Recurring (rare)_
A named researcher has made an unexpected personal breakthrough. The addendum they filed was not requested. It is interesting.

- Trigger: Researcher with Intelligence above 75 and relevant skill above 60; random chance

**Positive variant:** Research completion time reduced 25%; researcher gains skill increase; chance of adjacent node partial unlock.

**Unexpected variant:** Researcher has followed the research logic somewhere unplanned. New capability described — potentially useful, potentially alarming.

- Options:
    - **Pursue** — Research pivots; original unlock delayed; new unlock added to tree
    - **Shelve** — Original research continues; researcher slightly frustrated
    - **Classify** — Finding locked down; researcher's access restricted; they are not pleased

---

**The Talking Researcher**
_Event — Interrupts — Recurring_
A researcher has been sharing information they should not have been sharing.

- Trigger: Researcher loyalty below 40; sensitive research active; Counterintelligence below threshold
- Warning signs: Unusual social activity in simulation logs; loyalty anomalies on agent profile; Pattern Recognition Systems flags communication irregularities
- Effects if not caught: Foreign org gains partial research data; research set back; Null/Void may receive and publish
- Options on discovery:
    - **TERMINATE** — Pipeline closed; research resumes; EVIL gain; other researchers shaken
    - **Turn them** — Feed false data through researcher to foreign org; requires Deception skill agent; high risk, high reward
    - **Interrogate first** — Determine what was shared and to whom before deciding; researcher loyalty continues decaying during interrogation

---

**Stolen Research Acquired**
_Intelligence Report — Notification_
The empire has successfully extracted research data from a foreign org.

- Trigger: Stolen Research plot succeeds
- Effects: Empire gains partial progress toward equivalent research; if project not yet started, begins with head start
- Flavor: _"Whoever developed this knew what they were doing. We can work with this."_

---

**They're Working on Something**
_Intelligence Report — Recurring_
A foreign org is developing a capability that could affect empire operations.

- Requires: Intel level on org > 60; org at 50%+ completion on relevant research
- Content scales with intel level; at high intel, specific project and closing window for Stolen Research or Sabotage identified

---

**[Org Name] Announces Technological Achievement**
_News Feed — Recurring_
A CPU org has publicly announced a research completion.

- Effects: Other orgs may pursue same research faster; if military research, other orgs' combat effectiveness increases; if surveillance, empire espionage operations become harder empire-wide

---

**Program Initiated — Supersoldier**
_Notification — One-time_
The Human Performance Optimization program has begun active testing.

- Flavor: _"Subject intake has begun. Dr. [name] notes that volunteer recruitment has been 'more straightforward than anticipated,' which she finds concerning in ways she cannot fully articulate."_

---

**Early Results — Supersoldier**
_Notification — One-time; fires at 33% completion_
Initial results are promising. Possibly too promising.

- Flavor: _"Phase one results exceed baseline projections by 340%. Dr. [name] has requested additional containment resources. Request approved. Dr. [name] has submitted a second request for 'significantly more' containment resources. Request under review."_

---

**Complication — Supersoldier**
_Event — Interrupts — One-time; fires at 66% completion_
Something unexpected has emerged from the program. The researchers are managing it. Probably.

- Options:
    - **Pause and assess** — Research pauses; 30% chance of identifying and correcting instability; 70% chance resumes with higher catastrophic failure risk
    - **Accelerate** — Finishes faster; catastrophic failure probability increases significantly; success produces stronger supersoldiers; failure is worse
    - **Abandon** — Research cancelled; contained subjects must be dealt with (TERMINATE / release / study); no plague risk; Science investment partially lost

---

**Catastrophic Failure — The Plague Begins**
_Landmark — Interrupts — One-time if triggered_
The program has produced something that was not in the research parameters.

- Opening: _"This is Dr. [name]. If anyone is reading this, the lab is compromised. Do not open the east wing. Do not open the east wing. Do—"_
- Effects: Lab zone gains Zombie Plague effect; research empire-wide paused; EVIL increases; Zombie Plague Cure research becomes visible
- Options:
    - **Quarantine** — Lock down all movement in/out; slows spread; zone economy halted; loyalty collapses
    - **Military containment** — Troop agents reclaim zone by force; high risk; combat encounter against plague subjects
    - **Begin Cure research** — Queue immediately; long completion; plague spreads during research
    - **Do nothing** — Plague spreads unchecked; zone uninhabitable within days; adjacent zones begin exposure

---

**The Spread — Stage 1**
_Notification — Recurring during active plague; fires every 3-5 days initially_
Slow. Ominous. The player should feel like they have time.

- Content: _"Epidemiological monitoring reports unusual health patterns in [adjacent zone]. Assessed cause: proximity to quarantine zone. Situation being monitored."_
- Mechanical effect: Adjacent zone has 20% chance of gaining Zombie Plague effect within 5 days if no action taken

---

**The Spread — Stage 2**
_Event — Interrupts — Recurring when second zone infected_
The player can no longer dismiss this as contained.

- Effects: Both zones' economies halted; citizens dying; income decreasing; cure timeline shown if active
- Options: Emergency military containment / Accelerate cure research / Sacrifice the zones

---

**The Spread — Stage 3: The Crisis**
_Landmark — Interrupts — One-time; fires when plague reaches 4+ zones or crosses into non-empire territory_
This is no longer the empire's private problem.

- Effects: All foreign orgs learn of plague; perceived EVIL spikes massively; hero orgs may intervene; alternate defeat condition clock begins
- Options:
    - **Go public** — Acknowledge plague and cure effort; massive perceived EVIL reduction; foreign orgs may contribute to cure research in exchange for concessions
    - **Cover it up** — Propaganda and Deception resources committed; buys time; if cover-up fails, perceived EVIL increase is catastrophic
    - **Request hero org assistance** — Contact a hero org directly; they assist in exchange for concessions; Inner Circle uncomfortable

---

**Missing Persons Report**
_Notification — Recurring; fires gradually while Soylent Green program runs_
The simulation is tracking disappearances. Nobody has connected them yet.

- Content: Buried in routine administrative reports; population variance filed as emigration
- Mechanical note: Each notification increases the investigation progress counter

---

**Someone Is Asking Questions**
_Intelligence Report — Recurring; fires at investigation counter 30%_
A high-Intelligence citizen or foreign agent has noticed the pattern.

- Requires: Surveillance Tap active in relevant zone to catch this early
- Content: Named analyst cross-referencing population data; methodology sound; time to accurate conclusions shown
- Options:
    - **TERMINATE the analyst** — Removes this investigator; counter pauses briefly; another may emerge if counter is high enough
    - **Feed disinformation** — Corrupts analyst data; sets counter back 20%; analyst may eventually see through it
    - **Do nothing** — Investigation continues

---

**The Theory Emerges**
_Event — Interrupts — One-time; fires at investigation counter 60%_
Someone has figured out enough to start saying it out loud.

- Presentation: Intercepted communication between two foreign intelligence officers; one walks through the disappearance pattern; conclusion implicit
- Final line: _"If you're right about this, we have a much bigger problem than we thought."_
- Effects: Two orgs gain partial knowledge; opinion of empire decreases sharply; Null/Void investigation probability increases
- Options: Shut down program / Accelerate cover-up / Continue program

---

**The Exposure**
_Landmark — One-time_
They know. Everyone knows.

- Trigger: Investigation counter reaches 100%; or Null/Void publishes; or cover-up fails catastrophically
- Opening: A Null/Void transmission broadcast simultaneously to every org in the world. The documentation is accurate. The disappearances are named. Some of them have families.
- Effects: Massive empire-wide loyalty collapse; perceived EVIL to maximum regardless of current value; every foreign org declares maximum hostility; hero orgs gain full capability boost; People's Revolution queued
- Tone: Played seriously. The game does not make jokes here.
- Options:
    - **Deny everything** — Propaganda Department required; buys a few days; nobody believes it
    - **Claim it was unauthorized** — TERMINATE the program's lead researcher publicly; minor loyalty recovery; world largely unconvinced
    - **Address the empire** — Overlord makes public statement; player selects tonal register; each option has different mechanical outcomes; none fully recover from exposure
    - **Double down** — Empire openly defends the program; massive EVIL gain; loyalty collapses further; remaining loyal agents become fanatically loyal; this is the darkest timeline

---

### 19.9 Tier 4 Consequence Events

---

#### Blot Out the Sun

**Darkness Falls**
_Landmark — One-time; fires when Blot Out the Sun activates_

- Opening: _"Atmospheric Modification Initiative — Phase 3 Complete. Global solar irradiance has been reduced to 12% of baseline. The Renewable Energy Monetization Program is now active. Have a productive day."_
- Simultaneous world reaction cluster: agricultural organizations report "unexpected crop yield variance"; international astronomical society issues statement; intercepted foreign head of state: _"Is this them? ...Of course it's them."_
- Effects: All non-empire orgs receive first tribute demand; tribute cycle begins; all hero orgs gain capability increase; Grand Coalition probability spikes
- Note: Empire's internal energy sales dashboard goes live on Economy screen. It looks disturbingly cheerful.

---

**First Refusal**
_Event — Interrupts — Milestone_
An org has declined to pay. This was anticipated.

- Content: _"NOTICE: [Org name] has failed to remit scheduled energy access payment of $[X]. This is their first missed payment. Per the Atmospheric Monetization Agreement (to which they are a non-consenting party), the following consequences will now apply..."_
- Effects: Refusing org citizen health begins declining; other orgs watching — refusal rate increases (solidarity) or decreases (fear) depending on how badly refusing org suffers
- Options:
    - **Make an example** — Accelerate health consequences; compliance increases; EVIL gain; hero org capability increases
    - **Grant extension** — One-time mercy; 5 more days; perceived EVIL decreases slightly; sets precedent
    - **Deploy collection agents** — Physically extract resources; Smuggling and Larceny skill agents; EVIL gain

---

**The Agricultural Collapse**
_Event — Interrupts — Milestone; fires when 3+ orgs refuse tribute for 10+ days_
Food systems are breaking down across multiple nations.

- Effects: All refusing org zones accumulate Sick status effects; economic output decreases; tribute compliance among remaining orgs increases sharply
- Tier 4 interaction: If Global Financial Crash also active, orgs cannot pay tribute even if willing — financial collapse has frozen their assets. Empire collects nothing from anyone. Both operations' blowback compounds.
- Flavor: _"Energy Revenue Report: Week 3. Collection rate: 34%. Notes: market penetration ongoing. Projections remain optimistic."_

---

**Lights On — Someone Found the Switch**
_Landmark — One-time; fires if dispersal system is sabotaged_
Someone has partially restored solar irradiance.

- Content: _"Atmospheric Modification Initiative — Unscheduled Interruption. Solar irradiance has returned to 67% of baseline in sectors 4 through 9. Investigation ongoing. The responsible parties have been identified. HR is processing the relevant paperwork."_
- Effects: Partial tribute leverage lost; affected orgs stop paying immediately; empire income from operation decreases proportionally
- Options:
    - **Emergency repair** — Restore full coverage; money and Engineering agents; 7-day window before orgs consider threat neutralized
    - **Retaliate** — Immediate plot against responsible hero org; EVIL gain; retaliation follows
    - **Pivot to partial coverage** — Accept reduced control; perceived EVIL decreases slightly

---

#### Control the World's Water Supply

**The Tap**
_Landmark — One-time; fires when Water Supply operation activates_

- Opening: _"Global Hydraulic Infrastructure Initiative — Activation Complete. Control nodes are live across [X] distribution networks covering [Y]% of global freshwater access. The Hydration Monetization Program is now active. Stay hydrated."_
- Effects: All non-empire zones receive tribute demands; water tribute cycle begins; citizen health in non-paying zones declines after 5 days; Grand Coalition probability increases significantly
- Tier 4 interaction: If Blot Out the Sun also active, non-empire orgs simultaneously losing sunlight and water. Citizens dying faster. Tribute compliance near total — but world hostility is at maximum. Grand Coalition forms immediately if resources allow.

---

**First Health Consequences**
_Event — Interrupts — Milestone; fires when first org refuses water tribute for 5+ days_
The consequences of non-payment are visible in the simulation.

- Content: _"Hydration Compliance Monitor — Alert: [Org name] zones reporting elevated health variance. Projected citizen health trajectory: declining. Estimated days to critical threshold: [X]. Payment would resolve this immediately."_
- Effects: Citizens in refusing org's zones accumulate Sick effects; some citizens develop loyalty toward empire (they blame their government, not the empire, for the situation — a dark mechanic noted without comment)

---

**The Resistance Movement Floods In**
_Event — Interrupts — Milestone; fires when resistance org targets water nodes_
Someone is trying to contaminate the empire's leverage.

- Effects: Partial water control lost in affected regions; tribute from those regions stops; Pastoral Front gains citizen support
- Tier 4 interaction: If Zombie Plague also active, contaminated water accelerates plague spread. The empire has accidentally weaponized its own infrastructure against itself.

---

#### Hypno Disco Ball

**The Grand Opening**
_Landmark — One-time; fires when Hypno Disco Ball deploys_

- Opening: _"Hyper-refractive Loyalty Optimization System — Activation Confirmed. Target zone [name] is responding within normal parameters. Dr. [name] notes that 'normal parameters' did not previously include spontaneous group dancing, but the loyalty metrics are excellent so we are choosing to view this positively."_
- Effects: Mass loyalty conversion; Party Animal status effect applied to affected citizens; zone economic output drops 40%; zone loyalty to empire at maximum
- World reaction: Adjacent zones report "unusual atmospheric phenomena and music"; two foreign officials spotted in affected zone on personal time
- Note: This is the most cartoonish Tier 4 operation. The event writing reflects this fully.

---

**The Party Spreads**
_Event — Interrupts — Milestone; fires when Party Animal spreads beyond target zone_
The parties have become self-sustaining.

- Content: _"Loyalty Optimization System — Uncontrolled Parameter Note: The enthusiasm generated in [target zone] appears to be... infectious. In the non-clinical sense."_
- Effects: Party Animal spreading; loyalty increases and productivity decreases in affected zones; foreign org citizens crossing borders to attend; minor perceived EVIL decrease
- Options:
    - **Contain** — Manage citizen movement; productivity partially restored; loses loyalty spillover benefit
    - **Encourage** — Let parties propagate; loyalty gains expand; economic output continues declining
    - **Deploy second Disco Ball** — Compounds effects in new zone; EVIL gain; world response shifts from baffled to alarmed

---

**The Morning After**
_Event — Interrupts — Milestone; fires 30 days post-activation_
The initial effect is wearing off. What remains?

- Content: _"Hyper-refractive Loyalty Optimization System — 30-Day Assessment. The acute phase of the loyalty optimization effect has stabilized. Citizen intelligence scores remain below baseline. Loyalty to the empire remains above baseline. Net assessment: ambiguous. Dr. [name] has requested that the phrase 'we made them happy and slightly less smart' not appear in official documentation. This request is noted and denied."_
- Effects: Party Animal fades; citizens retain moderate permanent loyalty gain; intelligence remains slightly reduced permanently; productivity returns to 80% baseline
- Options:
    - **Reactivate** — Refresh effect; money and Science cost; citizens slightly more resistant this time
    - **Consolidate** — Run EVIL Education or Oratory activities to lock in loyalty while citizens are still positively disposed

---

#### Global Financial Crash

**The Crash**
_Landmark — One-time; fires when Global Financial Crash activates_

- News broadcast: _"...markets are in freefall across all major exchanges. Analysts describe the situation as 'unprecedented,' 'catastrophic,' and in one case 'somehow both of those things at once.'..."_
- Empire internal memo overlaid: _"Global Financial Disruption Initiative — Phase 1 Complete. Offshore assets secured. Projected competitor liquidity: critical. Our position: comparatively comfortable. Finance Department requests commendation. Finance Department commendation approved."_
- Effects: All non-empire org income reduced 60% immediately; empire income reduced 20% (with Offshore Infrastructure Development; 50% without); all CPU orgs reduce active operations; all active tribute payments freeze
- Tier 4 interaction: If Blot Out the Sun or Water Supply tribute active, this eliminates income from both simultaneously. Empire has crashed the economies it was extorting. Net income may decrease. The Finance Department commendation may have been premature.

---

**The Scramble**
_Event — Interrupts — Milestone; fires 7 days post-crash_
The world is adapting. Badly, but adapting.

- Content: Three simultaneous intelligence reports — CPU org A bartering directly with CPU org B; a resistance org establishing alternative local economy; foreign intelligence service formally concluding empire caused the crash
- Effects: CPU orgs begin partial recovery through barter; empire financial advantage narrows; recovering orgs increase hostility
- Options:
    - **Disrupt barter networks** — Smuggling and Criminal skill agents; slows recovery; EVIL gain
    - **Exploit the chaos** — Run Siphon and Rob a Bank plots while security is low
    - **Offer stabilization loans** — Financial assistance at interest; target org opinion increases; creates dependency; perceived EVIL decreases with those orgs

---

**The Recovery Threat**
_Event — Interrupts — Milestone; fires when any CPU org recovers to 50% pre-crash income_
Someone is getting back on their feet. This is inconvenient.

- Content: _"Global Financial Disruption Initiative — Anomalous Recovery Alert: [Org name] has achieved partial financial stabilization. Finance Department notes this was 'not in the projections.'"_
- Effects: Recovering org resumes full agent activity; begins coordinating against empire; Grand Coalition probability increases at 75% recovery
- Options:
    - **Secondary crash** — Targeted financial disruption against recovering org; significant resources; EVIL gain
    - **Acquisition** — Establish Front Company and Siphon Zone Accounts simultaneously; slow recovery while profiting
    - **Accept** — Org will fully recover and join coordinated response

---

#### The Grand Coalition

**Preliminary Coordination**
_Intelligence Report — Notification cluster; fires 10-15 days before Grand Coalition forms_

- Requires: Surveillance infrastructure active in at least two foreign zones
- Three notifications over several days — not obviously connected:
    - Day 1: Unusual diplomatic traffic between two orgs; encryption elevated; content unknown
    - Day 5: Another org has recalled senior military agents from peripheral operations
    - Day 10: Pattern Recognition Systems flags coordinated communication increase across multiple organizations
- Player options: None in notifications; **Poison the Well** plot becomes available if player acts within the window

---

**The Grand Coalition Forms**
_Landmark — One-time_
They have decided to stop competing with each other and start competing with the empire. This is, from a certain perspective, a compliment.

- Trigger: Multiple Tier 4 operations active simultaneously; or EVIL at Apocalyptic tier; or player failed to disrupt preliminary coordination
- Opening: Intercepted broadcast — deliberately public: _"The signatories of this accord, representing [X] governing organizations and [Y] million citizens, hereby declare a state of unified response to the organization known as [Empire Name]. We have our differences. We are setting them aside. Effective immediately."_
- Empire internal response: _"Grand Coalition Formation — Threat Assessment: Significant. Recommended internal designation: 'The Situation.' Finance Department is revising projections. Again."_
- Effects:
    - All coalition members share complete intelligence on empire operations — every active plot known to all of them
    - Coalition members can execute joint Takeover Zone plots with combined agent forces
    - A unified coordination layer organization appears in the Intel screen
    - All hero orgs coordinate with Coalition; operations become more targeted and better resourced
    - Empire perceived EVIL locked at maximum for Coalition duration
    - Grand Coalition has its own resource pool drawn from member contributions
- Options:
    - **Target the coordination layer** — Assassination or Infiltration against Coalition leadership; if successful, coordination degrades; requires finding and identifying leadership first
    - **Splinter the Coalition** — Deception and False Flag plots to make members distrust each other; long-term strategy; each success reduces Coalition effectiveness
    - **Accelerate Tier 4 operations** — Push remaining operations to completion before Coalition fully mobilizes; high risk; may achieve victory before Coalition destroys empire
    - **Negotiate** — Requires perceived EVIL below maximum (nearly impossible); significant concessions; partial dissolution possible if empire abandons one or more Tier 4 operations

---

**The Coalition Strikes**
_Landmark — Recurring; fires each time Coalition executes major coordinated operation_
The Coalition has moved from coordination to action. Combined force initiates combat encounter.

- Effects: Combined force significantly larger than any single org; weighted toward Coalition unless empire has significant Fortify Zone and Troop investment; Coalition does not disband on defeat — only loses agents
- Note: After Action Report for Coalition battles should feel different in scale from standard combat AARs

---

**Coalition Fracture**
_Landmark — One-time if triggered_
The Coalition is falling apart.

- Trigger: Empire executes 3+ Splinter Coalition operations; or Coalition suffers 3+ major military defeats; or Financial Crash collapses member org resources to zero
- Content: Series of increasingly terse intercepted Coalition internal communications; final message names the withdrawing org and their stated vs. actual reason for leaving
- Effects: Coalition dissolves; member orgs revert to independent action; Grand Coalition cannot reform for 30 days; perceived EVIL decreases moderately
- Flavor: _"Grand Coalition Dissolution — Status Update: The Situation has resolved. Finance Department projections restored to previous optimism. Have a productive day."_

---

## 20. The CPU & World Response

### 20.1 CPU Organization Behavior

Each CPU Governing Organization takes one action per day during the simulation phase. CPU actions include:

- Send agents into another org's territory (attack or espionage)
- Attempt to take over a zone (prioritizes reclaiming lost territory, but not always)
- Abduct a person from another zone
- Respond to empire actions with increasing aggression as perceived EVIL grows
- Staff development — improving agent skills and attributes
- Research science projects and utilize unlocked capabilities

CPU orgs are bound by the same basic rules as the player: they suffer infrastructure penalties, must pay agents, and face loyalty consequences for neglecting their people.

### 20.2 Retaliation Logic

CPU orgs respond to empire plots thematically where possible — a propaganda attack is countered with a loyalty recovery campaign; a financial raid is countered with increased security. As general hostility grows, retaliation becomes less targeted and more aggressive, eventually manifesting as direct military action against whatever empire target is most vulnerable.

Retaliation timing scales with the severity of the triggering plot:

- **Tier 1-2 empire plots:** Retaliation fires within 5-15 days; thematic counter-action
- **Tier 3-4 empire plots:** Retaliation fires within 3-7 days; direct and forceful response

### 20.3 World Response Orgs

As the empire's perceived EVIL increases, new organizations are generated to oppose it. These are mechanically CPU orgs with behavioral constraints. Full hero org profiles, operational patterns, and disbanding conditions are documented in Section 19.6.

**Resistance Movements**

- Emerge in nations the empire has conquered or threatened
- Can only take over zones within their native nation
- Cannot operate outside their nation
- Goal: reclaim occupied territory

**Hero Organizations**

- Emerge at EVIL tier "Menace" and above
- Generated with full capability set (no research needed)
- Focus exclusively on the empire
- Grow stronger with each successful operation — minor early victories compound into serious threats
- Goal: disrupt the empire; ultimately kill the Overlord
- Names are procedurally generated; see Section 19.6 for behavioral templates and example org profiles

**World Police / The Adjudicators**

- Emerge at high EVIL tiers
- Cannot take over zones
- Focus exclusively on the empire
- Do not research technology; occasionally gain random tech effect from non-empire orgs still in play
- The Adjudicators are the World Police enforcement arm — cold, professional, legally mandated
- Unique vulnerability: Can be discredited through Operation Clean Hands plot chain (Section 16) or manipulated into committing acts that turn world opinion against them
- Goal: contain and dismantle the empire through force and legal pressure

**The Grand Coalition**

- Forms when multiple Tier 4 operations are simultaneously active, or when empire EVIL reaches Apocalyptic tier, or when player fails to disrupt preliminary coordination
- All coalition member orgs share complete intelligence on empire operations
- Coalition members can execute joint military operations with combined forces
- Has its own resource pool drawn from member contributions
- Can be disrupted through Splinter Coalition Deception plots or by targeting the Coalition's coordination layer
- Full formation and dissolution event chain documented in Section 19.9

### 20.4 Information Surfacing

All significant CPU actions are logged. Events surface to the player through three tiers — News Feed, Intelligence Report, and Intercepted Communication — as documented in Section 19.2. The quality and timeliness of information the player receives scales directly with their Surveillance research investment and intel levels on relevant zones and orgs. The player should never feel blindsided by events they could have known about with appropriate intelligence infrastructure — but events they had no way of knowing about should still surprise them.

---

## 21. Victory & Defeat

### 21.1 Victory Conditions

**Military Victory**
The empire controls every zone in the world. Zones rendered permanently uninhabitable are excluded from this count.

**Cultural Victory**
The empire achieves loyalty from a target percentage of the world's total living population, regardless of zone ownership. The exact threshold is a design parameter to be tuned during development. This victory path rewards slow-burn tactics: propaganda, loyalty flipping, Free Internet, and long-term investment in the simulation over pure aggression.

### 21.2 Defeat Conditions

- The Evil Overlord is killed.
- The empire controls zero zones (including cases where the empire has rendered all its own zones uninhabitable).

### 21.3 Epilogue & Score

Upon victory or defeat, the player receives an epilogue screen that reflects _how_ they played:

- A narrative summary of the empire's rise (and fall, if defeat).
- Statistics: zones conquered, citizens converted, plots executed, agents lost, heroes defeated.
- A characterization of the Overlord's legacy — e.g., "You conquered the world through fear and spectacle" vs. "You seduced the world into compliance, one conspiracy theory at a time."

The epilogue should have enough variety that two different victory paths produce meaningfully different endings.

### 21.4 Save Modes

At game start, players select a save mode:

- **Standard** — Traditional save and load. Mistakes can be undone.
- **Ironman** — Autosave only. No reloading. Every decision is permanent.
- **Permadeath** — One life. Defeat ends the run. Start over.

The default mode is Standard.

---

## 22. The Interface

### 22.1 Design Philosophy & Aesthetic

The interface is the administrative backend of a functioning company. That company is a global evil empire. The horror is in the normalcy.

The player is not presented with a fantasy game UI. They are presented with a dashboard that would not look out of place in enterprise SaaS software — clean typography, structured data tables, muted color palette, clear information hierarchy. The cognitive dissonance between this professional presentation and the content it contains is the primary comedic and satirical mechanism.

**Design principle:** A new player looking at the interface for the first time should think "this looks like some kind of operations tool." Then they should read what it's tracking.

The interface targets the aesthetic register of a real, well-funded SaaS product — think Vercel's dashboard, Linear, or a Bloomberg terminal — rendered on a dark background with a muted, professional color system. Every screen should feel like something a mid-level manager might interact with before realizing what they're actually managing.

This is distinct from "game UI" in the following ways:

- No decorative chrome, no fantasy borders, no glowing orbs
- Data is presented in tables and structured panels, not cards with big icons
- Typography is precise and functional, not stylized
- Color is used sparingly and semantically, not decoratively
- Animations exist but are subtle — data loading, state transitions, not spectacle

The interface's tone is not static. As the empire's EVIL tier increases, the UI responds in understated ways. See Section 22.18 for full tone escalation rules. The core rule: the interface never becomes a "villain lair" aesthetic. It becomes a _more oppressive_ version of the corporate aesthetic it started as.

---

### 22.2 Design System

#### Color Palette

All colors defined as CSS custom properties. The palette is intentionally narrow. The interface does not use color decoratively.

```css
:root {
    /* Backgrounds */
    --bg-primary: #0d0f11;
    --bg-surface: #13161a;
    --bg-elevated: #1a1e24;
    --bg-hover: #1f242b;
    --bg-selected: #212830;

    /* Borders */
    --border-subtle: #1f2530;
    --border-default: #2a3140;
    --border-strong: #3a4455;

    /* Text */
    --text-primary: #e2e8f0;
    --text-secondary: #94a3b8;
    --text-muted: #475569;
    --text-inverse: #0d0f11;

    /* Accent — Empire Red */
    --accent-red: #c0392b;
    --accent-red-muted: #7f1d1d;
    --accent-red-subtle: #1f0d0d;

    /* Semantic Colors */
    --color-positive: #16a34a;
    --color-positive-muted: #14532d;
    --color-warning: #d97706;
    --color-warning-muted: #451a03;
    --color-negative: #dc2626;
    --color-negative-muted: #450a0a;
    --color-neutral: #475569;
    --color-info: #2563eb;
    --color-info-muted: #1e3a8a;

    /* EVIL Tier Colors */
    --evil-nuisance: #475569;
    --evil-irritant: #d97706;
    --evil-threat: #ea580c;
    --evil-menace: #dc2626;
    --evil-supervillain: #b91c1c;
    --evil-apocalyptic: #7f1d1d;
}
```

#### Typography

Two typefaces. No exceptions.

**Display / Headers: IBM Plex Mono** — screen titles, metric values, EVIL tier labels, empire name, stat blocks, research project names, plot names. Monospace conveys data precision and mild bureaucratic menace.

**Body / UI: IBM Plex Sans** — all descriptive prose, event text, labels, navigation, table content, tooltips.

#### Spacing

8px base unit. All spacing values are multiples of 4px (`--space-1: 4px` through `--space-16: 64px`).

#### Motion

Transitions are fast and purposeful. No decorative animation. Fast: 100ms (hover). Base: 160ms (state transitions). Slow: 240ms (modal enter/exit). XSlow: 400ms (landmark event presentation).

#### Iconography

Lucide icons exclusively. Used functionally, not decoratively. 14px in tables/labels, 16px in buttons, 20px in sidebar navigation.

#### Key Components

- **`<DataTable>`** — Sortable columns, selectable rows, optional row actions. Used on Personnel, Plots, Economy, Activities.
- **`<StatWidget>`** — Labeled metric with value, trend, optional drill-down. Used in Empire overview.
- **`<Panel>`** — Surface container with optional header and border. Primary layout primitive.
- **`<Tag>`** — Small semantic label. Used for status effects, EVIL tiers, job types, terrain types.
- **`<FeedEntry>`** — Single entry in notification/event feed. Supports different entry types.
- **`<CharacterProfile>`** — Slide-in panel for full character stat blocks.
- **`<ProgressBar>`** — Research progress, plot progress, health bars.
- **`<ActionButton>`** — Primary action button. Has a destructive variant (TERMINATE, Demolish) with accent-red styling.

---

### 22.3 Layout Architecture

#### Application Shell

Three fixed zones:

```
┌─────────────────────────────────────────────────────────────┐
│  TOPBAR  (48px fixed)                                       │
├──────────┬──────────────────────────────────────────────────┤
│          │                                                  │
│ SIDEBAR  │  CONTENT AREA                                    │
│ (220px   │  (fills remaining width)                        │
│  fixed)  │                                                  │
│          │                                                  │
└──────────┴──────────────────────────────────────────────────┘
```

#### Topbar (48px)

Fixed. Always visible.

- **Left:** Empire name (IBM Plex Mono, secondary color). Clicking opens Overlord profile.
- **Center:** Current in-game date. Format: `DAY 47 — 14 MARCH, YEAR 1`. Updates in real time while simulation runs.
- **Right cluster:** Unread event count badge → EVIL tier pill (hovering reveals actual and perceived EVIL scores) → Current money with cash flow indicator → Simulation speed / advance control

#### Sidebar (220px)

Fixed. Always visible. Contains primary navigation, EVIL score mini-widget, Infrastructure mini-widget, and Settings icon at bottom.

**EVIL Score Mini-Widget (sidebar bottom):**

- `EVIL RATING` label
- Score in tier color (large mono)
- Tier name below score
- Thin horizontal gauge bar in tier color

**Infrastructure Mini-Widget:**

- `INFRASTRUCTURE` label
- `12 / 15 ZONES` — green if under cap, amber at 80%+, red if over cap
- Progress bar in corresponding color

#### Content Area

Fills all remaining space. Minimum viewport: 1280×800px. Mobile is explicitly out of scope for MVP.

Internal layout patterns:

- **Single column** — Event resolution, After Action Report, landmark events
- **Left main + right panel** — Intel, Personnel, Plots
- **Dashboard grid** — Empire overview only
- **Full-bleed panel** — Science research tree

Sidebar and topbar never scroll. Content area scrolls vertically.

---

### 22.4 Navigation & Routing

#### Sidebar Navigation

| Icon              | Label      | Screen                     | Keyboard Shortcut |
| ----------------- | ---------- | -------------------------- | ----------------- |
| `LayoutDashboard` | EMPIRE     | Main overview              | `G` then `E`      |
| `Globe`           | INTEL      | World map + intelligence   | `G` then `I`      |
| `Users`           | PERSONNEL  | Agent roster + squads      | `G` then `P`      |
| `BarChart2`       | ECONOMY    | Income / expense breakdown | `G` then `$`      |
| `FlaskConical`    | SCIENCE    | Research tree              | `G` then `S`      |
| `Target`          | PLOTS      | Plot queue and selection   | `G` then `L`      |
| `Activity`        | ACTIVITIES | Activity assignment        | `G` then `A`      |
| `ScrollText`      | EVENTS     | Event log + AAR archive    | `G` then `V`      |

Navigation uses a two-key chord (`G` + key) to avoid accidental navigation during typing. The `G` key press opens a brief "navigate to..." hint overlay (200ms).

**Active state:** Active screen nav item receives `--bg-selected` background and 2px left border in `--accent-red`.

**Notification badges:** Intel and Plots nav items may display a numeric badge in `--accent-red`.

#### Time Advance Control

Lives in the **topbar right cluster**, not the sidebar. Always visible and accessible from any screen.

Advance dropdown options: `1 DAY` / `7 DAYS` / `TO DATE...` / `TO NEXT EVENT`

While simulation is running: ADVANCE button changes to PAUSE; speed selector appears (`1×` / `5×` / `10×` / `MAX`); date display increments visibly; a 2px progress bar appears below the topbar.

---

### 22.5 The Time Advance Flow

Time advance is the core game loop action. The simulation runs day by day. Events interrupt. The player resolves them. The simulation resumes.

#### Interruption Behavior

When an interrupting event fires:

1. Simulation pauses immediately
2. Progress bar freezes
3. Event notification appears in topbar
4. Combat or Landmark events: Event Resolution screen opens automatically
5. Less urgent events: non-blocking notification appears in feed; player chooses when to resolve
6. Simulation does not resume until all blocking events are resolved

**Always-blocking events (full auto-interrupt):** Combat encounters, events that kill or injure named characters, events requiring mandatory player choice, EVIL tier threshold crossings, Landmark events.

**Non-blocking (feed notifications):** Skippable notifications, Intelligence Reports, News Feed items.

#### Post-Advance Summary

When an advance period completes without interruption, a brief toast notification summarizes: `7 DAYS ELAPSED — 3 EVENTS — $42,400 NET INCOME`. Clicking the toast opens the event log filtered to the elapsed period.

---

### 22.6 The Event System UX

#### Event Priority Tiers

**1. Blocking Events (Full Screen)**
Event Resolution screen replaces current view. Simulation cannot resume until resolved. Used for: Combat, Landmark events, mandatory choices, EVIL tier crossings.

**2. Interrupting Notifications (Modal)**
Modal overlay over current screen. Simulation pauses. Player must acknowledge before resuming. Used for: Named character death/injury, zone captured/lost, major plot outcomes.

**3. Feed Notifications (Non-blocking)**
Entries appear in notification feed. Simulation continues. Reviewed at leisure. Used for: News feed items, Intelligence Reports, minor events, research completions.

#### The Notification Feed

Persistent timestamped log of all events. Accessible via:

- Notification icon in topbar (opens as right-edge drawer)
- Embedded panel within Intel screen (filtered to intel-relevant events)
- Full-screen Events log (via EVENTS nav item)

Feed entries styled by source:

- **News Feed:** `--text-secondary`, no left border
- **Intelligence Report:** `--color-info` left border (2px)
- **Intercepted Communication:** `--color-warning` left border (2px), italic text
- **Internal Empire:** `--text-primary`, no left border
- **Unread:** slightly brighter background

#### Event Resolution Screen Layout

Used for blocking events. Full content area replacement.

```
┌─────────────────────────────────────────────────────┐
│  EVENT TYPE LABEL (small caps, muted)               │
│                                                     │
│  EVENT TITLE (large, mono)                          │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  Event narrative body text (~640px max width)       │
│                                                     │
│  Mechanical effects summary (labeled list)          │
│                                                     │
│  ─────────────────────────────────────────────────  │
│                                                     │
│  [ OPTION A ]  [ OPTION B ]  [ OPTION C ]           │
│                                                     │
└─────────────────────────────────────────────────────┘
```

- Event narrative always presented in full before options are revealed
- Destructive options (TERMINATE) use red destructive button style
- Hovering an option reveals a tooltip with mechanical consequences preview
- After selecting: option buttons disappear; outcome confirmation text appears; mechanical effects listed; after 1.5 seconds a `CONTINUE` button appears (delay prevents accidental double-clicks)

**Event Type Labels:**

| Event Type         | Label                                   |
| ------------------ | --------------------------------------- |
| Standard event     | `INTERNAL REPORT`                       |
| Landmark event     | `PRIORITY COMMUNICATION`                |
| Combat encounter   | `COMBAT ENGAGEMENT REPORT`              |
| EVIL tier crossing | `THRESHOLD ALERT`                       |
| Hero org arrival   | `THREAT ASSESSMENT`                     |
| Research complete  | `RESEARCH DIVISION — COMPLETION NOTICE` |

**Landmark Event Treatment:**

- Content area dims to near-black before event appears (300ms fade)
- Event title appears first, then body text fades in (staggered, 400ms per element)
- EVIL tier crossing events using intercepted communications are presented as styled document facsimiles — letterhead, visible scan noise, slightly off-white background
- Landmark events cannot be dismissed or skipped

**Intercepted Communication Presentation:**

```
┌───────────────────────────────────────────────────────┐
│  [LETTERHEAD OR ORG IDENTIFIER — IF KNOWN]            │
│  INTERCEPT LOG ████████ // AUTO-TRANSLATED            │
│  Source: [ZONE] — DATE: DAY 47                        │
│  ─────────────────────────────────────────────────── │
│                                                       │
│  [Communication body — italic, slightly warm text]    │
│                                                       │
└───────────────────────────────────────────────────────┘
```

The `// AUTO-TRANSLATED` tag is present on all foreign communications — a flavor convention. The redaction bars appear on classified source metadata.

**When combat triggers an event that leads to an AAR:** The event is shown first, requiring player input to advance. The AAR is then shown. Both require explicit player action to proceed. Neither can be skipped.

---

### 22.7 Screen Specifications

#### 22.7.1 Empire (Main Overview)

The player's primary dashboard. At-a-glance state across all major systems.

**Layout: 12-column grid, three rows**

**Row 1 — Resource Bar (full width)**
Four resource stat widgets separated by vertical dividers:

| Widget         | Value Display              | Secondary                    |
| -------------- | -------------------------- | ---------------------------- |
| MONEY          | `$1,247,430` (mono, large) | `+$8,240/day` (green or red) |
| SCIENCE        | `2,847` (mono, large)      | `+140/day`                   |
| INFRASTRUCTURE | `12 / 15 ZONES` (mono)     | Red if over cap              |
| EVIL           | `47` (mono, tier color)    | `THREAT` tier label          |

Each widget is clickable and navigates to the relevant detail screen.

**Row 2 — Operations (left 8) + Empire Status (right 4)**

_Active Operations Panel:_
DataTable of all active plots and activities. Columns: Operation | Type | Target | Agents | Status | ETA. Clicking a row opens plot/activity detail.

_Empire Status Panel:_

- `ZONES` — count with 30-day sparkline
- `AGENTS` — count with assigned/unassigned breakdown
- `EVIL TIER` — name, score, progress bar toward next tier
- `HERO ORG ACTIVITY` — `NONE` / `MINOR` / `MODERATE` / `SIGNIFICANT` / `CRITICAL`; at EVIL tier Menace and above, shows specific org names rather than generic level

**Row 3 — Event Feed (left 5) + Zone Overview (right 7)**

_Recent Activity Panel:_
Last 20 feed entries. Timestamp | type icon | first line | unread dot. `VIEW ALL →` links to full Events log.

_Controlled Zones Panel:_
Compact DataTable of all empire zones. Columns: Zone | Nation | Output | Loyalty | Status. Clicking a zone row navigates to that zone's detail in Intel.

---

#### 22.7.2 Intel

The player's window into the outside world — and their own territory. World map plus data panel plus notification feed.

**Layout: Left Map (60%) + Right Panel (40%)**

**Left — World Map**
See Section 22.12 for full map specification. Zone selection updates the right panel.

Map layer toggle (bottom-left of map): `POLITICAL` / `LOYALTY` / `INTEL LEVEL` / `MILITARY`

**Right — Intelligence Panel**

Two states: World State (no zone selected) and Zone Detail (zone selected).

_World State:_

- **Foreign Org Summary** — All known foreign orgs with empire opinion (if known), activity level, and status tag: `NEUTRAL` / `HOSTILE` / `ALLIED` / `RESISTANCE` / `HERO ORG` / `WORLD POLICE` / `GRAND COALITION`
    - Hero orgs display their org type (Direct Combat / Sabotage / Information / Grassroots / Wildcard / Hacktivist / Enforcement) in addition to the `HERO ORG` tag
    - Clicking a hero org row opens a Hero Org Detail panel showing: known operational style, capability level, known agents, recent operations, disbanding status and conditions
    - If the Grand Coalition is active, it appears as a distinct elevated entry at the top of the org list with a banner showing member count and resource pool
- **Active Threats** — Confirmed hostile orgs with known operational status. Drill-down available.
- **Recent Intel Feed** — Intelligence Reports and Intercepted Communications from last 14 days

_Zone Detail (zone selected):_
Zone name as panel title. Three tabs:

`OVERVIEW` — Nation, terrain, controlling org, economic output with trend, population, intel level progress bar, known buildings, known troop presence, active zone status effects (Outbreak, Zombie Plague, uninhabitable status).

`CITIZENS` — Visible only if intel level > 20. Table of known citizens: Name | Attributes (quality scales with intel) | Loyalty | Status effects. Low intel citizens show as `[UNKNOWN INDIVIDUAL]`. Click opens Character Profile panel.

`ACTIVITY` — Recent events and plots related to this zone. Plot history, espionage detected, combat outcomes.

---

#### 22.7.3 Personnel

Agent roster, squad management, and Inner Circle.

**Layout: Left Roster (55%) + Right Profile (45%)**

**Left Panel — Agent Roster**

Filters: text search | Department | Zone | Squad | Status
Sort by: Name | Department | Loyalty | Top Attribute

Roster table columns:

| Column   | Content                                                                   |
| -------- | ------------------------------------------------------------------------- |
| NAME     | Full name; Inner Circle badge if applicable                               |
| DEPT     | Tag: `SCIENTIST` / `ADMINISTRATOR` / `OPERATIVE` / `TROOP` / `UNASSIGNED` |
| LOCATION | Current zone                                                              |
| SQUAD    | Squad name or `—`                                                         |
| LOYALTY  | Progress bar, 0–100, colored at thresholds                                |
| STATUS   | Tag: `ACTIVE` / `TRAVELING` / `ON PLOT` / `INJURED` / `CAPTIVE`           |
| TOP ATTR | Name and value of highest attribute                                       |

Row click: opens agent profile in right panel.
Row right-click or `⋯`: context menu: `Reassign` / `Move` / `Add to Squad` / `TERMINATE`.

**Tabs above roster:** `ALL AGENTS` / `SQUADS` / `INNER CIRCLE`

_Squads Tab:_
List of squads. Expanding a squad reveals its members. Squad-level controls:

- Edit squad name
- Set home zone
- Set standing orders (dropdown):
    - `None`
    - `Defend Zone`
    - `Run Reconnaissance`
    - `Maintain Activity [select]`
    - `Counterintelligence Sweep`
    - `Manage Zone Stability`
    - `Escort Overlord`
    - `Execute Standing Plot [select]`
- Add/remove agents via drag or modal picker
- Disband squad

_Inner Circle Tab:_
Named cards rather than a dense table — these characters warrant more visual emphasis. Each card: name, top 3 attributes, current location, loyalty bar. Cards can be reordered. `+ ADD MEMBER` opens filtered agent picker.

**Right Panel — Character Profile**
See Section 22.13 for full specification.

**Bulk Actions** (when multiple agents selected):
Reassign Department | Move to Zone | Add to Squad | `TERMINATE` (destructive; confirmation required; uses TERMINATE language in confirmation modal)

---

#### 22.7.4 Economy

Full breakdown of income and expenses, cash flow projection, financial management tools.

**Layout: Single Column, Divided into Sections**

**Top — Cash Flow Summary**
Four stat widgets: `CURRENT FUNDS` | `DAILY INCOME` | `DAILY EXPENSES` (red) | `NET DAILY` (green/red)

**Income Breakdown**
Three panels side by side:

_Building Income:_ Total; table by building type showing zones count and output; drilldown by building type filters zone list.

_Citizen Taxes:_ Total; current tax rate slider; per-zone adjustment available in zone detail; projection showing income change at different rates.

_Activity Income:_ Income-producing activities (Smuggling, EVIL Oratory, etc.); individual contributions listed.

**Expense Breakdown**

| Category          | Daily Cost | % of Total | Detail        |
| ----------------- | ---------- | ---------- | ------------- |
| Agent Salaries    | $X         | X%         | `→ BREAKDOWN` |
| Building Upkeep   | $X         | X%         | `→ BREAKDOWN` |
| Active Plots      | $X         | X%         | `→ BREAKDOWN` |
| Active Activities | $X         | X%         | `→ BREAKDOWN` |
| Construction      | $X         | X%         | `→ BREAKDOWN` |

Each `→ BREAKDOWN` opens a right-side detail drawer.

**By Zone**
Table of all empire zones: Zone | Nation | Building Income | Tax Income | Upkeep | Net

**Cash Flow Projection**
Line chart of projected funds over next 30 days. If insolvency is projected within the window: `PROJECTED INSOLVENCY IN X DAYS` with red dotted line at zero.

---

#### 22.7.5 Science

Research tree and active research project management.

**Layout: Full-Bleed Tree (75%) + Active Projects Sidebar (25%)**

**Left — Research Tree**

Pan-and-zoom canvas. Nodes represent research projects grouped into labeled branch clusters. Dependency lines connect nodes. Cross-branch dependencies rendered as dashed lines in a distinct color.

Node states:

| State       | Visual                                                      |
| ----------- | ----------------------------------------------------------- |
| Locked      | Dim, muted text, lock icon                                  |
| Available   | Full opacity, `AVAILABLE` tag                               |
| In Progress | Highlighted border, progress fill, days remaining           |
| Completed   | Checkmark, slightly dimmed                                  |
| Blocked     | Amber border — prerequisites met but resources insufficient |

Canvas controls: mouse wheel zoom, click+drag pan, `Ctrl+0` reset to overview, `Ctrl+F` focus active research, minimap in bottom-right corner.

**Right Sidebar — Project Queue & Active Research**

Active projects list (each as a card): project name | branch tag | progress bar | assigned agents with skill levels | `+ ASSIGN AGENT` | `✕ CANCEL`.

Below active projects, selected node detail: full description, requirements, unlocks, `BEGIN RESEARCH` button, agent assignment picker.

---

#### 22.7.6 Plots

Plot queue and management.

**Layout: Left List (45%) + Right Detail (55%)**

**Left — Plot List**

Two tabs: `AVAILABLE` and `ACTIVE`.

Available plots organized by category: Economic Disruption / Political Manipulation / Military Operations / Espionage & Intelligence / Social Engineering & Propaganda / Criminal / Defensive / Tier 4 — World-Altering _(only appears when at least one Tier 4 plot is unlocked)_

Each plot listed with: name | complexity tier tag (`T1`–`T4`) | status (`READY` / `AGENTS NEEDED` / `RESEARCH REQUIRED` / `RESOURCES LOW`). Locked plots visible but grayed out with lock condition listed.

Active tab: Name | Target | Agents | Stage | ETA | Actions (`VIEW` / `ABORT`)

**Right — Plot Detail**

Header: plot name | tier tag | category tag | one-paragraph description

Requirements: required agents (with skill notes) | target zone/person selector | resource costs | research prerequisites (green checkmark / red X) | research lock message with estimated completion time

Resolution section: execution time estimate including travel time | success outcomes | failure outcomes | failure severity note at high EVIL

Agent Assignment: agent picker filtered to candidates meeting minimum requirements; shows relevant skills; selected agents appear as `ON PLOT` in Personnel

Launch section: `LAUNCH PLOT` button (disabled until all requirements met); preflight checklist showing what's still needed

---

#### 22.7.7 Activities

Ongoing daily task management.

**Layout: Left List (40%) + Right Detail (60%)**

Left: all available activities with cost per participant, assigned agent count, one-line effect description.

Right: activity name | full effect description | cost summary | research requirements | agent assignment panel | active participants list with daily output contribution | `+ ADD AGENT` / `— REMOVE` controls.

---

#### 22.7.8 Events

Historical log of all events and After Action Reports. This is the player's record of everything that has happened in the playthrough.

**Layout: Single Column with Filters**

**Filter bar:**

- Text search
- Filter by category: `ALL` / `EMPIRE INTERNAL` / `WORLD RESPONSE` / `CPU ACTIONS` / `RESEARCH` / `TIER 4` / `AFTER ACTION REPORTS`
- Filter by day range
- Show unread only toggle

**Event log:**
Entries listed in reverse chronological order. Each entry:

- Day number and date
- Event type label (same labels as Event Resolution screen)
- Event title
- First line of event text
- Unread indicator
- `READ` button — opens the full event text in a modal using the same Event Resolution layout (minus player options, since the event is historical)

**After Action Reports sub-tab:**
All AARs from combat and completed plots, filterable by outcome (`SUCCESS` / `PARTIAL` / `FAILURE` / `CRITICAL FAILURE`). Each AAR opens in full AAR layout (see Section 22.9).

Events in the log that were Landmark events display with a subtle visual distinction — slightly more prominent entry styling — to help the player locate significant moments in their playthrough history.

---

### 22.8 Overlay & Modal Patterns

#### Confirmation Modal

Used for destructive or irreversible actions (TERMINATE, Demolish, Abandon Research):

```
┌──────────────────────────────────────┐
│  CONFIRM ACTION                      │
│                                      │
│  [Action description]                │
│  This cannot be undone.              │
│                                      │
│  [MECHANICAL CONSEQUENCE SUMMARY]    │
│                                      │
│  [ CANCEL ]          [ CONFIRM ]     │
└──────────────────────────────────────┘
```

TERMINATE-specific copy: `You are about to TERMINATE [Agent Name]. This is permanent.`

TERMINATE confirm button uses `--accent-red` background. Cannot be submitted by pressing Enter (accidental keypresses should not kill agents).

#### Agent Picker Modal

Used when selecting agents for plots, activities, squad assignment, Inner Circle.

- Filter by: Skill | Department | Location | Availability
- Sort by: Relevant Skill | Name | Loyalty
- Each row: Name | Key Skills | Location | Availability | Current Assignment
- Multi-select supported where applicable

#### Zone Selector

Used for plots targeting a zone. Inline dropdown within Plot Detail panel, not a modal. Shows zone name, nation, controlling org, empire intel level. Low-intel zones show: `Intel level LOW — accuracy of operations in this zone is reduced`.

#### Tooltip System

Hover with 300ms delay. Dismissable with Escape.

_Short tooltip:_ Single line. Icon labels, tag explanations, truncated text.

_Rich tooltip:_ Multi-line panel. Skill names (description + attribute cap), building types (output + requirements), EVIL tier indicators (current score, next threshold), research nodes (requirements and unlocks).

---

### 22.9 The After Action Report

One of the signature interface moments in EoE. Presents combat and plot outcomes as an official internal document.

**Layout: Full Content Area Replacement**

```
┌─────────────────────────────────────────────────────────────┐
│  INTERNAL DOCUMENT — AFTER ACTION REPORT                    │
│  Classification: EYES ONLY                                  │
│  Subject: [OPERATION NAME]                                  │
│  Date: DAY 47 — 14 MARCH, YEAR 1                           │
│  Status: [OUTCOME TAG]                                      │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  EXECUTIVE SUMMARY                                          │
│  [2-3 sentence dry summary]                                 │
│                                                             │
│  OPERATIONAL LOG                                            │
│  [Sequence of significant moments, named characters,        │
│   passive institutional voice]                              │
│                                                             │
│  PERSONNEL REPORT                                           │
│  Name | Role | Status | Notes                              │
│                                                             │
│  RESOURCE EFFECTS                                           │
│  + Zone captured: [name]                                    │
│  - Agent lost: [name]                                       │
│  + $X acquired                                              │
│  + EVIL: +4                                                 │
│                                                             │
│  ─────────────────────────────────────────────────────────  │
│                                                             │
│  [ CLOSE REPORT ]              [ VIEW PERSONNEL RECORDS ]   │
└─────────────────────────────────────────────────────────────┘
```

**Outcome Tag Styling:**

| Outcome         | Tag                | Color                            |
| --------------- | ------------------ | -------------------------------- |
| Full success    | `SUCCESS`          | `--color-positive`               |
| Partial success | `PARTIAL`          | `--color-warning`                |
| Failure         | `FAILURE`          | `--color-negative`               |
| Catastrophic    | `CRITICAL FAILURE` | `--accent-red` with subtle pulse |

**Tone Modulation:**
Cartoonish operations (Pigeon Missile Barrage, Hypno Disco Ball, pet actions): operational log adopts a slightly more dramatic register while maintaining the institutional memo format. The contrast between format and content carries the joke.

Serious operations or real-evil consequences: flat, terse, clinical. The absence of drama is the tone.

AARs are stored and accessible from the Events screen at any time after they fire.

---

### 22.10 Character Profile Panel

Right-side slide-in panel. 480px wide. Used throughout the interface — Personnel, Intel zone citizens, plot target selection, event resolution named characters.

Does not replace underlying screen. Escape or clicking outside closes it.

**Panel Content:**

_Header:_ Full name | Agent or Citizen tag | Department tag (if agent) | Current location | Quick actions: `[RECRUIT]` (citizen) / `[REASSIGN]` `[MOVE]` `[TERMINATE]` (agent)

_Attributes:_ Two-column layout of all attributes. Each: name label (small, muted) | value (mono) | small bar showing relative value against population average.

_Skills:_ Organized by skill category. Each skill: name | level (0–100) | progress bar | attribute cap indicator (`CAP: 72`).

_Loyalties:_ All known org loyalties. Each row: org name | loyalty bar | loyalty value. Empire loyalty highlighted with subtle background.

_Status Effects:_ Tag list of all active effects. Each tag clickable for full effect description tooltip.

_History (agents only):_ Compact log of significant events — plots participated in, missions failed, skills gained, injuries. Last 10 events, expandable.

_Intel Level Banner (citizens viewed via Intel):_ `LOW CONFIDENCE — Attribute values are estimates. Actual values may differ significantly.` Fields below confidence threshold show as ranges (`32–58`) or `[UNKNOWN]`.

---

### 22.11 The World Map

#### Rendering

2D tile-based rendering of the procedurally generated world. Implemented as an HTML Canvas element or WebGL layer. Must handle performance gracefully at intended world scale (hundreds of zones, thousands of tiles).

#### Visual Style

Deliberately flat and abstract — closer to a schematic than a realistic geography render.

- City tiles: slightly warm mid-dark
- Wilderness: muted mid-green gray
- Ocean: deep blue-gray, slightly desaturated
- Mountain: cool gray, slightly lighter than wilderness
- **Uninhabitable zones** (rendered by zombie plague or other catastrophic effects): desaturated, noticeably darker than surrounding tiles; a distinct visual state clearly communicating permanent loss
- Zone borders: thin lines (1–2px at default zoom)
- Zone fill colors change based on active map layer
- Empire-controlled zones: subtle pulsing border highlight (very slow, 3s cycle)

#### Map Layers

`POLITICAL` — zones colored by controlling org
`LOYALTY` — zones colored by average loyalty to empire (green → red gradient)
`INTEL LEVEL` — zones colored by empire intel level (dark → bright)
`MILITARY` — zones colored by troop presence (empire = blue, hostile = red)

#### Interaction

- **Click zone:** Selects zone, populates Intel panel
- **Hover zone:** Tooltip: Zone name | Controlling org | Population | Intel level
- **Right-click zone:** Quick-action context menu: `View Details` / `Target for Plot` / `Begin Reconnaissance`
- **Zoom:** Mouse wheel; range from overview (all zones visible) to close-up (individual tiles visible)
- **Pan:** Click and drag

#### Map Overlays

Agent location indicators:

- Empire agents: small colored dots on their current tile
- Known foreign agents: different color (if intel sufficient)
- Dots cluster at count badges when multiple agents on same tile at current zoom

Zone status icons (appear at medium zoom):

- Outbreak: biohazard icon
- Zombie Plague: more alarming variant of biohazard icon; affected tiles show the uninhabitable visual state as plague progresses
- Rebellion/Unrest: agitation icon
- Active combat: crossed swords icon
- Grand Coalition forces: distinct icon when Coalition military operations are active in a zone

---

### 22.12 Notification & Feed System

#### The Notification Drawer

Opens by clicking notification icon in topbar. Slides in from right as 360px wide overlay. Does not block main content interaction.

Structure: `COMMUNICATIONS LOG` header + unread count + `MARK ALL READ` | Filter tabs: `ALL` / `INTEL` / `EMPIRE` / `NEWS` | Feed entries (scrollable) | `OPEN FULL LOG →` at footer (opens Events screen).

#### Feed Entry Format

```
DAY 47  [TYPE INDICATOR]
Entry title or first line (bold, --text-primary)
Brief detail (--text-secondary, truncated at 2 lines)
[READ MORE →] if entry has full content
```

Type indicator left border (2px): Red (empire internal/critical) | Blue (intelligence report) | Amber (intercepted communication) | Gray (news feed)

`READ MORE →` opens full event text in a modal or navigates to Event Resolution screen if the event is still actionable.

#### Toast Notifications

Brief non-modal notifications for immediate feedback. Bottom-right. Auto-dismiss after 4 seconds. Can be dismissed manually.

Styles: green left border (success) | amber (warning) | red (error/critical) | gray (neutral)

---

### 22.13 First Run & New Player Experience

#### World Generation Screen

**Step 1 — World Configuration**

- Number of nations (slider: 3–10, default 5)
- Zone density (`SPARSE` → `DENSE`)
- Starting population (`SMALL` → `LARGE`)
- World size (`COMPACT` → `VAST`)
- Save mode: `STANDARD` / `IRONMAN` / `PERMADEATH` (with descriptions)
- New Player Mode toggle (on by default)

**Step 2 — Overlord Creation**

- Overlord name (text input)
- Attribute point allocation (pool distributed across starting attributes; each shown with description)
- Pet selection (image + name + flavor description for each option)

**Step 3 — Starting Zone**
World generation runs (loading state). Player shown generated map with 3–5 recommended starting zones highlighted. Each described briefly: terrain, nation, wealth level, population. Player selects one.

**Step 4 — Empire Naming**
Name the empire and its governing organization. Suggested names offered (procedurally generated from dark-corporate patterns).

**Loading → Game Start**
Interface fades in on Empire overview. First event fires immediately: minimal "Empire Established" notification. If New Player Mode is on, first contextual tooltip appears within 2 seconds.

#### New Player Mode

When active:

- Contextual tooltip panels appear near relevant UI elements during first system encounters
- Tooltips are dismissable and do not block interaction
- `?` icon in topbar opens searchable help system
- CPU org aggression reduced for first 14 days
- First 3 events are tutorial events introducing core mechanics organically
- Can be toggled off at any time via Settings

---

### 22.14 Victory & Defeat Screens

#### Defeat Screen

Full viewport replacement. Near pure black background.

```
   EMPIRE OF EVIL

   OPERATIONS TERMINATED

   ─────────────────────────────────────────────────────

   [Defeat condition in dry institutional voice]

   The empire controlled [X] zones across [Y] nations at
   the time of dissolution. [Z] agents were active.
   [Overlord name] is no longer a going concern.

   ─────────────────────────────────────────────────────

   [STATISTICS BLOCK]

   [ BEGIN NEW RUN ]                    [ MAIN MENU ]
```

#### Victory Screen

Same layout. Copy is drier and more understated — the empire has won and the dashboard is acknowledging it in the same voice it uses for everything else.

```
   EMPIRE STATUS: OBJECTIVE ACHIEVED

   [Victory condition in institutional voice]

   [LEGACY CHARACTERIZATION]

   [STATISTICS BLOCK]

   [ BEGIN NEW RUN ]                    [ MAIN MENU ]
```

#### Statistics Block

Present on both screens.

| Statistic                      | Value           |
| ------------------------------ | --------------- |
| Total days elapsed             |                 |
| Zones controlled at peak       |                 |
| Zones controlled at end        |                 |
| Total agents recruited         |                 |
| Agents lost (all causes)       |                 |
| Inner Circle members lost      |                 |
| Plots executed                 |                 |
| Plot success rate              |                 |
| Hero orgs encountered          |                 |
| Hero orgs disbanded            |                 |
| Citizens converted (cultural)  |                 |
| EVIL peak                      |                 |
| Times payroll was missed       |                 |
| Tier 4 plots deployed          |                 |
| Grand Coalition formed         | Yes / No        |
| Zombie plague zones at peak    | (if applicable) |
| Soylent Green program duration | (if applicable) |

#### Legacy Characterization

Brief generated characterization of the Overlord's approach based on play statistics:

- _Heavy military / low propaganda:_ "The empire rose through force. Citizens complied. Most of them."
- _High propaganda / low combat:_ "The empire did not conquer minds so much as politely occupy them. The occupation was largely welcomed."
- _Tier 4 heavy:_ "At its peak, the empire controlled the sunlight. The water. The discourse. For a time, it controlled everything."
- _Short run / early defeat:_ "The empire lasted [X] days. It was noticed."
- _Ironman run:_ "No saves were loaded. Every decision stood."
- _Soylent Green exposed:_ "The empire's most efficient program was ultimately its most costly. The world did not forget what it learned."
- _Zombie plague triggered:_ "The empire's ambitions exceeded its containment protocols. Some zones remain uninhabitable."

---

### 22.15 Data States

#### Loading State

Skeleton animation — placeholder rows with slow pulse animation. Skeleton rows match expected row height and column structure. Never use spinners in main content area (spinners only acceptable in button loading states).

#### Empty States

Every panel and table that can be empty must have a designed empty state:

- Short label: `No active plots.`
- Secondary line: `Select a plot from the Plots screen to begin operations.`
- Optional shortcut link to relevant action

Empty states use plain text, centered in the panel. No illustrations or decorative icons.

#### Error States

Data fetch failures show: red left border on affected panel | `Failed to load [data type]. Retry?` | `RETRY` button.

#### Stale Data Warning

If viewing a zone or agent record that may have changed since last loaded: `Data last updated DAY 43. Advance time or run Reconnaissance to refresh.`

---

### 22.16 Accessibility & Keyboard Shortcuts

All interactive elements are keyboard-focusable in logical tab order. Modal dialogs trap focus within themselves. Event resolution screens announced to screen readers via ARIA live regions.

| Shortcut              | Action                                                                       |
| --------------------- | ---------------------------------------------------------------------------- |
| `G` then `E`          | Navigate to Empire                                                           |
| `G` then `I`          | Navigate to Intel                                                            |
| `G` then `P`          | Navigate to Personnel                                                        |
| `G` then `$`          | Navigate to Economy                                                          |
| `G` then `S`          | Navigate to Science                                                          |
| `G` then `L`          | Navigate to Plots                                                            |
| `G` then `A`          | Navigate to Activities                                                       |
| `G` then `V`          | Navigate to Events                                                           |
| `Space`               | Pause / Resume time advance (when advancing)                                 |
| `N`                   | Open notification drawer                                                     |
| `Escape`              | Close modal / panel / drawer                                                 |
| `?`                   | Open help                                                                    |
| `1` / `2` / `3` / `4` | Switch map layer (Intel screen)                                              |
| `Ctrl+Z`              | Undo last assignment (30-second window; not available in Ironman/Permadeath) |

Shortcuts are disabled when a text input is focused.

---

### 22.17 Tone Escalation Rules

The interface is not static. As EVIL tier increases, the UI responds. Changes are subtle — the interface never breaks from its corporate aesthetic, but becomes progressively more oppressive and strange.

**NUISANCE (0–19) — Baseline**
Interface as described throughout. Clean, professional, dry.

**IRRITANT (20–39) — No visual change**
Content changes (new events, new world response) but interface itself does not. Escalation is in what's happening, not in how it looks.

**THREAT (40–59) — Subtle compression**

- Sidebar EVIL widget border changes from `--border-default` to tier color
- Event feed entries from hostile orgs appear more frequently
- Empire name in topbar gains very small, almost invisible red tint (5% opacity background)

**MENACE (60–79) — The tone shifts**

- Topbar bottom border transitions slowly to `--accent-red-muted` over several in-game days
- `HERO ORG ACTIVITY` widget shows specific org names instead of generic threat level
- Notification badge in topbar gains pulse animation when unread items present
- Intercepted communication feed entries become more frequent and more alarmed in tone

**SUPERVILLAIN (80–94) — Corporate facade cracks slightly**

- New persistent sidebar widget: `ACTIVE THREATS` — listing hero orgs, Adjudicators, resistance movements with current known activity
- Progress bar below topbar develops subtle idle animation — very slow, low-opacity pulse — as if system is under constant pressure
- EVIL score in topbar pulses softly at tier color constantly rather than being static

**APOCALYPTIC (95–100) — Maximum oppression**

- Background color shifts 3–4% darker and more blue. Barely perceptible but registers subconsciously.
- `--text-secondary` becomes slightly less bright — secondary information layer feels more muted
- New static banner below topbar: `STATUS: MAXIMUM ALERT — ALL HOSTILE ORGANIZATIONS ACTIVE` in `--text-xs`, `--accent-red-muted` background, full width. Does not animate. Simply exists.
- Simulation speed control remains functional — player is not mechanically penalized. But it feels different.

**The Mirror Principle:** Every tone escalation must feel like something that was already there becoming more of what it is. The interface should never feel like it's "turning into a villain lair." It should feel like the corporate dashboard of an organization under genuine existential pressure — which, at Apocalyptic tier, it is. The player created this situation. The interface is accurately reflecting it.

---

## 23. Effects Reference

### Governing Organization Effects

| Effect ID                   | Name                           | Description                                                              |
| --------------------------- | ------------------------------ | ------------------------------------------------------------------------ |
| `no-prisoners`              | No Prisoners                   | The org takes no prisoners                                               |
| `encryption-protocols`      | Encryption Protocols           | Hardened communications; difficult to crack; catastrophic if key is lost |
| `centralized-telecom`       | Centralized Telecommunications | The org taps its citizens' communications                                |
| `hyperrefractive-materials` | Hyperrefractive Materials      | Enables Hypno Disco Ball plot                                            |
| `counterfeiter`             | Counterfeiter                  | Enables Funny Money Printing Press plot                                  |
| `missile-pigeons`           | Missile Pigeons                | The empire can deploy pigeon-guided missiles                             |
| `pigeon-missiles`           | Pigeon Missiles                | The empire can deploy missile-guided pigeons                             |

_(These are distinct. Both are available. This is intentional.)_

### Person Effects

| Effect ID             | Name                | Resist                   | Description                                                                                                                                                                                                                                                                                                         |
| --------------------- | ------------------- | ------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `conspiracy-theories` | Conspiracy Theories | Intelligence check       | Makes person more paranoid of one GO; potentially more loyal to another. Daily chance to spread to one other person in zone. Effect lasts until successful resist.                                                                                                                                                  |
| `sick`                | Sick                | Constitution check       | Health decreases daily. May spread in zones with active Outbreak.                                                                                                                                                                                                                                                   |
| `injured`             | Injured             | —                        | Reduced combat effectiveness. Heals over time or in hospital.                                                                                                                                                                                                                                                       |
| `inspired`            | Inspired            | —                        | Temporary loyalty and productivity boost.                                                                                                                                                                                                                                                                           |
| `radicalized`         | Radicalized         | —                        | High hostility to a specific GO; increased hostile action probability.                                                                                                                                                                                                                                              |
| `party-animal`        | Party Animal        | Intelligence check (low) | Applied by Hypno Disco Ball. Increased socializing and social simulation actions; reduced productivity; reduced intelligence; elevated morale and loyalty to empire. Daily chance to spread to one other citizen via social contact. Fades after 30 days; partial permanent effects remain (loyalty, intelligence). |

### Zone Effects

| Effect ID       | Name          | Description                                                                                                                                                                                                                                                               |
| --------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `outbreak`      | Outbreak      | Disease present in zone. Infects people daily. May spread to adjacent zones.                                                                                                                                                                                              |
| `zombie-plague` | Zombie Plague | Produced by catastrophic Supersoldier Program failure. Far more lethal than standard Outbreak. Renders zones uninhabitable if unchecked. Spreads zone by zone. Can be slowed by quarantine or military containment; cured only by Zombie Plague Cure research completion. |

---

## 24. Post-MVP Features

The following features are planned for post-MVP development. They are described here for planning context and to ensure MVP architecture does not preclude them.

---

### 24.1 Multiplayer

**Format:** All players act on the same shared persistent world with a unified time scale. Players have a limited number of actions (plots, major decisions) they can take per real-world time period. Plots take the in-game time they would take — a week-long operation takes a week of real time to resolve.

A notification system informs players when:

- Their zones are being attacked.
- A queued plot requires attention.
- A significant world event affects them.

**PvP:** Direct zone conflict between human players is supported. Players can attack each other's zones via the same Takeover Zone plot used against CPU orgs.

**Victory:** Multiplayer victory conditions shift toward more nuanced goals — score-based thresholds, faction alliance victory conditions, or first-to-X-percent world control. Exact conditions are TBD for multiplayer design phase.

---

### 24.2 Exile Mechanic

If the Overlord survives the loss of the empire's last zone, the game does not immediately end. Instead, the Overlord and any surviving Inner Circle members enter an exile state:

- The empire has no zones and no income.
- The Overlord and surviving agents can still move, plot, and recruit.
- A comeback requires retaking at least one zone within a defined time window, or the game ends in defeat.

The exile mechanic rewards players who have invested in their Overlord and Inner Circle as individuals rather than just resource nodes.

---

### 24.3 Black Market Economy

A parallel economic layer representing underground commerce, smuggling networks, and criminal enterprises. The empire can:

- Invest in black market infrastructure within zones.
- Use black market channels to bypass standard economic penalties (e.g., fund operations when above the infrastructure cap).
- Be threatened by rival black market operators who are not affiliated with any standard GO.

The black market operates at higher margin but higher risk — exposure can trigger world response events and significant loyalty damage.

---

### 24.4 Additional Victory Conditions

- **Ideological Victory** — Convert a sufficient number of orgs to puppet status through political manipulation.
- **Economic Victory** — Achieve a threshold share of world GDP and trigger economic capitulation.
- **Reputation Victory** — Achieve maximum positive opinion from every surviving org (a near-pacifist run).

---

_End of Document_

_Empire of EVIL GDD v0.2 — For internal reference and developer onboarding._
_This document is a living design reference. Sections marked for development may be refined during implementation._
