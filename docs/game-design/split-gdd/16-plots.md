# 16. Plots

Plots are deliberate operations the empire executes to achieve strategic goals. Unlike activities (which are passive and ongoing), plots are goal-directed, resource-bounded, and have defined success and failure states.

## 16.1 Plot Resolution

All plots have:

- **Requirements** — Agents, zones, resources, and research needed.
- **Execution time** — Number of days to complete (including agent travel time to target zone).
- **Success condition** — What needs to happen for the plot to succeed.
- **Results** — Defined outcomes for success, failure, and any result.
- **Failure severity scaling** — Failure consequences are harsher the higher the empire's EVIL rating. High-EVIL empires are watched more closely; failed plots attract more attention.

## 16.2 Plot Capacity

The number of simultaneous active plots is limited by available agents who meet each plot's requirements. There is no arbitrary plot queue cap — the bottleneck is agent availability, required research, and resource sufficiency.

## 16.3 Plot Complexity Tiers

Plots are designed across four complexity tiers to ensure variety. At any point in the game the player should have plots available from multiple tiers running simultaneously.

| Tier                     | Shape                                                                   | Player Involvement      |
| ------------------------ | ----------------------------------------------------------------------- | ----------------------- |
| 1 — Fire and Forget      | Assign agents, plot runs to completion                                  | None after assignment   |
| 2 — Branching Resolution | Plot triggers a choice event mid-execution or at resolution             | One meaningful decision |
| 3 — Multi-Stage          | Distinct phases, each requiring agent assignment or resource commitment | Ongoing management      |
| 4 — World-Altering       | Empire-wide or world-wide consequences; long execution; heavy cost      | High; often multi-stage |

## 16.4 Plot List

---

### Economic Disruption

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

### Political Manipulation

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

### Military Operations

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

### Espionage & Intelligence

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

### Social Engineering & Propaganda

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

### Criminal

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

### Defensive

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

### Tier 4 — World-Altering Operations

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
