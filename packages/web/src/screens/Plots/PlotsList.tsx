import React from "react";
import { DataTable, type Row } from "../../components/DataTable/DataTable";
import { Panel } from "../../components/Panel/Panel";
import { Tag } from "../../components/Tag/Tag";
import { ActionButton } from "../../components/ActionButton/ActionButton";
import type {
    EnrichedActivePlot,
    EnrichedAvailablePlot,
} from "../../hooks/usePlots";

interface Props {
    tab: "available" | "active";
    availablePlots: EnrichedAvailablePlot[];
    activePlots: EnrichedActivePlot[];
    selectedPlotId?: string | null;
    onSelectPlot?: (id: string) => void;
}

const AVAILABLE_COLUMNS = [
    { key: "name", label: "NAME" },
    { key: "tier", label: "TIER", width: "60px" },
    { key: "category", label: "CATEGORY" },
    { key: "requirements", label: "REQUIREMENTS" },
];

const ACTIVE_COLUMNS = [
    { key: "name", label: "NAME" },
    { key: "target", label: "TARGET" },
    { key: "agents", label: "AGENTS" },
    { key: "stage", label: "STAGE" },
    { key: "eta", label: "ETA" },
    { key: "status", label: "STATUS" },
];

export default function PlotsList({
    tab,
    availablePlots,
    activePlots,
    selectedPlotId,
    onSelectPlot,
}: Props) {
    if (tab === "available") {
        const rows: Row[] = availablePlots.map((ap) => ({
            _key: ap.definition.id,
            name: (
                <div>
                    <div className="font-mono">{ap.definition.name}</div>
                    <div className="text-text-muted text-[11px]">
                        {ap.definition.description ?? ""}
                    </div>
                </div>
            ),
            tier: (
                <Tag
                    variant={
                        (ap.definition.tier
                            ? `t${ap.definition.tier}`
                            : "t1") as any
                    }
                >{`T${ap.definition.tier ?? 1}`}</Tag>
            ),
            category: ap.definition.category ?? "—",
            requirements:
                ap.status === "locked" ? (
                    <div className="text-text-muted text-[11px]">LOCKED</div>
                ) : (
                    <div className="text-text-muted text-[11px]">READY</div>
                ),
            // Launch action moved to detail panel
        }));

        return (
            <DataTable
                columns={AVAILABLE_COLUMNS}
                rows={rows}
                emptyText="No plots available."
                onRowClick={(r) => onSelectPlot?.(String(r._key))}
                selectedRowKey={selectedPlotId ?? undefined}
            />
        );
    }

    const rows: Row[] = activePlots.map((ap) => ({
        _key: ap.record.id,
        name: (
            <div>
                <div className="font-mono">
                    {ap.definition?.name ?? ap.record.plotDefinitionId}
                </div>
                <div className="text-text-muted text-[11px]">
                    {ap.definition?.description ?? ""}
                </div>
            </div>
        ),
        target: ap.targetLabel,
        agents: String(ap.assignedAgents.length),
        stage:
            ap.definition?.stages?.[ap.record.currentStageIndex]?.name ?? "—",
        eta: ap.record.daysRemaining > 0 ? `${ap.record.daysRemaining}d` : "—",
        status: (
            <Tag
                variant={
                    ap.record.status === "traveling" ? "traveling" : "active"
                }
            >
                {ap.record.status.toUpperCase()}
            </Tag>
        ),
    }));

    return (
        <DataTable
            columns={ACTIVE_COLUMNS}
            rows={rows}
            emptyText="No active plots."
            onRowClick={(r) => onSelectPlot?.(String(r._key))}
            selectedRowKey={selectedPlotId ?? undefined}
        />
    );
}
