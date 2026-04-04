# 22. The Interface

## 22.1 Design Philosophy & Aesthetic

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

## 22.2 Design System

### Color Palette

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

### Typography

Two typefaces. No exceptions.

**Display / Headers: IBM Plex Mono** — screen titles, metric values, EVIL tier labels, empire name, stat blocks, research project names, plot names. Monospace conveys data precision and mild bureaucratic menace.

**Body / UI: IBM Plex Sans** — all descriptive prose, event text, labels, navigation, table content, tooltips.

### Spacing

8px base unit. All spacing values are multiples of 4px (`--space-1: 4px` through `--space-16: 64px`).

### Motion

Transitions are fast and purposeful. No decorative animation. Fast: 100ms (hover). Base: 160ms (state transitions). Slow: 240ms (modal enter/exit). XSlow: 400ms (landmark event presentation).

### Iconography

Lucide icons exclusively. Used functionally, not decoratively. 14px in tables/labels, 16px in buttons, 20px in sidebar navigation.

### Key Components

- **`<DataTable>`** — Sortable columns, selectable rows, optional row actions. Used on Personnel, Plots, Economy, Activities.
- **`<StatWidget>`** — Labeled metric with value, trend, optional drill-down. Used in Empire overview.
- **`<Panel>`** — Surface container with optional header and border. Primary layout primitive.
- **`<Tag>`** — Small semantic label. Used for status effects, EVIL tiers, job types, terrain types.
- **`<FeedEntry>`** — Single entry in notification/event feed. Supports different entry types.
- **`<CharacterProfile>`** — Slide-in panel for full character stat blocks.
- **`<ProgressBar>`** — Research progress, plot progress, health bars.
- **`<ActionButton>`** — Primary action button. Has a destructive variant (TERMINATE, Demolish) with accent-red styling.

---

## 22.3 Layout Architecture

### Application Shell

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

### Topbar (48px)

Fixed. Always visible.

- **Left:** Empire name (IBM Plex Mono, secondary color). Clicking opens Overlord profile.
- **Center:** Current in-game date. Format: `DAY 47 — 14 MARCH, YEAR 1`. Updates in real time while simulation runs.
- **Right cluster:** Unread event count badge → EVIL tier pill (hovering reveals actual and perceived EVIL scores) → Current money with cash flow indicator → Simulation speed / advance control

### Sidebar (220px)

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

### Content Area

Fills all remaining space. Minimum viewport: 1280×800px. Mobile is explicitly out of scope for MVP.

Internal layout patterns:

- **Single column** — Event resolution, After Action Report, landmark events
- **Left main + right panel** — Intel, Personnel, Plots
- **Dashboard grid** — Empire overview only
- **Full-bleed panel** — Science research tree

Sidebar and topbar never scroll. Content area scrolls vertically.

---

## 22.4 Navigation & Routing

### Sidebar Navigation

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

### Time Advance Control

Lives in the **topbar right cluster**, not the sidebar. Always visible and accessible from any screen.

Advance dropdown options: `1 DAY` / `7 DAYS` / `TO DATE...` / `TO NEXT EVENT`

While simulation is running: ADVANCE button changes to PAUSE; speed selector appears (`1×` / `5×` / `10×` / `MAX`); date display increments visibly; a 2px progress bar appears below the topbar.

---

## 22.5 The Time Advance Flow

Time advance is the core game loop action. The simulation runs day by day. Events interrupt. The player resolves them. The simulation resumes.

### Interruption Behavior

When an interrupting event fires:

1. Simulation pauses immediately
2. Progress bar freezes
3. Event notification appears in topbar
4. Combat or Landmark events: Event Resolution screen opens automatically
5. Less urgent events: non-blocking notification appears in feed; player chooses when to resolve
6. Simulation does not resume until all blocking events are resolved

**Always-blocking events (full auto-interrupt):** Combat encounters, events that kill or injure named characters, events requiring mandatory player choice, EVIL tier threshold crossings, Landmark events.

**Non-blocking (feed notifications):** Skippable notifications, Intelligence Reports, News Feed items.

