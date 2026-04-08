import { useState } from 'react';
import type { StandingOrder } from '@empire-of-evil/engine';
import { useGameState } from '../../hooks/useGameState';
import { useGameStore } from '../../store/gameStore';
import { Panel } from '../../components/Panel/Panel';
import { DataTable } from '../../components/DataTable/DataTable';
import { Tag } from '../../components/Tag/Tag';
import { ActionButton } from '../../components/ActionButton/ActionButton';
import type { Row } from '../../components/DataTable/DataTable';
import type { TagVariant } from '../../components/Tag/Tag';
import type { AgentJob } from '@empire-of-evil/engine';

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
  operative:     'operative',
  scientist:     'scientist',
  troop:         'troop',
  administrator: 'admin',
  unassigned:    'unassigned',
};

const STANDING_ORDERS: StandingOrder[] = [
  'IDLE',
  'DEFEND_ZONE',
  'RUN_RECONNAISSANCE',
  'MAINTAIN_ACTIVITY',
  'COUNTERINTELLIGENCE',
  'MANAGE_STABILITY',
  'ESCORT_OVERLORD',
];

const MEMBER_COLUMNS = [
  { key: 'name',   label: 'NAME',   sortable: true },
  { key: 'dept',   label: 'DEPT' },
  { key: 'health', label: 'HEALTH' },
  { key: 'actions', label: 'ACTIONS' },
];

// ─── Component ────────────────────────────────────────────────────────────────

interface SquadsTabProps {
  onSelectPerson: (id: string) => void;
  selectedPersonId: string | null;
}

export function SquadsTab({ onSelectPerson, selectedPersonId }: SquadsTabProps) {
  const gameState = useGameState();
  const { persons, squads, zones } = gameState;
  const createSquad = useGameStore(s => s.createSquad);
  const updateSquadOrders = useGameStore(s => s.updateSquadOrders);
  const disbandSquad = useGameStore(s => s.disbandSquad);
  const removeAgentFromSquad = useGameStore(s => s.removeAgentFromSquad);

  const [selectedSquadId, setSelectedSquadId] = useState<string | null>(null);
  const [newSquadName, setNewSquadName] = useState('');

  const squadList = Object.values(squads);
  const selectedSquad = selectedSquadId ? squads[selectedSquadId] : null;

  const memberRows: Row[] = selectedSquad
    ? selectedSquad.memberIds
        .map(id => persons[id])
        .filter((p): p is NonNullable<typeof p> => !!p && !p.dead)
        .map(p => ({
          _key: p.id,
          name: p.name,
          dept: p.agentStatus
            ? <Tag variant={JOB_TAG_VARIANT[p.agentStatus.job]}>{p.agentStatus.job.toUpperCase()}</Tag>
            : <Tag variant="unassigned">—</Tag>,
          health: (
            <span className={`font-mono text-[11px] ${p.health >= 50 ? 'text-positive' : 'text-negative'}`}>
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

  const selectClass = 'font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red';

  const createSquadFromInput = () => {
    const trimmed = newSquadName.trim();
    if (!trimmed) return;
    createSquad(trimmed);
    setNewSquadName('');
  };

  return (
    <div className="flex gap-3" style={{ minHeight: '400px' }}>
      {/* Squad list */}
      <div style={{ flex: '0 0 35%' }} className="flex flex-col gap-2">
        <Panel title="NEW SQUAD">
          <div className="flex items-center gap-2">
            <label htmlFor="new-squad-name" className="sr-only">
              New squad name
            </label>
            <input
              id="new-squad-name"
              type="text"
              value={newSquadName}
              onChange={e => setNewSquadName(e.target.value)}
              placeholder="SQUAD NAME"
              className="flex-1 font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red"
            />
            <ActionButton onClick={createSquadFromInput}>CREATE SQUAD</ActionButton>
          </div>
        </Panel>
        <Panel title="SQUADS">
          {squadList.length === 0 ? (
            <div className="text-text-muted text-[11px] py-2">No squads formed.</div>
          ) : (
            <div className="space-y-px">
              {squadList.map(squad => {
                const leader = squad.leaderId ? persons[squad.leaderId] : null;
                const homeZone = squad.homeZoneId ? zones[squad.homeZoneId] : null;
                const isSelected = squad.id === selectedSquadId;
                return (
                  <div
                    key={squad.id}
                    onClick={() => setSelectedSquadId(squad.id)}
                    className={`px-2 py-2 cursor-pointer transition-colors ${isSelected ? 'bg-bg-selected' : 'hover:bg-bg-elevated'}`}
                  >
                    <div className="font-mono text-[12px] text-text-primary">{squad.name}</div>
                    <div className="font-mono text-[10px] text-text-muted mt-0.5">
                      {squad.memberIds.length} MEMBERS
                      {leader ? ` · ${leader.name}` : ''}
                      {homeZone ? ` · ${homeZone.name}` : ''}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </Panel>
      </div>

      {/* Squad detail */}
      <div style={{ flex: '0 0 65%' }} className="flex flex-col gap-3">
        {selectedSquad ? (
          <>
            <Panel title={selectedSquad.name}>
              <div className="flex items-center justify-between gap-3 mb-3">
                <div className="flex items-center gap-3">
                  <span className="font-mono text-[10px] text-text-muted tracking-[0.06em]">STANDING ORDERS</span>
                  <select
                    value={selectedSquad.standingOrders ?? 'IDLE'}
                    onChange={e => updateSquadOrders(selectedSquad.id, e.target.value as StandingOrder)}
                    className={selectClass}
                  >
                    {STANDING_ORDERS.map(order => (
                      <option key={order} value={order}>{order.replace(/_/g, ' ')}</option>
                    ))}
                  </select>
                </div>
                <ActionButton variant="destructive" onClick={() => disbandSquad(selectedSquad.id)}>
                  DISBAND SQUAD
                </ActionButton>
              </div>
              <DataTable
                columns={MEMBER_COLUMNS}
                rows={memberRows}
                onRowClick={row => onSelectPerson(row._key)}
                {...(selectedPersonId !== null ? { selectedRowKey: selectedPersonId } : {})}
                emptyText="No active members."
              />
            </Panel>
          </>
        ) : (
          <Panel>
            <div className="text-text-muted text-[11px]">Select a squad to view details.</div>
          </Panel>
        )}
      </div>
    </div>
  );
}
