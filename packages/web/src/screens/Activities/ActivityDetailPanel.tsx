import React from "react";
import { Panel } from "../../components/Panel/Panel";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import type {
    EnrichedActiveActivity,
    EnrichedAvailableActivity,
} from "../../hooks/useActivities";
import type { Person } from "@empire-of-evil/engine";

type Props = {
    enriched: EnrichedActiveActivity | EnrichedAvailableActivity | null;
    availableAgents?: Person[];
    unlockedResearchIds?: string[];
};

export default function ActivityDetailPanel({
    enriched,
    availableAgents = [],
    unlockedResearchIds = [],
}: Props) {
    if (!enriched) {
        return (
            <Panel>
                <div className="text-text-muted text-[11px]">
                    Select an activity to view details.
                </div>
            </Panel>
        );
    }

    const def =
        "definition" in enriched ? enriched.definition : enriched.definition;

    const activeRecord =
        "record" in (enriched as any)
            ? (enriched as EnrichedActiveActivity).record
            : null;

    return (
        <Panel title={def?.name ?? "Activity Detail"}>
            <div className="space-y-3">
                <div className="flex items-center justify-between">
                    <div className="space-y-1">
                        <div className="font-mono text-text-primary">
                            {def?.name}
                        </div>
                        <div className="text-text-muted text-[12px]">
                            {def?.description}
                        </div>
                    </div>
                </div>

                <div>
                    <div className="text-text-muted text-[11px] mb-1">
                        Requirements
                    </div>
                    <div className="text-text-muted text-[11px]">
                        Cost per participant:{" "}
                        {def?.costPerParticipantPerDay ?? 0}
                    </div>
                </div>

                {"record" in (enriched as any) && (
                    <div>
                        <div className="text-text-muted text-[11px] mb-1">
                            ASSIGNED AGENTS
                        </div>
                        {(enriched as EnrichedActiveActivity).assignedAgents
                            .length === 0 ? (
                            <div className="text-[10px] text-text-muted">
                                None assigned.
                            </div>
                        ) : (
                            (
                                enriched as EnrichedActiveActivity
                            ).assignedAgents.map((person) => (
                                <div
                                    key={person.id}
                                    className="flex items-center justify-between py-1 border-b border-bg-elevated last:border-0"
                                >
                                    <div>
                                        <div className="font-mono text-[11px] text-text-primary">
                                            {person.name}
                                        </div>
                                    </div>
                                    <ActionButton
                                        variant="destructive"
                                        onClick={() => {}}
                                        className="text-[9px] py-0.5 px-1.5"
                                    >
                                        REMOVE
                                    </ActionButton>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div>
                    <div className="text-text-muted text-[11px] mb-1">
                        AVAILABLE AGENTS
                    </div>
                    {(availableAgents ?? []).length === 0 ? (
                        <div className="text-[10px] text-text-muted">
                            None available.
                        </div>
                    ) : (
                        (availableAgents ?? []).map((person) => (
                            <div
                                key={person.id}
                                className="flex items-center justify-between py-1 border-b border-bg-elevated last:border-0"
                            >
                                <span className="font-mono text-[11px] text-text-primary">
                                    {person.name}
                                </span>
                                <ActionButton
                                    variant="default"
                                    onClick={() => {}}
                                    className="text-[9px] py-0.5 px-1.5"
                                >
                                    ASSIGN
                                </ActionButton>
                            </div>
                        ))
                    )}
                </div>

                <div className="mt-4">
                    {"record" in (enriched as any) ? (
                        <ActionButton
                            variant="destructive"
                            onClick={() => {}}
                            className="w-full"
                        >
                            CANCEL ACTIVITY
                        </ActionButton>
                    ) : (
                        <ActionButton
                            variant="primary"
                            onClick={() => {}}
                            className="w-full"
                        >
                            LAUNCH ACTIVITY
                        </ActionButton>
                    )}
                </div>
            </div>
        </Panel>
    );
}
