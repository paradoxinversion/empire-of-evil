import React from "react";
import { useState } from "react";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { ConfirmationModal } from "../../components/ConfirmationModal/ConfirmationModal";
import { AgentPicker } from "../../components/AgentPicker/AgentPicker";
import { ZoneSelector } from "../../components/ZoneSelector/ZoneSelector";
import { Tooltip } from "../../components/Tooltip/Tooltip";
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
    const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
    const [isAgentPickerOpen, setIsAgentPickerOpen] = useState(false);
    const [isLaunchAgentPickerOpen, setIsLaunchAgentPickerOpen] =
        useState(false);
    const [selectedZoneId, setSelectedZoneId] = useState<string | null>(null);

    const startPlot = useGameStore((s) => s.startPlot);
    const startPlotWithAgents = useGameStore((s) => s.startPlotWithAgents);
    const cancelPlot = useGameStore((s) => s.cancelPlot);
    const assignAgentToPlot = useGameStore((s) => s.assignAgentToPlot);
    const removeAgentFromPlot = useGameStore((s) => s.removeAgentFromPlot);
    const gameState = useGameStore((s) => s.gameState);
    const currentDay = gameState?.date ?? 0;

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
    const requiredZoneCount = def?.requirements?.zoneCount ?? 0;
    const requiresTargetZone = requiredZoneCount > 0;
    const requiredAgentCount = def?.requirements?.agentCount ?? 0;
    const insufficientAgentsForLaunch =
        requiredAgentCount > 0 && availableAgents.length < requiredAgentCount;
    const zoneOptions = Object.values(gameState?.zones ?? {}).map((zone) => ({
        id: zone.id,
        name: zone.name,
        nationName: gameState?.nations?.[zone.nationId]?.name ?? zone.nationId,
        controllingOrgName:
            gameState?.governingOrganizations?.[zone.governingOrganizationId]
                ?.name ?? zone.governingOrganizationId,
        intelLevel: zone.intelLevel,
    }));

    const handleConfirmCancel = () => {
        if (!("record" in (enriched as any)) || !(enriched as any).record) {
            return;
        }

        cancelPlot((enriched as EnrichedActivePlot).record.id);
        setIsCancelModalOpen(false);
    };

    const handleAssignAgents = (agentIds: string[]) => {
        if (!("record" in (enriched as any)) || !(enriched as any).record) {
            return;
        }

        for (const agentId of agentIds) {
            assignAgentToPlot(
                (enriched as EnrichedActivePlot).record.id,
                agentId,
            );
        }
    };

    const handleStartPlot = (agentIds: string[]) => {
        if ("record" in (enriched as any)) {
            return;
        }

        if (!def?.id) {
            return;
        }

        if (agentIds.length < requiredAgentCount) {
            return;
        }

        const targetZoneId = requiresTargetZone
            ? (selectedZoneId ?? undefined)
            : undefined;

        if (typeof startPlotWithAgents === "function") {
            startPlotWithAgents(def.id, agentIds, targetZoneId);
        } else {
            startPlot(def.id, targetZoneId);
        }
    };

    return (
        <>
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
                                variant={
                                    (def?.tier ? `t${def.tier}` : "t1") as any
                                }
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
                                    {(enriched as EnrichedActivePlot)
                                        .targetLabel ?? "—"}
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
                                {activeRecord &&
                                    isFinite(expectedDaysNeeded) && (
                                        <div className="text-[10px] text-text-muted">
                                            {`in ${Math.min(
                                                (enriched as EnrichedActivePlot)
                                                    .record.daysRemaining,
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
                                value={
                                    (enriched as EnrichedActivePlot).progressPct
                                }
                                color="evil"
                                height={8}
                            />
                            <div className="text-text-muted text-[11px] mt-1">
                                {(enriched as EnrichedActivePlot).progressPct}%
                            </div>
                        </div>
                    )}

                    <div>
                        <div className="mb-1 flex items-center gap-1 text-text-muted text-[11px]">
                            <span>Requirements</span>
                            <Tooltip
                                variant="rich"
                                richTitle="PRE-FLIGHT CHECK"
                                content="Use this section to confirm agent count, research prerequisites, and target requirements before launch."
                            >
                                <button
                                    type="button"
                                    aria-label="Requirements help"
                                    className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-border-subtle bg-bg-hover text-[9px] text-text-secondary"
                                >
                                    ?
                                </button>
                            </Tooltip>
                        </div>
                        <div className="text-text-muted text-[11px]">
                            Agents required:{" "}
                            {def?.requirements?.agentCount ?? 0}
                        </div>
                        <div className="text-text-muted text-[11px]">
                            Research prerequisites:
                            <div className="mt-1">
                                {(def?.requirements?.researchIds ?? [])
                                    .length === 0 && (
                                    <span className="text-text-muted">
                                        None
                                    </span>
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
                        {!("record" in (enriched as any)) &&
                        requiresTargetZone ? (
                            <div className="mt-3">
                                <ZoneSelector
                                    zones={zoneOptions}
                                    selectedZoneId={selectedZoneId}
                                    onChange={setSelectedZoneId}
                                />
                            </div>
                        ) : null}
                        {!("record" in (enriched as any)) &&
                        insufficientAgentsForLaunch ? (
                            <div className="mt-2 text-[10px] text-text-muted">
                                {`Need ${requiredAgentCount} available agents to launch this plot. Only ${availableAgents.length} available.`}
                            </div>
                        ) : null}
                    </div>

                    {"record" in (enriched as any) && (
                        <div>
                            <div className="text-text-muted text-[11px] mb-1">
                                ASSIGNED AGENTS
                            </div>
                            {(
                                (enriched as EnrichedActivePlot)
                                    .assignedAgents ?? []
                            ).length === 0 ? (
                                <div className="text-[10px] text-text-muted">
                                    None assigned.
                                </div>
                            ) : (
                                (
                                    enriched as EnrichedActivePlot
                                ).assignedAgents.map((person) => (
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
                                ))
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
                                <ActionButton
                                    variant="default"
                                    onClick={() => setIsAgentPickerOpen(true)}
                                    className="w-full"
                                >
                                    ADD AGENTS
                                </ActionButton>
                            )}
                        </div>
                    )}

                    <div className="mt-4">
                        {"status" in (enriched as any) &&
                            (enriched as any).status === "available" && (
                                <ActionButton
                                    variant="primary"
                                    onClick={() => {
                                        if (
                                            (def?.requirements?.agentCount ??
                                                0) > 0
                                        ) {
                                            setIsLaunchAgentPickerOpen(true);
                                            return;
                                        }

                                        if (requiresTargetZone) {
                                            startPlot(
                                                def?.id ?? "",
                                                selectedZoneId ?? undefined,
                                            );
                                            return;
                                        }

                                        startPlot(def?.id ?? "");
                                    }}
                                    disabled={
                                        (requiresTargetZone &&
                                            !selectedZoneId) ||
                                        insufficientAgentsForLaunch
                                    }
                                    className="w-full"
                                >
                                    LAUNCH PLOT
                                </ActionButton>
                            )}

                        {"record" in (enriched as any) &&
                            (enriched as any).record && (
                                <ActionButton
                                    variant="destructive"
                                    onClick={() => setIsCancelModalOpen(true)}
                                    className="w-full"
                                >
                                    CANCEL PLOT
                                </ActionButton>
                            )}
                    </div>
                </div>
            </Panel>
            <ConfirmationModal
                isOpen={isCancelModalOpen}
                onClose={() => setIsCancelModalOpen(false)}
                onConfirm={handleConfirmCancel}
                title="CANCEL PLOT"
                description="You are about to abort this plot. This cannot be undone."
                consequenceSummary="Assigned agents will be removed from the operation and any staged progress will be lost."
                confirmLabel="CONFIRM"
                confirmVariant="destructive"
                preventEnterConfirm
            />
            <AgentPicker
                isOpen={isAgentPickerOpen}
                onClose={() => setIsAgentPickerOpen(false)}
                onConfirm={handleAssignAgents}
                agents={availableAgents}
                relevantSkillKey={stageDrivers[0]}
                getLocationLabel={(person) => person.zoneId}
            />
            <AgentPicker
                isOpen={isLaunchAgentPickerOpen}
                onClose={() => setIsLaunchAgentPickerOpen(false)}
                onConfirm={handleStartPlot}
                agents={availableAgents}
                title="ADD AGENTS TO LAUNCH"
                minSelectionCount={requiredAgentCount}
                getLocationLabel={(person) => person.zoneId}
            />
        </>
    );
}
