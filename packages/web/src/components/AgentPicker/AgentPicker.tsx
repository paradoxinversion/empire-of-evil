import { useMemo, useState } from "react";
import type { AgentJob, Person } from "@empire-of-evil/engine";
import { Modal } from "../Modal/Modal";
import { ActionButton } from "../ActionButton/ActionButton";
import { Tag } from "../Tag/Tag";
import type { TagVariant } from "../Tag/Tag";

const DEPARTMENT_VARIANTS: Record<AgentJob, TagVariant> = {
    operative: "operative",
    scientist: "scientist",
    troop: "troop",
    administrator: "admin",
    unassigned: "unassigned",
};

const inputClass =
    "font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red";

export interface AgentPickerProps {
    isOpen: boolean;
    onClose: () => void;
    onConfirm: (agentIds: string[]) => void;
    agents: Person[];
    title?: string;
    relevantSkillKey?: string;
    getLocationLabel?: (person: Person) => string;
}

export function AgentPicker({
    isOpen,
    onClose,
    onConfirm,
    agents,
    title = "ADD AGENTS",
    relevantSkillKey,
    getLocationLabel,
}: AgentPickerProps) {
    const [search, setSearch] = useState("");
    const [department, setDepartment] = useState<AgentJob | "all">("all");
    const [selectedIds, setSelectedIds] = useState<string[]>([]);

    const filteredAgents = useMemo(() => {
        const normalizedSearch = search.trim().toLowerCase();

        return agents
            .filter((person) => {
                if (
                    normalizedSearch &&
                    !person.name.toLowerCase().includes(normalizedSearch)
                ) {
                    return false;
                }

                if (
                    department !== "all" &&
                    person.agentStatus?.job !== department
                ) {
                    return false;
                }

                return true;
            })
            .sort((left, right) => {
                if (!relevantSkillKey) {
                    return left.name.localeCompare(right.name);
                }

                const leftSkill =
                    (left.skills as Record<string, number>)[relevantSkillKey] ??
                    0;
                const rightSkill =
                    (right.skills as Record<string, number>)[
                        relevantSkillKey
                    ] ?? 0;

                if (leftSkill === rightSkill) {
                    return left.name.localeCompare(right.name);
                }

                return rightSkill - leftSkill;
            });
    }, [agents, department, relevantSkillKey, search]);

    const toggleSelection = (agentId: string) => {
        setSelectedIds((current) =>
            current.includes(agentId)
                ? current.filter((id) => id !== agentId)
                : [...current, agentId],
        );
    };

    const handleClose = () => {
        setSearch("");
        setDepartment("all");
        setSelectedIds([]);
        onClose();
    };

    const handleConfirm = () => {
        onConfirm(selectedIds);
        handleClose();
    };

    const selectedCount = selectedIds.length;
    const confirmLabel =
        selectedCount === 1
            ? "ASSIGN 1 AGENT"
            : `ASSIGN ${selectedCount} AGENTS`;

    return (
        <Modal
            isOpen={isOpen}
            onClose={handleClose}
            title={title}
            description="Filter and select available agents for assignment."
            className="max-w-180"
            footer={
                <>
                    <ActionButton variant="default" onClick={handleClose}>
                        CANCEL
                    </ActionButton>
                    <ActionButton
                        variant="primary"
                        onClick={handleConfirm}
                        disabled={selectedCount === 0}
                    >
                        {confirmLabel}
                    </ActionButton>
                </>
            }
        >
            <div className="space-y-3">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={search}
                        placeholder="SEARCH AGENTS..."
                        onChange={(event) => setSearch(event.target.value)}
                        className={`${inputClass} flex-1`}
                    />
                    <label className="flex items-center gap-2 text-[11px] text-text-muted">
                        <span className="font-mono">Department</span>
                        <select
                            aria-label="Department"
                            value={department}
                            onChange={(event) =>
                                setDepartment(
                                    event.target.value as AgentJob | "all",
                                )
                            }
                            className={inputClass}
                        >
                            <option value="all">ALL DEPTS</option>
                            <option value="operative">OPERATIVE</option>
                            <option value="scientist">SCIENTIST</option>
                            <option value="administrator">ADMINISTRATOR</option>
                            <option value="troop">TROOP</option>
                            <option value="unassigned">UNASSIGNED</option>
                        </select>
                    </label>
                </div>

                <div className="font-mono text-[10px] text-text-muted">
                    {filteredAgents.length} AVAILABLE
                </div>

                <div className="max-h-80 space-y-1 overflow-y-auto border border-border-subtle bg-bg-elevated/40 p-1.5">
                    {filteredAgents.length === 0 ? (
                        <div className="px-2 py-6 text-center text-[11px] text-text-muted">
                            No agents match the current filters.
                        </div>
                    ) : (
                        filteredAgents.map((person) => {
                            const job = person.agentStatus?.job ?? "unassigned";
                            const isSelected = selectedIds.includes(person.id);
                            const skillValue = relevantSkillKey
                                ? ((person.skills as Record<string, number>)[
                                      relevantSkillKey
                                  ] ?? 0)
                                : null;

                            return (
                                <button
                                    key={person.id}
                                    type="button"
                                    aria-pressed={isSelected}
                                    onClick={() => toggleSelection(person.id)}
                                    className={`flex w-full items-center justify-between rounded-sm border px-2 py-2 text-left transition-colors duration-fast ${
                                        isSelected
                                            ? "border-accent-red-muted bg-bg-selected"
                                            : "border-transparent bg-transparent hover:border-border-default hover:bg-bg-hover"
                                    }`}
                                >
                                    <div className="space-y-1">
                                        <div className="font-mono text-[11px] text-text-primary">
                                            {person.name}
                                        </div>
                                        <div className="flex items-center gap-2 text-[10px] text-text-muted">
                                            <Tag
                                                variant={
                                                    DEPARTMENT_VARIANTS[job]
                                                }
                                            >
                                                {job.toUpperCase()}
                                            </Tag>
                                            <span>
                                                {getLocationLabel
                                                    ? getLocationLabel(person)
                                                    : person.zoneId}
                                            </span>
                                        </div>
                                    </div>
                                    <div className="text-right">
                                        {skillValue !== null ? (
                                            <div className="font-mono text-[10px] text-text-secondary">
                                                {relevantSkillKey?.toUpperCase()}{" "}
                                                {Math.round(skillValue)}
                                            </div>
                                        ) : null}
                                        <div className="font-mono text-[10px] text-text-muted">
                                            {isSelected
                                                ? "SELECTED"
                                                : "AVAILABLE"}
                                        </div>
                                    </div>
                                </button>
                            );
                        })
                    )}
                </div>
            </div>
        </Modal>
    );
}
