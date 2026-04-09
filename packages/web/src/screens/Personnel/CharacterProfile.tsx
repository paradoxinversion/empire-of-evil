import { useState } from "react";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { Tooltip } from "../../components/Tooltip/Tooltip";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { Modal } from "../../components/Modal/Modal";
import { ConfirmationModal } from "../../components/ConfirmationModal/ConfirmationModal";
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
    const addAgentToSquad = useGameStore((s) => s.addAgentToSquad);
    const reassignAgentJob = useGameStore((s) => s.reassignAgentJob);
    const fireAgent = useGameStore((s) => s.fireAgent);
    const terminatePerson = useGameStore((s) => s.terminatePerson);
    const { persons, governingOrganizations, effectInstances, squads, zones } =
        gameState;
    const [isAddToSquadOpen, setIsAddToSquadOpen] = useState(false);
    const [selectedSquadId, setSelectedSquadId] = useState<string>("");
    const [isReassignOpen, setIsReassignOpen] = useState(false);
    const [selectedJob, setSelectedJob] = useState<AgentJob>("unassigned");
    const [isMoveOpen, setIsMoveOpen] = useState(false);
    const [isFireConfirmOpen, setIsFireConfirmOpen] = useState(false);
    const [isTerminateConfirmOpen, setIsTerminateConfirmOpen] = useState(false);

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
    const availableSquads = Object.values(squads ?? {}).filter(
        (squad) => !squad.memberIds.includes(person.id),
    );

    const openAddToSquadModal = () => {
        const firstSquad = availableSquads[0];
        setSelectedSquadId(firstSquad?.id ?? "");
        setIsAddToSquadOpen(true);
    };

    const confirmAddToSquad = () => {
        if (!selectedSquadId) return;
        addAgentToSquad(selectedSquadId, person.id);
        setIsAddToSquadOpen(false);
    };

    const openReassignModal = () => {
        setSelectedJob(person.agentStatus?.job ?? "unassigned");
        setIsReassignOpen(true);
    };

    const confirmReassign = () => {
        reassignAgentJob(person.id, selectedJob);
        setIsReassignOpen(false);
    };

    const confirmFire = () => {
        fireAgent(person.id);
        setIsFireConfirmOpen(false);
    };

    const confirmTerminate = () => {
        terminatePerson(person.id);
        setIsTerminateConfirmOpen(false);
    };

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
                            <ActionButton onClick={openReassignModal}>
                                REASSIGN
                            </ActionButton>
                            <ActionButton
                                onClick={openAddToSquadModal}
                                disabled={availableSquads.length === 0}
                            >
                                ADD TO SQUAD
                            </ActionButton>
                            <ActionButton onClick={() => setIsMoveOpen(true)}>
                                MOVE
                            </ActionButton>
                            <ActionButton
                                onClick={() => setIsFireConfirmOpen(true)}
                            >
                                FIRE
                            </ActionButton>
                            <ActionButton
                                variant="destructive"
                                onClick={() => setIsTerminateConfirmOpen(true)}
                            >
                                TERMINATE
                            </ActionButton>
                        </>
                    )}
                </div>
            </Panel>

            <Modal
                isOpen={isReassignOpen}
                onClose={() => setIsReassignOpen(false)}
                title="REASSIGN AGENT"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setIsReassignOpen(false)}
                            className="font-mono text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-sm border border-border-default bg-bg-elevated text-text-primary transition-colors duration-fast hover:bg-bg-hover hover:border-border-strong"
                        >
                            CANCEL
                        </button>
                        <ActionButton onClick={confirmReassign}>
                            CONFIRM REASSIGN
                        </ActionButton>
                    </>
                }
            >
                <div className="space-y-2">
                    <label
                        htmlFor="reassign-job-select"
                        className="font-mono text-[10px] text-text-muted tracking-[0.06em]"
                    >
                        DEPARTMENT
                    </label>
                    <select
                        id="reassign-job-select"
                        value={selectedJob}
                        onChange={(e) =>
                            setSelectedJob(e.target.value as AgentJob)
                        }
                        className="w-full font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red"
                    >
                        <option value="operative">OPERATIVE</option>
                        <option value="scientist">SCIENTIST</option>
                        <option value="administrator">ADMINISTRATOR</option>
                        <option value="troop">TROOP</option>
                        <option value="unassigned">UNASSIGNED</option>
                    </select>
                </div>
            </Modal>

            <Modal
                isOpen={isMoveOpen}
                onClose={() => setIsMoveOpen(false)}
                title="MOVE AGENT"
                description="Movement wiring is planned for a later phase."
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setIsMoveOpen(false)}
                            className="font-mono text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-sm border border-border-default bg-bg-elevated text-text-primary transition-colors duration-fast hover:bg-bg-hover hover:border-border-strong"
                        >
                            CLOSE
                        </button>
                        <ActionButton onClick={() => {}} disabled>
                            MOVE NOT YET WIRED
                        </ActionButton>
                    </>
                }
            >
                <div className="space-y-2">
                    <div className="font-mono text-[10px] text-text-muted tracking-[0.06em]">
                        TARGET ZONE
                    </div>
                    <select
                        value={person.zoneId}
                        disabled
                        className="w-full font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none"
                    >
                        {Object.values(zones ?? {}).map((zone) => (
                            <option key={zone.id} value={zone.id}>
                                {zone.name}
                            </option>
                        ))}
                    </select>
                </div>
            </Modal>

            <Modal
                isOpen={isAddToSquadOpen}
                onClose={() => setIsAddToSquadOpen(false)}
                title="ADD TO SQUAD"
                footer={
                    <>
                        <button
                            type="button"
                            onClick={() => setIsAddToSquadOpen(false)}
                            className="font-mono text-[11px] tracking-[0.08em] px-3 py-1.5 rounded-sm border border-border-default bg-bg-elevated text-text-primary transition-colors duration-fast hover:bg-bg-hover hover:border-border-strong"
                        >
                            CANCEL
                        </button>
                        <ActionButton onClick={confirmAddToSquad}>
                            CONFIRM ADD TO SQUAD
                        </ActionButton>
                    </>
                }
            >
                <div className="space-y-2">
                    <label
                        htmlFor="add-to-squad-select"
                        className="font-mono text-[10px] text-text-muted tracking-[0.06em]"
                    >
                        SQUAD
                    </label>
                    <select
                        id="add-to-squad-select"
                        value={selectedSquadId}
                        onChange={(e) => setSelectedSquadId(e.target.value)}
                        className="w-full font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red"
                    >
                        {availableSquads.map((squad) => (
                            <option key={squad.id} value={squad.id}>
                                {squad.name}
                            </option>
                        ))}
                    </select>
                </div>
            </Modal>

            <ConfirmationModal
                isOpen={isFireConfirmOpen}
                onClose={() => setIsFireConfirmOpen(false)}
                onConfirm={confirmFire}
                title="FIRE AGENT"
                description={`You are about to fire ${person.name}. They will no longer serve as an agent.`}
                consequenceSummary="Agent status will be removed, but this person will remain alive in the world."
                confirmLabel="CONFIRM FIRE"
            />

            <ConfirmationModal
                isOpen={isTerminateConfirmOpen}
                onClose={() => setIsTerminateConfirmOpen(false)}
                onConfirm={confirmTerminate}
                title="TERMINATE AGENT"
                description={`You are about to TERMINATE ${person.name}. This is permanent.`}
                consequenceSummary="This person will be marked dead and removed from all active assignments."
                confirmLabel="CONFIRM TERMINATION"
                confirmVariant="destructive"
                preventEnterConfirm
            />

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
