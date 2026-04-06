import { useState } from 'react';
import type { GameState, AgentJob, Person } from '@empire-of-evil/engine';
import { useGameState } from '../../hooks/useGameState';
import { DataTable } from '../../components/DataTable/DataTable';
import { Tag } from '../../components/Tag/Tag';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import type { Row } from '../../components/DataTable/DataTable';
import type { TagVariant } from '../../components/Tag/Tag';

// ─── Constants ────────────────────────────────────────────────────────────────

const JOB_TAG_VARIANT: Record<AgentJob, TagVariant> = {
  operative:     'operative',
  scientist:     'scientist',
  troop:         'troop',
  administrator: 'admin',
  unassigned:    'unassigned',
};

const COLUMNS = [
  { key: 'name',    label: 'NAME',     sortable: true },
  { key: 'dept',    label: 'DEPT' },
  { key: 'zone',    label: 'LOCATION', sortable: true },
  { key: 'squad',   label: 'SQUAD' },
  { key: 'loyalty', label: 'LOYALTY',  width: '90px' },
  { key: 'status',  label: 'STATUS' },
  { key: 'topAttr', label: 'TOP ATTR' },
];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function deriveStatus(p: Person, plots: GameState['plots']): string {
  if (p.health < 50) return 'INJURED';
  if (Object.values(plots).some(pl => pl.assignedAgentIds.includes(p.id))) return 'ON PLOT';
  return 'ACTIVE';
}

function topAttribute(attrs: Record<string, number>): string {
  const entry = Object.entries(attrs).sort((a, b) => b[1] - a[1])[0];
  return entry ? `${entry[0].toUpperCase()} ${Math.round(entry[1])}` : '—';
}

const STATUS_TAG_VARIANT: Record<string, TagVariant> = {
  ACTIVE:   'active',
  INJURED:  'injured',
  'ON PLOT': 'plot',
};

// ─── Component ────────────────────────────────────────────────────────────────

interface AllAgentsTabProps {
  onSelectPerson: (id: string) => void;
  selectedPersonId: string | null;
}

export function AllAgentsTab({ onSelectPerson, selectedPersonId }: AllAgentsTabProps) {
  const gameState = useGameState();
  const { persons, zones, squads, empire, plots } = gameState;

  const [search, setSearch] = useState('');
  const [deptFilter, setDeptFilter] = useState<AgentJob | 'all'>('all');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'injured' | 'on-plot'>('all');

  // Build squad name lookup
  const squadByAgent = new Map<string, string>();
  for (const squad of Object.values(squads)) {
    for (const memberId of squad.memberIds) {
      squadByAgent.set(memberId, squad.name);
    }
  }

  const agents = Object.values(persons).filter(p => p.agentStatus !== undefined && !p.dead);

  const filtered = agents.filter(p => {
    if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
    if (deptFilter !== 'all' && p.agentStatus?.job !== deptFilter) return false;
    const status = deriveStatus(p, plots);
    if (statusFilter === 'active' && status !== 'ACTIVE') return false;
    if (statusFilter === 'injured' && status !== 'INJURED') return false;
    if (statusFilter === 'on-plot' && status !== 'ON PLOT') return false;
    return true;
  });

  const rows: Row[] = filtered.map(p => {
    const loyalty = p.loyalties[empire.id] ?? 0;
    const status = deriveStatus(p, plots);
    return {
      _key: p.id,
      name: p.name,
      dept: p.agentStatus
        ? <Tag variant={JOB_TAG_VARIANT[p.agentStatus.job]}>{p.agentStatus.job.toUpperCase()}</Tag>
        : <Tag variant="unassigned">UNASSIGNED</Tag>,
      zone: zones[p.zoneId]?.name ?? p.zoneId,
      squad: squadByAgent.get(p.id) ?? <span className="text-text-muted">—</span>,
      loyalty: (
        <div className="flex items-center gap-1.5">
          <div className="flex-1">
            <ProgressBar
              value={Math.min(100, loyalty)}
              color={loyalty >= 60 ? 'positive' : loyalty >= 30 ? 'warning' : 'evil'}
              height={2}
            />
          </div>
          <span className="font-mono text-[10px] text-text-muted w-6 text-right">{Math.round(loyalty)}</span>
        </div>
      ),
      status: (
        <Tag variant={STATUS_TAG_VARIANT[status] ?? 'neutral'}>{status}</Tag>
      ),
      topAttr: (
        <span className="font-mono text-[11px] text-text-muted">{topAttribute(p.attributes)}</span>
      ),
    };
  });

  const inputClass = 'font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red';

  return (
    <div className="flex flex-col gap-3">
      {/* Filter bar */}
      <div className="flex gap-2 items-center">
        <input
          type="text"
          placeholder="SEARCH..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className={`${inputClass} flex-1`}
        />
        <select
          value={deptFilter}
          onChange={e => setDeptFilter(e.target.value as AgentJob | 'all')}
          className={inputClass}
        >
          <option value="all">ALL DEPTS</option>
          <option value="operative">OPERATIVE</option>
          <option value="scientist">SCIENTIST</option>
          <option value="administrator">ADMINISTRATOR</option>
          <option value="troop">TROOP</option>
          <option value="unassigned">UNASSIGNED</option>
        </select>
        <select
          value={statusFilter}
          onChange={e => setStatusFilter(e.target.value as typeof statusFilter)}
          className={inputClass}
        >
          <option value="all">ALL STATUS</option>
          <option value="active">ACTIVE</option>
          <option value="injured">INJURED</option>
          <option value="on-plot">ON PLOT</option>
        </select>
      </div>

      <div className="text-[10px] text-text-muted font-mono">
        {filtered.length} / {agents.length} AGENTS
      </div>

      <DataTable
        columns={COLUMNS}
        rows={rows}
        onRowClick={row => onSelectPerson(row._key)}
        {...(selectedPersonId !== null ? { selectedRowKey: selectedPersonId } : {})}
        emptyText="No agents match the current filters."
      />
    </div>
  );
}
