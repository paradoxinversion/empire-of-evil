import { useState } from "react";
import type { Building } from "@empire-of-evil/engine";
import { useGameState } from "../../hooks/useGameState";
import { Panel } from "../../components/Panel/Panel";
import { StatWidget } from "../../components/StatWidget/StatWidget";
import { DataTable } from "../../components/DataTable/DataTable";
import { FeedEntry } from "../../components/FeedEntry/FeedEntry";
import { Tag } from "../../components/Tag/Tag";
import { ProgressBar } from "../../components/ProgressBar/ProgressBar";
import { TabBar } from "../../components/TabBar/TabBar";
import { BUNDLED_CONFIG } from "../../store/gameStore";
import { getEvilTier, getEvilTierProgress } from "../../utils/evilTier";
import type { Row } from "../../components/DataTable/DataTable";
import {
    getBuildings,
    getEmpireTiles,
} from "../../../../engine/src/state/queries";

function formatMoney(n: number): string {
    return "$" + n.toLocaleString("en-US");
}

const INFRA_CAP = 20;

const OPERATIONS_COLUMNS = [
    { key: "operation", label: "OPERATION" },
    { key: "type", label: "TYPE" },
    { key: "target", label: "TARGET" },
    { key: "agents", label: "AGENTS" },
    { key: "status", label: "STATUS" },
    { key: "eta", label: "ETA" },
];

const ZONES_COLUMNS = [
    { key: "zone", label: "ZONE", sortable: true },
    { key: "nation", label: "NATION", sortable: true },
    { key: "tiles", label: "TILES" },
    { key: "output", label: "OUTPUT", sortable: true },
    { key: "status", label: "STATUS" },
];

type EmpireTab = "overview" | "buildings";
type BuildingStatusFilter = "all" | "secured" | "exposed";
type BuildingSort =
    | "name_asc"
    | "name_desc"
    | "output_desc"
    | "output_asc"
    | "intel_desc"
    | "intel_asc";
type BuildingGroupBy = "none" | "zone" | "type" | "status";

type BuildingRecord = {
    id: string;
    name: string;
    typeName: string;
    zoneName: string;
    tileLabel: string;
    outputMoney: number;
    upkeep: number;
    intelLevel: number;
    status: "SECURED" | "EXPOSED";
};

const EMPIRE_TABS = [
    { key: "overview", label: "OVERVIEW" },
    { key: "buildings", label: "BUILDINGS" },
];

function getBuildingStatus(intelLevel: number): "SECURED" | "EXPOSED" {
    return intelLevel >= 2 ? "SECURED" : "EXPOSED";
}

function sortBuildingRecords(
    records: BuildingRecord[],
    sortBy: BuildingSort,
): BuildingRecord[] {
    return [...records].sort((a, b) => {
        if (sortBy === "name_asc") return a.name.localeCompare(b.name);
        if (sortBy === "name_desc") return b.name.localeCompare(a.name);
        if (sortBy === "output_desc") return b.outputMoney - a.outputMoney;
        if (sortBy === "output_asc") return a.outputMoney - b.outputMoney;
        if (sortBy === "intel_desc") return b.intelLevel - a.intelLevel;
        return a.intelLevel - b.intelLevel;
    });
}

