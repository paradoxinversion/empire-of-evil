import { useState } from "react";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { AgentPicker } from "../../components/AgentPicker/AgentPicker";
import type {
    EnrichedProject,
    ResearchStatus,
} from "../../hooks/useResearch.js";
import type { TagVariant } from "../../components/Tag/Tag";
import { useGameStore } from "../../store/gameStore.js";
import { BUNDLED_CONFIG } from "../../store/gameStore.js";
import type { Person } from "@empire-of-evil/engine";

const STATUS_VARIANT: Record<ResearchStatus, TagVariant> = {
    completed: "active",
    active: "research",
    available: "neutral",
    locked: "unassigned",
};

function formatBranch(branch: string): string {
    return branch.replace(/-/g, " ").toUpperCase();
}

function getUnlockNames(
    ids: string[],
    type: "research" | "plot" | "activity",
): string[] {
    const config = BUNDLED_CONFIG;
    return ids.map((id) => {
        if (type === "research") {
            return config.researchProjects.find((p) => p.id === id)?.name ?? id;
        }
        return id;
    });
}

function AgentRow({
    person,
    action,
    actionLabel,
    onAction,
}: {
    person: Person;
    action: "assign" | "remove";
    actionLabel: string;
    onAction: () => void;
}) {
    return (
        <div className="flex items-center justify-between py-1 border-b border-bg-elevated last:border-0">
            <span className="font-mono text-[11px] text-text-primary">
                {person.name}
            </span>
            <ActionButton
                variant={action === "remove" ? "destructive" : "default"}
                onClick={onAction}
                className="text-[9px] py-0.5 px-1.5"
            >
                {actionLabel}
            </ActionButton>
        </div>
    );
}

interface ResearchDetailPanelProps {
    ep: EnrichedProject;
    availableScientists: Person[];
    allProjects: EnrichedProject[];
}

