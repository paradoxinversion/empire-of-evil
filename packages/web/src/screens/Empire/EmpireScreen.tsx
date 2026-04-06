import { useGameState } from '../../hooks/useGameState';
import { Panel } from '../../components/Panel/Panel';
import { StatWidget } from '../../components/StatWidget/StatWidget';
import { DataTable } from '../../components/DataTable/DataTable';
import { FeedEntry } from '../../components/FeedEntry/FeedEntry';
import { Tag } from '../../components/Tag/Tag';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import { getEvilTier, getEvilTierProgress } from '../../utils/evilTier';
import type { Row } from '../../components/DataTable/DataTable';

function formatMoney(n: number): string {
  return '$' + n.toLocaleString('en-US');
}

const INFRA_CAP = 20;

const OPERATIONS_COLUMNS = [
  { key: 'operation', label: 'OPERATION' },
  { key: 'type',      label: 'TYPE' },
  { key: 'target',    label: 'TARGET' },
  { key: 'agents',    label: 'AGENTS' },
  { key: 'status',    label: 'STATUS' },
  { key: 'eta',       label: 'ETA' },
];

const ZONES_COLUMNS = [
  { key: 'zone',   label: 'ZONE',   sortable: true },
  { key: 'nation', label: 'NATION', sortable: true },
  { key: 'output', label: 'OUTPUT', sortable: true },
  { key: 'status', label: 'STATUS' },
];

export function EmpireScreen() {
  const gameState = useGameState();
  const { empire, zones, plots, activities, persons, pendingEvents, nations } = gameState;
  const { resources, evil } = empire;

  const tier = getEvilTier(evil.perceived);
  const tierProgress = getEvilTierProgress(evil.perceived);

  const totalZones = Object.keys(zones).length;
  const agentCount = Object.values(persons).filter(p => p.agentStatus !== undefined && !p.dead).length;

  // Operations table rows
  const plotRows: Row[] = Object.values(plots).map(p => ({
    _key: p.id,
    operation: p.plotDefinitionId,
    type: <Tag variant="plot">PLOT</Tag>,
    target: p.targetZoneId ?? '—',
    agents: String(p.assignedAgentIds.length),
    status: p.status.toUpperCase(),
    eta: p.daysRemaining > 0 ? `${p.daysRemaining}d` : '—',
  }));
  const activityRows: Row[] = Object.values(activities).map(a => ({
    _key: a.id,
    operation: a.activityDefinitionId,
    type: <Tag variant="activity">ACTIVITY</Tag>,
    target: a.zoneId,
    agents: String(a.assignedAgentIds.length),
    status: 'ACTIVE',
    eta: '—',
  }));
  const operationsRows = [...plotRows, ...activityRows];

  // Controlled zones table rows
  const zoneRows: Row[] = Object.values(zones).map(z => ({
    _key: z.id,
    zone: z.name,
    nation: nations[z.nationId]?.name ?? '—',
    output: formatMoney(z.economicOutput),
    status: <Tag variant="stable">STABLE</Tag>,
  }));

  // Recent activity feed (last 5 events)
  const recentEvents = pendingEvents.slice(-5).reverse();

  return (
    <div>
      <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
        EMPIRE OVERVIEW
      </div>

      {/* Row 1 — Resource bar */}
      <div className="flex gap-px mb-3">
        <StatWidget
          label="MONEY"
          value={formatMoney(resources.money)}
          subVariant="neutral"
        />
        <StatWidget
          label="SCIENCE"
          value={resources.science.toLocaleString()}
          subVariant="positive"
        />
        <StatWidget
          label="INFRASTRUCTURE"
          value={`${totalZones}/${INFRA_CAP}`}
          subValue={totalZones >= INFRA_CAP ? 'AT CAPACITY' : `${Math.round((totalZones / INFRA_CAP) * 100)}% capacity`}
          subVariant={totalZones >= INFRA_CAP ? 'negative' : totalZones / INFRA_CAP >= 0.8 ? 'warning' : 'positive'}
        />
        <StatWidget
          label="EVIL"
          value={String(evil.perceived)}
          subValue={tier.name.toUpperCase() + ' TIER'}
          subVariant="warning"
        />
      </div>

      {/* Row 2 — Operations + Empire Status */}
      <div className="grid grid-cols-12 gap-3 mb-3">
        <div className="col-span-8">
          <Panel title="ACTIVE OPERATIONS">
            <DataTable
              columns={OPERATIONS_COLUMNS}
              rows={operationsRows}
              emptyText="No active operations."
            />
          </Panel>
        </div>
        <div className="col-span-4">
          <Panel title="EMPIRE STATUS">
            <div className="space-y-3 text-[12px]">
              <div className="flex justify-between">
                <span className="text-text-muted">ZONES</span>
                <span className="font-mono text-text-primary">{totalZones}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">AGENTS</span>
                <span className="font-mono text-text-primary">{agentCount}</span>
              </div>
              <div>
                <div className="flex justify-between mb-1">
                  <span className="text-text-muted">EVIL TIER</span>
                  <span className="font-mono" style={{ color: tier.color }}>{tier.name.toUpperCase()}</span>
                </div>
                <ProgressBar value={tierProgress} color="evil" height={2} />
              </div>
              <div className="flex justify-between">
                <span className="text-text-muted">HERO ORG ACTIVITY</span>
                <span className="font-mono text-text-primary">NONE</span>
              </div>
            </div>
          </Panel>
        </div>
      </div>

      {/* Row 3 — Event feed + Zone overview */}
      <div className="grid grid-cols-12 gap-3">
        <div className="col-span-5">
          <Panel title="RECENT ACTIVITY">
            {recentEvents.length === 0 ? (
              <div className="text-text-muted text-[11px] py-2">No recent events.</div>
            ) : (
              recentEvents.map(event => (
                <FeedEntry
                  key={event.id}
                  day={event.createdOnDate + 1}
                  text={event.title}
                  type="internal"
                />
              ))
            )}
          </Panel>
        </div>
        <div className="col-span-7">
          <Panel title="CONTROLLED ZONES">
            <DataTable
              columns={ZONES_COLUMNS}
              rows={zoneRows}
              emptyText="No controlled zones."
            />
          </Panel>
        </div>
      </div>
    </div>
  );
}
