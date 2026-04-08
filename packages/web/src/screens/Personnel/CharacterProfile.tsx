import { useGameState } from "../../hooks/useGameState";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import type { TagVariant } from "../../components/Tag/Tag";
import type { AgentJob } from "@empire-of-evil/engine";

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
    operative: "operative",
    scientist: "scientist",
    troop: "troop",
    administrator: "admin",
    unassigned: "unassigned",
};

interface CharacterProfileProps {
    personId: string;
    onClose: () => void;
}

export function CharacterProfile({ personId, onClose }: CharacterProfileProps) {
    const gameState = useGameState();
    const { persons, governingOrganizations, effectInstances } = gameState;

    const person = persons[personId];

    if (!person) {
        return (
            <Panel>
                <div className="text-text-muted text-[11px]">
                    Agent not found.
                </div>
            </Panel>
        );
    }

    const sortedAttrs = Object.entries(person.attributes).sort(
        (a, b) => b[1] - a[1],
    );
    const sortedSkills = Object.entries(person.skills).sort(
        (a, b) => b[1] - a[1],
    );
    const loyalties = Object.entries(person.loyalties).sort(
        (a, b) => b[1] - a[1],
    );
    const effects = person.activeEffectIds
        .map((id) => effectInstances[id])
        .filter(Boolean);

    return (
        <div className="flex flex-col gap-3">
            <Panel>
                <div className="flex items-start justify-between mb-1">
                    <div>
                        <div className="font-mono text-sm text-text-primary mb-1">
                            {person.name}
                        </div>
                        {person.agentStatus && (
                            <Tag
                                variant={
                                    JOB_TAG_VARIANT[person.agentStatus.job]
                                }
                            >
                                {person.agentStatus.job.toUpperCase()}
                            </Tag>
                        )}
                    </div>
                    <div className="flex items-center gap-1">
                        <button
                            type="button"
                            onClick={onClose}
                            className="font-mono text-[10px] text-text-muted hover:text-text-secondary tracking-[0.06em] cursor-pointer"
                        >
                            ✕ CLOSE
                        </button>
                    </div>
                </div>
                <div className="mt-2 flex gap-4 text-[11px]">
                    <div>
                        <span className="text-text-muted">HEALTH </span>
                        <span className="font-mono text-text-primary">
                            {person.health}
                        </span>
                    </div>
                    {person.agentStatus && (
                        <div>
                            <span className="text-text-muted">SALARY </span>
                            <span className="font-mono text-text-primary">
                                ${person.agentStatus.salary}/day
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex gap-2 py-2">
                    {person.agentStatus && (
                        <>
                            <ActionButton onClick={() => {}}>
                                REASSIGN
                            </ActionButton>
                            <ActionButton onClick={() => {}}>
                                ADD TO SQUAD
                            </ActionButton>
                            <ActionButton onClick={() => {}}>MOVE</ActionButton>
                            <ActionButton onClick={() => {}}>FIRE</ActionButton>
                            <ActionButton
                                variant="destructive"
                                onClick={() => {}}
                            >
                                TERMINATE
                            </ActionButton>
                        </>
                    )}
                </div>
            </Panel>

            {sortedAttrs.length > 0 && (
                <Panel title="ATTRIBUTES">
                    <div className="grid grid-cols-2 gap-x-4 gap-y-2">
                        {sortedAttrs.map(([key, value]) => (
                            <div key={key}>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span className="text-text-muted tracking-[0.06em]">
                                        {key.toUpperCase()}
                                    </span>
                                    <span className="font-mono text-text-secondary">
                                        {Math.round(value)}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={Math.min(100, value)}
                                    color="info"
                                    height={2}
                                />
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            {sortedSkills.length > 0 && (
                <Panel title="SKILLS">
                    <div className="space-y-2">
                        {sortedSkills.map(([key, value]) => (
                            <div key={key}>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span className="text-text-muted tracking-[0.06em]">
                                        {key.toUpperCase()}
                                    </span>
                                    <span className="font-mono text-text-secondary">
                                        {Math.round(value)}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={Math.min(100, value)}
                                    color="positive"
                                    height={2}
                                />
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            {loyalties.length > 0 && (
                <Panel title="LOYALTIES">
                    <div className="mb-2 flex items-center gap-1">
                        <Tooltip
                            variant="rich"
                            richTitle="LOYALTY INTERPRETATION"
                            content="Loyalty reflects alignment with each organization. Higher values indicate stronger commitment and lower defection risk."
                        >
                            <button
                                type="button"
                                aria-label="Loyalty help"
                                className="inline-flex h-4 w-4 items-center justify-center rounded-sm border border-border-subtle bg-bg-hover text-[9px] text-text-secondary"
                            >
                                ?
                            </button>
                        </Tooltip>
                        <span className="font-mono text-[10px] text-text-muted tracking-[0.06em]">
                            ORGANIZATION ALIGNMENT
                        </span>
                    </div>
                    <div className="space-y-2">
                        {loyalties.map(([orgId, value]) => (
                            <div key={orgId}>
                                <div className="flex justify-between text-[10px] mb-0.5">
                                    <span className="text-text-muted tracking-[0.06em]">
                                        {governingOrganizations[orgId]?.name ??
                                            orgId}
                                    </span>
                                    <span className="font-mono text-text-secondary">
                                        {Math.round(value)}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={Math.min(100, value)}
                                    color={
                                        value >= 60
                                            ? "positive"
                                            : value >= 30
                                              ? "warning"
                                              : "evil"
                                    }
                                    height={2}
                                />
                            </div>
                        ))}
                    </div>
                </Panel>
            )}

            <Panel title="STATUS EFFECTS">
                {effects.length === 0 ? (
                    <div className="text-text-muted text-[11px]">
                        No active effects.
                    </div>
                ) : (
                    <div className="flex flex-wrap gap-1">
                        {effects.map((e) => (
                            <Tag key={e!.id} variant="neutral">
                                {e!.effectId.toUpperCase()}
                            </Tag>
                        ))}
                    </div>
                )}
            </Panel>
        </div>
    );
}