export function ResearchDetailPanel({
    ep,
    availableScientists,
    allProjects,
}: ResearchDetailPanelProps) {
    const [isScientistPickerOpen, setIsScientistPickerOpen] = useState(false);
    const startResearch = useGameStore((s) => s.startResearch);
    const cancelResearch = useGameStore((s) => s.cancelResearch);
    const assignAgentToResearch = useGameStore((s) => s.assignAgentToResearch);
    const removeAgentFromResearch = useGameStore(
        (s) => s.removeAgentFromResearch,
    );

    const {
        definition: def,
        status,
        activeRecord,
        progressPct,
        daysRemaining,
        assignedAgents,
    } = ep;

    const prereqMap = new Map(allProjects.map((p) => [p.definition.id, p]));

    const unlockResearchNames = getUnlockNames(
        def.unlocks.researchIds,
        "research",
    );

    const handleAssignScientists = (agentIds: string[]) => {
        if (!activeRecord) {
            return;
        }

        for (const agentId of agentIds) {
            assignAgentToResearch(activeRecord.id, agentId);
        }
    };

    return (
        <>
            <Panel>
                {/* Header */}
                <div className="mb-3">
                    <div className="font-mono text-[13px] text-text-primary mb-1">
                        {def.name}
                    </div>
                    <div className="flex gap-1.5">
                        <Tag variant="research">{formatBranch(def.branch)}</Tag>
                        <Tag variant={STATUS_VARIANT[status]}>
                            {status.toUpperCase()}
                        </Tag>
                    </div>
                </div>

                {/* Description */}
                <div className="text-[11px] text-text-secondary mb-3 leading-relaxed">
                    {def.description}
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 mb-3 font-mono text-[10px]">
                    <div>
                        <span className="text-text-muted">COST </span>
                        <span className="text-text-primary">
                            ${def.cost.toLocaleString()}
                        </span>
                    </div>
                    <div>
                        <span className="text-text-muted">DURATION </span>
                        <span className="text-text-primary">
                            {def.completionDays}d
                        </span>
                    </div>
                    <div>
                        <span className="text-text-muted">SCI REQ </span>
                        <span className="text-text-primary">
                            {def.scienceRequired}
                        </span>
                    </div>
                </div>

                {/* Skill drivers */}
                {def.skillDrivers.length > 0 && (
                    <div className="mb-3">
                        <div className="font-mono text-[9px] tracking-widest text-text-muted mb-1">
                            SKILL DRIVERS
                        </div>
                        <div className="flex flex-wrap gap-1">
                            {def.skillDrivers.map((skill) => (
                                <Tag key={skill} variant="neutral">
                                    {skill.toUpperCase()}
                                </Tag>
                            ))}
                        </div>
                    </div>
                )}

                {/* Prerequisites */}
                {def.prerequisites.length > 0 && (
                    <div className="mb-3">
                        <div className="font-mono text-[9px] tracking-widest text-text-muted mb-1">
                            PREREQUISITES
                        </div>
                        <div className="flex flex-col gap-0.5">
                            {def.prerequisites.map((id) => {
                                const prereq = prereqMap.get(id);
                                const done = prereq?.status === "completed";
                                return (
                                    <div
                                        key={id}
                                        className="flex items-center gap-1.5 font-mono text-[10px]"
                                    >
                                        <span
                                            className={
                                                done
                                                    ? "text-positive"
                                                    : "text-text-muted"
                                            }
                                        >
                                            {done ? "✓" : "○"}
                                        </span>
                                        <span
                                            className={
                                                done
                                                    ? "text-text-secondary"
                                                    : "text-text-muted"
                                            }
                                        >
                                            {prereq?.definition.name ?? id}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>
                )}

                {/* Unlocks */}
                {(def.unlocks.researchIds.length > 0 ||
                    def.unlocks.plotIds.length > 0 ||
                    def.unlocks.activityIds.length > 0 ||
                    def.unlocks.effectIds.length > 0) && (
                    <div className="mb-3">
                        <div className="font-mono text-[9px] tracking-widest text-text-muted mb-1">
                            UNLOCKS
                        </div>
                        <div className="flex flex-col gap-0.5 font-mono text-[10px] text-text-secondary">
                            {unlockResearchNames.map((name) => (
                                <div key={name}>
                                    <Tag variant="research">RESEARCH</Tag>{" "}
                                    {name}
                                </div>
                            ))}
                            {def.unlocks.plotIds.map((id) => (
                                <div key={id}>
                                    <Tag variant="plot">PLOT</Tag> {id}
                                </div>
                            ))}
                            {def.unlocks.activityIds.map((id) => (
                                <div key={id}>
                                    <Tag variant="activity">ACTIVITY</Tag> {id}
                                </div>
                            ))}
                            {def.unlocks.effectIds.map((id) => (
                                <div key={id}>
                                    <Tag variant="neutral">EFFECT</Tag> {id}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Active: progress */}
                {status === "active" && activeRecord && (
                    <div className="mb-3">
                        <div className="font-mono text-[9px] tracking-widest text-text-muted mb-1">
                            PROGRESS
                        </div>
                        <div className="mb-1">
                            <ProgressBar
                                value={progressPct}
                                color="info"
                                height={4}
                            />
                        </div>
                        <div className="flex justify-between font-mono text-[10px] text-text-muted">
                            <span>{progressPct}% complete</span>
                            <span>{daysRemaining}d remaining</span>
                        </div>
                        <div className="font-mono text-[10px] text-text-muted mt-0.5">
                            Score: {Math.round(activeRecord.accumulatedScore)} /{" "}
                            {def.scienceRequired}
                        </div>
                    </div>
                )}

                {/* Active: assigned scientists */}
                {status === "active" && activeRecord && (
                    <div className="mb-3">
                        <div className="font-mono text-[9px] tracking-widest text-text-muted mb-1">
                            ASSIGNED SCIENTISTS ({assignedAgents.length})
                        </div>
                        {assignedAgents.length === 0 ? (
                            <div className="text-[10px] text-text-muted">
                                None assigned.
                            </div>
                        ) : (
                            assignedAgents.map((person) => (
                                <AgentRow
                                    key={person.id}
                                    person={person}
                                    action="remove"
                                    actionLabel="REMOVE"
                                    onAction={() =>
                                        removeAgentFromResearch(
                                            activeRecord.id,
                                            person.id,
                                        )
                                    }
                                />
                            ))
                        )}
                    </div>
                )}

                {/* Active: available scientists */}
                {status === "active" &&
                    activeRecord &&
                    availableScientists.length > 0 && (
                        <div className="mb-3">
                            <div className="font-mono text-[9px] tracking-widest text-text-muted mb-1">
                                AVAILABLE SCIENTISTS
                            </div>
                            <ActionButton
                                variant="default"
                                onClick={() => setIsScientistPickerOpen(true)}
                                className="w-full"
                            >
                                ADD SCIENTISTS
                            </ActionButton>
                        </div>
                    )}

                {/* Action button */}
                <div className="mt-4">
                    {status === "available" && (
                        <ActionButton
                            variant="primary"
                            onClick={() => startResearch(def.id)}
                            className="w-full"
                        >
                            BEGIN RESEARCH
                        </ActionButton>
                    )}
                    {status === "active" && activeRecord && (
                        <ActionButton
                            variant="destructive"
                            onClick={() => cancelResearch(activeRecord.id)}
                            className="w-full"
                        >
                            CANCEL RESEARCH
                        </ActionButton>
                    )}
                    {status === "completed" && (
                        <ActionButton
                            disabled
                            onClick={() => {}}
                            className="w-full"
                        >
                            COMPLETED
                        </ActionButton>
                    )}
                    {status === "locked" && (
                        <ActionButton
                            disabled
                            onClick={() => {}}
                            className="w-full"
                        >
                            PREREQUISITES REQUIRED
                        </ActionButton>
                    )}
                </div>
            </Panel>
            <AgentPicker
                isOpen={isScientistPickerOpen}
                onClose={() => setIsScientistPickerOpen(false)}
                onConfirm={handleAssignScientists}
                agents={availableScientists}
                title="ADD SCIENTISTS"
                relevantSkillKey={def.skillDrivers[0]}
                getLocationLabel={(person) => person.zoneId}
            />
        </>
    );
}
