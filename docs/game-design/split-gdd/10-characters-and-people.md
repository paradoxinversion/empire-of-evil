# 10. Characters & People

## 10.1 Every Person is an Individual

Every person in the game world — citizen or agent — is a fully simulated individual entity. There are no demographic abstractions. Each person has a unique set of attributes, skills, loyalties, status effects, and behavioral tendencies.

## 10.2 Core Attributes

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

## 10.3 Skills

Skills are separate from attributes and represent learned capabilities. Skills have a ceiling determined by the character's relevant attribute — a low-Intelligence character cannot become a master scientist regardless of training time.

Skills improve through:

- The Training activity.
- Repeated execution of relevant actions during simulation.
- Certain events.

### Combat

| Skill          | Attribute Cap | Passive Effect                                                                                                   |
| -------------- | ------------- | ---------------------------------------------------------------------------------------------------------------- |
| Firearms       | Combat        | Increases ranged damage output in combat                                                                         |
| Melee          | Combat        | Increases close-quarters damage output                                                                           |
| Tactics        | Leadership    | Improves squad combat effectiveness as a function of the character's Leadership attribute                        |
| Evasion        | Agility       | Improves chance of avoiding damage in combat                                                                     |
| Field Medicine | Intelligence  | Reduces health loss from injuries sustained in combat; allows basic in-field injury treatment without a hospital |

### Science & Research

| Skill       | Attribute Cap | Passive Effect                                                                                                                                                          |
| ----------- | ------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Biology     | Intelligence  | Improves science output in labs; gates biology-adjacent research branches                                                                                               |
| Engineering | Intelligence  | Improves construction speed; gates hardware and materials research branches                                                                                             |
| Computing   | Intelligence  | Improves intel accuracy on surveilled citizens and zones; improves science output for computing-adjacent research; improves detection of foreign agents in empire zones |

### Administration

| Skill     | Attribute Cap  | Passive Effect                                                        |
| --------- | -------------- | --------------------------------------------------------------------- |
| Logistics | Administration | Improves infrastructure output; reduces upkeep costs per managed zone |
| Finance   | Administration | Improves building income; reduces salary overhead                     |

### Medicine

| Skill     | Attribute Cap | Passive Effect                                                                                                              |
| --------- | ------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Medicine  | Intelligence  | Improves healing rate of patients in hospitals; reduces health loss from injuries and sickness in the character's zone      |
| First Aid | Intelligence  | Allows basic stabilization of injured characters outside of a hospital; reduces chance of injury worsening before treatment |

### Intelligence & Espionage

| Skill               | Attribute Cap | Passive Effect                                                                                                       |
| ------------------- | ------------- | -------------------------------------------------------------------------------------------------------------------- |
| Surveillance        | Intelligence  | Improves intel gain rate on citizens and zones                                                                       |
| Infiltration        | Agility       | Improves plot success chance and reduces detection risk when operating in foreign zones                              |
| Counterintelligence | Intelligence  | Reduces chance of empire agents being detected or captured in empire zones                                           |
| Forgery             | Intelligence  | Improves effectiveness of false flag operations and identity-based plots; gates Advanced Forgeries research benefits |

### Social

| Skill        | Attribute Cap | Passive Effect                                                                         |
| ------------ | ------------- | -------------------------------------------------------------------------------------- |
| Persuasion   | Empathy       | Improves loyalty gain from recruitment attempts and social activities                  |
| Intimidation | Combat        | Improves loyalty retention through fear; increases effectiveness of threat-based plots |
| Oratory      | Empathy       | Improves loyalty effects from speeches, propaganda plots, and EVIL Oratory activity    |
| Deception    | Intelligence  | Improves success chance of manipulation-based plots and misdirection                   |

### Command

| Skill      | Attribute Cap | Passive Effect                                                                                                 |
| ---------- | ------------- | -------------------------------------------------------------------------------------------------------------- |
| Delegation | Leadership    | Improves effectiveness of standing squad orders; reduces loyalty decay in squads under the character's command |
| Training   | Leadership    | Improves the rate at which agents under the character's command gain skills                                    |

### Criminal

| Skill      | Attribute Cap | Passive Effect                                                                                                                  |
| ---------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------- |
| Smuggling  | Agility       | Improves resource gain and reduces capture risk when running smuggling operations                                               |
| Larceny    | Agility       | Improves success chance of theft and break-in operations; useful for plots involving stealing resources or intel from buildings |
| Streetwise | Intelligence  | Improves black market access and resource rates; improves chance of finding and recruiting criminal-type citizens               |

## 10.4 Loyalties

Each person has a loyalty map: a key-value store where keys are Governing Organization IDs and values are 0–100.

- **100** — Total loyalty. Will act in the org's interests even at personal cost.
- **50** — Neutral. Follows orders but won't go out of their way.
- **25** — Disgruntled. May refuse assignments; risk of hostile action.
- **0** — Active resistance. Hostile to the org.

A person can have loyalty values to multiple organizations simultaneously. A citizen might be moderately loyal to their home nation's GO and also have growing loyalty to the empire due to propaganda.

## 10.5 Intel Level

The empire's knowledge about a specific person is tracked as an `intel_level` value (0–100). Low intel level means reports on that person are inaccurate or absent. High intel level means the empire has detailed, reliable information about their attributes, location, and loyalties.

Intel level is raised through the Survey Citizens activity, Reconnaissance plots, and certain science research effects.

## 10.6 Status Effects

People can carry status effects that modify their behavior and attributes. Key effects include:

- **Conspiracy Theories** — Reduces intelligence (resist check); may spread to adjacent citizens daily.
- **Sick** — Reduces health each day; may spread in zones with an active Outbreak.
- **Injured** — Reduced combat effectiveness; heals over time or in a hospital.
- **Inspired** — Temporary loyalty and productivity boost.
- **Radicalized** — High hostility to a specific GO; more likely to take hostile actions.
