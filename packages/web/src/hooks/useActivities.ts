import { useState } from "react";
import type { Person } from "@empire-of-evil/engine";
import { useGameState } from "./useGameState";
import { BUNDLED_CONFIG } from "../store/gameStore";

type ActivityDefinition = {
    id: string;
    name: string;
    description?: string;
    costPerParticipantPerDay?: number;
    evilCategory?: string;
    effects?: unknown[];
};

export type EnrichedActiveActivity = {
    record: any;
    definition?: ActivityDefinition;
    assignedAgents: Person[];
};

export type EnrichedAvailableActivity = {
    definition: ActivityDefinition;
    status: "available" | "locked";
    lockedReason?: string | null;
};

export function useActivities() {
    const state = useGameState();
    const config = BUNDLED_CONFIG;
    const [selectedActivityId, setSelectedActivityId] = useState<string | null>(
        null,
    );

    const defs = ((config.activities as unknown[]) ||
        []) as ActivityDefinition[];
    const defsById: Record<string, ActivityDefinition> = {};
    for (const d of defs) defsById[d.id] = d;

    const unlocked = new Set(state.empire.unlockedActivityIds ?? []);

    const availableActivities: EnrichedAvailableActivity[] = defs.map(
        (def) => ({
            definition: def,
            status: unlocked.has(def.id) ? "available" : "locked",
            lockedReason: unlocked.has(def.id)
                ? null
                : def.effects && def.effects.length > 0
                  ? "requirements"
                  : "locked",
        }),
    );

    const activeRecords = Object.values(state.activities ?? {});
    const activeActivities: EnrichedActiveActivity[] = activeRecords.map(
        (rec: any) => {
            const def = defsById[rec.activityDefinitionId];
            const assignedAgents = (rec.assignedAgentIds ?? [])
                .map((id: string) => state.persons[id])
                .filter((p): p is Person => Boolean(p));
            return {
                record: rec,
                definition: def,
                assignedAgents,
            };
        },
    );

    const assignedAgentIds = new Set(
        activeRecords.flatMap((r: any) => r.assignedAgentIds ?? []),
    );
    const availableAgents: Person[] = Object.values(state.persons).filter(
        (p) =>
            p.agentStatus !== undefined &&
            !p.dead &&
            !assignedAgentIds.has(p.id),
    );

    const unlockedResearchIds = state.empire.unlockedResearchIds ?? [];

    function selectActivity(id: string | null) {
        setSelectedActivityId((prev) => (prev === id ? null : id));
    }

    function getEnrichedById(
        id: string | null,
    ): EnrichedActiveActivity | EnrichedAvailableActivity | null {
        if (!id) return null;
        const active = activeActivities.find((a) => a.record.id === id);
        if (active) return active;
        const avail = availableActivities.find((a) => a.definition.id === id);
        return avail ?? null;
    }

    return {
        activeActivities,
        availableActivities,
        availableAgents,
        unlockedResearchIds,
        selectedActivityId,
        selectActivity,
        getEnrichedById,
    } as const;
}

export default useActivities;
