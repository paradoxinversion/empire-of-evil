import { useState } from "react";
import type { AgentJob } from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { AgentPicker } from "../../components/AgentPicker/AgentPicker";
import type { TagVariant } from "../../components/Tag/Tag";

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
    operative: "operative",
    scientist: "scientist",
    troop: "troop",
    administrator: "admin",
    unassigned: "unassigned",
};

interface InnerCircleTabProps {
    onSelectPerson: (id: string) => void;
}

export function InnerCircleTab({ onSelectPerson }: InnerCircleTabProps) {
    const gameState = useGameState();
    const { persons, empire } = gameState;
    const addInnerCircleMember = useGameStore((s) => s.addInnerCircleMember);
    const removeInnerCircleMember = useGameStore(
        (s) => s.removeInnerCircleMember,
    );
    const reorderInnerCircleMembers = useGameStore(
        (s) => s.reorderInnerCircleMembers,
    );
    const [isPickerOpen, setIsPickerOpen] = useState(false);

    const members = empire.innerCircleIds
        .map((id) => persons[id])
        .filter((p): p is NonNullable<typeof p> => !!p && !p.dead);

    const eligibleAgents = Object.values(persons).filter(
        (person) =>
            !person.dead &&
            person.agentStatus !== undefined &&
            !empire.innerCircleIds.includes(person.id),
    );

    const handleConfirmAdd = (agentIds: string[]) => {
        for (const agentId of agentIds) {
            addInnerCircleMember(agentId);
        }
    };

    const moveMember = (index: number, direction: -1 | 1) => {
        const targetIndex = index + direction;
        if (targetIndex < 0 || targetIndex >= empire.innerCircleIds.length)
            return;

        const reordered = [...empire.innerCircleIds];
        const [moved] = reordered.splice(index, 1);
        reordered.splice(targetIndex, 0, moved);
        reorderInnerCircleMembers(reordered);
    };

    if (members.length === 0) {
        return (
            <div className="space-y-2">
                <Panel>
                    <div className="flex items-center justify-between gap-2">
                        <div className="text-text-muted text-[11px]">
                            No inner circle members appointed.
                        </div>
                        <ActionButton onClick={() => setIsPickerOpen(true)}>
                            + ADD MEMBER
                        </ActionButton>
                    </div>
                </Panel>
                <AgentPicker
                    isOpen={isPickerOpen}
                    onClose={() => setIsPickerOpen(false)}
                    onConfirm={handleConfirmAdd}
                    agents={eligibleAgents}
                    title="ADD INNER CIRCLE MEMBER"
                    getLocationLabel={(person) => person.zoneId}
                />
            </div>
        );
    }

    return (
        <div className="space-y-2">
            <div className="flex justify-end">
                <ActionButton onClick={() => setIsPickerOpen(true)}>
                    + ADD MEMBER
                </ActionButton>
            </div>

            <div className="grid grid-cols-3 gap-2">
                {members.map((person, index) => {
                    const top3Attrs = Object.entries(person.attributes)
                        .sort((a, b) => b[1] - a[1])
                        .slice(0, 3);
                    const loyalty = person.loyalties[empire.id] ?? 0;

                    return (
                        <Panel key={person.id}>
                            <div className="flex justify-end gap-2">
                                <button
                                    type="button"
                                    aria-label={`Move up ${person.name}`}
                                    onClick={() => moveMember(index, -1)}
                                    className="font-mono text-[10px] text-text-muted hover:text-text-primary"
                                >
                                    UP
                                </button>
                                <button
                                    type="button"
                                    aria-label={`Move down ${person.name}`}
                                    onClick={() => moveMember(index, 1)}
                                    className="font-mono text-[10px] text-text-muted hover:text-text-primary"
                                >
                                    DOWN
                                </button>
                                <button
                                    type="button"
                                    onClick={() =>
                                        removeInnerCircleMember(person.id)
                                    }
                                    className="font-mono text-[10px] text-text-muted hover:text-text-primary"
                                >
                                    REMOVE MEMBER
                                </button>
                            </div>
                            <div
                                className="cursor-pointer hover:bg-bg-elevated -m-3 p-3 transition-colors"
                                onClick={() => onSelectPerson(person.id)}
                            >
                                <div className="font-mono text-[12px] text-text-primary mb-1">
                                    {person.name}
                                </div>
                                {person.agentStatus && (
                                    <Tag
                                        variant={
                                            JOB_TAG_VARIANT[
                                                person.agentStatus.job
                                            ]
                                        }
                                    >
                                        {person.agentStatus.job.toUpperCase()}
                                    </Tag>
                                )}

                                {top3Attrs.length > 0 && (
                                    <div className="mt-2 space-y-0.5">
                                        {top3Attrs.map(([key, value]) => (
                                            <div
                                                key={key}
                                                className="flex justify-between font-mono text-[10px]"
                                            >
                                                <span className="text-text-muted">
                                                    {key.toUpperCase()}
                                                </span>
                                                <span className="text-text-secondary">
                                                    {Math.round(value)}
                                                </span>
                                            </div>
                                        ))}
                                    </div>
                                )}

                                <div className="mt-2">
                                    <div className="flex justify-between text-[10px] mb-0.5">
                                        <span className="text-text-muted">
                                            LOYALTY
                                        </span>
                                        <span className="font-mono text-text-secondary">
                                            {Math.round(loyalty)}
                                        </span>
                                    </div>
                                    <ProgressBar
                                        value={Math.min(100, loyalty)}
                                        color={
                                            loyalty >= 60
                                                ? "positive"
                                                : loyalty >= 30
                                                  ? "warning"
                                                  : "evil"
                                        }
                                        height={2}
                                    />
                                </div>
                            </div>
                        </Panel>
                    );
                })}
            </div>

            <AgentPicker
                isOpen={isPickerOpen}
                onClose={() => setIsPickerOpen(false)}
                onConfirm={handleConfirmAdd}
                agents={eligibleAgents}
                title="ADD INNER CIRCLE MEMBER"
                getLocationLabel={(person) => person.zoneId}
            />
        </div>
    );
}
