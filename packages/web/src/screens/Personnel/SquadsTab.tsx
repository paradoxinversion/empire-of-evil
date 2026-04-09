import { useEffect, useState } from "react";
import type { StandingOrder } from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { useGameStore } from "../../store/gameStore";
import { Panel } from "../../components/Panel/Panel";
import { DataTable } from "../../components/DataTable/DataTable";
import { Tag } from "../../components/Tag/Tag";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import { AgentPicker } from "../../components/AgentPicker/AgentPicker";
import type { Row } from "../../components/DataTable/DataTable";
import type { TagVariant } from "../../components/Tag/Tag";
import type { AgentJob } from "@empire-of-evil/engine";

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
    operative: "operative",
    scientist: "scientist",
    troop: "troop",
    administrator: "admin",
    unassigned: "unassigned",
};

const STANDING_ORDERS: StandingOrder[] = [
    "IDLE",
    "DEFEND_ZONE",
    "RUN_RECONNAISSANCE",
    "MAINTAIN_ACTIVITY",
    "COUNTERINTELLIGENCE",
    "MANAGE_STABILITY",
    "ESCORT_OVERLORD",
    "EXECUTE_STANDING_PLOT",
];

const MEMBER_COLUMNS = [
    { key: "name", label: "NAME", sortable: true },
    { key: "dept", label: "DEPT" },
    { key: "health", label: "HEALTH" },
    { key: "actions", label: "ACTIONS" },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface SquadsTabProps {
    onSelectPerson: (id: string) => void;
    selectedPersonId: string | null;
}

export function SquadsTab({
    onSelectPerson,
    selectedPersonId,
}: SquadsTabProps) {
    const gameState = useGameState();
    const { persons, squads, zones, plots } = gameState;
    const createSquad = useGameStore((s) => s.createSquad);
    const addAgentToSquad = useGameStore((s) => s.addAgentToSquad);
    const renameSquad = useGameStore((s) => s.renameSquad);
    const setSquadHomeZone = useGameStore((s) => s.setSquadHomeZone);
    const setSquadLeader = useGameStore((s) => s.setSquadLeader);
    const setSquadStandingPlot = useGameStore((s) => s.setSquadStandingPlot);
    const updateSquadOrders = useGameStore((s) => s.updateSquadOrders);
    const disbandSquad = useGameStore((s) => s.disbandSquad);
    const removeAgentFromSquad = useGameStore((s) => s.removeAgentFromSquad);

    const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);
    const [newSquadName, setNewSquadName] = useState("");
    const [editingSquadName, setEditingSquadName] = useState("");
    const [isAddMembersOpen, setIsAddMembersOpen] = useState(false);

    const squadList = Object.values(squads);
    const selectedSquad = selectedSquadId ? squads[selectedSquadId] : null;
    const availableAgents = selectedSquad
        ? Object.values(persons).filter(
              (person) =>
                  !person.dead &&
                  person.agentStatus !== undefined &&
                  !selectedSquad.memberIds.includes(person.id),
          )
        : [];

    useEffect(() => {
        setEditingSquadName(selectedSquad?.name ?? "");
    }, [selectedSquad?.id, selectedSquad?.name]);

    const memberRows: Row[] = selectedSquad
        ? selectedSquad.memberIds
              .map((id) => persons[id])
              .filter((p): p is NonNullable<typeof p> => !!p && !p.dead)
              .map((p) => ({
                  _key: p.id,
                  name: p.name,
                  dept: p.agentStatus ? (
                      <Tag variant={JOB_TAG_VARIANT[p.agentStatus.job]}>
                          {p.agentStatus.job.toUpperCase()}
                      </Tag>
                  ) : (
                      <Tag variant="unassigned">—</Tag>
                  ),
                  health: (
                      <span
                          className={`font-mono text-[11px] ${p.health >= 50 ? "text-positive" : "text-negative"}`}
                      >
                          {p.health}
                      </span>
                  ),
                  actions: (
                      <button
                          type="button"
                          onClick={(event) => {
                              event.stopPropagation();
                              removeAgentFromSquad(selectedSquad.id, p.id);
                          }}
                          className="font-mono text-[10px] text-text-muted hover:text-text-primary"
                      >
                          REMOVE
                      </button>
                  ),
              }))
        : [];

    const selectClass =
        "font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red";

    const createSquadFromInput = () => {
        const trimmed = newSquadName.trim();
        if (!trimmed) return;
        createSquad(trimmed);
        setNewSquadName("");
    };

    const saveSquadName = () => {
        if (!selectedSquad) return;
        const trimmed = editingSquadName.trim();
        if (!trimmed) return;
        renameSquad(selectedSquad.id, trimmed);
    };

    const confirmAddMembers = (agentIds: string[]) => {
        if (!selectedSquad) return;
        for (const agentId of agentIds) {
            addAgentToSquad(selectedSquad.id, agentId);
        }
    };

    return (
        <div className="flex gap-3" style={{ minHeight: "400px" }}>
            {/* Squad list */}
            <div style={{ flex: "0 0 35%" }} className="flex flex-col gap-2">
                <Panel title="NEW SQUAD">
                    <div className="flex items-center gap-2">
                        <label htmlFor="new-squad-name" className="sr-only">
                            New squad name
                        </label>
                        <input
                            id="new-squad-name"
                            type="text"
                            value={newSquadName}
                            onChange={(e) => setNewSquadName(e.target.value)}
                            placeholder="SQUAD NAME"
                            className="flex-1 font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red"
                        />
                        <ActionButton onClick={createSquadFromInput}>
                            CREATE SQUAD
                        </ActionButton>
                    </div>
                </Panel>
                <Panel title="SQUADS">
                    {squadList.length === 0 ? (
                        <div className="text-text-muted text-[11px] py-2">
                            No squads formed.
                        </div>
                    ) : (
                        <div className="space-y-px">
                            {squadList.map((squad) => {
                                const leader = squad.leaderId
                                    ? persons[squad.leaderId]
                                    : null;
                                const homeZone = squad.homeZoneId
                                    ? zones[squad.homeZoneId]
                                    : null;
                                const isSelected = squad.id === selectedSquadId;
                                return (
                                    <div
                                        key={squad.id}
                                        onClick={() =>
                                            setSelectedSquadId(squad.id)
                                        }
                                        className={`px-2 py-2 cursor-pointer transition-colors ${isSelected ? "bg-bg-selected" : "hover:bg-bg-elevated"}`}
                                    >
                                        <div className="font-mono text-[12px] text-text-primary">
                                            {squad.name}
                                        </div>
                                        <div className="font-mono text-[10px] text-text-muted mt-0.5">
                                            {squad.memberIds.length} MEMBERS
                                            {leader ? ` · ${leader.name}` : ""}
                                            {homeZone
                                                ? ` · ${homeZone.name}`
                                                : ""}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </Panel>
            </div>

            {/* Squad detail */}
            <div style={{ flex: "0 0 65%" }} className="flex flex-col gap-3">
                {selectedSquad ? (
                    <>
                        <Panel title={selectedSquad.name}>
                            <div className="flex items-end gap-2 mb-3">
                                <div className="flex-1">
                                    <label
                                        htmlFor="squad-name"
                                        className="font-mono text-[10px] text-text-muted tracking-[0.06em]"
                                    >
                                        SQUAD NAME
                                    </label>
                                    <input
                                        id="squad-name"
                                        aria-label="Squad name"
                                        type="text"
                                        value={editingSquadName}
                                        onChange={(e) =>
                                            setEditingSquadName(e.target.value)
                                        }
                                        className="w-full mt-1 font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red"
                                    />
                                </div>
                                <ActionButton onClick={saveSquadName}>
                                    SAVE SQUAD
                                </ActionButton>
                            </div>

                            <div className="grid grid-cols-2 gap-2 mb-3">
                                <div>
                                    <label
                                        htmlFor="squad-home-zone"
                                        className="font-mono text-[10px] text-text-muted tracking-[0.06em]"
                                    >
                                        HOME ZONE
                                    </label>
                                    <select
                                        id="squad-home-zone"
                                        aria-label="Home zone"
                                        value={selectedSquad.homeZoneId ?? ""}
                                        onChange={(e) => {
                                            if (!e.target.value) return;
                                            setSquadHomeZone(
                                                selectedSquad.id,
                                                e.target.value,
                                            );
                                        }}
                                        className={`${selectClass} w-full mt-1`}
                                    >
                                        <option value="">SELECT ZONE</option>
                                        {Object.values(zones).map((zone) => (
                                            <option
                                                key={zone.id}
                                                value={zone.id}
                                            >
                                                {zone.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div>
                                    <label
                                        htmlFor="squad-leader"
                                        className="font-mono text-[10px] text-text-muted tracking-[0.06em]"
                                    >
                                        SQUAD LEADER
                                    </label>
                                    <select
                                        id="squad-leader"
                                        aria-label="Squad leader"
                                        value={selectedSquad.leaderId ?? ""}
                                        onChange={(e) => {
                                            if (!e.target.value) return;
                                            setSquadLeader(
                                                selectedSquad.id,
                                                e.target.value,
                                            );
                                        }}
                                        className={`${selectClass} w-full mt-1`}
                                    >
                                        <option value="">SELECT LEADER</option>
                                        {selectedSquad.memberIds
                                            .map((id) => persons[id])
                                            .filter(
                                                (
                                                    p,
                                                ): p is NonNullable<typeof p> =>
                                                    !!p && !p.dead,
                                            )
                                            .map((member) => (
                                                <option
                                                    key={member.id}
                                                    value={member.id}
                                                >
                                                    {member.name}
                                                </option>
                                            ))}
                                    </select>
                                </div>
                            </div>

                            <div className="flex items-center justify-between gap-3 mb-3">
                                <div className="flex items-center gap-3">
                                    <span className="font-mono text-[10px] text-text-muted tracking-[0.06em]">
                                        STANDING ORDERS
                                    </span>
                                    <select
                                        value={
                                            selectedSquad.standingOrders ??
                                            "IDLE"
                                        }
                                        onChange={(e) =>
                                            updateSquadOrders(
                                                selectedSquad.id,
                                                e.target.value as StandingOrder,
                                            )
                                        }
                                        className={selectClass}
                                    >
                                        {STANDING_ORDERS.map((order) => (
                                            <option key={order} value={order}>
                                                {order.replace(/_/g, " ")}
                                            </option>
                                        ))}
                                    </select>
                                    {selectedSquad.standingOrders ===
                                    "EXECUTE_STANDING_PLOT" ? (
                                        <>
                                            <span className="font-mono text-[10px] text-text-muted tracking-[0.06em]">
                                                STANDING PLOT
                                            </span>
                                            <label
                                                htmlFor="squad-standing-plot"
                                                className="sr-only"
                                            >
                                                Standing plot
                                            </label>
                                            <select
                                                id="squad-standing-plot"
                                                aria-label="Standing plot"
                                                value={
                                                    selectedSquad.standingPlotId ??
                                                    ""
                                                }
                                                onChange={(e) => {
                                                    if (!e.target.value) return;
                                                    setSquadStandingPlot(
                                                        selectedSquad.id,
                                                        e.target.value,
                                                    );
                                                }}
                                                className={selectClass}
                                            >
                                                <option value="">
                                                    SELECT PLOT
                                                </option>
                                                {Object.values(plots).map(
                                                    (plot) => (
                                                        <option
                                                            key={plot.id}
                                                            value={plot.id}
                                                        >
                                                            {
                                                                plot.plotDefinitionId
                                                            }
                                                        </option>
                                                    ),
                                                )}
                                            </select>
                                        </>
                                    ) : null}
                                </div>
                                <div className="flex items-center gap-2">
                                    <ActionButton
                                        onClick={() =>
                                            setIsAddMembersOpen(true)
                                        }
                                    >
                                        ADD MEMBERS
                                    </ActionButton>
                                    <ActionButton
                                        variant="destructive"
                                        onClick={() =>
                                            disbandSquad(selectedSquad.id)
                                        }
                                    >
                                        DISBAND SQUAD
                                    </ActionButton>
                                </div>
                            </div>
                            <DataTable
                                columns={MEMBER_COLUMNS}
                                rows={memberRows}
                                onRowClick={(row) => onSelectPerson(row._key)}
                                {...(selectedPersonId !== null
                                    ? { selectedRowKey: selectedPersonId }
                                    : {})}
                                emptyText="No active members."
                            />

                            <AgentPicker
                                isOpen={isAddMembersOpen}
                                onClose={() => setIsAddMembersOpen(false)}
                                onConfirm={confirmAddMembers}
                                agents={availableAgents}
                                title="ADD SQUAD MEMBERS"
                                getLocationLabel={(person) =>
                                    zones[person.zoneId]?.name ?? person.zoneId
                                }
                            />
                        </Panel>
                    </>
                ) : (
                    <Panel>
                        <div className="text-text-muted text-[11px]">
                            Select a squad to view details.
                        </div>
                    </Panel>
                )}
            </div>
        </div>
    );
}
