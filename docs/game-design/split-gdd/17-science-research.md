# 17. Science & Research

## 17.1 The Research Tree

Science projects are organized into a freeform web of interconnected clusters. Projects belong to thematic branches, but branches cross-connect throughout — some of the most powerful unlocks require prior investment in two or more branches. There are no labeled eras or tiers; the tree flows freely, rewarding exploration.

**Early game** research rewards breadth — small investments across multiple branches unlock cross-branch nodes faster and give the player a feel for their preferred playstyle. **Late game** research rewards depth — the most powerful and world-altering projects require sustained investment in specific branches. Players who have spread too thin will find themselves unable to reach the endgame nodes that define a dominant strategy.

Dead-end paths exist and are intentional. Some research chains lead to goofy, niche, or situationally powerful outcomes that won't suit every playstyle — but will delight players who seek them out.

## 17.2 Science Project Structure

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

## 17.3 Research Branches & Projects

The following describes each branch, its projects, their dependencies, and what they unlock. Cross-branch dependencies are noted explicitly.

---

### Surveillance & Control

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

### Military & Hardware

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

### Materials & Engineering

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

### Biology & Medicine

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

### Social & Propaganda

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

### Economic Disruption

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

### Security & Defense

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
