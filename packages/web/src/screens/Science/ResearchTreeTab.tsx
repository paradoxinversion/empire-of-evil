import { Panel } from '../../components/Panel/Panel';
import { Tag } from '../../components/Tag/Tag';
import { ProgressBar } from '../../components/ProgressBar/ProgressBar';
import type { EnrichedProject, ResearchStatus } from '../../hooks/useResearch.js';
import type { TagVariant } from '../../components/Tag/Tag';

const STATUS_VARIANT: Record<ResearchStatus, TagVariant> = {
    completed: 'active',
    active:    'research',
    available: 'neutral',
    locked:    'unassigned',
};

const STATUS_LABEL: Record<ResearchStatus, string> = {
    completed: 'DONE',
    active:    'ACTIVE',
    available: 'AVAILABLE',
    locked:    'LOCKED',
};

function formatBranch(branch: string): string {
    return branch.replace(/-/g, ' & ').toUpperCase();
}

interface ProjectRowProps {
    ep: EnrichedProject;
    isSelected: boolean;
    onSelect: (projectId: string) => void;
    prereqNames: string[];
}

function ProjectRow({ ep, isSelected, onSelect, prereqNames }: ProjectRowProps) {
    const { definition: def, status, progressPct } = ep;
    const isLocked = status === 'locked';

    return (
        <button
            type="button"
            onClick={() => onSelect(def.id)}
            className={`
                w-full text-left px-2 py-1.5 rounded-sm border transition-colors duration-fast
                font-mono text-[11px]
                ${isSelected
                    ? 'border-accent-red bg-accent-red-subtle text-text-primary'
                    : 'border-transparent hover:bg-bg-elevated text-text-primary'}
                ${isLocked ? 'opacity-50' : ''}
            `}
        >
            <div className="flex items-center gap-2">
                <span className="flex-1 truncate">{def.name}</span>
                <Tag variant={STATUS_VARIANT[status]}>{STATUS_LABEL[status]}</Tag>
                <span className="text-[10px] text-text-muted whitespace-nowrap">
                    ${def.cost.toLocaleString()} · {def.completionDays}d
                </span>
            </div>

            {status === 'active' && (
                <div className="mt-1">
                    <ProgressBar value={progressPct} color="info" height={2} />
                </div>
            )}

            {isLocked && prereqNames.length > 0 && (
                <div className="mt-0.5 text-[9px] text-text-muted truncate">
                    Requires: {prereqNames.join(', ')}
                </div>
            )}
        </button>
    );
}

interface ResearchTreeTabProps {
    projectsByBranch: Record<string, EnrichedProject[]>;
    onSelectProject: (projectId: string) => void;
    selectedProjectId: string | null;
    allProjects: EnrichedProject[];
}

export function ResearchTreeTab({
    projectsByBranch,
    onSelectProject,
    selectedProjectId,
    allProjects,
}: ResearchTreeTabProps) {
    const nameById = new Map(allProjects.map(ep => [ep.definition.id, ep.definition.name]));

    return (
        <div className="flex flex-col gap-3">
            {Object.entries(projectsByBranch).map(([branch, projects]) => (
                <Panel key={branch} title={formatBranch(branch)}>
                    <div className="flex flex-col gap-0.5">
                        {projects.map(ep => (
                            <ProjectRow
                                key={ep.definition.id}
                                ep={ep}
                                isSelected={selectedProjectId === ep.definition.id}
                                onSelect={onSelectProject}
                                prereqNames={ep.definition.prerequisites
                                    .map(id => nameById.get(id) ?? id)}
                            />
                        ))}
                        {projects.length === 0 && (
                            <div className="text-[10px] text-text-muted">No projects in this branch.</div>
                        )}
                    </div>
                </Panel>
            ))}
        </div>
    );
}
