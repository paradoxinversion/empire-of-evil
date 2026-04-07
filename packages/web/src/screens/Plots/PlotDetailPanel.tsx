import React from "react";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import type {
    EnrichedActivePlot,
    EnrichedAvailablePlot,
} from "../../hooks/usePlots";
import { useGameStore, BUNDLED_CONFIG } from "../../store/gameStore";
import type { Person } from "@empire-of-evil/engine";

type Props = {
    enriched: EnrichedActivePlot | EnrichedAvailablePlot | null;
    availableAgents?: Person[];
    unlockedResearchIds?: string[];
};

export default function PlotDetailPanel({
    enriched,
    availableAgents = [],
    unlockedResearchIds = [],
}: Props) {
    if (!enriched) {
        return (
            <Panel>
                <div className="text-text-muted text-[11px]">
                    Select a plot to view details.
                </div>
            </Panel>
        );
    }

    const def =
        "definition" in enriched ? enriched.definition : enriched.definition;

    const startPlot = useGameStore((s) => s.startPlot);
    const cancelPlot = useGameStore((s) => s.cancelPlot);
    const assignAgentToPlot = useGameStore((s) => s.assignAgentToPlot);
    const removeAgentFromPlot = useGameStore((s) => s.removeAgentFromPlot);
    const currentDay = useGameStore((s) => s.gameState?.date ?? 0);

    // Precompute stage drivers and per-agent daily contribution for active plots
    const activeRecord =
        "record" in (enriched as any)
            ? (enriched as EnrichedActivePlot).record
            : null;
    const currentStage =
        "record" in (enriched as any)
            ? (enriched as EnrichedActivePlot).definition?.stages?.[
                  (enriched as EnrichedActivePlot).record.currentStageIndex
              ]
            : null;
    const stageDrivers: string[] = (currentStage?.skillDrivers ??
        []) as string[];
    const computeAgentDaily = (p: Person) => {
        if (!stageDrivers || stageDrivers.length === 0) return 0;
        const sum = stageDrivers.reduce(
            (acc, d) => acc + ((p.skills as any)?.[d] ?? 0),
            0,
        );
        return Math.round(sum / stageDrivers.length);
    };
    const dailyTotal = activeRecord
        ? (enriched as EnrichedActivePlot).assignedAgents.reduce(
              (acc, p) => acc + computeAgentDaily(p),
              0,
          )
        : 0;
    const successThreshold = (currentStage as any)?.successThreshold ?? 0;
    const accumulated = activeRecord
        ? (activeRecord.accumulatedSuccessScore ?? 0)
        : 0;
    const remainingScore = Math.max(0, successThreshold - accumulated);
    const expectedDaysNeeded =
        dailyTotal > 0 ? Math.ceil(remainingScore / dailyTotal) : Infinity;
    const predictedFinishDay =
        activeRecord && isFinite(expectedDaysNeeded)
            ? currentDay +
              Math.min(activeRecord.daysRemaining, expectedDaysNeeded)
            : null;

    return (
        <Panel title={def?.name ?? "Plot Detail"}>
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
                    <div className="space-y-1">
                        <Tag
                            variant={(def?.tier ? `t${def.tier}` : "t1") as any}
                        >{`T${def?.tier ?? 1}`}</Tag>
                        <div className="text-text-muted text-[11px]">
                            {def?.category}
                        </div>
                    </div>
                </div>

                {/* Active meta: target, stage, ETA */}
                {"record" in (enriched as any) && (
                    <div className="flex gap-4 text-[11px] text-text-muted">
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                TARGET
                            </div>
                            <div className="text-text-secondary">
                                {(enriched as EnrichedActivePlot).targetLabel ??
                                    "—"}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                STAGE
                            </div>
                            <div className="text-text-secondary">
                                {(enriched as EnrichedActivePlot).definition
                                    ?.stages?.[
                                    (enriched as EnrichedActivePlot).record
                                        .currentStageIndex
                                ]?.name ??
                                    `Stage ${(enriched as EnrichedActivePlot).record.currentStageIndex + 1}`}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                ETA
                            </div>
                            <div className="text-text-secondary">
                                {(enriched as EnrichedActivePlot).record
                                    .daysRemaining > 0
                                    ? `${(enriched as EnrichedActivePlot).record.daysRemaining}d`
                                    : "—"}
                            </div>
                            {activeRecord && isFinite(expectedDaysNeeded) && (
                                <div className="text-[10px] text-text-muted">
                                    {`in ${Math.min(
                                        (enriched as EnrichedActivePlot).record
                                            .daysRemaining,
                                        expectedDaysNeeded,
                                    )}d`}
                                </div>
                            )}
                        </div>
                    </div>
                )}
                {"record" in (enriched as any) && (
                    <div>
                        <div className="text-text-muted text-[11px] mb-1">
                            Stage Progress
                        </div>
                        <ProgressBar
                            value={(enriched as EnrichedActivePlot).progressPct}
                            color="evil"
                            height={8}
                        />
                        <div className="text-text-muted text-[11px] mt-1">
                            {(enriched as EnrichedActivePlot).progressPct}%
                        </div>
                    </div>
                )}

                <div>
                    <div className="text-text-muted text-[11px] mb-1">
                        Requirements
                    </div>
                    <div className="text-text-muted text-[11px]">
                        Agents required: {def?.requirements?.agentCount ?? 0}
                    </div>
                    <div className="text-text-muted text-[11px]">
                        Research prerequisites:
                        <div className="mt-1">
                            {(def?.requirements?.researchIds ?? []).length ===
                                0 && (
                                <span className="text-text-muted">None</span>
                            )}
                            {(def?.requirements?.researchIds ?? []).map(
                                (rid) => {
                                    const unlocked =
                                        unlockedResearchIds.includes(rid);
                                    return (
                                        <div
                                            key={rid}
                                            className="flex items-center gap-2 font-mono text-[10px]"
                                        >
                                            <span
                                                className={
                                                    unlocked
                                                        ? "text-positive"
                                                        : "text-text-muted"
                                                }
                                            >
                                                {unlocked ? "✓" : "○"}
                                            </span>
                                            <span
                                                className={
                                                    unlocked
                                                        ? "text-text-secondary"
                                                        : "text-text-muted"
                                                }
                                            >
                                                {BUNDLED_CONFIG.researchProjects.find(
                                                    (p) => p.id === rid,
                                                )?.name ?? rid}
                                            </span>
                                        </div>
                                    );
                                },
                            )}
                        </div>
                    </div>
                </div>

                {"record" in (enriched as any) && (
                    <div>
                        <div className="text-text-muted text-[11px] mb-1">
                            ASSIGNED AGENTS
                        </div>
                        {((enriched as EnrichedActivePlot).assignedAgents ?? [])
                            .length === 0 ? (
                            <div className="text-[10px] text-text-muted">
                                None assigned.
                            </div>
                        ) : (
                            (enriched as EnrichedActivePlot).assignedAgents.map(
                                (person) => (
                                    <div
                                        key={person.id}
                                        className="flex items-center justify-between py-1 border-b border-bg-elevated last:border-0"
                                    >
                                        <div>
                                            <div className="font-mono text-[11px] text-text-primary">
                                                {person.name}
                                            </div>
                                            <div className="text-[10px] text-text-muted">
                                                Contrib:{" "}
                                                {computeAgentDaily(person)}/day
                                            </div>
                                        </div>
                                        <ActionButton
                                            variant="destructive"
                                            onClick={() =>
                                                removeAgentFromPlot(
                                                    (
                                                        enriched as EnrichedActivePlot
                                                    ).record.id,
                                                    person.id,
                                                )
                                            }
                                            className="text-[9px] py-0.5 px-1.5"
                                        >
                                            REMOVE
                                        </ActionButton>
                                    </div>
                                ),
                            )
                        )}
                    </div>
                )}

                {"record" in (enriched as any) && (
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
                                        onClick={() =>
                                            assignAgentToPlot(
                                                (enriched as EnrichedActivePlot)
                                                    .record.id,
                                                person.id,
                                            )
                                        }
                                        className="text-[9px] py-0.5 px-1.5"
                                    >
                                        ASSIGN
                                    </ActionButton>
                                </div>
                            ))
                        )}
                    </div>
                )}

                <div className="mt-4">
                    {"status" in (enriched as any) &&
                        (enriched as any).status === "available" && (
                            <ActionButton
                                variant="primary"
                                onClick={() => startPlot(def?.id ?? "")}
                                className="w-full"
                            >
                                LAUNCH PLOT
                            </ActionButton>
                        )}

                    {"record" in (enriched as any) &&
                        (enriched as any).record && (
                            <ActionButton
                                variant="destructive"
                                onClick={() =>
                                    cancelPlot(
                                        (enriched as EnrichedActivePlot).record
                                            .id,
                                    )
                                }
                                className="w-full"
                            >
                                CANCEL PLOT
                            </ActionButton>
                        )}
                </div>
            </div>
        </Panel>
    );
}