### Post-Advance Summary

When an advance period completes without interruption, a brief toast notification summarizes: `7 DAYS ELAPSED — 3 EVENTS — $42,400 NET INCOME`. Clicking the toast opens the event log filtered to the elapsed period.

---

## 22.6 The Event System UX

### Event Priority Tiers

**1. Blocking Events (Full Screen)**
Event Resolution screen replaces current view. Simulation cannot resume until resolved. Used for: Combat, Landmark events, mandatory choices, EVIL tier crossings.

**2. Interrupting Notifications (Modal)**
Modal overlay over current screen. Simulation pauses. Player must acknowledge before resuming. Used for: Named character death/injury, zone captured/lost, major plot outcomes.

**3. Feed Notifications (Non-blocking)**
Entries appear in notification feed. Simulation continues. Reviewed at leisure. Used for: News feed items, Intelligence Reports, minor events, research completions.

### The Notification Feed

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

### Event Resolution Screen Layout

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

## 22.7 Screen Specifications

### 22.7.1 Empire (Main Overview)

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

### 22.7.2 Intel

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

### 22.7.3 Personnel

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

### 22.7.4 Economy

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

### 22.7.5 Science

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

### 22.7.6 Plots

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

### 22.7.7 Activities

Ongoing daily task management.

**Layout: Left List (40%) + Right Detail (60%)**

Left: all available activities with cost per participant, assigned agent count, one-line effect description.

Right: activity name | full effect description | cost summary | research requirements | agent assignment panel | active participants list with daily output contribution | `+ ADD AGENT` / `— REMOVE` controls.

---

### 22.7.8 Events

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

## 22.8 Overlay & Modal Patterns

### Confirmation Modal

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

### Agent Picker Modal

Used when selecting agents for plots, activities, squad assignment, Inner Circle.

- Filter by: Skill | Department | Location | Availability
- Sort by: Relevant Skill | Name | Loyalty
- Each row: Name | Key Skills | Location | Availability | Current Assignment
- Multi-select supported where applicable

### Zone Selector

Used for plots targeting a zone. Inline dropdown within Plot Detail panel, not a modal. Shows zone name, nation, controlling org, empire intel level. Low-intel zones show: `Intel level LOW — accuracy of operations in this zone is reduced`.

### Tooltip System

Hover with 300ms delay. Dismissable with Escape.

_Short tooltip:_ Single line. Icon labels, tag explanations, truncated text.

_Rich tooltip:_ Multi-line panel. Skill names (description + attribute cap), building types (output + requirements), EVIL tier indicators (current score, next threshold), research nodes (requirements and unlocks).

---

## 22.9 The After Action Report

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

## 22.10 Character Profile Panel

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

## 22.11 The World Map

### Rendering

2D tile-based rendering of the procedurally generated world. Implemented as an HTML Canvas element or WebGL layer. Must handle performance gracefully at intended world scale (hundreds of zones, thousands of tiles).

### Visual Style

Deliberately flat and abstract — closer to a schematic than a realistic geography render.

- City tiles: slightly warm mid-dark
- Wilderness: muted mid-green gray
- Ocean: deep blue-gray, slightly desaturated
- Mountain: cool gray, slightly lighter than wilderness
- **Uninhabitable zones** (rendered by zombie plague or other catastrophic effects): desaturated, noticeably darker than surrounding tiles; a distinct visual state clearly communicating permanent loss
- Zone borders: thin lines (1–2px at default zoom)
- Zone fill colors change based on active map layer
- Empire-controlled zones: subtle pulsing border highlight (very slow, 3s cycle)

### Map Layers

`POLITICAL` — zones colored by controlling org
`LOYALTY` — zones colored by average loyalty to empire (green → red gradient)
`INTEL LEVEL` — zones colored by empire intel level (dark → bright)
`MILITARY` — zones colored by troop presence (empire = blue, hostile = red)

### Interaction

