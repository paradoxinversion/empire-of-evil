import type { ReactNode } from "react";
import { Panel } from "../../components/Panel/Panel";
import { StatWidget } from "../../components/StatWidget/StatWidget";
import { DataTable } from "../../components/DataTable/DataTable";
import { FeedEntry } from "../../components/FeedEntry/FeedEntry";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import type { Row } from "../../components/DataTable/DataTable";

const INFRA_CAP = 20;

function formatMoney(n: number): string {
    return "$" + n.toLocaleString("en-US");
}

interface EmpireOverviewTabProps {
    money: number;
    science: number;
    perceivedEvil: number;
    evilTierName: string;
    evilTierColor: string;
    evilTierProgress: number;
    empireZoneCount: number;
    agentCount: number;
    operationsRows: Row[];
    zoneRows: Row[];
    recentEvents: Array<{
        event: {
            id: string;
            title: string;
            createdOnDate: number;
        };
    }>;
    operationsColumns: Array<{
        key: string;
        label: string;
        sortable?: boolean;
        width?: string;
    }>;
    zonesColumns: Array<{
        key: string;
        label: string;
        sortable?: boolean;
        width?: string;
    }>;
}

export function EmpireOverviewTab({
    money,
    science,
    perceivedEvil,
    evilTierName,
    evilTierColor,
    evilTierProgress,
    empireZoneCount,
    agentCount,
    operationsRows,
    zoneRows,
    recentEvents,
    operationsColumns,
    zonesColumns,
}: EmpireOverviewTabProps) {
    const infrastructureSubValue: ReactNode =
        empireZoneCount >= INFRA_CAP
            ? "AT CAPACITY"
            : `${Math.round((empireZoneCount / INFRA_CAP) * 100)}% capacity`;

    const infrastructureSubVariant =
        empireZoneCount >= INFRA_CAP
            ? "negative"
            : empireZoneCount / INFRA_CAP >= 0.8
              ? "warning"
              : "positive";

    return (
        <>
            <div className="font-mono text-base text-text-primary mb-4 tracking-tight">
                EMPIRE OVERVIEW
            </div>

            <div className="flex gap-px mb-3">
                <StatWidget
                    label="MONEY"
                    value={formatMoney(money)}
                    subVariant="neutral"
                />
                <StatWidget
                    label="SCIENCE"
                    value={science.toLocaleString()}
                    subVariant="positive"
                />
                <StatWidget
                    label="INFRASTRUCTURE"
                    value={`${empireZoneCount}/${INFRA_CAP}`}
                    subValue={infrastructureSubValue}
                    subVariant={infrastructureSubVariant}
                />
                <StatWidget
                    label="EVIL"
                    value={String(perceivedEvil)}
                    subValue={evilTierName.toUpperCase() + " TIER"}
                    subVariant="warning"
                />
            </div>

            <div className="grid grid-cols-12 gap-3 mb-3">
                <div className="col-span-8">
                    <Panel title="ACTIVE OPERATIONS">
                        <DataTable
                            columns={operationsColumns}
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
                                <span className="font-mono text-text-primary">
                                    {empireZoneCount}
                                </span>
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">AGENTS</span>
                                <span className="font-mono text-text-primary">
                                    {agentCount}
                                </span>
                            </div>
                            <div>
                                <div className="flex justify-between mb-1">
                                    <span className="text-text-muted">
                                        EVIL TIER
                                    </span>
                                    <span
                                        className="font-mono"
                                        style={{ color: evilTierColor }}
                                    >
                                        {evilTierName.toUpperCase()}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={evilTierProgress}
                                    color="evil"
                                    height={2}
                                />
                            </div>
                            <div className="flex justify-between">
                                <span className="text-text-muted">
                                    HERO ORG ACTIVITY
                                </span>
                                <span className="font-mono text-text-primary">
                                    NONE
                                </span>
                            </div>
                        </div>
                    </Panel>
                </div>
            </div>

            <div className="grid grid-cols-12 gap-3">
                <div className="col-span-5">
                    <Panel title="RECENT ACTIVITY">
                        {recentEvents.length === 0 ? (
                            <div className="text-text-muted text-[11px] py-2">
                                No recent events.
                            </div>
                        ) : (
                            recentEvents.map((record) => (
                                <FeedEntry
                                    key={record.event.id}
                                    day={record.event.createdOnDate + 1}
                                    text={record.event.title}
                                    type="internal"
                                />
                            ))
                        )}
                    </Panel>
                </div>
                <div className="col-span-7">
                    <Panel title="CONTROLLED ZONES">
                        <DataTable
                            columns={zonesColumns}
                            rows={zoneRows}
                            emptyText="No controlled zones."
                        />
                    </Panel>
                </div>
            </div>
        </>
    );
}
