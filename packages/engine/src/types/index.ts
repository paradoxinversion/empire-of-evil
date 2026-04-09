// ─── Primitives ───────────────────────────────────────────────────────────────

export interface EffectInstance {
    id: string;
    effectId: string;
    targetId: string;
    targetType: "person" | "zone" | "tile" | "organization";
    parameters?: Record<string, unknown>;
    duration?: number;
    appliedOnDate: number;
}

// ─── Entities ─────────────────────────────────────────────────────────────────

export interface Tile {
    id: string;
    typeId: string;
    zoneId: string;
    activeEffectIds: string[];
    governingOrganizationId?: string;
}

export interface Zone {
    id: string;
    name: string;
    nationId: string;
    governingOrganizationId: string;
    tileIds: string[];
    buildingIds: string[];
    generationWealth: number;
    economicOutput: number;
    population: number;
    intelLevel: number;
    taxRate: number;
    activeEffectIds: string[];
}

export interface Nation {
    id: string;
    name: string;
    size: number;
    governingOrganizationId: string;
}

export interface Building {
    id: string;
    name: string;
    typeId: string;
    zoneId: string;
    /** Optional: the specific tile this building is placed on */
    tileId?: string;
    intelLevel: number;
    governingOrganizationId: string;
    activeEffectIds: string[];
    assignedAgentIds?: string[];
}

export type AgentJob =
    | "scientist"
    | "administrator"
    | "troop"
    | "operative"
    | "unassigned";

export interface AgentStatus {
    job: AgentJob;
    salary: number;
    squadId?: string;
    departmentId?: string;
}

export interface Person {
    id: string;
    name: string;
    zoneId: string;
    homeZoneId: string;
    governingOrganizationId: string;
    attributes: Record<string, number>;
    skills: Record<string, number>;
    loyalties: Record<string, number>;
    intelLevel: number;
    health: number;
    money: number;
    activeEffectIds: string[];
    dead: boolean;
    agentStatus?: AgentStatus;
}

export interface GoverningOrganization {
    id: string;
    name: string;
    intelLevel: number;
    activeEffectIds: string[];
}

// ─── Empire ───────────────────────────────────────────────────────────────────

export interface EmpireState {
    id: string;
    overlordId: string;
    petId: string;
    resources: {
        money: number;
        science: number;
        infrastructure: number;
    };
    evil: {
        actual: number;
        perceived: number;
    };
    innerCircleIds: string[];
    unlockedPlotIds: string[];
    unlockedActivityIds: string[];
    unlockedResearchIds: string[];
}

// ─── Active simulation records ─────────────────────────────────────────────────

export interface ActivePlot {
    id: string;
    plotDefinitionId: string;
    currentStageIndex: number;
    assignedAgentIds: string[];
    targetZoneId?: string;
    targetPersonId?: string;
    daysRemaining: number;
    accumulatedSuccessScore: number;
    status:
        | "traveling"
        | "active"
        | "awaiting_resolution"
        | "complete"
        | "failed";
}

export interface ActiveActivity {
    id: string;
    activityDefinitionId: string;
    assignedAgentIds: string[];
    zoneId: string;
}

export interface ActiveResearch {
    id: string;
    projectId: string;
    assignedAgentIds: string[];
    daysRemaining: number;
    accumulatedScore: number;
}

export interface Captive {
    id: string;
    personId: string;
    capturedOnDate: number;
    zoneId: string;
}

// ─── Events ───────────────────────────────────────────────────────────────────

export type EventCategory =
    | "combat"
    | "death"
    | "player_choice"
    | "evil_tier"
    | "informational";

export interface EventChoice {
    label: string;
    effects: Array<{
        type: string;
        chance: number;
        parameters?: Record<string, unknown>;
    }>;
}

export interface GameEvent {
    id: string;
    category: EventCategory;
    title: string;
    body: string;
    relatedEntityIds: string[];
    requiresResolution: boolean;
    choices?: EventChoice[];
    createdOnDate: number;
}

export type InterruptEvent = GameEvent & { requiresResolution: true };

export interface GameEventRecord {
    event: GameEvent;
    resolvedOnDate: number;
    choiceIndex?: number;
}

// ─── Squads ───────────────────────────────────────────────────────────────────

export type StandingOrder =
    | "IDLE"
    | "DEFEND_ZONE"
    | "RUN_RECONNAISSANCE"
    | "MAINTAIN_ACTIVITY"
    | "COUNTERINTELLIGENCE"
    | "MANAGE_STABILITY"
    | "ESCORT_OVERLORD"
    | "EXECUTE_STANDING_PLOT";

export interface Squad {
    id: string;
    name: string;
    memberIds: string[];
    leaderId?: string;
    homeZoneId?: string;
    standingOrders?: StandingOrder;
    standingPlotId?: string;
}

// ─── GameState ────────────────────────────────────────────────────────────────

export interface GameState {
    tiles: Record<string, Tile>;
    zones: Record<string, Zone>;
    nations: Record<string, Nation>;
    buildings: Record<string, Building>;
    persons: Record<string, Person>;
    governingOrganizations: Record<string, GoverningOrganization>;

    squads: Record<string, Squad>;
    plots: Record<string, ActivePlot>;
    activities: Record<string, ActiveActivity>;
    research: Record<string, ActiveResearch>;
    captives: Record<string, Captive>;
    effectInstances: Record<string, EffectInstance>;
    morgues: {
        byCitizen: Record<string, string[]>;
        byAgent: Record<string, string[]>;
    };

    empire: EmpireState;
    date: number;
    worldSeed: number;

    pendingEvents: GameEvent[];
    eventLog: GameEventRecord[];
}

// ─── World generation ─────────────────────────────────────────────────────────

export interface WorldGenParams {
    seed?: number;
    mapWidth: number;
    mapHeight: number;
    terrainProfile?: {
        noiseScale: number;
        uninhabitedWealthFloor: number;
    };
    minZoneSize: number;
    maxZoneSize: number;
    nationCount: number;
    zonesPerNation: number;
    minNationSpacing?: number;
    populationDensity: number;
    maxBuildingsPerZone: number;
    startingResources?: {
        money: number;
        science: number;
        infrastructure: number;
    };
    petTypeId?: string;
}