- **Click zone:** Selects zone, populates Intel panel
- **Hover zone:** Tooltip: Zone name | Controlling org | Population | Intel level
- **Right-click zone:** Quick-action context menu: `View Details` / `Target for Plot` / `Begin Reconnaissance`
- **Zoom:** Mouse wheel; range from overview (all zones visible) to close-up (individual tiles visible)
- **Pan:** Click and drag

### Map Overlays

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

## 22.12 Notification & Feed System

### The Notification Drawer

Opens by clicking notification icon in topbar. Slides in from right as 360px wide overlay. Does not block main content interaction.

Structure: `COMMUNICATIONS LOG` header + unread count + `MARK ALL READ` | Filter tabs: `ALL` / `INTEL` / `EMPIRE` / `NEWS` | Feed entries (scrollable) | `OPEN FULL LOG →` at footer (opens Events screen).

### Feed Entry Format

```
DAY 47  [TYPE INDICATOR]
Entry title or first line (bold, --text-primary)
Brief detail (--text-secondary, truncated at 2 lines)
[READ MORE →] if entry has full content
```

Type indicator left border (2px): Red (empire internal/critical) | Blue (intelligence report) | Amber (intercepted communication) | Gray (news feed)

`READ MORE →` opens full event text in a modal or navigates to Event Resolution screen if the event is still actionable.

### Toast Notifications

Brief non-modal notifications for immediate feedback. Bottom-right. Auto-dismiss after 4 seconds. Can be dismissed manually.

Styles: green left border (success) | amber (warning) | red (error/critical) | gray (neutral)

---

## 22.13 First Run & New Player Experience

### World Generation Screen

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

### New Player Mode

When active:

- Contextual tooltip panels appear near relevant UI elements during first system encounters
- Tooltips are dismissable and do not block interaction
- `?` icon in topbar opens searchable help system
- CPU org aggression reduced for first 14 days
- First 3 events are tutorial events introducing core mechanics organically
- Can be toggled off at any time via Settings

---

## 22.14 Victory & Defeat Screens

### Defeat Screen

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

### Victory Screen

Same layout. Copy is drier and more understated — the empire has won and the dashboard is acknowledging it in the same voice it uses for everything else.

```
   EMPIRE STATUS: OBJECTIVE ACHIEVED

   [Victory condition in institutional voice]

   [LEGACY CHARACTERIZATION]

   [STATISTICS BLOCK]

   [ BEGIN NEW RUN ]                    [ MAIN MENU ]
```

### Statistics Block

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

### Legacy Characterization

Brief generated characterization of the Overlord's approach based on play statistics:

- _Heavy military / low propaganda:_ "The empire rose through force. Citizens complied. Most of them."
- _High propaganda / low combat:_ "The empire did not conquer minds so much as politely occupy them. The occupation was largely welcomed."
- _Tier 4 heavy:_ "At its peak, the empire controlled the sunlight. The water. The discourse. For a time, it controlled everything."
- _Short run / early defeat:_ "The empire lasted [X] days. It was noticed."
- _Ironman run:_ "No saves were loaded. Every decision stood."
- _Soylent Green exposed:_ "The empire's most efficient program was ultimately its most costly. The world did not forget what it learned."
- _Zombie plague triggered:_ "The empire's ambitions exceeded its containment protocols. Some zones remain uninhabitable."

---

## 22.15 Data States

### Loading State

Skeleton animation — placeholder rows with slow pulse animation. Skeleton rows match expected row height and column structure. Never use spinners in main content area (spinners only acceptable in button loading states).

### Empty States

Every panel and table that can be empty must have a designed empty state:

- Short label: `No active plots.`
- Secondary line: `Select a plot from the Plots screen to begin operations.`
- Optional shortcut link to relevant action

Empty states use plain text, centered in the panel. No illustrations or decorative icons.

### Error States

Data fetch failures show: red left border on affected panel | `Failed to load [data type]. Retry?` | `RETRY` button.

### Stale Data Warning

If viewing a zone or agent record that may have changed since last loaded: `Data last updated DAY 43. Advance time or run Reconnaissance to refresh.`

---

## 22.16 Accessibility & Keyboard Shortcuts

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

## 22.17 Tone Escalation Rules

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
