import { useState } from "react";
import type { ActivePlot, Person } from "@empire-of-evil/engine";
import { useGameState } from "./useGameState";
import { BUNDLED_CONFIG } from "../store/gameStore";

type PlotDefinition = {
    id: string;
    name: string;
    description?: string;
    tier?: number;
    category?: string;
    requirements?: {
        agentCount?: number;
        researchIds?: string[];
        resourceCosts?: Record<string, number>;
    };
    durationDays?: number;
    stages?: Array<{ name?: string; durationDays?: number }>;
};

export type EnrichedActivePlot = {
    record: ActivePlot;
    definition?: PlotDefinition;
    assignedAgents: Person[];
    progressPct: number;
    targetLabel: string;
};

export type EnrichedAvailablePlot = {
    definition: PlotDefinition;
    status: "available" | "locked";
    lockedReason?: string | null;
};

export function usePlots() {
    const state = useGameState();
    const config = BUNDLED_CONFIG;
    const [selectedPlotId, setSelectedPlotId] = useState<string | null>(null);

    const defs = ((config.plots as unknown[]) || []) as PlotDefinition[];
    const defsById: Record<string, PlotDefinition> = {};
    for (const d of defs) defsById[d.id] = d;

    const unlocked = new Set(state.empire.unlockedPlotIds ?? []);

    const availablePlots: EnrichedAvailablePlot[] = defs.map((def) => ({
        definition: def,
        status: unlocked.has(def.id) ? "available" : "locked",
        lockedReason: unlocked.has(def.id)
            ? null
            : def.requirements?.researchIds &&
                def.requirements.researchIds.length > 0
              ? "research"
              : "locked",
    }));

    const activeRecords = Object.values(state.plots ?? {});
    const activePlots: EnrichedActivePlot[] = activeRecords.map(
        (rec: ActivePlot) => {
            const def = defsById[rec.plotDefinitionId];
            const assignedAgents = (rec.assignedAgentIds ?? [])
                .map((id) => state.persons[id])
                .filter((p): p is Person => Boolean(p));
            const totalDays = def?.durationDays ?? 0;
            const progressPct =
                totalDays > 0
                    ? Math.max(
                          0,
                          Math.min(
                              100,
                              Math.round(
                                  ((totalDays - rec.daysRemaining) /
                                      totalDays) *
                                      100,
                              ),
                          ),
                      )
                    : 0;
            const targetLabel = rec.targetZoneId
                ? (state.zones[rec.targetZoneId]?.name ?? rec.targetZoneId)
                : rec.targetPersonId
                  ? (state.persons[rec.targetPersonId]?.name ??
                    rec.targetPersonId)
                  : "—";
            return {
                record: rec,
                definition: def,
                assignedAgents,
                progressPct,
                targetLabel,
            };
        },
    );

    // Available agents: persons with agentStatus who are not dead and not already assigned to any active plot
    const assignedAgentIds = new Set(
        activeRecords.flatMap((r) => r.assignedAgentIds ?? []),
    );
    const availableAgents: Person[] = Object.values(state.persons).filter(
        (p) =>
            p.agentStatus !== undefined &&
            !p.dead &&
            !assignedAgentIds.has(p.id),
    );

    const unlockedResearchIds = state.empire.unlockedResearchIds ?? [];

    function selectPlot(id: string | null) {
        setSelectedPlotId((prev) => (prev === id ? null : id));
    }

    function getEnrichedById(
        id: string | null,
    ): EnrichedActivePlot | EnrichedAvailablePlot | null {
        if (!id) return null;
        const active = activePlots.find((a) => a.record.id === id);
        if (active) return active;
        const avail = availablePlots.find((a) => a.definition.id === id);
        return avail ?? null;
    }

    return {
        activePlots,
        availablePlots,
        availableAgents,
        unlockedResearchIds,
        selectedPlotId,
        selectPlot,
        getEnrichedById,
    } as const;
}

export default usePlots;
