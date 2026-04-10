export type {
    GameState,
    WorldGenParams,
    Tile,
    Zone,
    Nation,
    Building,
    Person,
    AgentStatus,
    AgentJob,
    GoverningOrganization,
    EmpireState,
    ActivePlot,
    ActiveActivity,
    ActiveResearch,
    Captive,
    EffectInstance,
    GameEvent,
    InterruptEvent,
    EventChoice,
    EventCategory,
    GameEventRecord,
    Squad,
    StandingOrder,
} from "./types/index.js";

export { advanceTime } from "./simulation/advance.js";
export type { AdvanceResult } from "./simulation/advance.js";

export { resolveEvent } from "./events/resolve.js";
export { generateWorld } from "./worldGen/index.js";
export type {
    Config,
    TileTypeDefinition,
    ResearchProjectDefinition,
} from "./config/loader.js";
export { applyEffect } from "./effects/apply.js";
export type { EffectDeclaration } from "./effects/apply.js";
export type { EffectContext, EffectResolver } from "./effects/types.js";

export {
    getZone,
    getPersonsInZone,
    getActiveEffectsOnPerson,
    getSquad,
    getAgentSquad,
    getSquadMembers,
    getDailyBuildingIncome,
    getBuildingIncomeByZone,
    getDailyBuildingUpkeep,
    getBuildingUpkeepByZone,
    getDailyAgentSalaries,
    getZoneTaxIncome,
    getResearchProject,
    isResearchCompleted,
    isResearchActive,
    isResearchAvailable,
    getResearchProgressPct,
} from "./state/queries.js";

export {
    startResearch,
    cancelResearch,
    assignAgentToResearch,
    removeAgentFromResearch,
} from "./simulation/research.js";

export {
    startPlot,
    cancelPlot,
    assignAgentToPlot,
    removeAgentFromPlot,
} from "./plots/index.js";

export {
    startActivity,
    cancelActivity,
    assignAgentToActivity,
    removeAgentFromActivity,
} from "./activities/index.js";

export {
    assignAgentToBuilding,
    removeAgentFromBuilding,
} from "./buildings/index.js";

export {
    createTile,
    createZone,
    createNation,
    createBuilding,
    createPerson,
    createGoverningOrganization,
    createEffectInstance,
    createSquad,
} from "./factories/index.js";

export {
    reassignAgentJob,
    fireAgent,
    terminatePerson,
    createSquadInState,
    renameSquad,
    setSquadHomeZone,
    setSquadStandingOrder,
    addAgentToSquad,
    removeAgentFromSquad,
    setSquadLeader,
    disbandSquad,
    addInnerCircleMember,
    removeInnerCircleMember,
    reorderInnerCircleMembers,
} from "./personnel/index.js";