export function EmpireScreen() {
    const [activeTab, setActiveTab] = useState<EmpireTab>("overview");
    const [buildingSearch, setBuildingSearch] = useState("");
    const [buildingStatusFilter, setBuildingStatusFilter] =
        useState<BuildingStatusFilter>("all");
    const [buildingSortBy, setBuildingSortBy] =
        useState<BuildingSort>("name_asc");
    const [buildingGroupBy, setBuildingGroupBy] =
        useState<BuildingGroupBy>("none");

    const gameState = useGameState();
    const {
        empire,
        zones,
        plots,
        activities,
        persons,
        eventLog,
        nations,
        tiles,
    } = gameState;
    const { resources, evil } = empire;

    const tier = getEvilTier(evil.perceived);
    const tierProgress = getEvilTierProgress(evil.perceived);

    const empireZones = Object.values(zones).filter(
        (z) => z.governingOrganizationId === empire.id,
    );
    const hasTileAndZoneState =
        gameState.tiles !== undefined && gameState.zones !== undefined;
    const empireTileIds = hasTileAndZoneState
        ? new Set(getEmpireTiles(gameState))
        : new Set<string>();

    const buildingDefsById = new Map(
        BUNDLED_CONFIG.buildings.map((buildingDef) => [
            buildingDef.id,
            buildingDef,
        ]),
    );

    const empireBuildings = (
        gameState.buildings
            ? (getBuildings(gameState, {
                  governingOrganizationId: empire.id,
              }) as Building[])
            : []
    )
        .filter((building) => {
            if (building.tileId) {
                return empireTileIds.has(building.tileId);
            }
            return (
                zones[building.zoneId]?.governingOrganizationId === empire.id
            );
        })
        .map((building) => {
            const zoneIdFromTile = building.tileId
                ? tiles[building.tileId]?.zoneId
                : undefined;
            const zoneId = zoneIdFromTile ?? building.zoneId;
            const zone = zones[zoneId];
            const definition = buildingDefsById.get(building.typeId);
            return {
                id: building.id,
                name: building.name,
                typeName: definition?.name ?? building.typeId,
                zoneName: zone?.name ?? zoneId,
                tileLabel: building.tileId ?? "—",
                outputMoney: definition?.resourceOutput?.money ?? 0,
                upkeep: definition?.upkeepPerDay ?? 0,
                intelLevel: building.intelLevel,
                status: getBuildingStatus(building.intelLevel),
            } as BuildingRecord;
        });

    const filteredEmpireBuildings = empireBuildings.filter((building) => {
        const searchValue = buildingSearch.trim().toLowerCase();
        const searchMatches =
            searchValue.length === 0 ||
            [
                building.name,
                building.typeName,
                building.zoneName,
                building.tileLabel,
                building.status,
            ]
                .join(" ")
                .toLowerCase()
                .includes(searchValue);

        const statusMatches =
            buildingStatusFilter === "all" ||
            (buildingStatusFilter === "secured" &&
                building.status === "SECURED") ||
            (buildingStatusFilter === "exposed" &&
                building.status === "EXPOSED");

        return searchMatches && statusMatches;
    });

    const sortedEmpireBuildings = sortBuildingRecords(
        filteredEmpireBuildings,
        buildingSortBy,
    );

    const groupedBuildings = (() => {
        if (buildingGroupBy === "none") {
            return [
                { groupLabel: "ALL BUILDINGS", rows: sortedEmpireBuildings },
            ];
        }

        const groupMap = new Map<string, BuildingRecord[]>();
        for (const building of sortedEmpireBuildings) {
            const groupKey =
                buildingGroupBy === "zone"
                    ? building.zoneName
                    : buildingGroupBy === "type"
                      ? building.typeName
                      : building.status;
            if (!groupMap.has(groupKey)) {
                groupMap.set(groupKey, []);
            }
            groupMap.get(groupKey)!.push(building);
        }

        return Array.from(groupMap.entries())
            .sort((a, b) => a[0].localeCompare(b[0]))
            .map(([groupLabel, rows]) => ({ groupLabel, rows }));
    })();

    const agentCount = Object.values(persons).filter(
        (p) => p.agentStatus !== undefined && !p.dead,
    ).length;

    // Operations table rows
    const plotRows: Row[] = Object.values(plots).map((p) => ({
        _key: p.id,
        operation: p.plotDefinitionId,
        type: <Tag variant="plot">PLOT</Tag>,
        target: p.targetZoneId ?? "—",
        agents: String(p.assignedAgentIds.length),
        status: p.status.toUpperCase(),
        eta: p.daysRemaining > 0 ? `${p.daysRemaining}d` : "—",
    }));
    const activityRows: Row[] = Object.values(activities).map((a) => ({
        _key: a.id,
        operation: a.activityDefinitionId,
        type: <Tag variant="activity">ACTIVITY</Tag>,
        target: a.zoneId,
        agents: String(a.assignedAgentIds.length),
        status: "ACTIVE",
        eta: "—",
    }));
    const operationsRows = [...plotRows, ...activityRows];

    // Controlled zones table rows
    const zoneRows: Row[] = empireZones.map((z) => ({
        _key: z.id,
        zone: z.name,
        nation: nations[z.nationId]?.name ?? "—",
        tiles: `${
            getEmpireTiles(gameState).filter(
                (tileId) => zones[gameState.tiles[tileId].zoneId]?.id === z.id,
            ).length
        } / ${z.tileIds.length}`,
        output: formatMoney(z.economicOutput),
        status: <Tag variant="stable">STABLE</Tag>,
    }));

    // Recent activity feed (last 5 resolved events)
    const recentEvents = eventLog.slice(-5).reverse();

    const overviewContent = (
        <>
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
                    value={`${empireZones.length}/${INFRA_CAP}`}
                    subValue={
                        empireZones.length >= INFRA_CAP
                            ? "AT CAPACITY"
                            : `${Math.round((empireZones.length / INFRA_CAP) * 100)}% capacity`
                    }
                    subVariant={
                        empireZones.length >= INFRA_CAP
                            ? "negative"
                            : empireZones.length / INFRA_CAP >= 0.8
                              ? "warning"
                              : "positive"
                    }
                />
                <StatWidget
                    label="EVIL"
                    value={String(evil.perceived)}
                    subValue={tier.name.toUpperCase() + " TIER"}
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
                                <span className="font-mono text-text-primary">
                                    {empireZones.length}
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
                                        style={{ color: tier.color }}
                                    >
                                        {tier.name.toUpperCase()}
                                    </span>
                                </div>
                                <ProgressBar
                                    value={tierProgress}
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

            {/* Row 3 — Event feed + Zone overview */}
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
                            columns={ZONES_COLUMNS}
                            rows={zoneRows}
                            emptyText="No controlled zones."
                        />
                    </Panel>
                </div>
            </div>
        </>
    );

    const inputClass =
        "font-mono text-[11px] bg-bg-elevated border border-border-subtle text-text-primary px-2 py-1 outline-none focus:border-accent-red";

    return (
        <div>
            <TabBar
                tabs={EMPIRE_TABS}
                activeTab={activeTab}
                onChange={(key) => setActiveTab(key as EmpireTab)}
            />

            {activeTab === "overview" && overviewContent}

            {activeTab === "buildings" && (
                <Panel title="EMPIRE BUILDINGS">
                    <div className="flex flex-wrap gap-2 mb-3 items-center">
                        <input
                            type="text"
                            value={buildingSearch}
                            onChange={(event) =>
                                setBuildingSearch(event.target.value)
                            }
                            placeholder="SEARCH BUILDINGS..."
                            className={`${inputClass} min-w-56`}
                        />

                        <label className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                            Sort by
                            <select
                                aria-label="Sort by"
                                value={buildingSortBy}
                                onChange={(event) =>
                                    setBuildingSortBy(
                                        event.target.value as BuildingSort,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="name_asc">NAME (A-Z)</option>
                                <option value="name_desc">NAME (Z-A)</option>
                                <option value="output_desc">
                                    OUTPUT (HIGH-LOW)
                                </option>
                                <option value="output_asc">
                                    OUTPUT (LOW-HIGH)
                                </option>
                                <option value="intel_desc">
                                    INTEL (HIGH-LOW)
                                </option>
                                <option value="intel_asc">
                                    INTEL (LOW-HIGH)
                                </option>
                            </select>
                        </label>

                        <label className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                            Group by
                            <select
                                aria-label="Group by"
                                value={buildingGroupBy}
                                onChange={(event) =>
                                    setBuildingGroupBy(
                                        event.target.value as BuildingGroupBy,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="none">NONE</option>
                                <option value="zone">ZONE</option>
                                <option value="type">TYPE</option>
                                <option value="status">STATUS</option>
                            </select>
                        </label>

                        <label className="text-[10px] text-text-muted font-mono flex items-center gap-1">
                            Status
                            <select
                                aria-label="Status filter"
                                value={buildingStatusFilter}
                                onChange={(event) =>
                                    setBuildingStatusFilter(
                                        event.target
                                            .value as BuildingStatusFilter,
                                    )
                                }
                                className={inputClass}
                            >
                                <option value="all">ALL</option>
                                <option value="secured">SECURED</option>
                                <option value="exposed">EXPOSED</option>
                            </select>
                        </label>

                        <div className="ml-auto text-[10px] text-text-muted font-mono">
                            {sortedEmpireBuildings.length} /{" "}
                            {empireBuildings.length} BUILDINGS
                        </div>
                    </div>

                    {sortedEmpireBuildings.length === 0 ? (
                        <div className="text-text-muted text-[11px] py-2">
                            No empire buildings match the current controls.
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {groupedBuildings.map((group) => (
                                <section key={group.groupLabel}>
                                    {buildingGroupBy !== "none" && (
                                        <div className="font-mono text-[10px] tracking-[0.08em] text-text-muted mb-1.5">
                                            {`${group.groupLabel.toUpperCase()} (${group.rows.length})`}
                                        </div>
                                    )}
                                    <table className="w-full border-collapse text-[12px]">
                                        <thead>
                                            <tr>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    BUILDING
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    TYPE
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    ZONE
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    TILE
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    OUTPUT
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    UPKEEP
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 pr-2 border-b border-border-subtle font-normal">
                                                    INTEL
                                                </th>
                                                <th className="font-mono text-[9px] tracking-widest text-text-muted text-left pb-2 border-b border-border-subtle font-normal">
                                                    STATUS
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {group.rows.map((building) => (
                                                <tr
                                                    key={building.id}
                                                    data-testid="empire-building-row"
                                                    className="border-b border-bg-elevated"
                                                >
                                                    <td className="py-1.5 pr-2 align-middle text-text-primary">
                                                        {building.name}
                                                    </td>
                                                    <td className="py-1.5 pr-2 align-middle text-text-secondary">
                                                        {building.typeName}
                                                    </td>
                                                    <td className="py-1.5 pr-2 align-middle text-text-secondary">
                                                        {building.zoneName}
                                                    </td>
                                                    <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                        {building.tileLabel}
                                                    </td>
                                                    <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                        {formatMoney(
                                                            building.outputMoney,
                                                        )}
                                                    </td>
                                                    <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                        {formatMoney(
                                                            building.upkeep,
                                                        )}
                                                    </td>
                                                    <td className="py-1.5 pr-2 align-middle text-text-secondary font-mono text-[11px]">
                                                        {building.intelLevel}
                                                    </td>
                                                    <td className="py-1.5 align-middle text-text-secondary">
                                                        <Tag
                                                            variant={
                                                                building.status ===
                                                                "SECURED"
                                                                    ? "stable"
                                                                    : "warning"
                                                            }
                                                        >
                                                            {building.status}
                                                        </Tag>
                                                    </td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </section>
                            ))}
                        </div>
                    )}
                </Panel>
            )}
        </div>
    );
}
