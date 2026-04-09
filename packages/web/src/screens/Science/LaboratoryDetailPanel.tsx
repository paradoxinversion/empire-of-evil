import { useState } from "react";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { AgentPicker } from "../../components/AgentPicker/AgentPicker";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { useGameStore } from "../../store/gameStore";
import type { LaboratoryDetailRecord } from "./ScienceSelectors";

type LaboratoryDetailPanelProps = {
    laboratory: LaboratoryDetailRecord | null;
};

export function LaboratoryDetailPanel({
    laboratory,
}: LaboratoryDetailPanelProps) {
    const [isScientistPickerOpen, setIsScientistPickerOpen] = useState(false);
    const assignAgentToBuilding = useGameStore((s) => s.assignAgentToBuilding);
    const removeAgentFromBuilding = useGameStore(
        (s) => s.removeAgentFromBuilding,
    );

    if (!laboratory) {
        return (
            <Panel title="LABORATORY DETAIL">
                <div className="text-[11px] text-text-muted">
                    Select a laboratory to view details.
                </div>
            </Panel>
        );
    }

    const assignedCount = laboratory.assignedScientists.length;
    const isAtCapacity = assignedCount >= laboratory.capacity;

    return (
        <>
            <Panel title="LABORATORY DETAIL">
                <div className="space-y-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="space-y-1">
                            <div className="font-mono text-text-primary">
                                {laboratory.name}
                            </div>
                            <div className="text-[12px] text-text-muted">
                                {laboratory.description}
                            </div>
                        </div>
                        <Tag
                            variant={
                                laboratory.status === "SECURED"
                                    ? "stable"
                                    : "unrest"
                            }
                        >
                            {laboratory.status}
                        </Tag>
                    </div>

                    <div className="grid grid-cols-2 gap-3 text-[11px]">
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                TYPE
                            </div>
                            <div className="text-text-secondary">
                                {laboratory.typeName}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                ZONE
                            </div>
                            <div className="text-text-secondary">
                                {laboratory.zoneName}
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                SCIENCE OUTPUT
                            </div>
                            <div className="font-mono text-text-secondary">
                                {laboratory.outputScience.toLocaleString(
                                    "en-US",
                                )}{" "}
                                SCI
                            </div>
                        </div>
                        <div>
                            <div className="font-mono text-[9px] text-text-muted">
                                UPKEEP
                            </div>
                            <div className="font-mono text-text-secondary">
                                ${laboratory.upkeep.toLocaleString("en-US")}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <div className="flex items-center justify-between gap-3">
                            <div>
                                <div className="font-mono text-[10px] tracking-[0.08em] text-text-muted">
                                    ASSIGNED SCIENTISTS
                                </div>
                                <div className="font-mono text-[10px] text-text-secondary">
                                    {assignedCount} / {laboratory.capacity}{" "}
                                    STAFFED
                                </div>
                            </div>
                            <ActionButton
                                variant="primary"
                                onClick={() => setIsScientistPickerOpen(true)}
                                disabled={
                                    isAtCapacity ||
                                    laboratory.availableScientists.length === 0
                                }
                            >
                                ASSIGN SCIENTIST
                            </ActionButton>
                        </div>

                        {laboratory.assignedScientists.length === 0 ? (
                            <div className="text-[11px] text-text-muted">
                                No scientists assigned.
                            </div>
                        ) : (
                            laboratory.assignedScientists.map((scientist) => (
                                <div
                                    key={scientist.id}
                                    className="flex items-center justify-between border-b border-bg-elevated py-1.5 last:border-0"
                                >
                                    <div>
                                        <div className="font-mono text-[11px] text-text-primary">
                                            {scientist.name}
                                        </div>
                                        <div className="text-[10px] text-text-muted">
                                            SCIENTIST
                                        </div>
                                    </div>
                                    <ActionButton
                                        variant="destructive"
                                        onClick={() =>
                                            removeAgentFromBuilding(
                                                laboratory.buildingId,
                                                scientist.id,
                                            )
                                        }
                                        className="px-2 py-1 text-[9px]"
                                    >
                                        REMOVE
                                    </ActionButton>
                                </div>
                            ))
                        )}
                    </div>
                </div>
            </Panel>

            <AgentPicker
                isOpen={isScientistPickerOpen}
                onClose={() => setIsScientistPickerOpen(false)}
                onConfirm={(agentIds) => {
                    for (const agentId of agentIds) {
                        assignAgentToBuilding(laboratory.buildingId, agentId);
                    }
                }}
                agents={laboratory.availableScientists}
                title="ASSIGN SCIENTISTS"
                relevantSkillKey={laboratory.preferredSkills[0]}
                getLocationLabel={(person) => person.zoneId}
            />
        </>
    );
}
