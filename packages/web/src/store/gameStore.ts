import { create } from "zustand";
import {
    reassignAgentJob as reassignAgentJobEngine,
    fireAgent as fireAgentEngine,
    terminatePerson as terminatePersonEngine,
    createSquadInState as createSquadInStateEngine,
    renameSquad as renameSquadEngine,
    setSquadHomeZone as setSquadHomeZoneEngine,
    setSquadStandingOrder as setSquadStandingOrderEngine,
    addAgentToSquad as addAgentToSquadEngine,
    removeAgentFromSquad as removeAgentFromSquadEngine,
    setSquadLeader as setSquadLeaderEngine,
    disbandSquad as disbandSquadEngine,
    addInnerCircleMember as addInnerCircleMemberEngine,
    removeInnerCircleMember as removeInnerCircleMemberEngine,
    reorderInnerCircleMembers as reorderInnerCircleMembersEngine,
} from "@empire-of-evil/engine";
import type {
    GameState,
    GameEvent,
    WorldGenParams,
    StandingOrder,
    AgentJob,
} from "@empire-of-evil/engine";
import type { Config, ResearchProjectDefinition } from "@empire-of-evil/engine";

// Import bundled config JSON files (Vite resolves these at build time)
import tileTypes from "../../../../config/default/tileTypes.json";
import buildings from "../../../../config/default/buildings.json";
import pets from "../../../../config/default/pets.json";
import worldgenDefaults from "../../../../config/default/worldgen.json";
import activities from "../../../../config/default/activities.json";
import citizenActions from "../../../../config/default/citizenActions.json";
import cpuBehaviors from "../../../../config/default/cpuBehaviors.json";
import effects from "../../../../config/default/effects.json";
import evilTiers from "../../../../config/default/evilTiers.json";
import personAttributes from "../../../../config/default/personAttributes.json";
import plots from "../../../../config/default/plots.json";
import researchProjects from "../../../../config/default/researchProjects.json";
import skills from "../../../../config/default/skills.json";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const BUNDLED_CONFIG: Config = {
    tileTypes: tileTypes as Config["tileTypes"],
    buildings: buildings as Config["buildings"],
    pets: pets as Config["pets"],
    worldgen: worldgenDefaults as Config["worldgen"],
    activities: activities as unknown[],
    citizenActions: citizenActions as unknown[],
    cpuBehaviors: cpuBehaviors as unknown[],
    effects: effects as unknown[],
    evilTiers: evilTiers as unknown[],
    personAttributes: personAttributes as unknown[],
    plots: plots as unknown[],
    researchProjects: researchProjects as ResearchProjectDefinition[],
    skills: skills as unknown[],
};

export type SimulationStatus =
    | "idle"
    | "ready"
    | "running"
    | "interrupted"
    | "victory"
    | "defeat";

export type GameStore = {
    gameState: GameState | null;
    version: number;
    status: SimulationStatus;
    activeInterrupts: GameEvent[];
    targetDate: number | null;

    newGame: (params: WorldGenParams) => void;
    loadGame: (json: string) => void;
    saveGame: () => string;
    advanceTo: (targetDate: number) => void;
    pauseAdvance: () => void;
    resolveEvent: (eventId: string, choiceIndex?: number) => void;
    resumeAfterInterrupt: () => void;
    createSquad: (name: string, homeZoneId?: string) => void;
    addAgentToSquad: (squadId: string, agentId: string) => void;
    renameSquad: (squadId: string, name: string) => void;
    setSquadHomeZone: (squadId: string, zoneId: string) => void;
    setSquadLeader: (squadId: string, leaderId: string) => void;
    setSquadStandingPlot: (squadId: string, plotId: string) => void;
    disbandSquad: (squadId: string) => void;
    addInnerCircleMember: (personId: string) => void;
    removeInnerCircleMember: (personId: string) => void;
    reorderInnerCircleMembers: (orderedIds: string[]) => void;
    reassignAgentJob: (agentId: string, job: AgentJob) => void;
    fireAgent: (agentId: string) => void;
    terminatePerson: (personId: string) => void;
    removeAgentFromSquad: (squadId: string, agentId: string) => void;
    updateSquadOrders: (squadId: string, orders: StandingOrder) => void;
    setZoneTaxRate: (zoneId: string, taxRate: number) => void;
    startResearch: (projectId: string) => void;
    cancelResearch: (researchId: string) => void;
    assignAgentToResearch: (researchId: string, agentId: string) => void;
    removeAgentFromResearch: (researchId: string, agentId: string) => void;
    startPlot: (plotDefinitionId: string, targetZoneId?: string) => void;
    assignAgentToPlot: (plotId: string, agentId: string) => void;
    removeAgentFromPlot: (plotId: string, agentId: string) => void;
    startActivity: (activityDefinitionId: string) => void;
    startActivityWithAgent: (
        activityDefinitionId: string,
        agentId: string,
    ) => void;
    cancelActivity: (activeActivityId: string) => void;
    assignAgentToActivity: (activityId: string, agentId: string) => void;
    removeAgentFromActivity: (activityId: string, agentId: string) => void;
};

