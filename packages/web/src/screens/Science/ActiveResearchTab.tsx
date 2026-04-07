import type { EnrichedProject } from '../../hooks/useResearch.js';
import { DataTable } from '../../components/DataTable/DataTable';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import type { Row } from '../../components/DataTable/DataTable';

const COLUMNS = [
    { key: 'name',       label: 'PROJECT',    sortable: true },
    { key: 'branch',     label: 'BRANCH' },
    { key: 'scientists', label: 'SCIENTISTS', width: '90px' },
    { key: 'progress',   label: 'PROGRESS',   width: '120px' },
    { key: 'eta',        label: 'ETA',        width: '70px' },
];

function formatBranch(branch: string): string {
    return branch.replace(/-/g, ' ').toUpperCase();
}

interface ActiveResearchTabProps {
    activeResearches: EnrichedProject[];
    onSelectProject: (projectId: string) => void;
    selectedProjectId: string | null;
}

export function ActiveResearchTab({
    activeResearches,
    onSelectProject,
    selectedProjectId,
}: ActiveResearchTabProps) {
    const rows: Row[] = activeResearches.map(ep => ({
        _key: ep.definition.id,
        name: ep.definition.name,
        branch: (
            <span className="font-mono text-[10px] text-text-muted">
                {formatBranch(ep.definition.branch)}
            </span>
        ),
        scientists: (
            <span className="font-mono text-[11px] text-text-primary">
                {ep.assignedAgents.length}
            </span>
        ),
        progress: (
            <div className="flex items-center gap-1.5">
                <div className="flex-1">
                    <ProgressBar value={ep.progressPct} color="info" height={3} />
                </div>
                <span className="font-mono text-[10px] text-text-muted w-8 text-right">
                    {ep.progressPct}%
                </span>
            </div>
        ),
        eta: (
            <span className="font-mono text-[10px] text-text-muted">
                {ep.daysRemaining}d
            </span>
        ),
    }));

    return (
        <DataTable
            columns={COLUMNS}
            rows={rows}
            onRowClick={row => onSelectProject(row._key)}
            {...(selectedProjectId !== null ? { selectedRowKey: selectedProjectId } : {})}
            emptyText="No research in progress."
        />
    );
}
