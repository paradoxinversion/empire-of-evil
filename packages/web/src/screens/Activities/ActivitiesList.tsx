import React from "react";
import { DataTable, type Row } from "../../components/DataTable/DataTable";
import { Tag } from "../../components/Tag/Tag";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import type {
    EnrichedActiveActivity,
    EnrichedAvailableActivity,
} from "../../hooks/useActivities";

interface Props {
    tab: "available" | "active";
    availableActivities: EnrichedAvailableActivity[];
    activeActivities: EnrichedActiveActivity[];
    selectedActivityId?: string | null;
    onSelectActivity?: (id: string) => void;
}

const AVAILABLE_COLUMNS = [
    { key: "name", label: "NAME" },
    { key: "cost", label: "COST", width: "80px" },
    { key: "status", label: "STATUS", width: "90px" },
];

const ACTIVE_COLUMNS = [
    { key: "name", label: "NAME" },
    { key: "agents", label: "AGENTS", width: "80px" },
    { key: "status", label: "STATUS", width: "90px" },
];

export default function ActivitiesList({
    tab,
    availableActivities,
    activeActivities,
    selectedActivityId,
    onSelectActivity,
}: Props) {
    if (tab === "available") {
        const rows: Row[] = availableActivities.map((a) => ({
            _key: a.definition.id,
            name: (
                <div>
                    <div className="font-mono">{a.definition.name}</div>
                    <div className="text-text-muted text-[11px]">
                        {a.definition.description ?? ""}
                    </div>
                </div>
            ),
            cost: (
                <div className="text-text-muted">
                    {String(a.definition.costPerParticipantPerDay ?? 0)}
                </div>
            ),
            status:
                a.status === "locked" ? (
                    <div className="text-text-muted text-[11px]">LOCKED</div>
                ) : (
                    <Tag variant="default">READY</Tag>
                ),
        }));

        return (
            <DataTable
                columns={AVAILABLE_COLUMNS}
                rows={rows}
                emptyText="No activities available."
                onRowClick={(r) => onSelectActivity?.(String(r._key))}
                selectedRowKey={selectedActivityId ?? undefined}
            />
        );
    }

    const rows: Row[] = activeActivities.map((a) => ({
        _key: a.record.id,
        name: (
            <div>
                <div className="font-mono">
                    {a.definition?.name ?? a.record.activityDefinitionId}
                </div>
                <div className="text-text-muted text-[11px]">
                    {a.definition?.description ?? ""}
                </div>
            </div>
        ),
        agents: String(a.assignedAgents.length),
        status: (
            <Tag variant="default">
                {(a.record.status ?? "active").toUpperCase()}
            </Tag>
        ),
    }));

    return (
        <DataTable
            columns={ACTIVE_COLUMNS}
            rows={rows}
            emptyText="No active activities."
            onRowClick={(r) => onSelectActivity?.(String(r._key))}
            selectedRowKey={selectedActivityId ?? undefined}
        />
    );
}
