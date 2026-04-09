import { useState } from "react";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { AgentPicker } from "../../components/AgentPicker/AgentPicker";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { useGameStore } from "../../store/gameStore";
import type { EmpireBuildingDetailRecord } from "./EmpireSelectors";

type BuildingDetailPanelProps = {
    building: EmpireBuildingDetailRecord | null;
};

function formatOutputResources(output: {
    money: number;
    science: number;
    infrastructure: number;
}): string {
    const parts: string[] = [];
    if (output.money > 0) {
        parts.push(`$${output.money.toLocaleString("en-US")}`);
    }
    if (output.science > 0) {
        parts.push(`S${output.science.toLocaleString("en-US")}`);
    }
    if (output.infrastructure > 0) {
        parts.push(`I${output.infrastructure.toLocaleString("en-US")}`);
    }
    return parts.length > 0 ? parts.join(" | ") : "$0";
}

export function BuildingDetailPanel({ building }: BuildingDetailPanelProps) {
    const [isAgentPickerOpen, setIsAgentPickerOpen] = useState(false);
    const assignAgentToBuilding = useGameStore((s) => s.assignAgentToBuilding);
    const removeAgentFromBuilding = useGameStore(
        (s) => s.removeAgentFromBuilding,
    );

    if (!building) {
        return (
            <Panel title="BUILDING DETAIL">
                <div className="text-[11px] text-text-muted">
                    Select a building to view details.
                </div>
            </Panel>
        );
    }

    const assignedCount = building.assignedAgents.length;
    const isAtCapacity = assignedCount >= building.capacity;

    return (
        <>
            <Panel title="BUILDING DETAIL">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <div className="font-mono text-text-primary">
                                {building.name}
                            </div>
                            <div className="text-[12px] text-text-muted">
                                {building.description}
                            </div>
                        </div>
                        <Tag
                            variant={
                                building.status === "SECURED"
                                    ? "stable"
                                    : "unrest"
                            }
                        >
                            {building.status}
                        </Tag>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                TYPE
                            </div>
                            <div className="text-text-secondary">
                                {building.typeName}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                ZONE
                            </div>
                            <div className="text-text-secondary">
                                {building.zoneName}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                TILE
                            </div>
                            <div className="font-mono text-text-secondary">
                                {building.tileLabel}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                INTEL
                            </div>
                            <div className="font-mono text-text-secondary">
                                {building.intelLevel}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                OUTPUT
                            </div>
                            <div className="font-mono text-text-secondary">
                                {formatOutputResources(
                                    building.outputResources,
                                )}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                UPKEEP
                            </div>
                            <div className="font-mono text-text-secondary">
                                ${building.upkeep.toLocaleString("en-US")}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="font-mono text-[10px] tracking-[0.08em] text-text-muted">
                                    ASSIGNED AGENTS
                                </div>
                                <div className="font-mono text-[10px] text-text-secondary">
                                    {assignedCount} / {building.capacity}{" "}
                                    STAFFED
                                </div>
                            </div>
                            <ActionButton
                                variant="primary"
                                onClick={() => setIsAgentPickerOpen(true)}
                                disabled={
                                    isAtCapacity ||
                                    building.availableAgents.length === 0
                                }
                            >
                                ASSIGN AGENT
                            </ActionButton>
                        </div>

                        {building.assignedAgents.length === 0 ? (
                            <div className="text-[11px] text-text-muted">
                                No agents assigned.
                            </div>
                        ) : (
                            building.assignedAgents.map((agent) => (
                                <div
                                    key={agent.id}
                                    className="flex items-center justify-between border-b border-bg-elevated py-1.5 last:border-0"
                                >
                                    <div>
                                        <div className="font-mono text-[11px] text-text-primary">
                                            {agent.name}
                                        </div>
                                        <div className="text-[10px] text-text-muted">
                                            {agent.agentStatus?.job.toUpperCase() ??
                                                "UNASSIGNED"}
                                        </div>
                                    </div>
                                    <ActionButton
                                        variant="destructive"
                                        onClick={() =>
                                            removeAgentFromBuilding(
                                                building.buildingId,
                                                agent.id,
                                            )
                                        }
                                        className="px-2 py-1 text-[9px]"
                                    >
                                        UNASSIGN
                                    </ActionButton>
                                </div>
                            ))
                        )}
                    </div>

                    <div>
                        <div className="font-mono text-[10px] tracking-[0.08em] text-text-muted">
                            PREFERRED SKILLS
                        </div>
                        <div className="mt-1 text-[11px] text-text-secondary">
                            {building.preferredSkills.length > 0
                                ? building.preferredSkills.join(", ")
                                : "None"}
                        </div>
                    </div>
                </div>
            </Panel>

            <AgentPicker
                isOpen={isAgentPickerOpen}
                onClose={() => setIsAgentPickerOpen(false)}
                onConfirm={(agentIds) => {
                    for (const agentId of agentIds) {
                        assignAgentToBuilding(building.buildingId, agentId);
                    }
                }}
                agents={building.availableAgents}
                title="ASSIGN BUILDING AGENTS"
                relevantSkillKey={building.preferredSkills[0]}
                getLocationLabel={(person) => person.zoneId}
            />
        </>
    );
}