export const useGameStore = create<GameStore>((set, get) => {
    // eslint-disable-next-line prefer-const
    let simulationGenerator: Generator | null = null;
    let animationFrameId: number | null = null;

    const stepSimulation = () => {
        const { gameState, targetDate } = get();
        if (!gameState || targetDate === null || !simulationGenerator) return;

        const result = simulationGenerator.next();

        if (result.done) {
            simulationGenerator = null;
            set({ status: "ready", targetDate: null });
            return;
        }

        const value = result.value as { type: string; events?: GameEvent[] };

        if (value.type === "interrupted") {
            simulationGenerator = null;
            set((s) => ({
                status: "interrupted",
                activeInterrupts: value.events ?? [],
                version: s.version + 1,
            }));
            return;
        }

        set((s) => ({ version: s.version + 1 }));
        animationFrameId = requestAnimationFrame(stepSimulation);
    };

    return {
        gameState: null,
        version: 0,
        status: "idle",
        activeInterrupts: [],
        targetDate: null,

        newGame: (params) => {
            import("@empire-of-evil/engine").then(({ generateWorld }) => {
                const gameState = generateWorld(params, BUNDLED_CONFIG);
                set({ gameState, status: "ready", version: 1 });
            });
        },

        advanceTo: (targetDate) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine").then(({ advanceTime }) => {
                simulationGenerator = advanceTime(
                    gameState,
                    targetDate,
                    BUNDLED_CONFIG,
                );
                set({ status: "running", targetDate });
                animationFrameId = requestAnimationFrame(stepSimulation);
            });
        },

        pauseAdvance: () => {
            if (animationFrameId !== null)
                cancelAnimationFrame(animationFrameId);
            simulationGenerator = null;
            set({ status: "ready", targetDate: null });
        },

        resolveEvent: (eventId, choiceIndex) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine").then(({ resolveEvent }) => {
                resolveEvent(gameState, eventId, choiceIndex);
                const remaining = gameState.pendingEvents.filter(
                    (e) => e.requiresResolution,
                );
                set((s) => ({
                    activeInterrupts: remaining,
                    version: s.version + 1,
                }));
            });
        },

        resumeAfterInterrupt: () => {
            const { activeInterrupts, targetDate, gameState } = get();
            if (activeInterrupts.length > 0 || !targetDate || !gameState)
                return;
            import("@empire-of-evil/engine").then(({ advanceTime }) => {
                simulationGenerator = advanceTime(
                    gameState,
                    targetDate,
                    BUNDLED_CONFIG,
                );
                set({ status: "running" });
                animationFrameId = requestAnimationFrame(stepSimulation);
            });
        },

        saveGame: () => {
            const { gameState } = get();
            if (!gameState) throw new Error("No game to save");
            return JSON.stringify(gameState);
        },

        loadGame: (json) => {
            const gameState = JSON.parse(json) as GameState;
            set({ gameState, status: "ready", version: 1 });
        },

        createSquad: (name, homeZoneId) => {
            const { gameState } = get();
            if (!gameState) return;
            const squad = createSquadInStateEngine(gameState, { name });
            if (homeZoneId) {
                setSquadHomeZoneEngine(gameState, squad.id, homeZoneId);
            }
            set((s) => ({ version: s.version + 1 }));
        },

        addAgentToSquad: (squadId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            addAgentToSquadEngine(gameState, squadId, agentId);
            set((s) => ({ version: s.version + 1 }));
        },

        renameSquad: (squadId, name) => {
            const { gameState } = get();
            if (!gameState) return;
            renameSquadEngine(gameState, squadId, name);
            set((s) => ({ version: s.version + 1 }));
        },

        setSquadHomeZone: (squadId, zoneId) => {
            const { gameState } = get();
            if (!gameState) return;
            setSquadHomeZoneEngine(gameState, squadId, zoneId);
            set((s) => ({ version: s.version + 1 }));
        },

        setSquadLeader: (squadId, leaderId) => {
            const { gameState } = get();
            if (!gameState) return;
            setSquadLeaderEngine(gameState, squadId, leaderId);
            set((s) => ({ version: s.version + 1 }));
        },

        setSquadStandingPlot: (squadId, plotId) => {
            const { gameState } = get();
            if (!gameState) return;
            const squad = gameState.squads[squadId];
            if (!squad) return;
            if (!gameState.plots[plotId]) return;
            squad.standingPlotId = plotId;
            set((s) => ({ version: s.version + 1 }));
        },

        disbandSquad: (squadId) => {
            const { gameState } = get();
            if (!gameState) return;
            disbandSquadEngine(gameState, squadId);
            set((s) => ({ version: s.version + 1 }));
        },

        addInnerCircleMember: (personId) => {
            const { gameState } = get();
            if (!gameState) return;
            addInnerCircleMemberEngine(gameState, personId);
            set((s) => ({ version: s.version + 1 }));
        },

        removeInnerCircleMember: (personId) => {
            const { gameState } = get();
            if (!gameState) return;
            removeInnerCircleMemberEngine(gameState, personId);
            set((s) => ({ version: s.version + 1 }));
        },

        reorderInnerCircleMembers: (orderedIds) => {
            const { gameState } = get();
            if (!gameState) return;
            reorderInnerCircleMembersEngine(gameState, orderedIds);
            set((s) => ({ version: s.version + 1 }));
        },

        reassignAgentJob: (agentId, job) => {
            const { gameState } = get();
            if (!gameState) return;
            const person = gameState.persons[agentId];
            if (!person?.agentStatus) return;
            reassignAgentJobEngine(gameState, agentId, job);
            set((s) => ({ version: s.version + 1 }));
        },

        fireAgent: (agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            const person = gameState.persons[agentId];
            if (!person?.agentStatus) return;

            fireAgentEngine(gameState, agentId);
            set((s) => ({ version: s.version + 1 }));
        },

        terminatePerson: (personId) => {
            const { gameState } = get();
            if (!gameState) return;
            const person = gameState.persons[personId];
            if (!person || person.dead) return;

            terminatePersonEngine(gameState, personId);

            set((s) => ({ version: s.version + 1 }));
        },

        removeAgentFromSquad: (squadId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            removeAgentFromSquadEngine(gameState, squadId, agentId);
            set((s) => ({ version: s.version + 1 }));
        },

        updateSquadOrders: (squadId, orders) => {
            const { gameState } = get();
            if (!gameState) return;
            setSquadStandingOrderEngine(gameState, squadId, orders);
            set((s) => ({ version: s.version + 1 }));
        },

        setZoneTaxRate: (zoneId, taxRate) => {
            const { gameState } = get();
            if (!gameState) return;
            const zone = gameState.zones[zoneId];
            if (!zone) return;
            zone.taxRate = Math.max(0, Math.min(1, taxRate));
            set((s) => ({ version: s.version + 1 }));
        },

        startResearch: (projectId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine").then(({ startResearch }) => {
                startResearch(gameState, projectId, BUNDLED_CONFIG);
                set((s) => ({ version: s.version + 1 }));
            });
        },

        cancelResearch: (researchId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine").then(({ cancelResearch }) => {
                cancelResearch(gameState, researchId);
                set((s) => ({ version: s.version + 1 }));
            });
        },

        assignAgentToResearch: (researchId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine").then(
                ({ assignAgentToResearch }) => {
                    assignAgentToResearch(gameState, researchId, agentId);
                    set((s) => ({ version: s.version + 1 }));
                },
            );
        },

        removeAgentFromResearch: (researchId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine").then(
                ({ removeAgentFromResearch }) => {
                    removeAgentFromResearch(gameState, researchId, agentId);
                    set((s) => ({ version: s.version + 1 }));
                },
            );
        },

        startPlot: (plotDefinitionId, targetZoneId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.startPlot === "function") {
                        m.startPlot(
                            gameState,
                            plotDefinitionId,
                            BUNDLED_CONFIG,
                            targetZoneId,
                        );
                    } else {
                        const def = (BUNDLED_CONFIG.plots as any[]).find(
                            (p) => p.id === plotDefinitionId,
                        );
                        if (!def) return;
                        const id = `plot-${Date.now().toString(36)}-${Math.random()
                            .toString(36)
                            .slice(2, 6)}`;
                        const days =
                            def?.stages?.[0]?.durationDays ??
                            def?.durationDays ??
                            1;
                        const ap = {
                            id,
                            plotDefinitionId: plotDefinitionId,
                            currentStageIndex: 0,
                            assignedAgentIds: [],
                            ...(targetZoneId ? { targetZoneId } : {}),
                            daysRemaining: days,
                            accumulatedSuccessScore: 0,
                            status: "active",
                        } as any;
                        gameState.plots[ap.id] = ap;
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        cancelPlot: (activePlotId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.cancelPlot === "function") {
                        m.cancelPlot(gameState, activePlotId);
                    } else {
                        delete gameState.plots[activePlotId];
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        assignAgentToPlot: (plotId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.assignAgentToPlot === "function") {
                        m.assignAgentToPlot(gameState, plotId, agentId);
                    } else {
                        const plot = gameState.plots[plotId];
                        if (!plot) return;
                        if (plot.assignedAgentIds.includes(agentId)) return;
                        plot.assignedAgentIds.push(agentId);
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        startActivity: (activityDefinitionId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.startActivity === "function") {
                        m.startActivity(
                            gameState,
                            activityDefinitionId,
                            BUNDLED_CONFIG,
                        );
                    } else {
                        const def = (BUNDLED_CONFIG.activities as any[]).find(
                            (p) => p.id === activityDefinitionId,
                        );
                        if (!def) return;
                        const id = `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
                        const ap = {
                            id,
                            activityDefinitionId: activityDefinitionId,
                            assignedAgentIds: [],
                            daysRemaining: 1,
                            status: "active",
                        } as any;
                        gameState.activities[ap.id] = ap;
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        startActivityWithAgent: (activityDefinitionId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    const beforeIds = new Set(
                        Object.keys(gameState.activities ?? {}),
                    );

                    if (typeof m.startActivity === "function") {
                        m.startActivity(
                            gameState,
                            activityDefinitionId,
                            BUNDLED_CONFIG,
                        );
                    } else {
                        const def = (BUNDLED_CONFIG.activities as any[]).find(
                            (p) => p.id === activityDefinitionId,
                        );
                        if (!def) return;
                        const id = `activity-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
                        const ap = {
                            id,
                            activityDefinitionId,
                            assignedAgentIds: [],
                            daysRemaining: 1,
                            status: "active",
                        } as any;
                        gameState.activities[ap.id] = ap;
                    }

                    let createdId: string | null = null;
                    for (const [id, rec] of Object.entries(
                        gameState.activities ?? {},
                    )) {
                        if (beforeIds.has(id)) continue;
                        if (
                            (rec as any).activityDefinitionId ===
                            activityDefinitionId
                        ) {
                            createdId = id;
                            break;
                        }
                    }

                    if (createdId) {
                        if (typeof m.assignAgentToActivity === "function") {
                            m.assignAgentToActivity(
                                gameState,
                                createdId,
                                agentId,
                            );
                        } else {
                            const act = gameState.activities[createdId];
                            if (
                                act &&
                                !act.assignedAgentIds.includes(agentId)
                            ) {
                                act.assignedAgentIds.push(agentId);
                            }
                        }
                    }

                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        cancelActivity: (activeActivityId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.cancelActivity === "function") {
                        m.cancelActivity(gameState, activeActivityId);
                    } else {
                        delete gameState.activities[activeActivityId];
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        assignAgentToActivity: (activityId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.assignAgentToActivity === "function") {
                        m.assignAgentToActivity(gameState, activityId, agentId);
                    } else {
                        const act = gameState.activities[activityId];
                        if (!act) return;
                        if (act.assignedAgentIds.includes(agentId)) return;
                        act.assignedAgentIds.push(agentId);
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        removeAgentFromActivity: (activityId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.removeAgentFromActivity === "function") {
                        m.removeAgentFromActivity(
                            gameState,
                            activityId,
                            agentId,
                        );
                    } else {
                        const act = gameState.activities[activityId];
                        if (!act) return;
                        act.assignedAgentIds = act.assignedAgentIds.filter(
                            (id) => id !== agentId,
                        );
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },

        removeAgentFromPlot: (plotId, agentId) => {
            const { gameState } = get();
            if (!gameState) return;
            import("@empire-of-evil/engine")
                .then((m) => {
                    if (typeof m.removeAgentFromPlot === "function") {
                        m.removeAgentFromPlot(gameState, plotId, agentId);
                    } else {
                        const plot = gameState.plots[plotId];
                        if (!plot) return;
                        plot.assignedAgentIds = plot.assignedAgentIds.filter(
                            (id) => id !== agentId,
                        );
                    }
                    set((s) => ({ version: s.version + 1 }));
                })
                .catch(() => {
                    /* ignore */
                });
        },
    };
});
