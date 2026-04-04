# 19. Events

## 19.1 Event System Overview

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

## 19.2 Information Surfacing Tiers

Beyond the presentation tier, events are categorized by how they reach the player:

- **News Feed** — Public information. Surfaces automatically regardless of intel level. Wire-service tone.
- **Intelligence Report** — Discovered through active surveillance. Quality and accuracy scales with empire intel investment.
- **Intercepted Communication** — Richest tier. Personal, specific, sometimes alarming. Requires Surveillance Tap or Centralized Telecommunications active in relevant zone.

## 19.3 Flavor Note — TERMINATE

Within the empire's internal documentation, communications, and event writing, the act of the empire executing a person is referred to as **TERMINATE** (all caps). This is consistent corporate euphemism. It applies to player-directed executions of agents, citizens, captives, and named targets. External organizations do not use this terminology.

---

## 19.4 Foundational Events

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

## 19.5 Empire Internal Events

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

## 19.6 World Response Events

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

## 19.7 CPU Org Action Events

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

## 19.8 Research & Science Events

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

## 19.9 Tier 4 Consequence Events

---

### Blot Out the Sun

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

### Control the World's Water Supply

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

### Hypno Disco Ball

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

### Global Financial Crash

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

### The Grand Coalition

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
